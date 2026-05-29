import '../global.css';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { queryClient } from '../src/lib/queryClient';
import { useAuthStore } from '../src/store/authStore';
import SplashScreen from './(shared)/SplashScreen';
import { refreshUser } from '@/utils/referesh-user';
import { navigateHome } from '@/utils/navigate-home';
import { Toaster } from '../src/components/shared/Toaster';

// ── Notifications (optional) ─────────────────────────────────────────────────

try {
  const Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch {
  console.warn('Push notifications unavailable (Expo Go)');
}

// ── App state machine ─────────────────────────────────────────────────────────
//
//  splash ──► verifying ──► ready
//               │
//               └── no token → ready (skips fetch)
//
type AppPhase = 'splash' | 'verifying' | 'ready';

const SPLASH_MS = 1000;

// ── Root layout ───────────────────────────────────────────────────────────────

export default function RootLayout() {
  const { setLoading, _hasHydrated, token } = useAuthStore();
  const router = useRouter();

  const [phase, setPhase] = useState<AppPhase>('splash');

  // 1️⃣  Splash timer — runs once
  useEffect(() => {
    const id = setTimeout(() => setPhase('verifying'), SPLASH_MS);
    return () => clearTimeout(id);
  }, []);

  // 2️⃣  Auth check — runs once the splash is done AND the store has hydrated
  useEffect(() => {
    if (phase !== 'verifying' || !_hasHydrated) return;

    if (!token) {
      setPhase('ready');
      return;
    }

    refreshUser(setLoading, token).then(() => setPhase('ready'));
  }, [phase, _hasHydrated]);

  // 3️⃣  Navigate once everything is ready
  useEffect(() => {
    if (phase !== 'ready') return;
    navigateHome();
  }, [phase]);

  // ── Loading UI ──────────────────────────────────────────────────────────────

  if (phase === 'splash') {
    return <SplashScreen />;
  }

  if (phase === 'verifying') {
    return (
      <View style={{ flex: 1, backgroundColor: '#fbf8fe', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#000666" size="large" />
      </View>
    );
  }

  // phase === 'ready' — render the shell; navigation fires in the effect above
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" backgroundColor="#fbf8fe" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fbf8fe' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(worker)" />
          <Stack.Screen name="(employer)" />
          <Stack.Screen name="(shared)" />
        </Stack>
        <Toaster />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}