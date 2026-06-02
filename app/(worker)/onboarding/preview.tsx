import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, ActivityIndicator, Alert, Image,
  Animated, StyleSheet,
} from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { useAuthStore } from '../../../src/store/authStore';
import { AIScoreBar } from '../../../src/components/worker/AIScoreBar';
import { SKILL_LIST } from '@/utils';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import api from '../../../src/lib/api';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';
import { refreshUser } from '@/utils/referesh-user';
import { navigateHome } from '@/utils/navigate-home';

export default function PreviewScreen() {
  const { worker, resetWorker } = useOnboardingStore();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(22)).current;
  const cardOp = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 340, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 340, useNativeDriver: true }),
      Animated.timing(cardOp, { toValue: 1, duration: 420, delay: 100, useNativeDriver: true }),
      Animated.timing(cardSlide, { toValue: 0, duration: 420, delay: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  const skill = SKILL_LIST.find((s) => s.id === worker.primary_skill);

  const handleGoLive = async () => {
    setLoading(true);
    try {
      const token = useAuthStore.getState().token;
      const formData = new FormData();

      formData.append('sector', worker.sector || '');
      formData.append('primary_skill', worker.primary_skill || '');
      formData.append('years_experience', String(worker.years_experience || 0));
      formData.append('home_lat', String(worker.home_lat || 0));
      formData.append('home_lng', String(worker.home_lng || 0));
      formData.append('home_city', worker.home_city || '');
      formData.append('home_area', worker.home_area || '');
      formData.append('min_pay_per_shift', String(worker.min_pay_per_shift || 0));
      formData.append('fcm_token', worker.fcm_token || '');
      formData.append('sub_skills', JSON.stringify(worker.sub_skills || []));
      formData.append('available_days', JSON.stringify(worker.available_days || []));
      formData.append('preferred_shifts', JSON.stringify(worker.preferred_shifts || []));
      if (worker.ai_score) formData.append('ai_score', JSON.stringify(worker.ai_score));

      if (worker.profile_photo_uri) {
        const uri = worker.profile_photo_uri;
        const name = uri.split('/').pop() || 'photo.jpg';
        formData.append('profile_photo', { uri, name, type: 'image/jpeg' } as any);
      }
      if (worker.skill_video_uri) {
        const uri = worker.skill_video_uri;
        const name = uri.split('/').pop() || 'video.mp4';
        formData.append('skill_video', { uri, name, type: 'video/mp4' } as any);
      }

      const res = await api.post('/workers/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (!res.data.success) throw new Error(res.data.error || 'Failed to create profile');

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
        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="px-6 pt-8"
        >
          <StepIndicator currentStep={11} totalSteps={11} />
          <Text className="text-on-surface text-2xl font-bold mb-1">Your Skill Card</Text>
          <Text className="text-on-surface-variant text-sm mb-6">
            This is how employers will discover you
          </Text>
        </Animated.View>

        {/* Premium Skill Card */}
        <Animated.View
          style={[{ opacity: cardOp, transform: [{ translateY: cardSlide }] }, styles.skillCard]}
          className="mx-6 mb-6"
        >
          <View style={styles.cardHeader}>
            {(worker.profile_photo_uri || worker.profile_photo_url) ? (
              <Image
                source={{ uri: worker.profile_photo_uri || worker.profile_photo_url }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <LucideIcon name="User" size={28} color="#C6C5D4" />
              </View>
            )}

            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                {skill?.icon && <LucideIcon name={skill.icon} size={18} color="#000666" />}
                <Text style={styles.skillName}>{skill?.label ?? 'Worker'}</Text>
              </View>
              <Text style={styles.expLine}>
                {worker.years_experience === 0
                  ? 'Fresher'
                  : `${worker.years_experience} yr${(worker.years_experience ?? 0) > 1 ? 's' : ''} experience`}
              </Text>
              {worker.home_city && (
                <View className="flex-row items-center gap-1 mt-1">
                  <LucideIcon name="MapPin" size={11} color="#9CA3AF" />
                  <Text style={styles.locationLine}>{worker.home_city}</Text>
                </View>
              )}
            </View>

            <View style={styles.payBubble}>
              <Text style={styles.payCaption}>min/shift</Text>
              <Text style={styles.payAmt}>₹{worker.min_pay_per_shift?.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {((worker.sub_skills ?? []).length > 0 || (worker.available_days ?? []).length > 0) && (
            <View className="flex-row flex-wrap gap-2 mb-4">
              {(worker.sub_skills ?? []).map((s) => (
                <View key={s} style={styles.tagChip}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
              {(worker.available_days ?? []).slice(0, 4).map((d) => (
                <View key={d} style={styles.dayChip}>
                  <Text style={styles.dayChipText}>{d}</Text>
                </View>
              ))}
            </View>
          )}

          {(worker.skill_video_uri || worker.skill_video_url) && (
            <View style={styles.videoBadge}>
              <LucideIcon name="Video" size={14} color="#166534" />
              <Text style={styles.videoBadgeText}>Skill video uploaded</Text>
            </View>
          )}
        </Animated.View>

        {worker.ai_score && (
          <Animated.View
            style={{ opacity: cardOp, transform: [{ translateY: cardSlide }] }}
            className="mx-6 mb-6"
          >
            <View style={styles.scoreCard}>
              <View className="flex-row items-center gap-3 mb-4">
                <View style={styles.scoreIconWrap}>
                  <LucideIcon name="Sparkles" size={18} color="#000666" />
                </View>
                <Text style={styles.scoreTitle}>AI Video Score</Text>
              </View>
              <AIScoreBar scores={worker.ai_score} />
            </View>
          </Animated.View>
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

const styles = StyleSheet.create({
  skillCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E1E7',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', gap: 14, alignItems: 'flex-start', marginBottom: 16 },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#000666' },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F6F2F8',
    borderWidth: 1,
    borderColor: '#E4E1E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillName: { color: '#1B1B1F', fontSize: 17, fontWeight: '700' },
  expLine: { color: '#767683', fontSize: 13 },
  locationLine: { color: '#9CA3AF', fontSize: 12 },
  payBubble: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  payCaption: { color: '#92400E', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  payAmt: { color: '#D97706', fontSize: 15, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#F0EDF2', marginBottom: 14 },
  tagChip: {
    backgroundColor: '#F0EDF2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { color: '#454652', fontSize: 12 },
  dayChip: {
    backgroundColor: '#E0E0FF',
    borderWidth: 1,
    borderColor: '#BDC2FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dayChipText: { color: '#000666', fontSize: 12, fontWeight: '600' },
  videoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  videoBadgeText: { color: '#166534', fontSize: 12, fontWeight: '600' },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E1E7',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  scoreIconWrap: {
    backgroundColor: '#E0E0FF',
    borderRadius: 10,
    padding: 8,
  },
  scoreTitle: { color: '#1B1B1F', fontSize: 16, fontWeight: '700' },
});
