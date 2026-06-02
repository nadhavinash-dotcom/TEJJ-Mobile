import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { mapVoiceToPay } from '@/utils';

const QUICK_PICKS = [300, 400, 500, 600, 700, 800, 1000, 1200];

export default function PayScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const pay = worker.min_pay_per_shift ?? 500;

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
      const amount = (structured.min_pay_per_shift as number | undefined) ?? mapVoiceToPay(englishText);
      if (amount) { updateWorker({ min_pay_per_shift: amount }); return true; }
      return false;
    },
    [updateWorker],
  );

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="px-6 pt-8"
        >
          <StepIndicator currentStep={8} totalSteps={11} />
          <Text className="text-on-surface text-2xl font-bold mb-1">Minimum pay per shift?</Text>
          <Text className="text-on-surface-variant text-sm mb-4">
            Set your floor — employers won't see jobs below this rate
          </Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </Animated.View>

        {/* Hero Amount */}
        <Animated.View
          style={{ opacity: heroOp, transform: [{ scale: heroScale }] }}
          className="px-6 py-6 items-center"
        >
          <View style={styles.heroCard}>
            <Text style={styles.heroCaption}>per shift</Text>
            <Text style={styles.heroAmount}>₹{pay.toLocaleString('en-IN')}</Text>
            <View style={styles.monthlyRow}>
              <Text style={styles.monthlyLabel}>Monthly estimate</Text>
              <Text style={styles.monthlyValue}>₹{(pay * 26).toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="px-6"
        >
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={200}
            maximumValue={2000}
            step={50}
            value={pay}
            onValueChange={(v) => updateWorker({ min_pay_per_shift: v })}
            minimumTrackTintColor="#F59E0B"
            maximumTrackTintColor="#E4E1E7"
            thumbTintColor="#F59E0B"
          />
          <View className="flex-row justify-between mt-1 mb-6">
            <Text className="text-outline text-xs">₹200</Text>
            <Text className="text-outline text-xs">₹2,000</Text>
          </View>

          <Text style={styles.sectionLabel}>Quick select</Text>
          <View className="flex-row flex-wrap gap-2 mb-2">
            {QUICK_PICKS.map((p) => {
              const sel = pay === p;
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => updateWorker({ min_pay_per_shift: p })}
                  activeOpacity={0.72}
                  style={sel ? styles.quickOn : styles.quickOff}
                >
                  <Text style={sel ? styles.quickTextOn : styles.quickTextOff}>₹{p}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        <OnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/(worker)/onboarding/video')}
        />
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    width: '100%',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 28,
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
  },
  heroCaption: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroAmount: {
    color: '#D97706',
    fontSize: 64,
    fontWeight: '800',
    lineHeight: 72,
  },
  monthlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  monthlyLabel: { color: '#92400E', fontSize: 12, fontWeight: '500' },
  monthlyValue: { color: '#D97706', fontSize: 13, fontWeight: '700' },
  sectionLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  quickOn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#000666',
    borderWidth: 1,
    borderColor: '#000666',
    shadowColor: '#000666',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  quickOff: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C6C5D4',
  },
  quickTextOn: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  quickTextOff: { color: '#454652', fontSize: 13, fontWeight: '500' },
});
