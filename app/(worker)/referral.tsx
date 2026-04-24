import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { auth } from '../../src/lib/firebase';
import { LucideIcon } from '../../src/components/shared/LucideIcon';

export default function ReferralScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/referrals/mine', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
  });

  const handleShare = () => {
    Share.share({
      message: `Join TEJJ — India's top gig platform for hospitality workers!\n\nUse my referral code: ${data?.referral_code ?? 'TEJJ'}\n\nDownload: https://tejj.app`,
    });
  };

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          <TouchableOpacity onPress={() => router.back()} className="mb-6 flex-row items-center gap-1">
            <LucideIcon name="ChevronLeft" size={20} color="#F59E0B" />
            <Text className="text-amber-400 text-base">Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold mb-1">Refer a Friend</Text>
          <Text className="text-navy-300 text-sm mb-6">Invite friends and earn rewards when they complete their first shift</Text>
        </View>

        {isLoading ? (
          <View className="py-10 items-center"><ActivityIndicator color="#F59E0B" /></View>
        ) : (
          <View className="px-4 gap-4">
            <View className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 items-center">
              <Text className="text-amber-400 text-sm mb-2">Your referral code</Text>
              <Text className="text-white text-3xl font-bold tracking-widest mb-4">{data?.referral_code ?? 'TEJJ001'}</Text>
              <TouchableOpacity onPress={handleShare} className="bg-amber-500 rounded-xl px-6 py-3 flex-row items-center gap-2" activeOpacity={0.85}>
                <LucideIcon name="Share2" size={18} color="#FFFFFF" />
                <Text className="text-white font-bold">Share Now</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-navy-800 border border-navy-700 rounded-2xl p-5">
              <Text className="text-white font-semibold mb-3">Your Referrals</Text>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-amber-400 text-3xl font-bold">{data?.total_referred ?? 0}</Text>
                  <Text className="text-navy-400 text-xs mt-1">Invited</Text>
                </View>
                <View className="items-center">
                  <Text className="text-green-400 text-3xl font-bold">{data?.completed ?? 0}</Text>
                  <Text className="text-navy-400 text-xs mt-1">Completed</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white text-3xl font-bold">₹{(data?.earnings ?? 0).toLocaleString('en-IN')}</Text>
                  <Text className="text-navy-400 text-xs mt-1">Earned</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
}
