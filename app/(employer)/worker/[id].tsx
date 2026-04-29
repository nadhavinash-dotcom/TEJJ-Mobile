import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SKILL_LIST } from '@/utils';
import { AIScoreBar } from '../../../src/components/worker/AIScoreBar';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function WorkerSkillCardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: worker, isLoading } = useQuery({
    queryKey: ['worker-card', id],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get(`/workers/${id}/card`, { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <SafeScreen className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color="#000666" size="large" />
      </SafeScreen>
    );
  }

  const skill = SKILL_LIST.find((s) => s.id === worker?.primary_skill);

  return (
    <SafeScreen className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-3 bg-surface border-b border-outline-variant">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1 self-start mb-2">
            <LucideIcon name="ChevronLeft" size={20} color="#000666" />
            <Text className="text-primary text-sm font-medium">Back</Text>
          </TouchableOpacity>
          <Text className="text-on-background text-xl font-bold">Worker Profile</Text>
        </View>

        <View className="px-4 pt-4 pb-8 gap-3">
          {/* Profile card */}
          <View className="bg-surface border border-outline-variant rounded-2xl p-5">
            <View className="flex-row items-start gap-4">
              {worker?.profile_photo_url ? (
                <Image source={{ uri: worker.profile_photo_url }} className="w-20 h-20 rounded-full" />
              ) : (
                <View className="w-20 h-20 rounded-full bg-surface-container-highest items-center justify-center">
                  <LucideIcon name={skill?.icon || 'User'} size={36} color="#767683" />
                </View>
              )}

              <View className="flex-1">
                <View className="flex-row items-center gap-2 flex-wrap">
                  {skill?.icon && (
                    <View className="w-7 h-7 bg-primary-container rounded-full items-center justify-center">
                      <LucideIcon name={skill.icon} size={15} color="#8690ee" />
                    </View>
                  )}
                  <Text className="text-on-surface text-lg font-bold">{skill?.label ?? 'Worker'}</Text>
                </View>
                <Text className="text-on-surface-variant text-sm mt-0.5">{worker?.years_experience} yrs experience</Text>

                <View className="flex-row items-center gap-1.5 mt-2">
                  <LucideIcon name="Star" size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text className="text-same-day font-bold text-sm">{(worker?.trust_score ?? 0).toFixed(1)}</Text>
                  <Text className="text-outline text-xs">Trust Score</Text>
                </View>
              </View>
            </View>

            {/* Sub-skills */}
            {(worker?.sub_skills ?? []).length > 0 && (
              <View className="mt-4 pt-4 border-t border-outline-variant">
                <Text className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-2">Skills</Text>
                <View className="flex-row flex-wrap gap-2">
                  {(worker?.sub_skills ?? []).map((s: string) => (
                    <View key={s} className="bg-surface-container-high border border-outline-variant px-3 py-1 rounded-full">
                      <Text className="text-on-surface-variant text-xs">{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Availability */}
          <View className="bg-surface border border-outline-variant rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-3">
              <View className="w-7 h-7 bg-secondary-container rounded-full items-center justify-center">
                <LucideIcon name="Clock" size={15} color="#006f62" />
              </View>
              <Text className="text-on-surface font-semibold">Availability</Text>
            </View>
            {(worker?.preferred_shifts ?? []).length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {(worker?.preferred_shifts ?? []).map((shift: string) => (
                  <View key={shift} className="bg-secondary-container px-3 py-1.5 rounded-full">
                    <Text className="text-on-secondary-container text-sm font-medium">{shift}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-on-surface-variant text-sm">No shifts specified</Text>
            )}
          </View>

          {/* AI Score */}
          {worker?.ai_score && <AIScoreBar scores={worker.ai_score} />}
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
