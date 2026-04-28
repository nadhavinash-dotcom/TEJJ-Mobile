import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../src/store/authStore';
import api from '../../../src/lib/api';
import {
  UserCircle,
  ChevronRight,
  LogOut,
  ClipboardCheck,
  Bell,
  Settings,
  Star,
  BadgeCheck,
  HardHat,
} from 'lucide-react-native';

const C = {
  primary: '#000666',
  onPrimary: '#ffffff',
  primaryFixed: '#e0e0ff',
  background: '#fbf8fe',
  surface: '#fbf8fe',
  surfaceContainerLow: '#f6f2f8',
  surfaceContainerLowest: '#ffffff',
  surfaceContainer: '#f0edf2',
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

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onPress: () => void;
  accent?: string;
  isLast?: boolean;
};

function MenuItem({ icon, label, description, onPress, accent, isLast }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center justify-between px-4 py-3.5"
      style={{ borderBottomWidth: isLast ? 0 : 1, borderBottomColor: C.surfaceContainer }}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View
          className="w-9 h-9 rounded-xl items-center justify-center"
          style={{ backgroundColor: accent ?? C.surfaceContainerHigh }}
        >
          {icon}
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-[15px]" style={{ color: C.onSurface }}>{label}</Text>
          {description && (
            <Text className="text-xs mt-0.5" style={{ color: C.outline }}>{description}</Text>
          )}
        </View>
      </View>
      <ChevronRight size={16} color={C.outline} />
    </TouchableOpacity>
  );
}

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
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          clear();
          router.replace('/(auth)/language');
        },
      },
    ]);
  };

  const trustScore = (data?.trust_score ?? 0).toFixed(1);

  return (
    <SafeScreen style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header Card */}
        <View
          className="mx-4 mt-5 mb-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: C.primary }}
        >
          <View className="px-5 pt-5 pb-4">
            <View className="flex-row items-start justify-between mb-4">
              {/* Avatar */}
              <View className="relative">
                {data?.profile_photo_url ? (
                  <Image
                    source={{ uri: data.profile_photo_url }}
                    className="w-16 h-16 rounded-2xl"
                    style={{ borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }}
                  />
                ) : (
                  <View
                    className="w-16 h-16 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                  >
                    <UserCircle size={32} color={C.onPrimary} />
                  </View>
                )}
              </View>

              {/* Trust score chip */}
              <View
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                <Star size={13} color={C.amber} fill={C.amber} />
                <Text className="text-sm font-bold" style={{ color: C.onPrimary }}>{trustScore}</Text>
                <Text className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Trust</Text>
              </View>
            </View>

            <Text className="text-xl font-bold mb-0.5" style={{ color: C.onPrimary }}>
              {data?.name ?? 'Worker Profile'}
            </Text>
            <View className="flex-row items-center gap-1.5 mb-3">
              <HardHat size={12} color="rgba(255,255,255,0.6)" />
              <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
                {data?.primary_role ?? 'Hospitality Worker'}
              </Text>
            </View>

            {data?.is_verified && (
              <View
                className="self-start flex-row items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ backgroundColor: C.secondaryContainer }}
              >
                <BadgeCheck size={12} color={C.onSecondaryContainer} />
                <Text className="text-xs font-bold" style={{ color: C.onSecondaryContainer }}>
                  Verified Worker
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Activity Section */}
        <View
          className="mx-4 rounded-2xl overflow-hidden mb-4"
          style={{ backgroundColor: C.surfaceContainerLowest }}
        >
          <Text
            className="text-xs font-bold uppercase tracking-widest px-4 pt-3 pb-2"
            style={{ color: C.outline, letterSpacing: 1 }}
          >
            Activity
          </Text>
          <MenuItem
            icon={<ClipboardCheck size={18} color={C.primary} />}
            label="My Applications"
            description="Track your job applications"
            accent={C.primaryFixed}
            onPress={() => router.push('/(worker)/(tabs)/applications')}
          />
          <MenuItem
            icon={<Bell size={18} color="#723600" />}
            label="Notifications"
            description="Alerts & job updates"
            accent="#ffdcc6"
            onPress={() => router.push('/(shared)/notifications')}
            isLast
          />
        </View>

        {/* Account Section */}
        <View
          className="mx-4 rounded-2xl overflow-hidden mb-4"
          style={{ backgroundColor: C.surfaceContainerLowest }}
        >
          <Text
            className="text-xs font-bold uppercase tracking-widest px-4 pt-3 pb-2"
            style={{ color: C.outline, letterSpacing: 1 }}
          >
            Account
          </Text>
          <MenuItem
            icon={<Settings size={18} color={C.onSurfaceVariant} />}
            label="Settings"
            description="App & account preferences"
            accent={C.surfaceContainerHigh}
            onPress={() => router.push('/(shared)/settings')}
            isLast
          />
        </View>

        {/* Sign Out */}
        <View className="mx-4 mb-10">
          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.75}
            className="flex-row items-center justify-center gap-2 rounded-2xl py-4"
            style={{
              backgroundColor: C.errorContainer,
              borderWidth: 1,
              borderColor: '#fecdd3',
            }}
          >
            <LogOut size={17} color={C.error} />
            <Text className="font-bold text-[15px]" style={{ color: C.error }}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
