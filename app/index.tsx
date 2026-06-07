import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useAuthStore } from '../src/store/authStore';
import { navigateHome } from '../utils/navigate-home';
import { SafeScreen } from '../src/components/shared/SafeScreen';

export default function Index() {
  const { _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;
    navigateHome();
  }, [_hasHydrated]);

  return (
    <SafeScreen bgClassName="bg-[#0A1628]" className="items-center justify-center">
      <ActivityIndicator color="#F59E0B" size="large" />
    </SafeScreen>
  );
}
