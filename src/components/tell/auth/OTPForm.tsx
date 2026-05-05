import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { StyledTimer } from '../Icons';

// Lazily import so we don't crash on iOS where the native module won't exist
let OtpVerify: any = null;
if (Platform.OS === 'android') {
    try {
        OtpVerify = require('react-native-otp-verify').default;
    } catch (e) {
        console.warn('[OTPForm] react-native-otp-verify not available:', e);
    }
}

interface OtpFormProps {
    phone: string;
    onChangePhone: () => void;
    isLoading: boolean;
    setIsLoading: (val: boolean) => void;
    onResendOTP: (phone: string) => Promise<void>;
    onVerifyOtp: (otpCode: string) => Promise<void>;
}

const OtpForm = ({ phone, onChangePhone, isLoading, setIsLoading, onResendOTP, onVerifyOtp }: OtpFormProps) => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const hasAutoFilled = useRef(false);

    // Timer State
    const [timeLeft, setTimeLeft] = useState(60);
    const [isResending, setIsResending] = useState(false);

    // --- 1. COUNTDOWN TIMER LOGIC ---
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    // --- 2. SMS RETRIEVER (Android only) ---
    const autoFillOtp = useCallback(
        (code: string) => {
            console.log('[OTPForm] autoFillOtp triggered with code:', code);
            if (hasAutoFilled.current) {
                console.log('[OTPForm] Code already auto-filled, skipping');
                return;
            }
            hasAutoFilled.current = true;

            const digits = code.split('').slice(0, 6);
            console.log('[OTPForm] Setting OTP digits:', digits);
            setOtp(digits);
            // Focus last box so keyboard goes away
            inputRefs.current[5]?.focus();
            console.log('[OTPForm] Auto-submitting OTP verify...');
            onVerifyOtp(digits.join(''));
        },
        [onVerifyOtp]
    );

    useEffect(() => {
        console.log('[OTPForm] SMS Retriever useEffect. Platform:', Platform.OS);
        if (Platform.OS !== 'android' || !OtpVerify) {
            console.log('[OTPForm] Skipping SMS Listener (not Android or no OtpVerify module)');
            return;
        }

        const startSmsListener = async () => {
            try {
                console.log('[OTPForm] Calling OtpVerify.startListener()...');
                await OtpVerify.startListener();
                console.log('[OTPForm] SMS Listener started successfully');
            } catch (e) {
                console.warn('[OTPForm] Failed to start SMS listener:', e);
            }
        };

        startSmsListener();

        const handleMessage = (message: string | null) => {
            console.log('[OTPForm] Received SMS message event:', message);
            if (!message) return;
            // Extract 6-digit OTP from the SMS body
            const match = message.match(/\b(\d{6})\b/);
            if (match) {
                console.log('[OTPForm] Found 6 digits in message:', match[1]);
                autoFillOtp(match[1]);
            } else {
                console.log('[OTPForm] No 6-digit code found in message.');
            }
        };

        console.log('[OTPForm] Adding OtpVerify listener');
        OtpVerify.addListener(handleMessage);

        return () => {
            try {
                console.log('[OTPForm] Removing OtpVerify listener on cleanup');
                OtpVerify.removeListener(handleMessage);
            } catch (_) {}
        };
    }, [autoFillOtp]);

    // --- 3. HANDLE RESEND ---
    const handleResendClick = async () => {
        if (timeLeft > 0) return;

        setIsResending(true);
        try {
            await onResendOTP(phone);
            setTimeLeft(60);
            setOtp(['', '', '', '', '', '']);
            hasAutoFilled.current = false;
            inputRefs.current[0]?.focus();

            // Restart SMS listener after resend
            if (Platform.OS === 'android' && OtpVerify) {
                try {
                    await OtpVerify.startListener();
                } catch (e) {
                    console.warn('[OTPForm] Failed to restart SMS listener:', e);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsResending(false);
        }
    };

    // --- 4. INPUT HANDLING (INCLUDING PASTE) ---
    const handleChange = (text: string, index: number) => {
        if (text.length === 6) {
            const pastedOtp = text.split('').slice(0, 6);
            setOtp(pastedOtp);
            inputRefs.current[5]?.focus();
            onVerifyOtp(pastedOtp.join(''));
            return;
        }

        const char = text.length > 0 ? text[text.length - 1] : '';
        const newOtp = [...otp];
        newOtp[index] = char;
        setOtp(newOtp);

        if (char !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
        else if (char !== '' && index === 5) {
            onVerifyOtp(newOtp.join(''));
        }
    };

    const handleBackspace = (text: string, index: number) => {
        if (text === '' && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <View className="pt-4 space-y-6">
            <View className="flex-row items-center gap-4 mb-2">
                <View className="h-[1px] flex-1 bg-outline-variant/20" />
                <Text className="text-outline text-xs font-bold uppercase tracking-widest">
                    Verification Code
                </Text>
                <View className="h-[1px] flex-1 bg-outline-variant/20" />
            </View>

            <View className="flex-row justify-between gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => { inputRefs.current[index] = ref; }}
                        className={`flex-1 aspect-square bg-surface-container-high text-center text-3xl font-bold rounded-lg border ${digit ? 'border-primary text-primary' : 'border-transparent text-on-surface'
                            }`}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        autoComplete="sms-otp"
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace') {
                                handleBackspace(digit, index);
                            }
                        }}
                        editable={!isLoading && !isResending}
                        placeholder="·"
                        placeholderTextColor="#000666"
                        textAlign='center'
                    />
                ))}
            </View>

            {isLoading || isResending ? (
                <ActivityIndicator size="large" color="#000666" className="mt-4" />
            ) : (
                <View className="flex-col items-center gap-4 mt-4">
                    {timeLeft > 0 ? (
                        <View className="flex-row items-center gap-2">
                            <StyledTimer color="#006b5e" size={20} />
                            <Text className="text-on-surface-variant font-medium">
                                Resend in <Text className="text-primary font-bold">
                                    0:{timeLeft.toString().padStart(2, '0')}
                                </Text>
                            </Text>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={handleResendClick} className="flex-row items-center gap-2">
                            <StyledTimer color="#000666" size={20} />
                            <Text className="text-primary font-bold tracking-wide">
                                Resend Code
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={onChangePhone}>
                        <Text className="text-on-surface-variant font-medium text-sm tracking-wide underline mt-2">
                            Change Phone Number
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default OtpForm;
