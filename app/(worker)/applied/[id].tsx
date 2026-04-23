import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function AppliedScreen() {
  return (
    <SafeScreen className="items-center justify-center px-6">
      <View className="mb-6">
        <LucideIcon name="PartyPopper" size={64} color="#F59E0B" />
      </View>
      <Text className="text-white text-2xl font-bold mb-2 text-center">Application Submitted!</Text>
      <Text className="text-navy-300 text-base text-center mb-8">
        We've sent your profile to the employer. You'll get a notification if you're shortlisted or matched.
      </Text>
      <View className="bg-navy-800 border border-navy-700 rounded-2xl p-5 w-full mb-8">
        <Text className="text-navy-300 text-sm mb-2">What happens next?</Text>
        <View className="gap-2">
          {['Employer reviews your skill card', 'You get shortlisted if it matches', 'Direct match → venue revealed', 'Show up on time for shift'].map((step, i) => (
            <View key={i} className="flex-row items-center gap-3">
              <View className="w-6 h-6 rounded-full bg-amber-500 items-center justify-center">
                <Text className="text-white text-xs font-bold">{i + 1}</Text>
              </View>
              <Text className="text-white text-sm">{step}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity onPress={() => router.replace('/(worker)/(tabs)/feed')} className="bg-amber-500 rounded-2xl py-4 px-8 mb-3" activeOpacity={0.85}>
        <Text className="text-white font-bold text-base">Browse More Jobs</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(worker)/(tabs)/applications')} activeOpacity={0.75}>
        <Text className="text-navy-300 text-sm">View My Applications</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
}
