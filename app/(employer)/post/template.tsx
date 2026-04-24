import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function TemplateScreen() {
  const { updateJobDraft } = useOnboardingStore();

  const { data, isLoading } = useQuery({
    queryKey: ['job-templates'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/jobs/templates', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data as any[];
    },
  });

  const handleSelect = (template: any) => {
    updateJobDraft({
      job_title: template.job_title,
      primary_skill: template.primary_skill,
      description: template.description,
      pay_rate: template.pay_rate,
      shift_duration_hours: template.shift_duration_hours,
      number_of_openings: template.number_of_openings,
    });
    router.push('/(employer)/post/form');
  };

  return (
    <SafeScreen className="flex-1">
      <View className="px-4 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mb-4 flex-row items-center gap-1">
          <LucideIcon name="ChevronLeft" size={20} color="#F59E0B" />
          <Text className="text-amber-400 text-base">Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold mb-1">Use a Template</Text>
        <Text className="text-navy-300 text-sm mb-4">Save time with your previous job templates</Text>
      </View>

      {isLoading ? (
        <View className="py-10 items-center"><ActivityIndicator color="#3B82F6" /></View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)} className="mx-4 mb-3 bg-navy-800 border border-navy-700 rounded-2xl p-4" activeOpacity={0.85}>
              <Text className="text-white font-bold mb-1">{item.job_title}</Text>
              <Text className="text-navy-300 text-sm">₹{item.pay_rate?.toLocaleString('en-IN')}/shift · {item.shift_duration_hours}hrs</Text>
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <TouchableOpacity onPress={() => router.push('/(employer)/post/form')} className="mx-4 mb-3 bg-blue-600/20 border border-blue-500/40 rounded-2xl p-4 flex-row items-center gap-3" activeOpacity={0.85}>
              <LucideIcon name="Pencil" size={24} color="#3B82F6" />
              <View>
                <Text className="text-blue-300 font-bold">Start from scratch</Text>
                <Text className="text-navy-400 text-sm">Create a new job posting</Text>
              </View>
            </TouchableOpacity>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeScreen>
  );
}
