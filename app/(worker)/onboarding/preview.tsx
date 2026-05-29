import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { useAuthStore } from '../../../src/store/authStore';
import { AIScoreBar } from '../../../src/components/worker/AIScoreBar';
import { SKILL_LIST } from '@/utils';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';
import { refreshUser } from '@/utils/referesh-user';
import { navigateHome } from '@/utils/navigate-home';

export default function PreviewScreen() {
  const { worker, resetWorker } = useOnboardingStore();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const skill = SKILL_LIST.find((s) => s.id === worker.primary_skill);

  const handleGoLive = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      
      const formData = new FormData();
      
      // Append text fields
      formData.append('primary_skill', worker.primary_skill || '');
      formData.append('years_experience', String(worker.years_experience || 0));
      formData.append('home_lat', String(worker.home_lat || 0));
      formData.append('home_lng', String(worker.home_lng || 0));
      formData.append('home_city', worker.home_city || '');
      formData.append('home_area', worker.home_area || '');
      formData.append('min_pay_per_shift', String(worker.min_pay_per_shift || 0));
      formData.append('fcm_token', worker.fcm_token || '');

      // Append JSON fields
      formData.append('sub_skills', JSON.stringify(worker.sub_skills || []));
      formData.append('available_days', JSON.stringify(worker.available_days || []));
      formData.append('preferred_shifts', JSON.stringify(worker.preferred_shifts || []));
      if (worker.ai_score) formData.append('ai_score', JSON.stringify(worker.ai_score));

      // Append files
      if (worker.profile_photo_uri) {
        const uri = worker.profile_photo_uri;
        const name = uri.split('/').pop() || 'photo.jpg';
        const type = 'image/jpeg'; // Assume jpeg for photos
        formData.append('profile_photo', { uri, name, type } as any);
      }

      if (worker.skill_video_uri) {
        const uri = worker.skill_video_uri;
        const name = uri.split('/').pop() || 'video.mp4';
        const type = 'video/mp4';
        formData.append('skill_video', { uri, name, type } as any);
      }

      const res = await api.post('/workers/create', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const response = res.data;
      if (!response.success) {
        throw new Error(response.error || 'Failed to create profile');
      }

      // const user = response.data;
      // setUser({
      //   userId: user._id,
      //   token: token!,
      //   // firebaseUid: auth.currentUser?.uid || '',
      //   hasWorker: true,
      //   hasEmployer: false,
      //   workerId: user.worker_id,
      //   activeRole: 'worker',
      // });
      const result = await refreshUser(setLoading, token);
      if (!result.ok) throw new Error('Session verification failed');
      resetWorker();
      navigateHome();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Could not save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8">
          <StepIndicator currentStep={10} totalSteps={10} />
          <Text className="text-white text-2xl font-bold mb-1">Your Skill Card</Text>
          <Text className="text-zinc-300 text-sm mb-6">This is how employers will see your profile</Text>
        </View>

        {/* Skill Card Preview */}
        <View className="mx-6 bg-zinc-800 rounded-3xl p-5 border border-zinc-700 mb-6">
          <View className="flex-row items-center gap-4 mb-4">
            {(worker.profile_photo_uri || worker.profile_photo_url) ? (
              <Image source={{ uri: worker.profile_photo_uri || worker.profile_photo_url }} className="w-16 h-16 rounded-full" />
            ) : (
              <View className="w-16 h-16 rounded-full bg-zinc-700 items-center justify-center">
                <LucideIcon name="User" size={24} color="#94A3B8" />
              </View>
            )}
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                {skill?.icon && <LucideIcon name={skill.icon} size={22} color="#F59E0B" />}
                <Text className="text-white text-lg font-bold">{skill?.label ?? 'Worker'}</Text>
              </View>
              <Text className="text-zinc-300 text-sm">{worker.years_experience} yrs experience</Text>
              {worker.home_city && (
                <View className="flex-row items-center gap-1 mt-1">
                  <LucideIcon name="MapPin" size={12} color="#94A3B8" />
                  <Text className="text-zinc-400 text-xs">{worker.home_city}</Text>
                </View>
              )}
            </View>
          </View>

          <View className="flex-row gap-2 mb-4 flex-wrap">
            {(worker.sub_skills ?? []).map((s) => (
              <View key={s} className="bg-zinc-700 px-3 py-1 rounded-full">
                <Text className="text-zinc-200 text-xs">{s}</Text>
              </View>
            ))}
            {(worker.available_days ?? []).slice(0, 3).map((d) => (
              <View key={d} className="bg-zinc-700 px-3 py-1 rounded-full">
                <Text className="text-zinc-200 text-xs">{d}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row items-center justify-between bg-zinc-700 rounded-xl px-4 py-3">
            <Text className="text-zinc-300 text-sm">Min per shift</Text>
            <Text className="text-amber-400 font-bold text-lg">₹{worker.min_pay_per_shift?.toLocaleString('en-IN')}</Text>
          </View>

          {(worker.skill_video_uri || worker.skill_video_url) && (
            <View className="mt-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2 flex-row items-center gap-2">
              <LucideIcon name="Video" size={14} color="#22C55E" />
              <Text className="text-green-400 text-xs">Skill video uploaded</Text>
            </View>
          )}
        </View>

        {worker.ai_score && (
          <View className="mx-6 mb-6">
            <Text className="text-white font-semibold mb-3">AI Video Score</Text>
            <AIScoreBar scores={worker.ai_score} />
          </View>
        )}

        <OnboardingFooter 
          onBack={() => router.back()}
          onNext={handleGoLive}
          nextLabel={loading ? 'Setting up...' : 'Go Live!'}
          nextDisabled={loading}
        />
      </ScrollView>
    </SafeScreen>
  );
}
