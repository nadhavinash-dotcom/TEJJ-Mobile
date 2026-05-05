import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import api from '../../src/lib/api';
import OtpForm from '../../src/components/tell/auth/OTPForm';
import { refreshUser } from '@/utils/referesh-user';

// Lazily load so iOS never crashes
let OtpVerify: any = null;
if (Platform.OS === 'android') {
  try {
    OtpVerify = require('react-native-otp-verify').default;
  } catch (e) {
    console.warn('[OTPScreen] react-native-otp-verify not available:', e);
  }
}

export default function OTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [loading, setLoading] = useState(false);
  const appHashRef = useRef<string | null>(null);

  console.log('[OTPScreen] Initialized with phone:', phone);

  // Retrieve app hash on mount (Android only)
  useEffect(() => {
    console.log('[OTPScreen] Mounting. Platform:', Platform.OS);
    if (Platform.OS !== 'android' || !OtpVerify) {
      console.log('[OTPScreen] Skipping getHash (not Android or OtpVerify missing)');
      return;
    }
    console.log('[OTPScreen] Requesting app hash for resend...');
    OtpVerify.getHash()
      .then((hashes: string[]) => {
        console.log('[OTPScreen] getHash response:', hashes);
        if (hashes && hashes.length > 0) {
          appHashRef.current = hashes[0];
          console.log('[OTPScreen] App hash ready for resend:', hashes[0]);
        }
      })
      .catch((err: any) =>
        console.error('[OTPScreen] getHash failed:', err)
      );
  }, []);

  const handleVerify = async (code: string) => {
    console.log(`[OTPScreen] handleVerify called with code: ${code}`);
    if (code.length < 6) {
      console.log('[OTPScreen] Code too short, ignoring');
      return;
    }
    setLoading(true);
    try {
      console.log(`[OTPScreen] Sending API request to /auth/otp/verify with phone: ${phone}, code: ${code}`);
      const response = await api.post('/auth/otp/verify', {
        phone_number: phone,
        code: code,
      });
      console.log('[OTPScreen] Verify API response:', response.data);

      if (!response.data.success) {
        console.log('[OTPScreen] Verify returned success false. Error:', response.data.error);
        throw new Error(response.data.error || 'Verification failed');
      }

      const { token } = response.data.data;
      console.log('[OTPScreen] Token extracted successfully. Calling refreshUser...');

      const {user}:any = await refreshUser(setLoading, token)
      console.log('[OTPScreen] User refreshed:', user);

      if (!user.language) return router.replace('/(auth)/language');
      if (!user.active_role) return router.replace('/(auth)/role');

      if (user.active_role === 'employer') {
        router.replace(
          user.has_employer
            ? '/(employer)/(tabs)/dashboard'
            : '/(employer)/onboarding/property'
        );
      } else {
        router.replace(
          user.has_worker ? '/(worker)/(tabs)/feed' : '/(worker)/onboarding/role'
        );
      }
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.error ??
        e.message ??
        'The code you entered is incorrect. Please try again.';
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    console.log('[OTPScreen] handleResend called for:', phone);
    try {
      const payload: Record<string, string> = { phone_number: phone };
      if (appHashRef.current) {
        payload.app_hash = appHashRef.current;
        console.log('[OTPScreen] Appended app_hash to resend payload:', appHashRef.current);
      } else {
        console.log('[OTPScreen] No app_hash available for resend payload.');
      }

      console.log('[OTPScreen] Resending OTP via API...');
      const response = await api.post('/auth/otp/send', payload);
      console.log('[OTPScreen] Resend API response:', response.data);

      if (!response.data.success) {
        console.log('[OTPScreen] Resend success false. Error:', response.data.error);
        throw new Error(response.data.error || 'Failed to resend OTP');
      }
    } catch (e: any) {
      console.error('[OTPScreen] Resend exception:', e);
      const errorMessage =
        e.response?.data?.error ?? e.message ?? 'Could not resend OTP. Try again.';
      Alert.alert('Error', errorMessage);
      throw e; // Rethrow so OtpForm knows the resend failed
    }
  };

  // Format phone for display: +91 98765 43210
  const formattedPhone = phone
    ? phone.replace(/(\+\d{2})(\d{5})(\d{5})/, '$1 $2 $3')
    : '';

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mx-5 mt-4 mb-2 self-start flex-row items-center gap-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className="text-primary text-base font-semibold">← Back</Text>
          </TouchableOpacity>

          <View className="flex-1 px-5 pt-6 pb-10">

            {/* Header */}
            <View className="mb-8">
              <Text
                className="text-4xl font-black text-primary italic tracking-tighter mb-2"
                style={{ includeFontPadding: false }}
              >
                TEJJ
              </Text>
              <Text className="text-2xl font-bold text-on-surface mb-3">
                Check your messages
              </Text>
              <Text className="text-sm text-on-surface-variant leading-relaxed">
                We sent a 6-digit verification code to
              </Text>

              {/* Phone pill */}
              <View className="mt-3 self-start flex-row items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant">
                <Text className="text-sm font-bold text-on-surface tracking-wide">
                  {formattedPhone}
                </Text>
                <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text className="text-xs text-primary font-semibold">Change</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider */}
            <View className="flex-row items-center gap-3 mb-8">
              <View className="h-px flex-1 bg-outline-variant" />
              <Text className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                Enter Code
              </Text>
              <View className="h-px flex-1 bg-outline-variant" />
            </View>

            {/* OTP Form */}
            <OtpForm
              phone={phone || ''}
              onChangePhone={() => router.back()}
              isLoading={loading}
              setIsLoading={setLoading}
              onResendOTP={handleResend}
              onVerifyOtp={handleVerify}
            />

            {/* Help note */}
            <View className="mt-8 rounded-2xl bg-surface-container-low p-4">
              <Text className="text-xs font-semibold text-on-surface mb-1">
                Didn't receive the code?
              </Text>
              <Text className="text-xs text-on-surface-variant leading-relaxed">
                It may take up to 30 seconds. Check your SMS inbox or tap{' '}
                <Text className="text-primary font-medium">Resend</Text> above.
              </Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}