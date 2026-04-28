import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';
import { Clock, ClipboardList, CheckCircle, XCircle, MinusCircle, ChevronRight, MapPin, Banknote } from 'lucide-react-native';

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
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  amber: '#F59E0B',
};

type StatusConfig = {
  label: string;
  icon: React.ReactNode;
  bg: string;
  text: string;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  PENDING: {
    label: 'Pending',
    icon: <Clock size={11} color="#92400e" />,
    bg: '#fef3c7',
    text: '#92400e',
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    icon: <ClipboardList size={11} color={C.primary} />,
    bg: C.primaryFixed,
    text: C.primary,
  },
  MATCHED: {
    label: 'Matched',
    icon: <CheckCircle size={11} color={C.secondary} />,
    bg: C.secondaryContainer,
    text: C.onSecondaryContainer,
  },
  REJECTED: {
    label: 'Rejected',
    icon: <XCircle size={11} color={C.error} />,
    bg: C.errorContainer,
    text: C.error,
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    icon: <MinusCircle size={11} color={C.outline} />,
    bg: C.surfaceContainerHigh,
    text: C.outline,
  },
};

export default function ApplicationsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/applications/mine', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data as any[];
    },
    staleTime: 60_000,
  });

  return (
    <SafeScreen style={{ flex: 1, backgroundColor: C.background }}>
      <View className="px-5 pt-8 pb-4">
        <Text className="text-2xl font-bold" style={{ color: C.primary }}>My Applications</Text>
        <Text className="text-xs uppercase tracking-widest mt-0.5" style={{ color: C.outline }}>
          Your job pipeline
        </Text>
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
            const status = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.WITHDRAWN;
            return (
              <TouchableOpacity
                onPress={() => {
                  if (item.status === 'MATCHED') {
                    router.push({ pathname: '/(worker)/match/[id]', params: { id: item.match_id } });
                  } else {
                    router.push({ pathname: '/(worker)/applied/[id]', params: { id: item._id } });
                  }
                }}
                className="mx-4 mb-3 rounded-2xl"
                style={{
                  backgroundColor: C.surfaceContainerLowest,
                  borderWidth: 1,
                  borderColor: C.outlineVariant,
                }}
                activeOpacity={0.85}
              >
                <View className="p-4">
                  {/* Title row */}
                  <View className="flex-row items-start justify-between mb-2">
                    <Text
                      className="font-bold text-base flex-1 mr-2"
                      numberOfLines={1}
                      style={{ color: C.onSurface }}
                    >
                      {item.job_title}
                    </Text>
                    <View
                      className="flex-row items-center gap-1 px-2 py-1 rounded-lg"
                      style={{ backgroundColor: status.bg }}
                    >
                      {status.icon}
                      <Text className="text-[11px] font-bold" style={{ color: status.text }}>
                        {status.label}
                      </Text>
                    </View>
                  </View>

                  {/* Location */}
                  <View className="flex-row items-center gap-1.5 mb-2">
                    <MapPin size={13} color={C.onSurfaceVariant} />
                    <Text className="text-sm" style={{ color: C.onSurfaceVariant }} numberOfLines={1}>
                      {item.employer_property_type}
                      {item.employer_area_locality ? ` · ${item.employer_area_locality}` : ''}
                    </Text>
                  </View>

                  {/* Footer */}
                  <View
                    className="flex-row items-center justify-between pt-2.5"
                    style={{ borderTopWidth: 1, borderTopColor: C.outlineVariant }}
                  >
                    <View className="flex-row items-center gap-1.5">
                      <Banknote size={14} color={C.primary} />
                      <Text className="font-bold text-sm" style={{ color: C.primary }}>
                        ₹{item.pay_rate?.toLocaleString('en-IN')}/shift
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-xs" style={{ color: C.outline }}>
                        {new Date(item.applied_at).toLocaleDateString('en-IN')}
                      </Text>
                      <ChevronRight size={14} color={C.outline} />
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
                No applications yet
              </Text>
              <Text className="text-sm text-center leading-relaxed" style={{ color: C.onSurfaceVariant }}>
                Browse the feed and apply to jobs to see them here.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
        />
      )}
    </SafeScreen>
  );
}
