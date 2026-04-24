import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { auth } from '../../src/lib/firebase';
import { LucideIcon } from '../../src/components/shared/LucideIcon';

export default function ConfirmGateScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['confirm-gate'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/employers/confirm-gate', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data as { blocked: boolean; pending_match?: any };
    },
  });

  if (isLoading) {
    return <SafeScreen className="items-center justify-center"><ActivityIndicator color="#3B82F6" size="large" /></SafeScreen>;
  }

  if (data?.blocked && data?.pending_match) {
    return (
      <SafeScreen className="flex-1 bg-navy-900 px-6 justify-center">
        <View className="items-center mb-4">
          <LucideIcon name="AlertTriangle" size={48} color="#F59E0B" />
        </View>
        <Text className="text-white text-2xl font-bold mb-2 text-center">Confirm Gate</Text>
        <Text className="text-navy-300 text-sm text-center mb-8">
          You have an unresolved match. Please confirm whether the worker arrived before posting new jobs.
        </Text>
        <View className="bg-navy-800 border border-amber-500/30 rounded-2xl p-5 mb-6">
          <Text className="text-white font-bold mb-1">{data.pending_match.job_title}</Text>
          <Text className="text-navy-300 text-sm">{data.pending_match.worker_name}</Text>
        </View>
        <View className="gap-3">
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(employer)/qr-scanner' })}
            className="bg-green-600 rounded-2xl py-4 items-center"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold">Worker arrived — Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const token = await auth.currentUser?.getIdToken();
              await api.post(`/matches/${data.pending_match._id}/no-show`, {}, { headers: { Authorization: `Bearer ${token}` } });
              router.replace('/(employer)/post/lane');
            }}
            className="bg-red-500/20 border border-red-500/30 rounded-2xl py-4 items-center"
            activeOpacity={0.85}
          >
            <Text className="text-red-400 font-bold">Worker did not arrive (No-show)</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  // Not blocked — proceed to post job
  router.replace('/(employer)/post/lane');
  return null;
}
