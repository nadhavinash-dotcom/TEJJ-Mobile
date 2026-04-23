import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../../src/store/authStore';

export default function RoleSelectScreen() {
  const { setActiveRole } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-navy-900 px-6 justify-center">
      <Text className="text-white text-3xl font-bold mb-2 text-center">Welcome to TEJJ</Text>
      <Text className="text-navy-300 text-base text-center mb-10">Are you here to find work or hire workers?</Text>

      <TouchableOpacity
        onPress={() => router.push('/(worker)/onboarding/role')}
        className="bg-navy-800 border border-amber-500/40 rounded-3xl p-6 mb-4 items-center"
        activeOpacity={0.85}
      >
        <Text className="text-4xl mb-3">👷</Text>
        <Text className="text-white text-xl font-bold mb-1">I'm a Worker</Text>
        <Text className="text-navy-400 text-sm text-center">Find gig jobs in hospitality — cook, waiter, housekeeper & more</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => { setActiveRole('employer'); router.push('/(employer)/onboarding/property'); }}
        className="bg-navy-800 border border-blue-500/40 rounded-3xl p-6 items-center"
        activeOpacity={0.85}
      >
        <Text className="text-4xl mb-3">🏨</Text>
        <Text className="text-white text-xl font-bold mb-1">I'm an Employer</Text>
        <Text className="text-navy-400 text-sm text-center">Post jobs and find verified hospitality staff quickly</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
