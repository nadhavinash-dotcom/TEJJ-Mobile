import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function Index() {
  const { userId, hasWorker, hasEmployer, activeRole, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!userId) {
      router.replace('/(auth)/language');
      return;
    }

    if (!activeRole) {
      router.replace('/(auth)/role');
      return;
    }
    
    if (activeRole === 'employer') {
      if (hasEmployer) {
        router.replace('/(employer)/(tabs)/dashboard');
      } else {
        router.replace('/(employer)/onboarding/property');
      }
      return;
    }

    if (activeRole === 'worker') {
      if (hasWorker) {
        router.replace('/(worker)/(tabs)/feed');
      } else {
        router.replace('/(worker)/onboarding/role');
      }
      return;
    }

    router.replace('/(auth)/role');
  }, [userId, activeRole, hasWorker, hasEmployer, _hasHydrated]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0A1628', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color="#F59E0B" size="large" />
    </View>
  );
}
