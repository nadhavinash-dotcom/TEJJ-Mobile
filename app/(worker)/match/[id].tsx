import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';

export default function MatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: match, isLoading } = useQuery({
    queryKey: ['match', id],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get(`/matches/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
  });

  if (isLoading) {
    return <SafeAreaView className="flex-1 bg-navy-900 items-center justify-center"><ActivityIndicator color="#F59E0B" size="large" /></SafeAreaView>;
  }

  const shiftTime = match?.shift_start_time
    ? new Date(match.shift_start_time).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })
    : null;

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center px-6 pt-10 pb-6">
          <Text className="text-6xl mb-4">✅</Text>
          <Text className="text-white text-2xl font-bold mb-2">Match Confirmed!</Text>
          <Text className="text-navy-300 text-sm text-center">You got the job. Here are the details:</Text>
        </View>

        <View className="mx-4 bg-green-500/10 border border-green-500/30 rounded-2xl p-5 mb-4">
          <Text className="text-white text-xl font-bold mb-1">{match?.job_title}</Text>
          <Text className="text-navy-300 text-base mb-3">{match?.employer_property_type}</Text>

          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-green-400">📍</Text>
              <Text className="text-white font-medium">{match?.venue_address}</Text>
            </View>
            {shiftTime && (
              <View className="flex-row items-center gap-2">
                <Text className="text-green-400">🕐</Text>
                <Text className="text-white font-medium">{shiftTime}</Text>
              </View>
            )}
            <View className="flex-row items-center gap-2">
              <Text className="text-green-400">💰</Text>
              <Text className="text-white font-medium">₹{match?.pay_rate?.toLocaleString('en-IN')} for {match?.shift_duration_hours} hrs</Text>
            </View>
            {match?.contact_name && (
              <View className="flex-row items-center gap-2">
                <Text className="text-green-400">👤</Text>
                <Text className="text-white font-medium">Ask for: {match.contact_name}</Text>
              </View>
            )}
          </View>
        </View>

        <View className="mx-4 gap-3 pb-8">
          <TouchableOpacity
            onPress={() => router.push('/(worker)/qr-code')}
            className="bg-amber-500 rounded-2xl py-4 items-center"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">🔲 Show My QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/(worker)/(tabs)/feed')} className="bg-navy-800 border border-navy-700 rounded-2xl py-4 items-center" activeOpacity={0.8}>
            <Text className="text-white font-medium">Back to Feed</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
