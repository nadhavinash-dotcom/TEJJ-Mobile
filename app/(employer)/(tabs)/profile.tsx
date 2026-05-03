import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../src/store/authStore';
import api from '../../../src/lib/api';
import {
  TrendingUp,
  Users,
  Gift,
  CreditCard,
  Bell,
  Settings,
  ChevronRight,
  Star,
  BadgeCheck,
  Building2,
  LogOut,
  MapPin,
} from 'lucide-react-native';
import { PROPERTY_TYPES } from '@/utils';

const COLORS = {
  primary: '#000666',
  onPrimary: '#ffffff',
  primaryContainer: '#1a237e',
  onPrimaryContainer: '#8690ee',
  secondary: '#006b5e',
  secondaryContainer: '#94f0df',
  onSecondaryContainer: '#006f62',
  background: '#fbf8fe',
  surface: '#fbf8fe',
  onSurface: '#1b1b1f',
  onSurfaceVariant: '#454652',
  surfaceContainerLow: '#f6f2f8',
  surfaceContainer: '#f0edf2',
  surfaceContainerHigh: '#eae7ed',
  outline: '#767683',
  outlineVariant: '#c6c5d4',
  error: '#ba1a1a',
  amber: '#F59E0B',
  green: '#006b5e',
  greenContainer: '#94f0df',
};

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onPress: () => void;
  accent?: string;
};

function MenuItem({ icon, label, description, onPress, accent }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center justify-between px-4 py-3.5"
      style={{ borderBottomWidth: 1, borderBottomColor: COLORS.surfaceContainer }}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View
          className="w-9 h-9 rounded-xl items-center justify-center"
          style={{ backgroundColor: accent ?? COLORS.surfaceContainerHigh }}
        >
          {icon}
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-[15px]" style={{ color: COLORS.onSurface }}>
            {label}
          </Text>
          {description && (
            <Text className="text-xs mt-0.5" style={{ color: COLORS.outline }}>
              {description}
            </Text>
          )}
        </View>
      </View>
      <ChevronRight size={16} color={COLORS.outline} />
    </TouchableOpacity>
  );
}

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
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          clear();
          router.replace('/(auth)/phone');
        },
      },
    ]);
  };

  const dignityScore = (data?.dignity_score ?? 0).toFixed(1);

  return (
    <SafeScreen style={{ flex: 1, backgroundColor: COLORS.surfaceContainerLow }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header Card */}
        <View
          className="mx-4 mt-5 mb-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: COLORS.primary }}
        >
          {/* Subtle pattern layer */}
          <View className="px-5 pt-5 pb-4">
            <View className="flex-row items-start justify-between">
              <View
                className="w-12 h-12 rounded-2xl items-start justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                <Building2 size={24} color={COLORS.onPrimary} />
              </View>
              {data?.gstin_verified && (
                <View
                  className="flex-row items-center gap-1 px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: COLORS.secondaryContainer }}
                >
                  <BadgeCheck size={13} color={COLORS.onSecondaryContainer} />
                  <Text className="text-xs font-bold" style={{ color: COLORS.onSecondaryContainer }}>
                    GST Verified
                  </Text>
                </View>
              )}
            </View>

            <Text className="text-lg font-bold mb-0.5" style={{ color: COLORS.onPrimary }}>
              {data?.property_name ?? 'My Property'}
            </Text>
            {/* <Text className="text-xs" style={{ color: COLORS.onPrimary }}>
              {PROPERTY_TYPES.find(property => property.id === data?.property_type)?.label}
            </Text> */}

            <View className="flex-row items-center gap-1 mb-3">
              <MapPin size={12} color="rgba(255,255,255,0.6)" />
              <Text className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                 {PROPERTY_TYPES.find(property => property.id === data?.property_type)?.label}
                {data?.area_locality ? ` · ${data.area_locality}` : ''}
                {data?.city ? `, ${data.city}` : ''}
              </Text>
            </View>

            {/* Dignity score chip */}
            <View
              className="self-start flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            >
              <Star size={13} color={COLORS.amber} fill={COLORS.amber} />
              <Text className="text-sm font-bold" style={{ color: COLORS.onPrimary }}>
                {dignityScore}
              </Text>
              <Text className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Dignity Score
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View
          className="mx-4 rounded-2xl overflow-hidden mb-4"
          style={{ backgroundColor: COLORS.surface }}
        >
          <Text
            className="text-xs font-bold uppercase tracking-widest px-4 pt-3 pb-2"
            style={{ color: COLORS.outline, letterSpacing: 1 }}
          >
            Manage
          </Text>
          <MenuItem
            icon={<TrendingUp size={18} color={COLORS.primary} />}
            label="Analytics"
            description="Views, applications & trends"
            accent="#e0e0ff"
            onPress={() => router.push('/(employer)/analytics')}
          />
          <MenuItem
            icon={<Users size={18} color={COLORS.secondary} />}
            label="Crew Pools"
            description="Your saved talent groups"
            accent={COLORS.secondaryContainer}
            onPress={() => router.push('/(employer)/crew-pools')}
          />
          <MenuItem
            icon={<Gift size={18} color="#723600" />}
            label="TEJJ Retain"
            description="Loyalty & retention programs"
            accent="#ffdcc6"
            onPress={() => router.push('/(employer)/retain')}
          />
        </View>

        <View
          className="mx-4 rounded-2xl overflow-hidden mb-4"
          style={{ backgroundColor: COLORS.surface }}
        >
          <Text
            className="text-xs font-bold uppercase tracking-widest px-4 pt-3 pb-2"
            style={{ color: COLORS.outline, letterSpacing: 1 }}
          >
            Account
          </Text>
          <MenuItem
            icon={<CreditCard size={18} color={COLORS.primary} />}
            label="Plans & Billing"
            description="Subscription & invoices"
            accent="#e0e0ff"
            onPress={() => router.push('/(shared)/plans')}
          />
          <MenuItem
            icon={<Bell size={18} color="#723600" />}
            label="Notifications"
            description="Alerts & preferences"
            accent="#ffdcc6"
            onPress={() => router.push('/(shared)/notifications')}
          />
          <MenuItem
            icon={<Settings size={18} color={COLORS.onSurfaceVariant} />}
            label="Settings"
            description="App & account settings"
            accent={COLORS.surfaceContainerHigh}
            onPress={() => router.push('/(shared)/settings')}
          />
        </View>

        {/* Sign Out */}
        <View className="mx-4 mb-10">
          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.75}
            className="flex-row items-center justify-center gap-2 rounded-2xl py-4"
            style={{
              backgroundColor: '#fff1f2',
              borderWidth: 1,
              borderColor: '#fecdd3',
            }}
          >
            <LogOut size={17} color={COLORS.error} />
            <Text className="font-bold text-[15px]" style={{ color: COLORS.error }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}