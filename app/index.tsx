import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../src/store/authStore';
import { navigateHome } from '../utils/navigate-home';

export default function Index() {
  const { _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;
    navigateHome();
  }, [_hasHydrated]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0A1628', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color="#F59E0B" size="large" />
    </View>
  );
}
