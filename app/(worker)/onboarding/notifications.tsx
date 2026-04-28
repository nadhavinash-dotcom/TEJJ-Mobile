import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
} catch (e) {
  // Ignored in Expo Go
}

import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function NotificationsScreen() {
  const { updateWorker } = useOnboardingStore();
  const [requesting, setRequesting] = useState(false);
  const [granted, setGranted] = useState(false);

  const requestPermission = async () => {
    setRequesting(true);
    try {
      if (!Notifications) {
        console.warn("Notifications not available in Expo Go");
        setGranted(false);
        return;
      }
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        const token = await Notifications.getExpoPushTokenAsync();
        updateWorker({ fcm_token: token.data });
        setGranted(true);
      }
    } finally {
      setRequesting(false);
    }
  };

  return (
    <SafeScreen className="flex-1">
      <View className="flex-1 px-6 pt-8 justify-between">
        <View>
          <StepIndicator currentStep={9} totalSteps={10} />
          <Text className="text-white text-2xl font-bold mb-1">Turn ON job alerts</Text>
          <Text className="text-zinc-300 text-sm mb-8">Get instant notifications for flash jobs near you. Don't miss out!</Text>

          <View className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-6">
            <View className="items-center mb-4">
              <LucideIcon name="Bell" size={48} color="#F59E0B" />
            </View>
            <Text className="text-white font-semibold text-center text-lg mb-2">Flash Job Alerts</Text>
            <Text className="text-zinc-300 text-sm text-center">
              L1 Flash jobs fill in minutes. Push notifications ensure you never miss a high-paying same-day gig near you.
            </Text>
          </View>

          {granted && (
            <View className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex-row items-center gap-3">
              <LucideIcon name="Check" size={20} color="#4ADE80" />
              <Text className="text-green-400 font-semibold">Notifications enabled!</Text>
            </View>
          )}
        </View>

        <View className="gap-3 pb-6">
          {!granted && (
            <TouchableOpacity
              onPress={requestPermission}
              disabled={requesting}
              className="bg-amber-500 rounded-2xl py-4 flex-row items-center justify-center gap-2"
              activeOpacity={0.85}
            >
              {requesting ? <ActivityIndicator color="#fff" size="small" /> : <LucideIcon name="Bell" size={20} color="#FFFFFF" />}
              <Text className="text-white font-bold text-base">Turn ON notifications</Text>
            </TouchableOpacity>
          )}
          <OnboardingFooter 
            onBack={() => router.back()}
            onNext={() => router.push('/(worker)/onboarding/preview')}
            nextLabel={granted ? 'Next →' : 'Skip for now →'}
          />
        </View>
      </View>
    </SafeScreen>
  );
}
