import '../global.css';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { queryClient } from '../src/lib/queryClient';
import { useAuthStore } from '../src/store/authStore';
import api from '../src/lib/api';
import SplashScreen from './(shared)/SplashScreen';

let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch (e) {
  console.warn("Push notifications disabled in Expo Go");
}


export default function RootLayout() {
  const { setUser, setLoading, clear, _hasHydrated, isLoading } = useAuthStore();

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!_hasHydrated) return;
    
    const verifySession = async () => {
      const token = useAuthStore.getState().token;
      if (token) {
        try {
          const res = await api.get('/auth/me');
          const user = res.data.data;
          setUser({
            userId: user._id,
            token: token,
            hasWorker: user.has_worker,
            hasEmployer: user.has_employer,
            activeRole: user.active_role,
          });
        } catch (e) {
          console.error("Session verification failed", e);
          clear();
        }
      } else {
        setLoading(false);
      }
    };

    verifySession();
  }, [_hasHydrated]);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 2500);
  }, []);

  // Show loading screen while store rehydrates from AsyncStorage
  // if (!_hasHydrated) {
  //   return (
  //     <View style={{ flex: 1, backgroundColor: '#fbf8fe', alignItems: 'center', justifyContent: 'center' }}>
  //       <ActivityIndicator color="#000666" size="large" />
  //     </View>
  //   );
  // }
  if (!_hasHydrated || isLoading || showSplash) {
    return <SplashScreen />;
  }

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
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

