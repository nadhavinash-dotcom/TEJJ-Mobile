import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function ArrivalConfirmedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-navy-900 items-center justify-center px-6">
      <Text className="text-7xl mb-6">🎊</Text>
      <Text className="text-green-400 text-2xl font-bold mb-2 text-center">Shift Started!</Text>
      <Text className="text-white text-lg font-semibold mb-2 text-center">Welcome to your workplace</Text>
      <Text className="text-navy-300 text-sm text-center mb-8">Your arrival has been confirmed. Give it your best!</Text>

      <View className="bg-navy-800 border border-navy-700 rounded-2xl p-5 w-full mb-8">
        <Text className="text-navy-300 text-sm mb-3">During your shift:</Text>
        {['Follow all employer instructions', 'Maintain hygiene standards', 'Be polite to customers', 'Complete the full shift duration'].map((tip, i) => (
          <View key={i} className="flex-row items-center gap-2 mb-2">
            <Text className="text-amber-400">✓</Text>
            <Text className="text-white text-sm">{tip}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={() => router.replace('/(worker)/(tabs)/feed')} className="bg-amber-500 rounded-2xl py-4 px-10" activeOpacity={0.85}>
        <Text className="text-white font-bold text-base">Go to Feed</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
