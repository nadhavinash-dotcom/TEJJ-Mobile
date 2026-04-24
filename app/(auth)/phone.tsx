import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { signInWithPhoneNumber, PhoneAuthProvider } from 'firebase/auth';
import { auth, firebaseConfig } from '../../src/lib/firebase';
import { useAuthStore } from '../../src/store/authStore';

export default function PhoneScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);
  const setVerificationId = useAuthStore((s) => s.setVerificationId);

  const handleSendOTP = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const phoneNumber = `+91${cleaned}`;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier.current!);
      setVerificationId(confirmation.verificationId);
      router.push({ pathname: '/(auth)/otp', params: { phone: phoneNumber } });
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Could not send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen className="flex-1">
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={false}
      />
      <View className="flex-1 px-6 pt-12">
        <TouchableOpacity onPress={() => router.back()} className="mb-8">
          <Text className="text-amber-400 text-base">← Back</Text>
        </TouchableOpacity>

        <Text className="text-white text-2xl font-bold mb-2">Mobile Number</Text>
        <Text className="text-navy-300 text-sm mb-8">We'll send an OTP to verify your number</Text>

        <View className="flex-row items-center bg-navy-800 border border-navy-600 rounded-2xl px-4 mb-6">
          <Text className="text-white text-base mr-2">🇮🇳 +91</Text>
          <View className="w-px h-6 bg-navy-600 mr-3" />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter 10-digit number"
            placeholderTextColor="#4B5563"
            keyboardType="phone-pad"
            maxLength={10}
            className="flex-1 text-white text-base py-4"
          />
        </View>

        <TouchableOpacity
          onPress={handleSendOTP}
          disabled={loading || phone.length < 10}
          className={`rounded-2xl py-4 items-center ${loading || phone.length < 10 ? 'bg-navy-700' : 'bg-amber-500'}`}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">Send OTP →</Text>
          )}
        </TouchableOpacity>

        <Text className="text-navy-400 text-xs text-center mt-6">
          By continuing, you agree to TEJJ's Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeScreen>
  );
}
