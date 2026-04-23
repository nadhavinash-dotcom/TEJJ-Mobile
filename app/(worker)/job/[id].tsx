import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { HIRING_LANES } from '@/utils';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [applying, setApplying] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get(`/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
  });

  const handleApply = async () => {
    setApplying(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.post('/applications', { job_id: id }, { headers: { Authorization: `Bearer ${token}` } });
      router.replace({ pathname: '/(worker)/applied/[id]', params: { id: res.data.data._id } });
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Could not apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (isLoading || !job) {
    return (
      <SafeAreaView className="flex-1 bg-navy-900 items-center justify-center">
        <ActivityIndicator color="#F59E0B" size="large" />
      </SafeAreaView>
    );
  }

  const laneKey = `L${job.lane}` as keyof typeof HIRING_LANES;
  const lane = HIRING_LANES[laneKey];
  const shiftTime = job.shift_start_time
    ? new Date(job.shift_start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    : null;
  const spotsLeft = job.number_of_openings - job.openings_filled;

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-2 flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-amber-400 text-base">← Back</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 pb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="px-3 py-1 rounded-lg" style={{ backgroundColor: lane.color }}>
              <Text className="text-white text-sm font-bold">{lane.icon} {lane.label}</Text>
            </View>
            {job.employer_gstin_verified && <Text className="text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded">✓ GST Verified</Text>}
          </View>

          <Text className="text-white text-2xl font-bold mb-1">{job.job_title}</Text>
          <Text className="text-navy-300 text-base mb-4">{job.employer_property_type} · {job.employer_area_locality}</Text>

          <View className="bg-navy-800 rounded-2xl p-4 border border-navy-700 mb-4">
            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-navy-400 text-xs mb-1">Pay per shift</Text>
                <Text className="text-amber-400 text-2xl font-bold">₹{job.pay_rate?.toLocaleString('en-IN')}</Text>
              </View>
              <View className="items-end">
                <Text className="text-navy-400 text-xs mb-1">Distance</Text>
                <Text className="text-white font-semibold">{job.distance_km} km away</Text>
              </View>
            </View>

            {shiftTime && (
              <View className="border-t border-navy-700 pt-3 flex-row justify-between">
                <View>
                  <Text className="text-navy-400 text-xs mb-1">Shift time</Text>
                  <Text className="text-white font-medium">{shiftTime}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-navy-400 text-xs mb-1">Duration</Text>
                  <Text className="text-white font-medium">{job.shift_duration_hours} hours</Text>
                </View>
              </View>
            )}
          </View>

          {job.description && (
            <View className="bg-navy-800 rounded-2xl p-4 border border-navy-700 mb-4">
              <Text className="text-white font-semibold mb-2">Job Description</Text>
              <Text className="text-navy-300 text-sm leading-5">{job.description}</Text>
            </View>
          )}

          <View className="bg-navy-800 rounded-2xl p-4 border border-navy-700 mb-4">
            <Text className="text-white font-semibold mb-3">Employer</Text>
            <Text className="text-navy-300 text-sm mb-1">{job.employer_property_type}</Text>
            {job.employer_dignity_score > 0 && (
              <View className="flex-row items-center gap-2">
                <Text className="text-amber-400 text-sm">⭐ {job.employer_dignity_score.toFixed(1)} Dignity Score</Text>
              </View>
            )}
          </View>

          {spotsLeft > 0 && spotsLeft <= 3 && (
            <View className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 mb-4 flex-row items-center gap-2">
              <Text className="text-red-400 font-semibold text-sm">⚡ Only {spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="px-4 pb-6 pt-2 border-t border-navy-800">
        <TouchableOpacity
          onPress={handleApply}
          disabled={applying}
          className={`rounded-2xl py-4 items-center ${applying ? 'bg-navy-700' : 'bg-amber-500'}`}
          activeOpacity={0.85}
        >
          {applying ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Apply Now →</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
