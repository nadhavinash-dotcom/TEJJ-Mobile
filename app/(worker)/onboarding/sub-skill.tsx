import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { CUISINE_LIST, SKILL_LIST } from '@/utils';

export default function SubSkillScreen() {
  const { worker, updateWorker } = useOnboardingStore();

  const skillDef = SKILL_LIST.find((s) => s.id === worker.primary_skill);
  const cuisines = worker.primary_skill === 'cook' ? CUISINE_LIST : [];

  const handleVoiceResult = ({ keywords }: { keywords: string[] }) => {
    const match = CUISINE_LIST.find((c) => keywords.some((k) => c.id === k || c.labelEn?.toLowerCase().includes(k)));
    if (match) updateWorker({ sub_skills: [match.id] });
  };

  const toggleCuisine = (id: string) => {
    const current = worker.sub_skills ?? [];
    if (current.includes(id)) {
      updateWorker({ sub_skills: current.filter((s) => s !== id) });
    } else {
      updateWorker({ sub_skills: [...current, id] });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 pb-4">
          <Text className="text-navy-400 text-sm mb-1">Step 2 of 10</Text>
          <Text className="text-white text-2xl font-bold mb-1">Speciality kya hai?</Text>
          <Text className="text-navy-300 text-sm mb-4">
            {skillDef ? `${skillDef.label} — ` : ''}Select your specialisation
          </Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </View>

        {cuisines.length > 0 && (
          <View className="px-6">
            <Text className="text-navy-300 text-sm mb-3">Cuisine speciality</Text>
            <View className="flex-row flex-wrap gap-2">
              {cuisines.map((c) => {
                const sel = (worker.sub_skills ?? []).includes(c.id);
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => toggleCuisine(c.id)}
                    className={`px-4 py-2 rounded-xl border ${sel ? 'bg-amber-500 border-amber-500' : 'bg-navy-800 border-navy-600'}`}
                    activeOpacity={0.75}
                  >
                    <Text className={`text-sm font-medium ${sel ? 'text-white' : 'text-navy-300'}`}>{c.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {cuisines.length === 0 && (
          <View className="px-6 py-4">
            <Text className="text-navy-400 text-sm">No sub-skills available for this role. Continue to next step.</Text>
          </View>
        )}

        <View className="px-6 py-6">
          <TouchableOpacity
            onPress={() => router.push('/(worker)/onboarding/experience')}
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
