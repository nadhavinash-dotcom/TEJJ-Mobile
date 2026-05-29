import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../../src/lib/api';
import { Clock, ClipboardList, CheckCircle, XCircle, MinusCircle, ChevronRight, MapPin, Banknote } from 'lucide-react-native';

type StatusConfig = {
  label: string;
  icon: React.ReactNode;
  bgClass: string;
  textClass: string;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  PENDING: {
    label: 'Pending',
    icon: <Clock size={12} color="#92400e" />,
    bgClass: 'bg-amber-100',
    textClass: 'text-amber-800',
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    icon: <ClipboardList size={12} color="#000666" />, // primary
    bgClass: 'bg-primary-fixed',
    textClass: 'text-primary',
  },
  MATCHED: {
    label: 'Matched',
    icon: <CheckCircle size={12} color="#006b5e" />, // secondary
    bgClass: 'bg-secondary-container',
    textClass: 'text-on-secondary-container',
  },
  REJECTED: {
    label: 'Rejected',
    icon: <XCircle size={12} color="#ba1a1a" />, // error
    bgClass: 'bg-error-container',
    textClass: 'text-error',
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    icon: <MinusCircle size={12} color="#767683" />, // outline
    bgClass: 'bg-surface-container-high',
    textClass: 'text-outline',
  },
};

export default function ApplicationsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const res = await api.get('/applications/mine');
      return res.data.data as any[];
    },
    staleTime: 60_000,
  });

  return (
    <SafeScreen className="flex-1 bg-background">
      <View className="px-5 pt-8 pb-4">
        <Text className="text-3xl font-black text-primary tracking-tight">My Applications</Text>
        <Text className="text-xs uppercase tracking-widest mt-1 text-outline font-semibold">
          Your job pipeline
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#000666" size="large" />
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const status = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.WITHDRAWN;
            return (
              <TouchableOpacity
                onPress={() => {
                  if (item.status === 'MATCHED' && item.match_id) {
                    router.push({ pathname: '/(worker)/match/[id]', params: { id: item.match_id } });
                  } else {
                    router.push({ pathname: '/(worker)/applied/[id]', params: { id: item._id } });
                  }
                }}
                className="mx-4 mb-4 rounded-3xl bg-surface-container-lowest border border-outline-variant overflow-hidden shadow-sm"
                activeOpacity={0.85}
              >
                <View className="p-5">
                  {/* Title row */}
                  <View className="flex-row items-start justify-between mb-3">
                    <Text
                      className="font-bold text-lg flex-1 mr-3 text-on-surface leading-tight"
                      numberOfLines={1}
                    >
                      {item.job_title}
                    </Text>
                    <View className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-lg ${status.bgClass}`}>
                      {status.icon}
                      <Text className={`text-[11px] font-bold uppercase tracking-wider ${status.textClass}`}>
                        {status.label}
                      </Text>
                    </View>
                  </View>

                  {/* Location */}
                  <View className="flex-row items-center gap-2 mb-4">
                    <MapPin size={14} color="#454652" />
                    <Text className="text-sm font-medium text-on-surface-variant flex-1" numberOfLines={1}>
                      {item.employer_property_type}
                      {item.employer_area_locality ? ` · ${item.employer_area_locality}` : ''}
                    </Text>
                  </View>

                  {/* Footer */}
                  <View className="flex-row items-center justify-between pt-4 border-t border-outline-variant/50">
                    <View className="flex-row items-center gap-2">
                      <Banknote size={16} color="#000666" />
                      <Text className="font-bold text-base text-primary">
                        ₹{item.pay_rate?.toLocaleString('en-IN')}/shift
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1 bg-surface-container-low px-2 py-1 rounded-md">
                      <Text className="text-xs font-semibold text-outline">
                        {new Date(item.applied_at).toLocaleDateString('en-IN')}
                      </Text>
                      <ChevronRight size={14} color="#767683" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-24 px-10">
              <View className="w-24 h-24 rounded-full items-center justify-center mb-6 bg-primary-fixed shadow-sm">
                <ClipboardList size={40} color="#000666" />
              </View>
              <Text className="text-2xl font-black mb-2 text-on-surface tracking-tight">
                No applications yet
              </Text>
              <Text className="text-base text-center leading-relaxed text-on-surface-variant px-4">
                Browse the feed and apply to jobs to start building your pipeline.
              </Text>
              
              <TouchableOpacity 
                onPress={() => router.replace('/(worker)/(tabs)/feed')}
                className="mt-8 bg-primary px-8 py-3.5 rounded-full shadow-md flex-row items-center gap-2 active:opacity-90"
              >
                <Text className="text-on-primary font-bold text-base tracking-wide">Find Jobs</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
        />
      )}
    </SafeScreen>
  );
}
