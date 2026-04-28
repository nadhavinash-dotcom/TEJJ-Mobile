import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { StyledArrowRight } from '../Icons';

const PhoneForm = ({
    handleSendOtp,
    isLoading,
}: {
    handleSendOtp: (phone: string) => void;
    isLoading: boolean;
    setIsLoading: (val: boolean) => void;
}) => {
    const [phone, setPhone] = useState('');

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
