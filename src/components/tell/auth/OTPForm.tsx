import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Keyboard
} from 'react-native';
import { StyledTimer } from '../Icons';

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

    // Timer State
    const [timeLeft, setTimeLeft] = useState(60);
    const [isResending, setIsResending] = useState(false);

    // --- 1. COUNTDOWN TIMER LOGIC ---
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    // --- 2. HANDLE RESEND ---
    const handleResendClick = async () => {
        if (timeLeft > 0) return;

        setIsResending(true);
        try {
            await onResendOTP(phone);
            setTimeLeft(60);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
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
