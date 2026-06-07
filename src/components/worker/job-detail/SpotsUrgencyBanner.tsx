import React from 'react';
import { View, Text } from 'react-native';
import { Zap } from 'lucide-react-native';
import { C } from './colors';

interface SpotsUrgencyBannerProps {
  spotsLeft: number;
}

export function SpotsUrgencyBanner({ spotsLeft }: SpotsUrgencyBannerProps) {
  if (spotsLeft <= 0 || spotsLeft > 3) return null;

  return (
    <View
      className="mx-4 mb-4 rounded-xl px-4 py-3 flex-row items-center gap-2"
      style={{ backgroundColor: C.errorContainer, borderWidth: 1, borderColor: '#fecdd3' }}
    >
      <Zap size={15} color={C.error} />
      <Text className="font-bold text-sm flex-1" style={{ color: C.error }}>
        Only {spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left — apply fast!
      </Text>
    </View>
  );
}
