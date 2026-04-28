import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LucideIcon } from './LucideIcon';

interface OnboardingFooterProps {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  color?: string; // e.g. 'bg-amber-500' or 'bg-blue-600'
}

export function OnboardingFooter({ 
  onBack, 
  onNext, 
  nextDisabled, 
  nextLabel = 'Next',
  color = 'bg-amber-500'
}: OnboardingFooterProps) {
  return (
    <View className="px-6 py-6 flex-row gap-4">
      <TouchableOpacity
        onPress={onBack}
        className="flex-1 bg-navy-500 border border-zinc-400 rounded-2xl py-4 flex-row items-center justify-center gap-1"
        activeOpacity={0.7}
      >
        <LucideIcon name="ChevronLeft" size={18} color="white" />
        <Text className="text-white font-bold text-base">Back</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onNext}
        disabled={nextDisabled}
        className={`flex-[2] rounded-2xl py-4 flex-row items-center justify-center gap-2 ${nextDisabled ? 'bg-navy-700 opacity-50 border border-zinc-400' : color}`}
        activeOpacity={0.85}
      >
        <Text className="text-white font-bold text-base">{nextLabel.replace(' →', '')}</Text>
        <LucideIcon name="ChevronRight" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
