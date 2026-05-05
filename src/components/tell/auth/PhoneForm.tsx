import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Animated,
} from 'react-native';
import { StyledArrowRight } from '../Icons';

// Safely import requestHint
let requestHint: any = null;
if (Platform.OS === 'android') {
    try {
        const OtpVerify = require('react-native-otp-verify');
        // ✅ Try both patterns to be safe
        requestHint = OtpVerify.requestHint ?? OtpVerify.default?.requestHint ?? null;
        console.log('[PhoneForm] requestHint loaded:', typeof requestHint);
    } catch (e) {
        console.warn('[PhoneForm] react-native-otp-verify not available:', e);
    }
}

const PhoneForm = ({
    handleSendOtp,
    isLoading,
}: {
    handleSendOtp: (phone: string) => void;
    isLoading: boolean;
    setIsLoading: (val: boolean) => void;
}) => {
    const [phone, setPhone] = useState('');

    useEffect(() => {
        detectPhoneNumber();
    }, []);

    const detectPhoneNumber = async () => {
        console.log('[PhoneForm] Starting detectPhoneNumber with requestHint...');
        if (Platform.OS === 'ios' || !requestHint) {
            console.log('[PhoneForm] Skipping phone detection (iOS or requestHint missing)');
            return;
        }

        try {
            console.log('[PhoneForm] Calling requestHint()...');
            const phoneNumber = await requestHint();
            console.log('[PhoneForm] requestHint returned:', phoneNumber);

            if (!phoneNumber) return;

            // Strip to digits only
            const digits = phoneNumber.replace(/\D/g, '');
            console.log('[PhoneForm] Stripped digits:', digits);

            // Extract the last 10 digits aggressively (ignores country codes like +1, +91, +44)
            let ten: string | null = null;
            if (digits.length >= 10) {
                ten = digits.slice(-10);
            }

            if (ten && ten.length === 10) {
                console.log('[PhoneForm] Valid 10-digit number extracted:', ten);
                setPhone(ten); // Auto-fill the input directly
            } else {
                console.log('[PhoneForm] Could not extract valid 10-digit number. Extracted:', ten);
            }
} catch (err) {
    console.log('[PhoneForm] requestHint failed / error:', JSON.stringify(err)); // ✅ was hiding the real error
}
    };

    return (
        <View className="gap-y-4 mb-4">
            <Text className="font-bold text-sm tracking-widest uppercase text-on-surface-variant">
                Phone Number
            </Text>
            <View className="flex-row gap-3 h-14">
                <View className="flex items-center justify-center bg-surface-container-high px-4 rounded-xl min-w-[70px]">
                    <Text className="text-primary font-bold">+91</Text>
                </View>
                <TextInput
                    className="flex-1 bg-surface-container-low rounded-xl px-4 text-lg font-medium text-on-surface"
                    placeholder="98765 43210"
                    placeholderTextColor="#c6c5d4"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    maxLength={10}
                    editable={!isLoading}
                />
            </View>

            <TouchableOpacity
                onPress={() => handleSendOtp(phone)}
                disabled={isLoading}
                className={`w-full h-14 rounded-xl flex-row items-center justify-center gap-2 active:opacity-90 ${isLoading ? 'bg-primary/70' : 'bg-primary'}`}
            >
                {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <>
                        <Text className="text-on-primary font-bold text-base">Send OTP</Text>
                        <StyledArrowRight color="#ffffff" size={20} />
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default PhoneForm;
