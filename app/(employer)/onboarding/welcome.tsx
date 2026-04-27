import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { EMPLOYER_PLANS } from '@/utils';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function EmployerWelcomeScreen() {
  return (
    <SafeScreen className="flex-1">
      <View className="flex-1 px-6 py-8 justify-between">
        <View className="items-center">
          <View className="mb-4">
            <LucideIcon name="PartyPopper" size={64} color="#F59E0B" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2 text-center">Welcome to TEJJ!</Text>
          <Text className="text-zinc-300 text-sm text-center mb-8">Your employer account is ready. Start posting jobs.</Text>
        </View>

        <View className="gap-3 mb-4">
          {Object.entries(EMPLOYER_PLANS).map(([key, plan]: [string, any]) => (
            <View key={key} className={`rounded-2xl p-4 border ${key === 'GROWTH' ? 'border-amber-500/40 bg-amber-500/10' : 'border-zinc-700 bg-zinc-800'}`}>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-bold">{plan.name}</Text>
                {key === 'GROWTH' && <Text className="text-amber-400 text-xs bg-amber-500/20 px-2 py-1 rounded">Current</Text>}
              </View>
              <Text className="text-zinc-300 text-sm">{(plan as any).post_limit === -1 ? 'Unlimited' : (plan as any).post_limit} jobs/month</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.replace('/(employer)/(tabs)/dashboard')}
          className="bg-blue-600 rounded-2xl py-4 items-center"
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-lg">Go to Dashboard →</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}
