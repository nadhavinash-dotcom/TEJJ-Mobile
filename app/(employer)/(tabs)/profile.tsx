import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../src/store/authStore';
import api from '../../../src/lib/api';

export default function EmployerProfileScreen() {
  const { clear } = useAuthStore();

  const { data } = useQuery({
    queryKey: ['employer-profile'],
    queryFn: async () => {
      const res = await api.get('/employers/me');
      return res.data.data;
    },
  });

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { clear(); router.replace('/(auth)/language'); } },
    ]);
  };

  const MenuItem = ({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between px-4 py-4 border-b border-navy-700" activeOpacity={0.7}>
      <View className="flex-row items-center gap-3">
        <Text className="text-xl">{icon}</Text>
        <Text className="text-white font-medium">{label}</Text>
      </View>
      <Text className="text-navy-500">›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-6 pb-4">
          <Text className="text-white text-xl font-bold mb-1">{data?.property_name ?? 'My Property'}</Text>
          <Text className="text-navy-300 text-sm">{data?.property_type} · {data?.area_locality}, {data?.city}</Text>
          <View className="flex-row items-center gap-2 mt-2">
            <Text className="text-amber-400 text-sm">⭐ {(data?.dignity_score ?? 0).toFixed(1)} Dignity</Text>
            {data?.gstin_verified && <Text className="text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded">✓ GST</Text>}
          </View>
        </View>

        <View className="mx-4 bg-navy-800 rounded-2xl border border-navy-700 mb-4 overflow-hidden">
          <MenuItem icon="📈" label="Analytics" onPress={() => router.push('/(employer)/analytics')} />
          <MenuItem icon="👥" label="Crew Pools" onPress={() => router.push('/(employer)/crew-pools')} />
          <MenuItem icon="🎁" label="TEJJ Retain" onPress={() => router.push('/(employer)/retain')} />
          <MenuItem icon="💳" label="Plans & Billing" onPress={() => router.push('/(shared)/plans')} />
          <MenuItem icon="🔔" label="Notifications" onPress={() => router.push('/(shared)/notifications')} />
          <MenuItem icon="⚙️" label="Settings" onPress={() => router.push('/(shared)/settings')} />
        </View>

        <View className="mx-4 mb-8">
          <TouchableOpacity onPress={handleSignOut} className="bg-red-500/10 border border-red-500/30 rounded-2xl py-4 items-center" activeOpacity={0.8}>
            <Text className="text-red-400 font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
