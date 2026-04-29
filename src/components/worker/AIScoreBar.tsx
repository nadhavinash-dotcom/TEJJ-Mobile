import React from 'react';
import { View, Text } from 'react-native';
import { LucideIcon } from '../shared/LucideIcon';

interface AIScore {
  technique: number;
  speed: number;
  hygiene: number;
  warmth: number;
}

interface AIScoreBarProps {
  scores: AIScore;
}

function Bar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5.0) * 100;
  const color = value >= 4.0 ? '#006b5e' : value >= 3.0 ? '#F59E0B' : '#ba1a1a';
  return (
    <View className="mb-3">
      <View className="flex-row justify-between mb-1.5">
        <Text className="text-on-surface-variant text-sm">{label}</Text>
        <Text className="text-on-surface font-semibold text-sm">{value.toFixed(1)}</Text>
      </View>
      <View className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
        <View className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </View>
    </View>
  );
}

export function AIScoreBar({ scores }: AIScoreBarProps) {
  const avg = (scores.technique + scores.speed + scores.hygiene + scores.warmth) / 4;
  return (
    <View className="bg-surface border border-outline-variant rounded-2xl p-4">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <View className="w-7 h-7 bg-primary-container rounded-full items-center justify-center">
            <LucideIcon name="Brain" size={14} color="#8690ee" />
          </View>
          <Text className="text-on-surface font-semibold">AI Video Score</Text>
        </View>
        <View className="bg-tertiary-container px-2.5 py-1 rounded-full">
          <Text className="text-on-tertiary-container font-bold text-sm">{avg.toFixed(1)} / 5.0</Text>
        </View>
      </View>
      <Bar label="Technique" value={scores.technique} />
      <Bar label="Speed" value={scores.speed} />
      <Bar label="Hygiene" value={scores.hygiene} />
      <Bar label="Warmth" value={scores.warmth} />
    </View>
  );
}
