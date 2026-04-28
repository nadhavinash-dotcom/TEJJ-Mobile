import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { auth } from '../../src/lib/firebase';
import { ChevronLeft, Stethoscope, Bike, Banknote, Users, CalendarDays } from 'lucide-react-native';

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
  tertiaryFixed: '#ffdcc6',
  onTertiaryContainer: '#ec7700',
};

export default function RetainScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['retain-dashboard'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/employers/retain', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
  });

  return (
    <SafeScreen style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-5 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="mb-5 flex-row items-center gap-1">
            <ChevronLeft size={20} color={C.primary} />
            <Text className="text-base font-medium" style={{ color: C.primary }}>Back</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold mb-1" style={{ color: C.primary }}>TEJJ Retain</Text>
          <Text className="text-sm mb-5" style={{ color: C.onSurfaceVariant }}>
            Your long-term workers and benefit status
          </Text>
        </View>

        {isLoading ? (
          <View className="py-10 items-center">
            <ActivityIndicator color={C.primary} />
          </View>
        ) : (
          <View className="px-4 gap-4 pb-8">
            {/* Stats */}
            <View className="flex-row gap-3">
              <View
                className="flex-1 rounded-2xl p-4 items-center"
                style={{
                  backgroundColor: C.surfaceContainerLowest,
                  borderWidth: 1,
                  borderColor: C.outlineVariant,
                }}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: C.primaryFixed }}
                >
                  <Users size={18} color={C.primary} />
                </View>
                <Text className="text-2xl font-bold" style={{ color: C.primary }}>
                  {data?.enrolled_workers ?? 0}
                </Text>
                <Text className="text-xs text-center mt-1" style={{ color: C.onSurfaceVariant }}>
                  Retained Workers
                </Text>
              </View>
              <View
                className="flex-1 rounded-2xl p-4 items-center"
                style={{
                  backgroundColor: C.surfaceContainerLowest,
                  borderWidth: 1,
                  borderColor: C.outlineVariant,
                }}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: C.tertiaryFixed }}
                >
                  <CalendarDays size={18} color={C.onTertiaryContainer} />
                </View>
                <Text className="text-2xl font-bold" style={{ color: C.onTertiaryContainer }}>
                  {data?.avg_retention_days ?? 0}
                </Text>
                <Text className="text-xs text-center mt-1" style={{ color: C.onSurfaceVariant }}>
                  Avg Days
                </Text>
              </View>
            </View>

            <Text className="font-semibold text-base" style={{ color: C.onSurface }}>
              Benefit Milestones
            </Text>

            {(data?.workers ?? []).length === 0 ? (
              <View
                className="rounded-2xl p-5 items-center"
                style={{
                  backgroundColor: C.surfaceContainerLowest,
                  borderWidth: 1,
                  borderColor: C.outlineVariant,
                }}
              >
                <Text className="text-sm text-center" style={{ color: C.onSurfaceVariant }}>
                  No retained workers yet. Keep rehiring the same workers!
                </Text>
              </View>
            ) : (
              (data.workers as any[]).map((w: any) => (
                <View
                  key={w._id}
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: C.surfaceContainerLowest,
                    borderWidth: 1,
                    borderColor: C.outlineVariant,
                  }}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="font-bold text-base" style={{ color: C.onSurface }}>
                      {w.worker_skill}
                    </Text>
                    <View
                      className="flex-row items-center gap-1 px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: C.tertiaryFixed }}
                    >
                      <CalendarDays size={12} color={C.onTertiaryContainer} />
                      <Text className="text-xs font-bold" style={{ color: C.onTertiaryContainer }}>
                        {w.days_with_employer}d
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row flex-wrap gap-2">
                    {w.days_with_employer >= 90 && (
                      <View
                        className="flex-row items-center gap-1 px-2.5 py-1 rounded-lg"
                        style={{ backgroundColor: '#dbeafe' }}
                      >
                        <Stethoscope size={11} color="#1d4ed8" />
                        <Text className="text-[11px] font-semibold" style={{ color: '#1d4ed8' }}>
                          Health Insurance
                        </Text>
                      </View>
                    )}
                    {w.days_with_employer >= 180 && (
                      <View
                        className="flex-row items-center gap-1 px-2.5 py-1 rounded-lg"
                        style={{ backgroundColor: C.secondaryContainer }}
                      >
                        <Bike size={11} color={C.secondary} />
                        <Text className="text-[11px] font-semibold" style={{ color: C.secondary }}>
                          Bike Loan
                        </Text>
                      </View>
                    )}
                    {w.days_with_employer >= 365 && (
                      <View
                        className="flex-row items-center gap-1 px-2.5 py-1 rounded-lg"
                        style={{ backgroundColor: C.primaryFixed }}
                      >
                        <Banknote size={11} color={C.primary} />
                        <Text className="text-[11px] font-semibold" style={{ color: C.primary }}>
                          EWA
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
}
