import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SkillGrid } from '../../../src/components/shared/SkillGrid';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { SKILL_LIST } from '@/utils';

export default function RoleScreen() {
  const { worker, updateWorker } = useOnboardingStore();

  const handleVoiceResult = ({ keywords }: { keywords: string[]; englishText: string; originalText: string; structured: Record<string, unknown> }) => {
    const match = SKILL_LIST.find((s) => keywords.some((k) => s.keywords.includes(k.toLowerCase())));
    if (match) updateWorker({ primary_skill: match.id });
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 pb-4">
          <Text className="text-navy-400 text-sm mb-1">Step 1 of 10</Text>
          <Text className="text-white text-2xl font-bold mb-1">Aap kya kaam karte hain?</Text>
          <Text className="text-navy-300 text-sm mb-4">What is your primary skill?</Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </View>

        <SkillGrid
          selected={worker.primary_skill}
          onSelect={(id) => updateWorker({ primary_skill: id })}
        />

        <View className="px-6 py-6">
          <TouchableOpacity
            onPress={() => router.push('/(worker)/onboarding/sub-skill')}
            disabled={!worker.primary_skill}
            className={`rounded-2xl py-4 items-center ${worker.primary_skill ? 'bg-amber-500' : 'bg-navy-700'}`}
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">Aage Badhein →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
