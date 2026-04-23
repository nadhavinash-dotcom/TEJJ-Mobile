import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SKILL_LIST } from '@/utils';
import { AIScoreBar } from '../../../src/components/worker/AIScoreBar';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';

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

  if (isLoading) return <SafeAreaView className="flex-1 bg-navy-900 items-center justify-center"><ActivityIndicator color="#3B82F6" size="large" /></SafeAreaView>;

  const skill = SKILL_LIST.find((s) => s.id === worker?.primary_skill);

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-amber-400 text-base">← Back</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4">
          <View className="bg-navy-800 border border-navy-700 rounded-2xl p-5 mb-4">
            <View className="flex-row items-center gap-4 mb-4">
              {worker?.profile_photo_url ? (
                <Image source={{ uri: worker.profile_photo_url }} className="w-16 h-16 rounded-full" />
              ) : (
                <View className="w-16 h-16 rounded-full bg-navy-700 items-center justify-center">
                  <Text className="text-3xl">{skill?.icon ?? '👤'}</Text>
                </View>
              )}
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-xl">{skill?.icon}</Text>
                  <Text className="text-white text-lg font-bold">{skill?.label}</Text>
                </View>
                <Text className="text-navy-300 text-sm">{worker?.years_experience} yrs experience</Text>
                <View className="flex-row items-center gap-3 mt-1">
                  <Text className="text-amber-400 text-sm">⭐ {(worker?.trust_score ?? 0).toFixed(1)}</Text>
                  <Text className="text-navy-400 text-xs">Trust</Text>
                </View>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {(worker?.sub_skills ?? []).map((s: string) => (
                <View key={s} className="bg-navy-700 px-3 py-1 rounded-full">
                  <Text className="text-navy-200 text-xs">{s}</Text>
                </View>
              ))}
            </View>
          </View>

          {worker?.ai_score && (
            <View className="mb-4">
              <Text className="text-white font-semibold mb-3">AI Video Score</Text>
              <AIScoreBar scores={worker.ai_score} />
            </View>
          )}

          <View className="bg-navy-800 border border-navy-700 rounded-2xl p-4 mb-8">
            <Text className="text-navy-300 text-sm mb-1">Available shifts</Text>
            <Text className="text-white">{(worker?.preferred_shifts ?? []).join(', ')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
