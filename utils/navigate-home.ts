import { router } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export function getHomeRoute(): string {
  const { token, language, activeRole, hasWorker, hasEmployer } = useAuthStore.getState();
  if (!token)      return '/(auth)/phone';
  if (!language)   return '/(auth)/language';
  if (!activeRole) return '/(auth)/role';
  if (activeRole === 'employer') {
    return hasEmployer ? '/(employer)/(tabs)/dashboard' : '/(employer)/onboarding/property';
  }
  return hasWorker ? '/(worker)/(tabs)/feed' : '/(worker)/onboarding/sector';
}

export function navigateHome() {
  router.replace(getHomeRoute() as any);
}
