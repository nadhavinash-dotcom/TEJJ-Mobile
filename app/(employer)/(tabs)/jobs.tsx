import React from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';
import { HIRING_LANES } from '@/utils';

export default function EmployerJobsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/jobs/mine', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data as any[];
    },
    staleTime: 30_000,
  });

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <View className="px-4 pt-6 pb-2 flex-row items-center justify-between">
        <Text className="text-white text-xl font-bold">My Jobs</Text>
        <TouchableOpacity onPress={() => router.push('/(employer)/confirm-gate')} className="bg-blue-600 px-4 py-2 rounded-xl" activeOpacity={0.85}>
          <Text className="text-white font-bold text-sm">+ Post</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#3B82F6" size="large" /></View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const laneKey = `L${item.lane}` as keyof typeof HIRING_LANES;
            const lane = HIRING_LANES[laneKey];
            return (
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/(employer)/applicants/[jobId]', params: { jobId: item._id } })}
                className="mx-4 mb-3 bg-navy-800 border border-navy-700 rounded-2xl p-4"
                activeOpacity={0.85}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="px-2 py-1 rounded-lg" style={{ backgroundColor: lane.color }}>
                    <Text className="text-white text-xs font-bold">{lane.icon} {lane.label}</Text>
                  </View>
                  <View className={`px-2 py-1 rounded-lg ${item.status === 'ACTIVE' ? 'bg-green-500/20' : 'bg-navy-700'}`}>
                    <Text className={`text-xs ${item.status === 'ACTIVE' ? 'text-green-400' : 'text-navy-400'}`}>{item.status}</Text>
                  </View>
                </View>
                <Text className="text-white font-bold mb-1">{item.job_title}</Text>
                <View className="flex-row justify-between">
                  <Text className="text-navy-300 text-sm">{item.applicant_count ?? 0} applicants</Text>
                  <Text className="text-amber-400 font-semibold">₹{item.pay_rate?.toLocaleString('en-IN')}/shift</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-4xl mb-4">📋</Text>
              <Text className="text-white font-semibold mb-2">No jobs posted yet</Text>
              <Text className="text-navy-400 text-sm text-center px-8">Post your first job to find workers!</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        />
      )}
    </SafeAreaView>
  );
}
