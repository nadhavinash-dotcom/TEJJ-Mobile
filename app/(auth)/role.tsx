import React from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import api from '../../src/lib/api';
import { LucideIcon } from '../../src/components/shared/LucideIcon';

export default function RoleScreen() {
  const { setActiveRole, hasWorker, hasEmployer } = useAuthStore();
  const [loading, setLoading] = React.useState<string | null>(null);

  const selectRole = async (role: 'worker' | 'employer') => {
    setLoading(role);
    try {
      await api.patch('/auth/set-role', { role });
      setActiveRole(role);
      
      if (role === 'worker') {
        if (hasWorker) {
          router.replace('/(worker)/(tabs)/feed');
        } else {
          router.replace('/(worker)/onboarding/role');
        }
      } else {
        if (hasEmployer) {
          router.replace('/(employer)/(tabs)/dashboard');
        } else {
          router.replace('/(employer)/onboarding/property');
        }
      }
    } catch (err) {
      console.error('Failed to set role:', err);
      Alert.alert('Error', 'Could not save your choice. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeScreen className="px-6 justify-center">
      <Text className="text-white text-3xl font-bold mb-2 text-center">Welcome to TEJJ</Text>
      <Text className="text-navy-300 text-base text-center mb-10">Are you here to find work or hire workers?</Text>

      <TouchableOpacity
        onPress={() => selectRole('worker')}
        disabled={!!loading}
        className={`bg-navy-800 border border-amber-500/40 rounded-3xl p-6 mb-4 items-center ${loading === 'worker' ? 'opacity-70' : ''}`}
        activeOpacity={0.85}
      >
        {loading === 'worker' ? (
          <ActivityIndicator color="#F59E0B" className="mb-3" />
        ) : (
          <View className="mb-4">
            <LucideIcon name="HardHat" size={40} color="#F59E0B" />
          </View>
        )}
        <Text className="text-white text-xl font-bold mb-1">I'm a Worker</Text>
        <Text className="text-navy-400 text-sm text-center">Find gig jobs in hospitality — cook, waiter, housekeeper & more</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => selectRole('employer')}
        disabled={!!loading}
        className={`bg-navy-800 border border-blue-500/40 rounded-3xl p-6 items-center ${loading === 'employer' ? 'opacity-70' : ''}`}
        activeOpacity={0.85}
      >
        {loading === 'employer' ? (
          <ActivityIndicator color="#3B82F6" className="mb-3" />
        ) : (
          <View className="mb-4">
            <LucideIcon name="Hotel" size={40} color="#3B82F6" />
          </View>
        )}
        <Text className="text-white text-xl font-bold mb-1">I'm an Employer</Text>
        <Text className="text-navy-400 text-sm text-center">Post jobs and find verified hospitality staff quickly</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
}
