import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function EmployerDashboardScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['employer-dashboard'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/employers/dashboard', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
    staleTime: 30_000,
  });

  const StatCard = ({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) => (
    <View className="flex-1 bg-navy-800 border border-navy-700 rounded-2xl p-4 items-center">
      <View className="mb-2">
        <LucideIcon name={icon} size={24} color={color} />
      </View>
      <Text style={{ color }} className="text-2xl font-bold">{value}</Text>
      <Text className="text-navy-400 text-xs text-center mt-1">{label}</Text>
    </View>
  );

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-6 pb-2 flex-row items-center justify-between">
          <Text className="text-white text-xl font-bold">Dashboard</Text>
          <TouchableOpacity onPress={() => router.push('/(employer)/confirm-gate')} className="bg-blue-600 px-4 py-2 rounded-xl" activeOpacity={0.85}>
            <Text className="text-white font-bold text-sm">+ Post Job</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="py-10 items-center"><ActivityIndicator color="#3B82F6" size="large" /></View>
        ) : (
          <>
            <View className="px-4 flex-row gap-3 mb-4">
              <StatCard icon="ClipboardList" label="Active Jobs" value={data?.active_jobs ?? 0} color="#3B82F6" />
              <StatCard icon="Users" label="Applicants" value={data?.total_applicants ?? 0} color="#F59E0B" />
              <StatCard icon="CheckCircle" label="Matches Today" value={data?.matches_today ?? 0} color="#22C55E" />
            </View>

            <View className="px-4 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white font-semibold">Active Jobs</Text>
                <TouchableOpacity onPress={() => router.push('/(employer)/(tabs)/jobs')}>
                  <Text className="text-blue-400 text-sm">See all</Text>
                </TouchableOpacity>
              </View>

              {(data?.active_jobs_list ?? []).length === 0 ? (
                <View className="bg-navy-800 border border-navy-700 rounded-2xl p-6 items-center">
                  <View className="mb-3">
                    <LucideIcon name="ClipboardList" size={40} color="#334155" />
                  </View>
                  <Text className="text-white font-medium mb-1">No active jobs</Text>
                  <Text className="text-navy-400 text-sm">Post your first job to find workers</Text>
                </View>
              ) : (
                (data.active_jobs_list as any[]).map((job: any) => (
                  <TouchableOpacity
                    key={job._id}
                    onPress={() => router.push({ pathname: '/(employer)/applicants/[jobId]', params: { jobId: job._id } })}
                    className="bg-navy-800 border border-navy-700 rounded-2xl p-4 mb-3"
                    activeOpacity={0.85}
                  >
                    <Text className="text-white font-bold mb-1">{job.job_title}</Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-navy-300 text-sm">{job.applicant_count} applicants</Text>
                      <Text className="text-amber-400 font-semibold">₹{job.pay_rate?.toLocaleString('en-IN')}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>

            <View className="px-4 mb-8">
              <Text className="text-white font-semibold mb-3">Quick Actions</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity onPress={() => router.push('/(employer)/qr-scanner')} className="flex-1 bg-navy-800 border border-navy-700 rounded-2xl p-4 items-center" activeOpacity={0.85}>
                  <View className="mb-2">
                    <LucideIcon name="QrCode" size={24} color="#F59E0B" />
                  </View>
                  <Text className="text-white text-sm font-medium text-center">Scan QR</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(employer)/analytics')} className="flex-1 bg-navy-800 border border-navy-700 rounded-2xl p-4 items-center" activeOpacity={0.85}>
                  <View className="mb-2">
                    <LucideIcon name="TrendingUp" size={24} color="#3B82F6" />
                  </View>
                  <Text className="text-white text-sm font-medium text-center">Analytics</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(employer)/crew-pools')} className="flex-1 bg-navy-800 border border-navy-700 rounded-2xl p-4 items-center" activeOpacity={0.85}>
                  <View className="mb-2">
                    <LucideIcon name="Users" size={24} color="#A855F7" />
                  </View>
                  <Text className="text-white text-sm font-medium text-center">Crew Pool</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeScreen>
  );
}
