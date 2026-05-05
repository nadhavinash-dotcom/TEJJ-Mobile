import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import api from '../../src/lib/api';
import PhoneForm from '../../src/components/tell/auth/PhoneForm';

// Lazily load so iOS never crashes
let OtpVerify: any = null;
if (Platform.OS === 'android') {
  try {
    OtpVerify = require('react-native-otp-verify').default;
  } catch (e) {
    console.warn('[PhoneScreen] react-native-otp-verify not available:', e);
  }
}

export default function PhoneScreen() {
  const [loading, setLoading] = useState(false);
  const appHashRef = useRef<string | null>(null);

  // Retrieve app hash once on mount (Android only) for SMS Retriever
  useEffect(() => {
    console.log('[PhoneScreen] Component mounted. Platform:', Platform.OS);
    if (Platform.OS !== 'android' || !OtpVerify) {
      console.log('[PhoneScreen] Skipping getHash (not Android or OtpVerify missing)');
      return;
    }
    console.log('[PhoneScreen] Requesting app hash from OtpVerify...');
    OtpVerify.getHash()
      .then((hashes: string[]) => {
        console.log('[PhoneScreen] getHash response hashes:', hashes);
        if (hashes && hashes.length > 0) {
          appHashRef.current = hashes[0];
          console.log('[PhoneScreen] App hash successfully retrieved:', hashes[0]);
        }
      })
      .catch((err: any) =>
        console.error('[PhoneScreen] getHash failed with error:', err)
      );
  }, []);

  const handleSendOTP = async (phone: string) => {
    console.log(`[PhoneScreen] handleSendOTP called for: ${phone}`);
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      console.log('[PhoneScreen] Invalid length, showing alert.');
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const phoneNumber = `+91${cleaned}`;
      const payload: Record<string, string> = { phone_number: phoneNumber };
      if (appHashRef.current) {
        payload.app_hash = appHashRef.current;
        console.log('[PhoneScreen] Appended app_hash to payload:', appHashRef.current);
      } else {
        console.log('[PhoneScreen] No app_hash available to append.');
      }

      console.log('[PhoneScreen] Sending API request to /auth/otp/send with payload:', payload);
      const response = await api.post('/auth/otp/send', payload);
      console.log('[PhoneScreen] API response:', response.data);
      if (response.data.success) {
        console.log('[PhoneScreen] OTP sent successfully, navigating to /otp');
        router.push({ pathname: '/(auth)/otp', params: { phone: phoneNumber } });
      } else {
        console.log('[PhoneScreen] API returned success false. Error:', response.data.error);
        throw new Error(response.data.error || 'Failed to send OTP');
      }
    } catch (e: any) {
      console.error('[PhoneScreen] handleSendOTP Exception:', e);
      Alert.alert('Error', e.message ?? 'Could not send OTP. Try again.');
    } finally {
      console.log('[PhoneScreen] handleSendOTP complete, resetting loading state');
      setLoading(false);
    }
  };


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
          {/* Top hero strip */}
          <View className="w-full h-48 overflow-hidden relative">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1562790351-d273a961e0e9?auto=format&fit=crop&q=80&w=800' }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* gradient overlay */}
            <View
              className="absolute inset-0 bg-surface"
              style={{ opacity: 0.55 }}
            />
            {/* Logo pinned inside hero */}
            <View className="absolute inset-0 items-center justify-center">
              <Text
                className="text-6xl font-black text-primary tracking-tighter italic"
                style={{ includeFontPadding: false }}
              >
                TEJJ
              </Text>
              <Text className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase mt-1">
                Hospitality · Staffing
              </Text>
            </View>
          </View>

          {/* Main card */}
          <View className="flex-1 px-5 pt-8 pb-10">

            {/* Section label */}
            <View className="flex-row items-center gap-3 mb-6">
              <View className="h-px flex-1 bg-outline-variant" />
              <Text className="text-xs font-semibold text-on-surface-variant tracking-widest uppercase">
                Sign In
              </Text>
              <View className="h-px flex-1 bg-outline-variant" />
            </View>

            {/* Headline */}
            <Text className="text-2xl font-bold text-on-surface mb-1">
              Enter your mobile number
            </Text>
            <Text className="text-sm text-on-surface-variant mb-8 leading-relaxed">
              We'll send a one-time code to verify your identity.
            </Text>

            {/* Phone form */}
            <PhoneForm
              handleSendOtp={handleSendOTP}
              isLoading={loading}
              setIsLoading={setLoading}
            />

            {/* Divider */}
            <View className="h-px bg-outline-variant my-8" />

            {/* Feature card */}
            <View className="rounded-2xl bg-surface-container-low overflow-hidden">
              {/* Top accent bar */}
              <View className="h-1 w-full bg-primary" />

              <View className="p-5 flex-row items-center gap-4">
                <View className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1562790351-d273a961e0e9?auto=format&fit=crop&q=80&w=200' }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>

                <View className="flex-1">
                  <Text className="font-bold text-primary text-base mb-0.5">
                    Elite Hospitality Network
                  </Text>
                  <Text className="text-xs text-on-surface-variant leading-snug">
                    Connecting premium staff with India's top venues — seamlessly.
                  </Text>
                </View>
              </View>
            </View>

            {/* Footer note */}
            <Text className="text-xs text-on-surface-variant text-center mt-6 leading-relaxed">
              By continuing, you agree to our{' '}
              <Text className="text-primary font-medium">Terms of Service</Text>
              {' '}and{' '}
              <Text className="text-primary font-medium">Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}