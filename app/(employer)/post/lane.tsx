import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { HIRING_LANES } from '@/utils';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

const LANES = [
  { key: 'L1', ...HIRING_LANES.L1, description: 'Fill urgent shift today. Workers get notified instantly.' },
  { key: 'L2', ...HIRING_LANES.L2, description: 'Post for shifts starting within 24 hours.' },
  { key: 'L3', ...HIRING_LANES.L3, description: 'Short-term contract for events or peak periods.' },
  { key: 'L4', ...HIRING_LANES.L4, description: 'Hire full-time permanent staff.' },
];

export default function LaneScreen() {
  const { updateJobDraft } = useOnboardingStore();

  const handleSelect = (lane: number) => {
    updateJobDraft({ lane });
    router.push('/(employer)/post/template');
  };

  return (
    <SafeScreen className="flex-1">
      <View className="flex-1 px-6 pt-8">
        <TouchableOpacity onPress={() => router.back()} className="mb-6 flex-row items-center gap-1">
          <LucideIcon name="ChevronLeft" size={20} color="#F59E0B" />
          <Text className="text-amber-400 text-base">Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold mb-1">Select Hiring Lane</Text>
        <Text className="text-navy-300 text-sm mb-6">What type of job are you posting?</Text>

        <View className="gap-3">
          {LANES.map((lane) => (
            <TouchableOpacity
              key={lane.key}
              onPress={() => handleSelect(parseInt(lane.key.replace('L', '')))}
              className="bg-navy-800 border border-navy-700 rounded-2xl p-5"
              activeOpacity={0.85}
            >
              <View className="flex-row items-center gap-3 mb-2">
                <View className="px-3 py-1 rounded-lg flex-row items-center gap-2" style={{ backgroundColor: lane.color }}>
                  <LucideIcon name={lane.icon} size={16} color="#FFFFFF" />
                  <Text className="text-white font-bold">{lane.label}</Text>
                </View>
              </View>
              <Text className="text-navy-300 text-sm">{lane.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeScreen>
  );
}
