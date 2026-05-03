import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { SkillGrid } from '../../../src/components/shared/SkillGrid';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { SKILL_LIST } from '@/utils';

export default function RoleScreen() {
  const { worker, updateWorker } = useOnboardingStore();

  const handleVoiceResult = ({ keywords }: { keywords: string[]; englishText: string; originalText: string; structured: Record<string, unknown> }) => {
    const match = SKILL_LIST.find((s:any) => keywords.some((k:string) => s.keywords.includes(k.toLowerCase())));
    if (match) updateWorker({ primary_skill: match.id });
  };

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 pb-4">
          <StepIndicator currentStep={1} totalSteps={10} />
          <Text className="text-white text-2xl font-bold mb-1">What work do you do?</Text>
          <Text className="text-navy-300 text-sm mb-4">What is your primary skill?</Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </View>

        <SkillGrid
          selected={worker.primary_skill}
          onSelect={(id) => updateWorker({ primary_skill: id })}
        />

        <OnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/(worker)/onboarding/sub-skill')}
          nextDisabled={!worker.primary_skill}
          backDisabled={true}
        />
      </ScrollView>
    </SafeScreen>
  );
}
