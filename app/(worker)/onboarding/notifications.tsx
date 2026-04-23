import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
} catch (e) {
  // Ignored in Expo Go
}

import { useOnboardingStore } from '../../../src/store/onboardingStore';

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
    <SafeAreaView className="flex-1 bg-navy-900">
      <View className="flex-1 px-6 pt-8 justify-between">
        <View>
          <Text className="text-navy-400 text-sm mb-1">Step 9 of 10</Text>
          <Text className="text-white text-2xl font-bold mb-1">Job alerts ON karo</Text>
          <Text className="text-navy-300 text-sm mb-8">Get instant notifications for flash jobs near you. Don't miss out!</Text>

          <View className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-6">
            <Text className="text-4xl text-center mb-4">🔔</Text>
            <Text className="text-white font-semibold text-center text-lg mb-2">Flash Job Alerts</Text>
            <Text className="text-navy-300 text-sm text-center">
              L1 Flash jobs fill in minutes. Push notifications ensure you never miss a high-paying same-day gig near you.
            </Text>
          </View>

          {granted && (
            <View className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex-row items-center gap-3">
              <Text className="text-green-400 text-xl">✓</Text>
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
              {requesting ? <ActivityIndicator color="#fff" size="small" /> : <Text className="text-white text-xl">🔔</Text>}
              <Text className="text-white font-bold text-base">Notifications ON karo</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => router.push('/(worker)/onboarding/preview')}
            className={`rounded-2xl py-4 items-center ${granted ? 'bg-amber-500' : 'bg-navy-700'}`}
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">
              {granted ? 'Aage Badhein →' : 'Skip for now →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
