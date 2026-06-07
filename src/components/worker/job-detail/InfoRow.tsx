import React from 'react';
import { View, Text } from 'react-native';
import { C } from './colors';

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  noBorder?: boolean;
}

export function InfoRow({ icon, label, value, noBorder }: InfoRowProps) {
  return (
    <View
      className="flex-row items-center justify-between py-3"
      style={noBorder ? undefined : { borderBottomWidth: 1, borderBottomColor: C.outlineVariant + '55' }}
    >
      <View className="flex-row items-center gap-2.5 flex-1 mr-4">
        {icon}
        <Text style={{ color: C.onSurfaceVariant, fontSize: 13 }}>{label}</Text>
      </View>
      <Text style={{ color: C.onSurface, fontSize: 13, fontWeight: '600', textAlign: 'right', flexShrink: 1 }}>
        {value}
      </Text>
    </View>
  );
}
