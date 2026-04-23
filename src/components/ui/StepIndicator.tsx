import React from 'react';
import { View, Text } from 'react-native';

interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  const progress = (current / total) * 100;

  return (
    <View className="px-6 pb-4">
      <View className="flex-row justify-between mb-2">
        <Text className="text-navy-300 text-xs">Step {current} of {total}</Text>
        <Text className="text-amber-500 text-xs font-bold">{Math.round(progress)}%</Text>
      </View>
      <View className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
        <View
          className="h-full bg-amber-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
}
