import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../src/lib/api';
import { getAbsoluteUrl, SKILL_LIST } from '@/utils';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function ApplicantsScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['applicants', jobId],
    queryFn: async () => {
      const res = await api.get(`/applications/job/${jobId}`);
      return res.data.data as any[];
    },
  });

  console.log('applicants', data);

  const shortlistMutation = useMutation({
    mutationFn: async (appId: string) => {
      await api.patch(`/applications/${appId}/shortlist`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applicants', jobId] }),
  });

  const matchMutation = useMutation({
    mutationFn: async (appId: string) => {
      await api.post('/matches', { application_id: appId });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applicants', jobId] }),
  });

  return (
    <SafeScreen className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 pt-4 pb-4 bg-surface border-b border-outline-variant">
        <TouchableOpacity onPress={() => router.back()} className="mb-3 flex-row items-center gap-1 self-start">
          <LucideIcon name="ChevronLeft" size={20} color="#000666" />
          <Text className="text-primary text-sm font-medium">Back</Text>
        </TouchableOpacity>
        <Text className="text-on-background text-2xl font-bold">Applicants</Text>
        <View className="flex-row items-center gap-2 mt-1">
          <View className="bg-primary-container px-2.5 py-0.5 rounded-full">
            <Text className="text-white text-xs font-bold">{data?.length ?? 0}</Text>
          </View>
          <Text className="text-on-surface-variant text-sm">applications received</Text>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#000666" size="large" />
        </View>
      ) : (data?.length ?? 0) === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-16 h-16 bg-surface-container-highest rounded-full items-center justify-center mb-4">
            <LucideIcon name="Users" size={32} color="#767683" />
          </View>
          <Text className="text-on-surface text-base font-semibold text-center">No applications yet</Text>
          <Text className="text-on-surface-variant text-sm text-center mt-1">Applications will appear here once workers apply.</Text>
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
          renderItem={({ item }) => {
            const skill = SKILL_LIST.find((s) => s.id === item.worker_primary_skill);
            const isMatched = item.status === 'MATCHED';
            const isShortlisted = item.status === 'SHORTLISTED';
            const isPending = item.status === 'PENDING';

            return (
              <View className="mx-4 mb-3 bg-surface border border-outline-variant rounded-2xl overflow-hidden">
                {/* Status strip */}
                {isShortlisted && (
                  <View className="bg-secondary-container px-4 py-2 flex-row items-center gap-1.5">
                    <LucideIcon name="Bookmark" size={12} color="#006f62" />
                    <Text className="text-on-secondary-container text-xs font-semibold">Shortlisted</Text>
                  </View>
                )}
                {isMatched && (
                  <View className="bg-secondary px-4 py-2 flex-row items-center gap-1.5">
                    <LucideIcon name="CheckCircle" size={12} color="#ffffff" />
                    <Text className="text-on-secondary text-xs font-semibold">Matched</Text>
                  </View>
                )}

                <View className="p-4">
                  {/* Worker info */}
                  <View className="flex-row items-center gap-3 mb-4">
                    {item.worker_photo ? (
                      <Image source={{ uri: getAbsoluteUrl(item.worker_photo) }} className="w-14 h-14 rounded-full" />
                    ) : (
                      <View className="w-14 h-14 rounded-full bg-surface-container-highest items-center justify-center">
                        <LucideIcon name={skill?.icon || 'User'} size={26} color="#767683" />
                      </View>
                    )}

                    <View className="flex-1">
                      <Text className="text-on-surface font-bold text-base">{skill?.label ?? 'Worker'}</Text>
                      <View className="flex-row items-center gap-1 mt-0.5 flex-wrap">
                        <LucideIcon name="Star" size={13} color="#F59E0B" fill="#F59E0B" />
                        <Text className="text-same-day text-sm font-semibold">{(item.worker_trust_score ?? 0).toFixed(1)}</Text>
                        <Text className="text-outline text-sm"> · </Text>
                        <Text className="text-on-surface-variant text-sm">{item.worker_years_experience} yrs</Text>
                        <Text className="text-outline text-sm"> · </Text>
                        <Text className="text-on-surface-variant text-sm">{item.worker_sups_score ?? 70} SUPS</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => router.push({ pathname: '/(employer)/worker/[id]', params: { id: item.worker_id } })}
                      className="bg-surface-container border border-outline-variant px-3 py-1.5 rounded-xl flex-row items-center gap-1"
                    >
                      <Text className="text-on-surface-variant text-xs font-medium">Profile</Text>
                      <LucideIcon name="ChevronRight" size={12} color="#454652" />
                    </TouchableOpacity>
                  </View>

                  {/* Action buttons */}
                  {!isMatched && (
                    <View className="flex-row gap-2">
                      {isPending && (
                        <TouchableOpacity
                          onPress={() => shortlistMutation.mutate(item._id)}
                          disabled={shortlistMutation.isPending}
                          className="flex-1 border border-secondary rounded-xl py-2.5 items-center flex-row justify-center gap-1.5"
                          activeOpacity={0.8}
                        >
                          <LucideIcon name="Bookmark" size={15} color="#006b5e" />
                          <Text className="text-secondary font-semibold text-sm">Shortlist</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => matchMutation.mutate(item._id)}
                        disabled={matchMutation.isPending}
                        className="flex-1 bg-secondary rounded-xl py-2.5 items-center flex-row justify-center gap-1.5"
                        activeOpacity={0.85}
                      >
                        <LucideIcon name="Zap" size={15} color="#ffffff" />
                        <Text className="text-on-secondary font-semibold text-sm">Match</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeScreen>
  );
}
