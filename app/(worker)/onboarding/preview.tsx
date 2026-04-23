import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { useAuthStore } from '../../../src/store/authStore';
import { AIScoreBar } from '../../../src/components/worker/AIScoreBar';
import { SKILL_LIST } from '@/utils';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';

export default function PreviewScreen() {
  const { worker, resetWorker } = useOnboardingStore();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const skill = SKILL_LIST.find((s) => s.id === worker.primary_skill);

  const handleGoLive = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const payload = {
        primary_skill: worker.primary_skill,
        sub_skills: worker.sub_skills,
        years_experience: worker.years_experience,
        profile_photo_url: worker.profile_photo_url,
        home_lat: worker.home_lat,
        home_lng: worker.home_lng,
        home_city: worker.home_city,
        home_area: worker.home_area,
        available_days: worker.available_days,
        preferred_shifts: worker.preferred_shifts,
        min_pay_per_shift: worker.min_pay_per_shift,
        skill_video_url: worker.skill_video_url,
        ai_score: worker.ai_score,
        fcm_token: worker.fcm_token,
      };
      const res = await api.post('/workers/onboarding', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = res.data.data;
      setUser({
        userId: user._id,
        firebaseUid: auth.currentUser!.uid,
        hasWorker: true,
        hasEmployer: false,
        activeRole: 'worker',
      });
      resetWorker();
      router.replace('/(worker)/(tabs)/feed');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Could not save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8">
          <Text className="text-navy-400 text-sm mb-1">Step 10 of 10</Text>
          <Text className="text-white text-2xl font-bold mb-1">Aapka Skill Card</Text>
          <Text className="text-navy-300 text-sm mb-6">This is how employers will see your profile</Text>
        </View>

        {/* Skill Card Preview */}
        <View className="mx-6 bg-navy-800 rounded-3xl p-5 border border-navy-700 mb-6">
          <View className="flex-row items-center gap-4 mb-4">
            {worker.profile_photo_url ? (
              <Image source={{ uri: worker.profile_photo_url }} className="w-16 h-16 rounded-full" />
            ) : (
              <View className="w-16 h-16 rounded-full bg-navy-700 items-center justify-center">
                <Text className="text-2xl">👤</Text>
              </View>
            )}
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-2xl">{skill?.icon}</Text>
                <Text className="text-white text-lg font-bold">{skill?.label ?? 'Worker'}</Text>
              </View>
              <Text className="text-navy-300 text-sm">{worker.years_experience} yrs experience</Text>
              {worker.home_city && <Text className="text-navy-400 text-xs">📍 {worker.home_city}</Text>}
            </View>
          </View>

          <View className="flex-row gap-2 mb-4 flex-wrap">
            {(worker.sub_skills ?? []).map((s) => (
              <View key={s} className="bg-navy-700 px-3 py-1 rounded-full">
                <Text className="text-navy-200 text-xs">{s}</Text>
              </View>
            ))}
            {(worker.available_days ?? []).slice(0, 3).map((d) => (
              <View key={d} className="bg-navy-700 px-3 py-1 rounded-full">
                <Text className="text-navy-200 text-xs">{d}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row items-center justify-between bg-navy-700 rounded-xl px-4 py-3">
            <Text className="text-navy-300 text-sm">Min per shift</Text>
            <Text className="text-amber-400 font-bold text-lg">₹{worker.min_pay_per_shift?.toLocaleString('en-IN')}</Text>
          </View>

          {worker.skill_video_url && (
            <View className="mt-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2 flex-row items-center gap-2">
              <Text className="text-green-400 text-xs">🎥 Skill video uploaded</Text>
            </View>
          )}
        </View>

        {worker.ai_score && (
          <View className="mx-6 mb-6">
            <Text className="text-white font-semibold mb-3">AI Video Score</Text>
            <AIScoreBar scores={worker.ai_score} />
          </View>
        )}

        <View className="px-6 pb-8">
          <TouchableOpacity
            onPress={handleGoLive}
            disabled={loading}
            className="bg-amber-500 rounded-2xl py-4 flex-row items-center justify-center gap-2"
            activeOpacity={0.85}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-xl">🚀</Text>}
            <Text className="text-white font-bold text-lg">{loading ? 'Setting up...' : 'Go Live!'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
