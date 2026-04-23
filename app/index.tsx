import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function Index() {
  const { userId, hasWorker, hasEmployer, activeRole } = useAuthStore();

  if (!userId) return <Redirect href="/(auth)/language" />;

  if (activeRole === 'employer' || (!hasWorker && hasEmployer)) {
    return <Redirect href="/(employer)/(tabs)/dashboard" />;
  }

  if (hasWorker) return <Redirect href="/(worker)/(tabs)/feed" />;

  return <Redirect href="/(auth)/language" />;
}
