import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { QRCodeDisplay } from '../../src/components/shared/QRCodeDisplay';
import api from '../../src/lib/api';
import { auth } from '../../src/lib/firebase';
import { LucideIcon } from '../../src/components/shared/LucideIcon';

export default function QRCodeScreen() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['qr-token'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/dispatch/qr-token', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data as { qr_token: string; expires_at: string };
    },
    staleTime: 4 * 60 * 1000, // refresh every 4 min (token valid 5 min)
    refetchInterval: 4 * 60 * 1000,
  });

  const [timeLeft, setTimeLeft] = useState(300);
  useEffect(() => {
    if (!data?.expires_at) return;
    const update = () => {
      const diff = Math.max(0, Math.floor((new Date(data.expires_at).getTime() - Date.now()) / 1000));
      setTimeLeft(diff);
      if (diff === 0) refetch();
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [data?.expires_at]);

  return (
    <SafeScreen className="flex-1">
      <View className="flex-1 px-6 pt-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-6 flex-row items-center gap-1">
          <LucideIcon name="ChevronLeft" size={20} color="#F59E0B" />
          <Text className="text-amber-400 text-base">Back</Text>
        </TouchableOpacity>

        <Text className="text-white text-2xl font-bold mb-2">Arrival QR Code</Text>
        <Text className="text-navy-300 text-sm mb-8">Show this to the employer when you arrive. Rotates every 5 minutes.</Text>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#F59E0B" size="large" />
          </View>
        ) : (
          <View className="items-center">
            <View className="bg-white p-4 rounded-2xl mb-4">
              <QRCodeDisplay value={data?.qr_token ?? ''} size={200} />
            </View>

            <View className="flex-row items-center gap-2 mb-6">
              <View className={`w-2 h-2 rounded-full ${timeLeft > 60 ? 'bg-green-400' : 'bg-red-400'}`} />
              <Text className={`font-semibold ${timeLeft > 60 ? 'text-green-400' : 'text-red-400'}`}>
                Expires in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </Text>
            </View>

            <View className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 w-full flex-row items-center gap-3">
              <LucideIcon name="Lightbulb" size={20} color="#FCD34D" />
              <Text className="text-amber-300 text-sm flex-1">
                The employer scans this with the TEJJ employer app to confirm your arrival and start the shift.
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeScreen>
  );
}
