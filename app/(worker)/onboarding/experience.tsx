import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
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
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8">
          <StepIndicator currentStep={3} totalSteps={10} />
          <Text className="text-white text-2xl font-bold mb-1">How many years of experience?</Text>
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
            maximumTrackTintColor="#f5f5f5"
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
              className={`px-3 py-2 rounded-xl border ${years === n ? 'bg-amber-500 border-amber-500' : 'bg-zinc-800 border-zinc-600'}`}
              activeOpacity={0.75}
            >
              <Text className={`text-sm ${years === n ? 'text-white font-bold' : 'text-zinc-400'}`}>{n}yr</Text>
            </TouchableOpacity>
          ))}
        </View>

        <OnboardingFooter 
          onBack={() => router.back()}
          onNext={() => router.push('/(worker)/onboarding/photo')}
        />
      </ScrollView>
    </SafeScreen>
  );
}
