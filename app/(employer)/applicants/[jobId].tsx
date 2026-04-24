import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';
import { SKILL_LIST } from '@/utils';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function ApplicantsScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['applicants', jobId],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get(`/applications/job/${jobId}`, { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data as any[];
    },
  });

  const shortlistMutation = useMutation({
    mutationFn: async (appId: string) => {
      const token = await auth.currentUser?.getIdToken();
      await api.patch(`/applications/${appId}/shortlist`, {}, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applicants', jobId] }),
  });

  const matchMutation = useMutation({
    mutationFn: async (appId: string) => {
      const token = await auth.currentUser?.getIdToken();
      await api.post('/matches', { application_id: appId }, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applicants', jobId] }),
  });

  return (
    <SafeScreen className="flex-1">
      <View className="px-4 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mb-3 flex-row items-center gap-1">
          <LucideIcon name="ChevronLeft" size={20} color="#F59E0B" />
          <Text className="text-amber-400 text-base">Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold mb-1">Applicants</Text>
        <Text className="text-navy-300 text-sm">{data?.length ?? 0} applications received</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3B82F6" size="large" /></View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const skill = SKILL_LIST.find((s) => s.id === item.worker_primary_skill);
            return (
              <View className="mx-4 mb-3 bg-navy-800 border border-navy-700 rounded-2xl p-4">
                <View className="flex-row items-center gap-3 mb-3">
                  {item.worker_photo ? (
                    <Image source={{ uri: item.worker_photo }} className="w-12 h-12 rounded-full" />
                  ) : (
                    <View className="w-12 h-12 rounded-full bg-navy-700 items-center justify-center">
                      <LucideIcon name={skill?.icon || 'User'} size={24} color="#94A3B8" />
                    </View>
                  )}
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-white font-bold">{skill?.label ?? 'Worker'}</Text>
                      <View className="flex-row items-center gap-0.5">
                        <LucideIcon name="Star" size={12} color="#F59E0B" fill="#F59E0B" />
                        <Text className="text-amber-400 text-xs">{(item.worker_trust_score ?? 0).toFixed(1)}</Text>
                      </View>
                    </View>
                    <Text className="text-navy-300 text-xs">{item.worker_years_experience} yrs · {item.worker_sups_score ?? 70} SUPS</Text>
                  </View>
                  <TouchableOpacity onPress={() => router.push({ pathname: '/(employer)/worker/[id]', params: { id: item.worker_id } })} className="bg-navy-700 px-3 py-1 rounded-xl">
                    <Text className="text-navy-300 text-xs">View</Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row gap-2">
                  {item.status === 'PENDING' && (
                    <TouchableOpacity
                      onPress={() => shortlistMutation.mutate(item._id)}
                      disabled={shortlistMutation.isPending}
                      className="flex-1 bg-blue-600/20 border border-blue-500/40 rounded-xl py-2 items-center"
                      activeOpacity={0.85}
                    >
                      <Text className="text-blue-300 font-semibold text-sm">Shortlist</Text>
                    </TouchableOpacity>
                  )}
                  {(item.status === 'PENDING' || item.status === 'SHORTLISTED') && (
                    <TouchableOpacity
                      onPress={() => matchMutation.mutate(item._id)}
                      disabled={matchMutation.isPending}
                      className="flex-1 bg-green-600 rounded-xl py-2 items-center"
                      activeOpacity={0.85}
                    >
                      <Text className="text-white font-semibold text-sm">Match →</Text>
                    </TouchableOpacity>
                  )}
                  {item.status === 'MATCHED' && (
                    <View className="flex-row items-center gap-1">
                      <LucideIcon name="CheckCircle" size={16} color="#22C55E" />
                      <Text className="text-green-400 text-sm font-semibold">Matched</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeScreen>
  );
}
