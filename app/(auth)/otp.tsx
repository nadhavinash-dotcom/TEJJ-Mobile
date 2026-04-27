import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import api from '../../src/lib/api';
import OtpForm from '../../src/components/tell/auth/OTPForm';

export default function OTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleVerify = async (code: string) => {
    if (code.length < 6) return;
    setLoading(true);
    try {
      const response = await api.post('/auth/otp/verify', {
        phone_number: phone,
        code: code
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Verification failed');
      }

      const { token, user_id } = response.data.data;
      
      // Fetch the full user object with the new JWT
      const meRes = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      const user = meRes.data.data;

      setUser({
        userId: user._id,
        token: token,
        hasWorker: user.has_worker,
        hasEmployer: user.has_employer,
        activeRole: user.active_role,
      });
console.log(user)
      if (!user.active_role) {
        router.replace('/(auth)/role');
      } else if (user.active_role === 'employer') {
        if(user.has_employer) {
          router.replace('/(employer)/(tabs)/dashboard');
        } else {
          router.replace('/(employer)/onboarding/property');
        }
      } else {
        if(user.has_worker) {
          router.replace('/(worker)/(tabs)/feed');
        } else {
          router.replace('/(worker)/onboarding/role');
        }
      }
    } catch (e: any) {
      console.error('OTP Verification Error:', e);
      let errorMessage = 'The code you entered is incorrect. Please try again.';
      if (e.response && e.response.data && e.response.data.error) {
        errorMessage = e.response.data.error;
      } else if (e.message) {
        errorMessage = e.message;
      }
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    // In this simplified version, we just go back to phone screen to resend
    // or you could trigger the same logic as handleSendOTP in phone.tsx
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 items-center justify-center px-4 py-12">
            <View className="w-full max-w-md">
              <View className="space-y-2 mb-8">
                <Text className="text-5xl font-extrabold tracking-tight text-primary">
                  Verify OTP
                </Text>
                <Text className="text-lg text-on-surface-variant leading-relaxed">
                  Enter the 6-digit code sent to <Text className="font-bold text-primary">{phone}</Text>
                </Text>
              </View>

              <OtpForm
                phone={phone || ''}
                onChangePhone={() => router.back()}
                isLoading={loading}
                setIsLoading={setLoading}
                onResendOTP={handleResend}
                onVerifyOtp={handleVerify}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

