import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatchStore } from '../../store/dispatchStore';
import api from '../../lib/api';
import { auth } from '../../lib/firebase';

interface FlashJob {
  _id: string;
  job_title: string;
  pay_rate: number;
  distance_km: number;
  employer_area_locality: string;
  expires_at: string;
}

export function FlashNotification({ job }: { job: FlashJob }) {
  const { setFlashJob } = useDispatchStore();
  const clearFlash = () => setFlashJob(null);
  const qc = useQueryClient();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.03, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const acceptMutation = useMutation({
    mutationFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.post('/dispatch/accept', { job_id: job._id }, { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
    onSuccess: (match) => {
      clearFlash();
      qc.invalidateQueries({ queryKey: ['my-applications'] });
      router.push({ pathname: '/(worker)/match/[id]', params: { id: match._id } });
    },
    onError: (e: any) => {
      Alert.alert('Taken!', e?.response?.data?.message ?? 'This job was already taken. Try next time!');
      clearFlash();
    },
  });

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }} className="mx-4 mb-2 bg-red-900/90 border border-red-500 rounded-2xl p-4">
      <View className="flex-row items-center gap-2 mb-2">
        <Text className="text-red-400 font-bold text-sm">⚡ FLASH JOB — Act fast!</Text>
        <View className="flex-1" />
        <TouchableOpacity onPress={clearFlash}>
          <Text className="text-navy-400">✕</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-white font-bold text-base mb-1">{job.job_title}</Text>
      <Text className="text-navy-300 text-sm mb-3">{job.employer_area_locality} · {job.distance_km} km</Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-amber-400 font-bold text-lg">₹{job.pay_rate?.toLocaleString('en-IN')}</Text>
        <TouchableOpacity
          onPress={() => acceptMutation.mutate()}
          disabled={acceptMutation.isPending}
          className="bg-red-500 px-6 py-2 rounded-xl"
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold">{acceptMutation.isPending ? '...' : 'Accept ⚡'}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
