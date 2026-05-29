import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { AlertTriangle, QrCode, UserX } from 'lucide-react-native';

const C = {
  primary: '#000666',
  background: '#fbf8fe',
  surfaceContainerLowest: '#ffffff',
  onSurface: '#1b1b1f',
  onSurfaceVariant: '#454652',
  outline: '#767683',
  outlineVariant: '#c6c5d4',
  secondary: '#006b5e',
  tertiaryFixed: '#ffdcc6',
  onTertiaryContainer: '#ec7700',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
};

export default function ConfirmGateScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['confirm-gate'],
    queryFn: async () => {
      const res = await api.get('/employers/confirm-gate');
      return res.data.data as { blocked: boolean; pending_match?: any };
    },
  });

  if (isLoading) {
    return (
      <SafeScreen
        style={{ flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator color={C.primary} size="large" />
      </SafeScreen>
    );
  }

  if (data?.blocked && data?.pending_match) {
    return (
      <SafeScreen
        style={{
          flex: 1,
          backgroundColor: C.background,
          paddingHorizontal: 24,
          justifyContent: 'center',
        }}
      >
        <View className="items-center mb-6">
          <View
            className="w-20 h-20 rounded-full items-center justify-center"
            style={{ backgroundColor: C.tertiaryFixed }}
          >
            <AlertTriangle size={36} color={C.onTertiaryContainer} />
          </View>
        </View>

        <Text className="text-2xl font-bold text-center mb-2" style={{ color: C.onSurface }}>
          Confirm Gate
        </Text>
        <Text className="text-sm text-center mb-8" style={{ color: C.onSurfaceVariant }}>
          You have an unresolved match. Please confirm whether the worker arrived before posting new jobs.
        </Text>

        <View
          className="rounded-2xl p-5 mb-8"
          style={{
            backgroundColor: C.surfaceContainerLowest,
            borderWidth: 1,
            borderColor: C.outlineVariant,
          }}
        >
          <Text
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: C.outline }}
          >
            Pending Match
          </Text>
          <Text className="font-bold text-base mb-1" style={{ color: C.onSurface }}>
            {data.pending_match.job_title}
          </Text>
          <Text className="text-sm" style={{ color: C.onSurfaceVariant }}>
            {data.pending_match.worker_name}
          </Text>
        </View>

        <View className="gap-3">
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(employer)/qr-scanner' })}
            className="rounded-2xl py-4 flex-row items-center justify-center gap-2"
            style={{ backgroundColor: C.secondary }}
            activeOpacity={0.85}
          >
            <QrCode size={18} color="#ffffff" />
            <Text className="text-white font-bold text-base">Worker arrived — Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await api.post(`/matches/${data.pending_match._id}/no-show`, {});
              router.replace('/(employer)/post/lane');
            }}
            className="rounded-2xl py-4 flex-row items-center justify-center gap-2"
            style={{
              backgroundColor: C.errorContainer,
              borderWidth: 1,
              borderColor: '#fecdd3',
            }}
            activeOpacity={0.85}
          >
            <UserX size={18} color={C.error} />
            <Text className="font-bold text-base" style={{ color: C.error }}>
              Worker did not arrive (No-show)
            </Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  router.replace('/(employer)/post/lane');
  return null;
}
