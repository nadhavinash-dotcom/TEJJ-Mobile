import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { mapVoiceToExperience } from '@/utils';

const QUICK_YEARS = [0, 1, 2, 3, 5, 7, 10];

export default function ExperienceScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const years = worker.years_experience ?? 1;

  const opacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(22)).current;
  const heroOp = useRef(new Animated.Value(0)).current;
  const heroScale = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 340, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 340, useNativeDriver: true }),
      Animated.timing(heroOp, { toValue: 1, duration: 400, delay: 80, useNativeDriver: true }),
      Animated.spring(heroScale, {
        toValue: 1,
        tension: 55,
        friction: 8,
        delay: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleVoiceResult = useCallback(
    ({ englishText, structured }: { englishText: string; keywords: string[]; originalText: string; structured: Record<string, unknown> }): boolean => {
      const exp = (structured.years_experience as number | undefined) ?? mapVoiceToExperience(englishText);
      if (exp !== null && exp !== undefined) { updateWorker({ years_experience: exp }); return true; }
      return false;
    },
    [updateWorker],
  );

  const expLabel = (n: number) => {
    if (n === 0) return 'Fresher';
    if (n === 1) return '1 year';
    return `${n} years`;
  };

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="px-6 pt-8"
        >
          <StepIndicator currentStep={3} totalSteps={10} />
          <Text className="text-on-surface text-2xl font-bold mb-1">Years of experience?</Text>
          <Text className="text-on-surface-variant text-sm mb-4">
            Honest experience = better job matches
          </Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </Animated.View>

        <Animated.View
          style={{ opacity: heroOp, transform: [{ scale: heroScale }] }}
          className="px-6 py-6 items-center"
        >
          <View style={styles.heroCard}>
            <Text style={styles.heroNum}>{years}</Text>
            <Text style={styles.heroLabel}>{expLabel(years)}</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="px-6"
        >
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={20}
            step={1}
            value={years}
            onValueChange={(v) => updateWorker({ years_experience: v })}
            minimumTrackTintColor="#000666"
            maximumTrackTintColor="#E4E1E7"
            thumbTintColor="#000666"
          />
          <View className="flex-row justify-between mt-1 mb-6">
            <Text className="text-outline text-xs">Fresher</Text>
            <Text className="text-outline text-xs">20+ years</Text>
          </View>

          <Text style={styles.sectionLabel}>Quick select</Text>
          <View className="flex-row flex-wrap gap-2 mb-2">
            {QUICK_YEARS.map((n) => {
              const sel = years === n;
              return (
                <TouchableOpacity
                  key={n}
                  onPress={() => updateWorker({ years_experience: n })}
                  activeOpacity={0.72}
                  style={sel ? styles.quickOn : styles.quickOff}
                >
                  <Text style={sel ? styles.quickTextOn : styles.quickTextOff}>
                    {n === 0 ? 'Fresh' : `${n}yr`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        <OnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/(worker)/onboarding/photo')}
        />
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    width: '100%',
    backgroundColor: '#E0E0FF',
    borderWidth: 1,
    borderColor: '#BDC2FF',
    borderRadius: 28,
    paddingHorizontal: 48,
    paddingVertical: 28,
    alignItems: 'center',
    shadowColor: '#000666',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  heroNum: {
    color: '#000666',
    fontSize: 72,
    fontWeight: '800',
    lineHeight: 80,
  },
  heroLabel: {
    color: '#343D96',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  quickOn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#000666',
    borderWidth: 1,
    borderColor: '#000666',
    shadowColor: '#000666',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  quickOff: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C6C5D4',
  },
  quickTextOn: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  quickTextOff: { color: '#454652', fontSize: 13, fontWeight: '500' },
});
