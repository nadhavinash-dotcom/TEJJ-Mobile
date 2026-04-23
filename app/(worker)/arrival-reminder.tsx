import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';

export default function ArrivalReminderScreen() {
  return (
    <SafeScreen className="items-center justify-center px-6">
      <Text className="text-7xl mb-6">⏰</Text>
      <Text className="text-white text-2xl font-bold mb-2 text-center">30 minutes to go!</Text>
      <Text className="text-amber-400 text-lg font-semibold mb-2 text-center">Your shift starts soon</Text>
      <Text className="text-navy-300 text-sm text-center mb-8">
        Make sure you leave now to arrive on time. The employer is counting on you!
      </Text>
      <View className="bg-navy-800 border border-navy-700 rounded-2xl p-5 w-full mb-8">
        <Text className="text-navy-300 text-sm mb-3">Arrival checklist:</Text>
        {['Wear clean, professional attire', 'Carry valid ID', 'Know the venue address', 'Arrive 5 minutes early'].map((item, i) => (
          <View key={i} className="flex-row items-center gap-2 mb-2">
            <Text className="text-amber-400">•</Text>
            <Text className="text-white text-sm">{item}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={() => router.push('/(worker)/qr-code')} className="bg-amber-500 rounded-2xl py-4 px-8 w-full items-center mb-3" activeOpacity={0.85}>
        <Text className="text-white font-bold text-base">Show My QR Code</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
}
