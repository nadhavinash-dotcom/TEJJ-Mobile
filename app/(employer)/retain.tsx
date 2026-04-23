import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { auth } from '../../src/lib/firebase';

export default function RetainScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['retain-dashboard'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/employers/retain', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-amber-400 text-base">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold mb-1">TEJJ Retain</Text>
          <Text className="text-navy-300 text-sm mb-4">Your long-term workers and their benefit status</Text>
        </View>

        {isLoading ? (
          <View className="py-10 items-center"><ActivityIndicator color="#3B82F6" /></View>
        ) : (
          <View className="px-4 gap-4">
            <View className="flex-row gap-3">
              <View className="flex-1 bg-navy-800 border border-navy-700 rounded-2xl p-4 items-center">
                <Text className="text-white text-2xl font-bold">{data?.enrolled_workers ?? 0}</Text>
                <Text className="text-navy-300 text-xs text-center mt-1">Retained Workers</Text>
              </View>
              <View className="flex-1 bg-navy-800 border border-navy-700 rounded-2xl p-4 items-center">
                <Text className="text-amber-400 text-2xl font-bold">{data?.avg_retention_days ?? 0}</Text>
                <Text className="text-navy-300 text-xs text-center mt-1">Avg Days</Text>
              </View>
            </View>

            <Text className="text-white font-semibold">Benefit Milestones</Text>
            {(data?.workers ?? []).length === 0 ? (
              <View className="bg-navy-800 border border-navy-700 rounded-2xl p-5 items-center">
                <Text className="text-navy-400 text-sm">No retained workers yet. Keep rehiring the same workers!</Text>
              </View>
            ) : (
              (data.workers as any[]).map((w: any) => (
                <View key={w._id} className="bg-navy-800 border border-navy-700 rounded-2xl p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-white font-bold">{w.worker_skill}</Text>
                    <Text className="text-amber-400 text-sm">{w.days_with_employer} days</Text>
                  </View>
                  <View className="flex-row gap-2">
                    {w.days_with_employer >= 90 && <Text className="text-blue-400 text-xs bg-blue-500/10 px-2 py-1 rounded">🏥 Insurance</Text>}
                    {w.days_with_employer >= 180 && <Text className="text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded">🛵 Loan</Text>}
                    {w.days_with_employer >= 365 && <Text className="text-amber-400 text-xs bg-amber-500/10 px-2 py-1 rounded">💸 EWA</Text>}
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
