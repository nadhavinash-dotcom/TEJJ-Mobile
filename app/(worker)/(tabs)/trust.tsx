import React from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { TrustGauge } from '../../../src/components/worker/TrustGauge';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';

const METRIC = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
  <View className="mb-4">
    <View className="flex-row justify-between mb-1">
      <Text className="text-navy-300 text-sm">{label}</Text>
      <Text className="text-white font-semibold text-sm">{(value * 100).toFixed(0)}%</Text>
    </View>
    <View className="h-2 bg-navy-700 rounded-full">
      <View className="h-2 rounded-full" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
    </View>
  </View>
);

export default function TrustScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['worker-trust'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/workers/me', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
    staleTime: 120_000,
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-navy-900 items-center justify-center">
        <ActivityIndicator color="#F59E0B" size="large" />
      </SafeAreaView>
    );
  }

  const score = data?.trust_score ?? 0;
  const metrics = data?.trust_score_breakdown ?? {};

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-6 pb-2">
          <Text className="text-white text-xl font-bold mb-1">Trust Score</Text>
          <Text className="text-navy-300 text-sm">Your reliability rating with employers</Text>
        </View>

        <View className="items-center py-6">
          <TrustGauge score={score} size={220} />
          <Text className="text-navy-300 text-sm mt-2">
            {score >= 4.0 ? '🌟 Excellent — Top worker' : score >= 3.0 ? '👍 Good standing' : '⚠️ Needs improvement'}
          </Text>
        </View>

        <View className="mx-4 bg-navy-800 rounded-2xl p-5 border border-navy-700 mb-4">
          <Text className="text-white font-semibold mb-4">Score Breakdown</Text>
          <METRIC label="Show-up Rate (40%)" value={metrics.show_up_rate ?? 0} max={1} color="#22C55E" />
          <METRIC label="Employer Rating (30%)" value={(metrics.employer_rating_avg ?? 0) / 5} max={1} color="#F59E0B" />
          <METRIC label="Profile Depth (20%)" value={metrics.profile_depth_score ?? 0} max={1} color="#3B82F6" />
          <METRIC label="Conduct (10%)" value={metrics.conduct_score ?? 0} max={1} color="#8B5CF6" />
        </View>

        <View className="mx-4 mb-6">
          <Text className="text-white font-semibold mb-3">Recent Ratings</Text>
          {(data?.recent_ratings ?? []).length === 0 ? (
            <View className="bg-navy-800 rounded-2xl p-4 items-center border border-navy-700">
              <Text className="text-navy-400 text-sm">No ratings yet. Complete your first shift!</Text>
            </View>
          ) : (
            (data.recent_ratings as any[]).map((r: any, i: number) => (
              <View key={i} className="bg-navy-800 rounded-2xl p-4 border border-navy-700 mb-2">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-white font-semibold">{r.employer_property_type}</Text>
                  <Text className="text-amber-400 font-bold">{'⭐'.repeat(Math.round(r.overall_score))}</Text>
                </View>
                {r.comment && <Text className="text-navy-300 text-sm">{r.comment}</Text>}
                <Text className="text-navy-500 text-xs mt-1">{new Date(r.created_at).toLocaleDateString('en-IN')}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
