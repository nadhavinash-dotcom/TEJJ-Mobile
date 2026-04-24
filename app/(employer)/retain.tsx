import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { auth } from '../../src/lib/firebase';
import { LucideIcon } from '../../src/components/shared/LucideIcon';

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
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="mb-4 flex-row items-center gap-1">
            <LucideIcon name="ChevronLeft" size={20} color="#F59E0B" />
            <Text className="text-amber-400 text-base">Back</Text>
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
                  <View className="flex-row gap-2 mt-2">
                    {w.days_with_employer >= 90 && (
                      <View className="flex-row items-center gap-1 bg-blue-500/10 px-2 py-1 rounded">
                        <LucideIcon name="Stethoscope" size={10} color="#60A5FA" />
                        <Text className="text-blue-400 text-[10px]">Insurance</Text>
                      </View>
                    )}
                    {w.days_with_employer >= 180 && (
                      <View className="flex-row items-center gap-1 bg-green-500/10 px-2 py-1 rounded">
                        <LucideIcon name="Bike" size={10} color="#4ADE80" />
                        <Text className="text-green-400 text-[10px]">Loan</Text>
                      </View>
                    )}
                    {w.days_with_employer >= 365 && (
                      <View className="flex-row items-center gap-1 bg-amber-500/10 px-2 py-1 rounded">
                        <LucideIcon name="Banknote" size={10} color="#FBBF24" />
                        <Text className="text-amber-400 text-[10px]">EWA</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
}
