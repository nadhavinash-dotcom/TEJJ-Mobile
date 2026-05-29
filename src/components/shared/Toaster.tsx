import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastStore } from '../../store/toastStore';

const BG: Record<string, string> = {
  error: '#DC2626',
  success: '#16A34A',
  info: '#3F3F46',
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  const insets = useSafeAreaInsets();

  if (!toasts.length) return null;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: insets.bottom + 16,
        left: 16,
        right: 16,
        zIndex: 9999,
      }}
      pointerEvents="box-none"
    >
      {toasts.map((t) => (
        <TouchableOpacity
          key={t.id}
          onPress={() => dismiss(t.id)}
          activeOpacity={0.9}
          style={{
            backgroundColor: BG[t.type],
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
            elevation: 6,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500', flex: 1 }}>
            {t.message}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginLeft: 8 }}>×</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
