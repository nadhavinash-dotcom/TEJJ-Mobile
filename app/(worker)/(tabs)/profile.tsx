import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../src/store/authStore';
import api from '../../../src/lib/api';
import { 
  StyledUserCircle, 
  StyledChevronRight, 
  StyledLogOut,
  StyledClipboardCheck,
  StyledStar,
  StyledBell,
  StyledSettings
} from '../../../src/components/tell/Icons';

export default function ProfileScreen() {
  const { clear } = useAuthStore();

  const { data } = useQuery({
    queryKey: ['worker-profile'],
    queryFn: async () => {
      const res = await api.get('/workers/me');
      return res.data.data;
    },
    staleTime: 120_000,
  });

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: async () => {
          clear();
          router.replace('/(auth)/language');
        },
      },
    ]);
  };

  const MenuItem = ({ Icon, label, onPress }: { Icon: any; label: string; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between px-6 py-5 border-b border-surface-container-highest/30" activeOpacity={0.7}>
      <View className="flex-row items-center gap-4">
        <Icon color="#000666" size={22} />
        <Text className="text-on-surface font-bold text-base">{label}</Text>
      </View>
      <StyledChevronRight color="#c6c5d4" size={18} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-10 pb-8 flex-row items-center gap-6">
          <View className="relative">
            {data?.profile_photo_url ? (
              <Image source={{ uri: data.profile_photo_url }} className="w-24 h-24 rounded-3xl border-4 border-white shadow-sm" />
            ) : (
              <View className="w-24 h-24 rounded-3xl bg-primary-fixed items-center justify-center border-4 border-white shadow-sm">
                <StyledUserCircle color="#000666" size={48} />
              </View>
            )}
            <View className="absolute -bottom-2 -right-2 bg-secondary px-2 py-1 rounded-lg border-2 border-white">
              <Text className="text-white text-[10px] font-black italic">PRO</Text>
            </View>
          </View>
          
          <View className="flex-1">
            <Text className="text-primary text-2xl font-black">{data?.name || 'Worker Profile'}</Text>
            <Text className="text-on-surface-variant font-bold text-sm uppercase tracking-wider">{data?.primary_role || 'Culinary Mission'}</Text>
            <View className="flex-row items-center gap-3 mt-2">
              <View className="bg-surface-container-high px-3 py-1 rounded-full border border-surface-container-highest/50">
                <Text className="text-primary font-bold text-xs">⭐ {(data?.trust_score ?? 0).toFixed(1)}</Text>
              </View>
              <Text className="text-outline text-xs font-bold uppercase tracking-tighter">Elite Member</Text>
            </View>
          </View>
        </View>

        <View className="mx-6 bg-surface-container-low rounded-3xl border border-surface-container-highest/30 mb-8 overflow-hidden">
          <MenuItem Icon={StyledClipboardCheck} label="My Applications" onPress={() => router.push('/(worker)/(tabs)/applications')} />
          {/* <MenuItem Icon={StyledStar} label="Trust Dashboard" onPress={() => router.push('/(worker)/(tabs)/trust')} /> */}
          <MenuItem Icon={StyledBell} label="Notifications" onPress={() => router.push('/(shared)/notifications')} />
          <MenuItem Icon={StyledSettings} label="Settings" onPress={() => router.push('/(shared)/settings')} />
        </View>

        <View className="mx-6 mb-12">
          <TouchableOpacity onPress={handleSignOut} className="flex-row items-center justify-center gap-3 py-4 bg-error-container/20 border border-error/10 rounded-2xl active:opacity-80">
            <StyledLogOut color="#ba1a1a" size={20} />
            <Text className="text-error font-bold text-base">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

