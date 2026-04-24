import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-amber-400',
  SHORTLISTED: 'text-blue-400',
  MATCHED: 'text-green-400',
  REJECTED: 'text-red-400',
  WITHDRAWN: 'text-navy-400',
};

const STATUS_LABELS: Record<string, { label: string; icon: string }> = {
  PENDING: { label: 'Pending', icon: 'Clock' },
  SHORTLISTED: { label: 'Shortlisted', icon: 'ClipboardList' },
  MATCHED: { label: 'Matched', icon: 'CheckCircle' },
  REJECTED: { label: 'Rejected', icon: 'XCircle' },
  WITHDRAWN: { label: 'Withdrawn', icon: 'MinusCircle' },
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
    <SafeScreen className="flex-1">
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
                <View className="flex-row items-center gap-1.5 ml-2">
                  <LucideIcon 
                    name={STATUS_LABELS[item.status]?.icon || 'Info'} 
                    size={12} 
                    color={STATUS_COLORS[item.status]?.replace('text-', '#')?.replace('amber-400', 'F59E0B')?.replace('blue-400', '60A5FA')?.replace('green-400', '4ADE80')?.replace('red-400', 'F87171') || '#94A3B8'} 
                  />
                  <Text className={`text-xs font-semibold ${STATUS_COLORS[item.status] ?? 'text-navy-400'}`}>
                    {STATUS_LABELS[item.status]?.label ?? item.status}
                  </Text>
                </View>
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
              <View className="mb-4">
                <LucideIcon name="ClipboardList" size={64} color="#475569" />
              </View>
              <Text className="text-white font-semibold text-lg mb-2">No applications yet</Text>
              <Text className="text-navy-400 text-sm text-center px-8">Browse the feed and apply to jobs!</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        />
      )}
    </SafeScreen>
  );
}
