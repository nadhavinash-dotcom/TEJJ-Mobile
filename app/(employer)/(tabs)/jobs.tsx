import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';
import { HIRING_LANES } from '@/utils';
import { Plus, ChevronRight, Users, ClipboardList } from 'lucide-react-native';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

const C = {
  primary: '#000666',
  primaryFixed: '#e0e0ff',
  background: '#fbf8fe',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#eae7ed',
  onSurface: '#1b1b1f',
  onSurfaceVariant: '#454652',
  outline: '#767683',
  outlineVariant: '#c6c5d4',
  secondary: '#006b5e',
  secondaryContainer: '#94f0df',
  onSecondaryContainer: '#006f62',
};

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
    <SafeScreen style={{ flex: 1, backgroundColor: C.background }}>
      <View className="px-5 pt-8 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold" style={{ color: C.primary }}>My Jobs</Text>
          <Text className="text-xs uppercase tracking-widest mt-0.5" style={{ color: C.outline }}>
            Active Postings
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(employer)/confirm-gate')}
          className="flex-row items-center gap-2 px-4 py-2.5 rounded-2xl"
          style={{ backgroundColor: C.primary }}
          activeOpacity={0.8}
        >
          <Plus size={16} color="#ffffff" />
          <Text className="text-white font-bold text-sm">Post Job</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={C.primary} size="large" />
        </View>
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
                className="mx-4 mb-3 rounded-3xl"
                style={{
                  backgroundColor: C.surfaceContainerLowest,
                  borderWidth: 1,
                  borderColor: C.outlineVariant,
                }}
                activeOpacity={0.85}
              >
                <View className="p-5">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-2">
                      <View
                        className="px-2.5 py-1 rounded-lg flex-row items-center gap-1.5"
                        style={{ backgroundColor: lane.color + '18' }}
                      >
                        <LucideIcon name={lane.icon} size={11} color={lane.color} />
                        <Text
                          className="font-bold text-[10px] uppercase tracking-tight"
                          style={{ color: lane.color }}
                        >
                          {lane.label}
                        </Text>
                      </View>
                      <View
                        className="px-2.5 py-1 rounded-lg"
                        style={{
                          backgroundColor:
                            item.status === 'ACTIVE' ? C.secondaryContainer : C.surfaceContainerHigh,
                        }}
                      >
                        <Text
                          className="text-[10px] font-bold uppercase tracking-tight"
                          style={{
                            color: item.status === 'ACTIVE' ? C.onSecondaryContainer : C.outline,
                          }}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>
                    <ChevronRight size={16} color={C.outline} />
                  </View>

                  <Text className="text-lg font-bold mb-3" style={{ color: C.onSurface }}>
                    {item.job_title}
                  </Text>

                  <View
                    className="flex-row items-center justify-between pt-3"
                    style={{ borderTopWidth: 1, borderTopColor: C.outlineVariant }}
                  >
                    <View className="flex-row items-center gap-1.5">
                      <Users size={14} color={C.onSurfaceVariant} />
                      <Text className="text-sm font-medium" style={{ color: C.onSurfaceVariant }}>
                        {item.applicant_count ?? 0} applicants
                      </Text>
                    </View>
                    <View className="flex-row items-end">
                      <Text className="font-bold text-lg" style={{ color: C.primary }}>
                        ₹{item.pay_rate?.toLocaleString('en-IN')}
                      </Text>
                      <Text
                        className="text-[10px] mb-0.5 ml-0.5 font-medium"
                        style={{ color: C.outline }}
                      >
                        /shift
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-24 px-10">
              <View
                className="w-20 h-20 rounded-full items-center justify-center mb-6"
                style={{ backgroundColor: C.primaryFixed }}
              >
                <ClipboardList size={32} color={C.primary} />
              </View>
              <Text className="text-xl font-bold mb-2" style={{ color: C.onSurface }}>
                No jobs posted yet
              </Text>
              <Text className="text-sm text-center leading-relaxed" style={{ color: C.onSurfaceVariant }}>
                Post your first job listing to start receiving applications from qualified workers in your area.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
        />
      )}
    </SafeScreen>
  );
}
