import '../global.css';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/lib/firebase';
import { queryClient } from '../src/lib/queryClient';
import { useAuthStore } from '../src/store/authStore';
import api from '../src/lib/api';

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
  const { setUser, setLoading, clear } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const res = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const user = res.data.data;
          setUser({
            userId: user._id,
            firebaseUid: firebaseUser.uid,
            hasWorker: user.has_worker,
            hasEmployer: user.has_employer,
            activeRole: user.active_role,
          });
        } catch {
          clear();
        }
      } else {
        clear();
      }
    });
    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" backgroundColor="#0A1628" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A1628' } }}>
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
