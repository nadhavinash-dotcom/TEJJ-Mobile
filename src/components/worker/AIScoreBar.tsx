import React from 'react';
import { View, Text } from 'react-native';

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
  const color = value >= 4.0 ? '#22C55E' : value >= 3.0 ? '#F59E0B' : '#EF4444';
  return (
    <View className="mb-3">
      <View className="flex-row justify-between mb-1">
        <Text className="text-navy-300 text-sm">{label}</Text>
        <Text className="text-white font-semibold text-sm">{value.toFixed(1)}</Text>
      </View>
      <View className="h-2 bg-navy-700 rounded-full">
        <View className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </View>
    </View>
  );
}

export function AIScoreBar({ scores }: AIScoreBarProps) {
  const avg = (scores.technique + scores.speed + scores.hygiene + scores.warmth) / 4;
  return (
    <View className="bg-navy-800 border border-navy-700 rounded-2xl p-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white font-semibold">AI Video Score</Text>
        <Text className="text-amber-400 font-bold text-lg">{avg.toFixed(1)} / 5.0</Text>
      </View>
      <Bar label="Technique" value={scores.technique} />
      <Bar label="Speed" value={scores.speed} />
      <Bar label="Hygiene" value={scores.hygiene} />
      <Bar label="Warmth" value={scores.warmth} />
    </View>
  );
}
