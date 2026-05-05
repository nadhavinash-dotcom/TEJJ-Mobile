// Activity & Account menu sections of the Worker Profile screen
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import {
  ClipboardCheck, Bell, Settings, LogOut,
} from 'lucide-react-native';
import { ProfileColors as C } from './ProfileColors';
import { MenuItem } from './ProfilePrimitives';

// ── Activity Section ─────────────────────────────────────────────────────────

export function ProfileActivitySection() {
  return (
    <View className="mx-4 mb-3 rounded-2xl overflow-hidden" style={{ backgroundColor: C.surface }}>
      <Text className="text-[10px] font-bold uppercase px-4 pt-4 pb-2"
        style={{ color: C.outline, letterSpacing: 1.4 }}>
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
  );
}

// ── Account Section ──────────────────────────────────────────────────────────

export function ProfileAccountSection() {
  return (
    <View className="mx-4 mb-4 rounded-2xl overflow-hidden" style={{ backgroundColor: C.surface }}>
      <Text className="text-[10px] font-bold uppercase px-4 pt-4 pb-2"
        style={{ color: C.outline, letterSpacing: 1.4 }}>
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
  );
}

// ── Sign Out Button ──────────────────────────────────────────────────────────

interface ProfileSignOutButtonProps {
  onPress: () => void;
}

export function ProfileSignOutButton({ onPress }: ProfileSignOutButtonProps) {
  return (
    <View className="mx-4">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.75}
        className="flex-row items-center justify-center gap-2 rounded-2xl py-4"
        style={{ backgroundColor: C.errorContainer, borderWidth: 1, borderColor: '#fecdd3' }}
      >
        <LogOut size={17} color={C.error} />
        <Text className="font-bold text-[15px]" style={{ color: C.error }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
