import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { signOut } from 'firebase/auth';
import { auth } from '../../../src/lib/firebase';
import { useAuthStore } from '../../../src/store/authStore';
import { SKILL_LIST, LANGUAGES } from '@/utils';
import api from '../../../src/lib/api';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function ProfileScreen() {
  const { clear, language, setLanguage } = useAuthStore();

  const { data } = useQuery({
    queryKey: ['worker-profile'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/workers/me', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
    staleTime: 120_000,
  });

  const skill = SKILL_LIST.find((s) => s.id === data?.primary_skill);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: async () => {
          await signOut(auth);
          clear();
          router.replace('/(auth)/language');
        },
      },
    ]);
  };

  const MenuItem = ({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between px-4 py-4 border-b border-navy-700" activeOpacity={0.7}>
      <View className="flex-row items-center gap-3">
        <LucideIcon name={icon} size={20} color="#F59E0B" />
        <Text className="text-white font-medium">{label}</Text>
      </View>
      <LucideIcon name="ChevronRight" size={16} color="#475569" />
    </TouchableOpacity>
  );

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View className="px-4 pt-6 pb-4 flex-row items-center gap-4">
          {data?.profile_photo_url ? (
            <Image source={{ uri: data.profile_photo_url }} className="w-16 h-16 rounded-full border-2 border-amber-500" />
          ) : (
            <View className="w-16 h-16 rounded-full bg-navy-700 items-center justify-center">
              <LucideIcon name="User" size={32} color="#94A3B8" />
            </View>
          )}
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              {skill?.icon && <LucideIcon name={skill.icon} size={20} color="#F59E0B" />}
              <Text className="text-white text-lg font-bold">{skill?.label ?? 'Worker'}</Text>
            </View>
            <Text className="text-navy-300 text-sm">{data?.years_experience} yrs · {data?.home_city}</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <Text className="text-amber-400 text-sm">⭐ {(data?.trust_score ?? 0).toFixed(1)}</Text>
              <Text className="text-navy-500 text-xs">Trust Score</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/(worker)/profile/edit')}
            className="bg-navy-800 border border-amber-500/40 px-3 py-2 rounded-xl"
            activeOpacity={0.7}
          >
            <Text className="text-amber-400 font-semibold text-sm">Edit</Text>
          </TouchableOpacity>
        </View>

        <View className="mx-4 bg-navy-800 rounded-2xl border border-navy-700 mb-4 overflow-hidden">
          <MenuItem icon="FileText" label="My Applications" onPress={() => router.push('/(worker)/(tabs)/applications')} />
          <MenuItem icon="Star" label="Trust Dashboard" onPress={() => router.push('/(worker)/(tabs)/trust')} />
          <MenuItem icon="Gift" label="TEJJ Benefits" onPress={() => router.push('/(worker)/benefits')} />
          <MenuItem icon="Bot" label="Agent Mode" onPress={() => router.push('/(worker)/agent')} />
          <MenuItem icon="Users" label="Refer a Friend" onPress={() => router.push('/(worker)/referral')} />
          <MenuItem icon="EyeOff" label="Whisper Network" onPress={() => router.push('/(worker)/whisper')} />
          <MenuItem icon="Bell" label="Notifications" onPress={() => router.push('/(shared)/notifications')} />
          <MenuItem icon="Settings" label="Settings" onPress={() => router.push('/(shared)/settings')} />
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
