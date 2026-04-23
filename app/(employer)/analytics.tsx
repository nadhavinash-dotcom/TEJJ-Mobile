import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { auth } from '../../src/lib/firebase';
import { LucideIcon } from '../../src/components/shared/LucideIcon';

export default function AnalyticsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['employer-analytics'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/analytics/employer', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
  });

  const Stat = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
    <View className="flex-1 bg-navy-800 border border-navy-700 rounded-2xl p-4 items-center">
      <Text className="text-white text-2xl font-bold">{value}</Text>
      {sub && <Text className="text-navy-400 text-xs">{sub}</Text>}
      <Text className="text-navy-300 text-xs text-center mt-1">{label}</Text>
    </View>
  );

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="mb-4 flex-row items-center gap-1">
            <LucideIcon name="ChevronLeft" size={20} color="#F59E0B" />
            <Text className="text-amber-400 text-base">Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold mb-1">Analytics</Text>
          <Text className="text-navy-300 text-sm mb-4">Last 30 days</Text>
        </View>

        {isLoading ? (
          <View className="py-10 items-center"><ActivityIndicator color="#3B82F6" /></View>
        ) : (
          <View className="px-4 gap-4">
            <View className="flex-row gap-3">
              <Stat label="Jobs Posted" value={data?.jobs_posted ?? 0} />
              <Stat label="Total Matches" value={data?.total_matches ?? 0} />
              <Stat label="Show-Up Rate" value={`${(data?.show_up_rate ?? 0).toFixed(0)}%`} />
            </View>
            <View className="flex-row gap-3">
              <Stat label="Avg Time to Fill" value={data?.avg_fill_time_mins ?? 0} sub="minutes" />
              <Stat label="Dignity Score" value={(data?.dignity_score ?? 0).toFixed(1)} sub="/ 5.0" />
              <Stat label="Repeat Workers" value={data?.repeat_workers ?? 0} />
            </View>

            <View className="bg-navy-800 border border-navy-700 rounded-2xl p-5">
              <Text className="text-white font-semibold mb-3">Top Performing Skills</Text>
              {(data?.top_skills ?? []).map((s: any, i: number) => (
                <View key={i} className="flex-row items-center justify-between mb-2">
                  <Text className="text-navy-300 text-sm">{s.skill}</Text>
                  <Text className="text-white font-medium">{s.matches} matches</Text>
                </View>
              ))}
              {(!data?.top_skills?.length) && <Text className="text-navy-400 text-sm">No data yet</Text>}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
}
