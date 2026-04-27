import React, { useState } from 'react';
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

export default function PhoneScreen() {
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const phoneNumber = `+91${cleaned}`;
      const response = await api.post('/auth/otp/send', { phone_number: phoneNumber });
      
      if (response.data.success) {
        router.push({ pathname: '/(auth)/otp', params: { phone: phoneNumber } });
      } else {
        throw new Error(response.data.error || 'Failed to send OTP');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Could not send OTP. Try again.');
    } finally {
      setLoading(false);
    }
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
              <View className="mb-2 items-center">
                <Text
                  className="text-5xl font-black text-primary tracking-tighter italic"
                  style={{ includeFontPadding: false }}
                >
                  TEJJ
                </Text>
              </View>

              <View className="space-y-2 mb-8">
                <Text className="text-lg text-center text-on-surface-variant leading-relaxed">
                  Enter your phone number to access the Resilient Concierge dashboard.
                </Text>
              </View>

              <PhoneForm
                handleSendOtp={handleSendOTP}
                isLoading={loading}
                setIsLoading={setLoading}
              />

              <View className="mt-8 p-6 rounded-3xl bg-surface-container-low flex-row items-center gap-6 overflow-hidden relative mb-12">
                <View className="flex-1 space-y-1 z-10">
                  <Text className="font-bold text-primary text-lg">Hospitality Ready</Text>
                  <Text className="text-sm text-on-surface-variant leading-tight">
                    TEJJ connects elite staff with India's premium hospitality venues.
                  </Text>
                </View>
                <View className="w-20 h-20 rounded-2xl overflow-hidden bg-primary rotate-12 flex-shrink-0 z-10 border border-primary/20">
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1562790351-d273a961e0e9?auto=format&fit=crop&q=80&w=200' }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="absolute -right-10 -bottom-10 w-40 h-40 bg-secondary-container opacity-20 rounded-full" />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

