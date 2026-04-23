import React, { useState, useCallback } from 'react';
import { View, Text, SafeAreaView, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { JobCard } from '../../../src/components/worker/JobCard';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { FlashNotification } from '../../../src/components/worker/FlashNotification';
import { useDispatchStore } from '../../../src/store/dispatchStore';
import { useAuthStore } from '../../../src/store/authStore';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';
import { SKILL_LIST } from '@/utils';

const LANES = [
  { id: 0, label: 'All' },
  { id: 1, label: '⚡ Flash' },
  { id: 2, label: '☀️ Same-Day' },
  { id: 3, label: '📋 Contract' },
  { id: 4, label: '🏢 Permanent' },
];

export default function FeedScreen() {
  const [laneFilter, setLaneFilter] = useState(0);
  const [skillFilter, setSkillFilter] = useState('');
  const { flashJob } = useDispatchStore();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['job-feed', laneFilter, skillFilter],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const params: Record<string, unknown> = {};
      if (laneFilter) params.lane = laneFilter;
      if (skillFilter) params.skill = skillFilter;
      const res = await api.get('/jobs/feed', { headers: { Authorization: `Bearer ${token}` }, params });
      return res.data.data as any[];
    },
    staleTime: 30_000,
  });

  const handleVoiceResult = ({ keywords }: { keywords: string[] }) => {
    const match = SKILL_LIST.find((s) => keywords.some((k) => s.keywords.includes(k.toLowerCase())));
    if (match) setSkillFilter(match.id);
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      {flashJob && <FlashNotification job={flashJob} />}

      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white text-xl font-bold">Job Feed</Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </View>

        {/* Lane filter tabs */}
        <FlatList
          horizontal
          data={LANES}
          keyExtractor={(i) => String(i.id)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setLaneFilter(item.id)}
              className={`px-4 py-2 rounded-xl border ${laneFilter === item.id ? 'bg-amber-500 border-amber-500' : 'bg-navy-800 border-navy-600'}`}
              activeOpacity={0.75}
            >
              <Text className={`text-xs font-semibold ${laneFilter === item.id ? 'text-white' : 'text-navy-300'}`}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#F59E0B" size="large" />
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item._id}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#F59E0B" />}
          renderItem={({ item }) => (
            <JobCard job={item} onPress={() => router.push({ pathname: '/(worker)/job/[id]', params: { id: item._id } })} />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-4xl mb-4">🔍</Text>
              <Text className="text-white font-semibold text-lg mb-2">No jobs nearby</Text>
              <Text className="text-navy-400 text-sm text-center px-8">Try changing filters or check back soon.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        />
      )}
    </SafeAreaView>
  );
}
