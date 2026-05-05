import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { SUB_SKILLS_MAP, SKILL_LIST } from '@/utils';

export default function SubSkillScreen() {
  const { worker, updateWorker } = useOnboardingStore();

  const skillDef = SKILL_LIST.find((s) => s.id === worker.primary_skill);
  const availableSubSkills = worker.primary_skill ? SUB_SKILLS_MAP[worker.primary_skill] || [] : [];

  const handleVoiceResult = ({ keywords }: { keywords: string[] }) => {
    const match = availableSubSkills.find((c) => 
      keywords.some((k) => c.id === k || c.labelEn?.toLowerCase().includes(k) || (c.keywords && c.keywords.includes(k)))
    );
    if (match) updateWorker({ sub_skills: [match.id] });
  };

  const toggleSubSkill = (id: string) => {
    const current = worker.sub_skills ?? [];
    if (current.includes(id)) {
      updateWorker({ sub_skills: current.filter((s) => s !== id) });
    } else {
      updateWorker({ sub_skills: [...current, id] });
    }
  };

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 pb-4">
          <StepIndicator currentStep={2} totalSteps={10} />
          <Text className="text-white text-2xl font-bold mb-1">What is your speciality?</Text>
          <Text className="text-zinc-300 text-sm mb-4">
            {skillDef ? `${skillDef.label} — ` : ''}Select your specialisation
          </Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </View>

        {availableSubSkills.length > 0 && (
          <View className="px-6">
            <Text className="text-zinc-300 text-sm mb-3">Select Speciality</Text>
            <View className="flex-row flex-wrap gap-2">
              {availableSubSkills.map((c) => {
                const sel = (worker.sub_skills ?? []).includes(c.id);
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => toggleSubSkill(c.id)}
                    className={`px-4 py-2 rounded-xl border ${sel ? 'bg-amber-500 border-amber-500' : 'bg-zinc-800 border-zinc-600'}`}
                    activeOpacity={0.75}
                  >
                    <Text className={`text-sm font-medium ${sel ? 'text-white' : 'text-zinc-400'}`}>{c.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {availableSubSkills.length === 0 && (
          <View className="px-6 py-4">
            <Text className="text-zinc-400 text-sm">No sub-skills available for this role. Continue to next step.</Text>
          </View>
        )}

        <OnboardingFooter 
          onBack={() => router.back()}
          onNext={() => router.push('/(worker)/onboarding/experience')}
        />
      </ScrollView>
    </SafeScreen>
  );
}
