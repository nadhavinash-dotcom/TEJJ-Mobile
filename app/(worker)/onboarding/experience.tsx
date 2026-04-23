import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { mapVoiceToExperience } from '@/utils';

export default function ExperienceScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const years = worker.years_experience ?? 1;

  const handleVoiceResult = ({ englishText }: { englishText: string; keywords: string[]; originalText: string; structured: Record<string, unknown> }) => {
    const exp = mapVoiceToExperience(englishText);
    if (exp !== null) updateWorker({ years_experience: exp });
  };

  const expLabel = (n: number) => {
    if (n === 0) return 'Fresher (0 years)';
    if (n === 1) return '1 year';
    return `${n} years`;
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8">
          <Text className="text-navy-400 text-sm mb-1">Step 3 of 10</Text>
          <Text className="text-white text-2xl font-bold mb-1">Kitne saal ka experience?</Text>
          <Text className="text-navy-300 text-sm mb-4">How many years of experience do you have?</Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </View>

        <View className="px-6 py-8 items-center">
          <Text className="text-amber-400 text-5xl font-bold mb-2">{years}</Text>
          <Text className="text-white text-lg mb-8">{expLabel(years)}</Text>

          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={20}
            step={1}
            value={years}
            onValueChange={(v) => updateWorker({ years_experience: v })}
            minimumTrackTintColor="#F59E0B"
            maximumTrackTintColor="#374151"
            thumbTintColor="#F59E0B"
          />
          <View className="flex-row justify-between w-full mt-1">
            <Text className="text-navy-400 text-xs">Fresher</Text>
            <Text className="text-navy-400 text-xs">20+ years</Text>
          </View>
        </View>

        <View className="px-6 pb-8 flex-row gap-3">
          {[0, 1, 2, 3, 5, 7, 10].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => updateWorker({ years_experience: n })}
              className={`px-3 py-2 rounded-xl border ${years === n ? 'bg-amber-500 border-amber-500' : 'bg-navy-800 border-navy-600'}`}
              activeOpacity={0.75}
            >
              <Text className={`text-sm ${years === n ? 'text-white font-bold' : 'text-navy-300'}`}>{n}yr</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="px-6 pb-8">
          <TouchableOpacity
            onPress={() => router.push('/(worker)/onboarding/photo')}
            className="bg-amber-500 rounded-2xl py-4 items-center"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">Aage Badhein →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
