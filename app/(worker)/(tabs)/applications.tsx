import React from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-amber-400',
  SHORTLISTED: 'text-blue-400',
  MATCHED: 'text-green-400',
  REJECTED: 'text-red-400',
  WITHDRAWN: 'text-navy-400',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: '⏳ Pending',
  SHORTLISTED: '📋 Shortlisted',
  MATCHED: '✅ Matched',
  REJECTED: '❌ Rejected',
  WITHDRAWN: 'Withdrawn',
};

export default function ApplicationsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/applications/mine', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data as any[];
    },
    staleTime: 60_000,
  });

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <View className="px-4 pt-6 pb-2">
        <Text className="text-white text-xl font-bold">My Applications</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#F59E0B" size="large" />
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                if (item.status === 'MATCHED') {
                  router.push({ pathname: '/(worker)/match/[id]', params: { id: item.match_id } });
                } else {
                  router.push({ pathname: '/(worker)/applied/[id]', params: { id: item._id } });
                }
              }}
              className="mx-4 mb-3 bg-navy-800 rounded-2xl p-4 border border-navy-700"
              activeOpacity={0.85}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-bold flex-1" numberOfLines={1}>{item.job_title}</Text>
                <Text className={`text-xs font-semibold ml-2 ${STATUS_COLORS[item.status] ?? 'text-navy-400'}`}>
                  {STATUS_LABELS[item.status] ?? item.status}
                </Text>
              </View>
              <Text className="text-navy-300 text-sm mb-1">{item.employer_property_type} · {item.employer_area_locality}</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-amber-400 font-semibold">₹{item.pay_rate?.toLocaleString('en-IN')}/shift</Text>
                <Text className="text-navy-400 text-xs">{new Date(item.applied_at).toLocaleDateString('en-IN')}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-4xl mb-4">📋</Text>
              <Text className="text-white font-semibold text-lg mb-2">No applications yet</Text>
              <Text className="text-navy-400 text-sm text-center px-8">Browse the feed and apply to jobs!</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        />
      )}
    </SafeAreaView>
  );
}
