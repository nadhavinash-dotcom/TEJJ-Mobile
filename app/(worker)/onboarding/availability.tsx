import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { VoiceSuggestionSheet } from '../../../src/components/shared/VoiceSuggestionSheet';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { useVoiceStep } from '../../../src/hooks/useVoiceStep';
import { VoiceSuggestion } from '../../../src/types/voice';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SHIFTS = [
  { id: 'morning', label: 'Morning', time: '6am – 12pm', icon: 'Sunrise' },
  { id: 'afternoon', label: 'Afternoon', time: '12pm – 5pm', icon: 'Sun' },
  { id: 'evening', label: 'Evening', time: '5pm – 10pm', icon: 'Sunset' },
  { id: 'night', label: 'Night', time: '10pm – 6am', icon: 'Moon' },
];
const SHIFT_IDS = new Set(SHIFTS.map((s) => s.id));

export default function AvailabilityScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const days = worker.available_days ?? [];
  const shifts = worker.preferred_shifts ?? [];

  const opacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(22)).current;
  const contentOp = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 340, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 340, useNativeDriver: true }),
      Animated.timing(contentOp, { toValue: 1, duration: 340, delay: 90, useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: 0, duration: 340, delay: 90, useNativeDriver: true }),
    ]).start();
  }, []);

  const getOptions = useCallback(() => [], []);
  const { handleVoiceResult, match, speechResult, dismiss } = useVoiceStep('availability', getOptions);

  const toggleDay = (d: string) =>
    updateWorker({ available_days: days.includes(d) ? days.filter((x) => x !== d) : [...days, d] });

  const toggleShift = (s: string) =>
    updateWorker({ preferred_shifts: shifts.includes(s) ? shifts.filter((x) => x !== s) : [...shifts, s] });

  const handleSuggestionConfirm = (selected: VoiceSuggestion[]) => {
    const dayIds = selected.filter((s) => !SHIFT_IDS.has(s.id)).map((s) => s.id);
    const shiftIds = selected.filter((s) => SHIFT_IDS.has(s.id)).map((s) => s.id);
    if (dayIds.length) updateWorker({ available_days: Array.from(new Set([...days, ...dayIds])) });
    if (shiftIds.length) updateWorker({ preferred_shifts: Array.from(new Set([...shifts, ...shiftIds])) });
    dismiss();
  };

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="px-6 pt-8"
        >
          <StepIndicator currentStep={7} totalSteps={11} />
          <Text className="text-on-surface text-2xl font-bold mb-1">When are you available?</Text>
          <Text className="text-on-surface-variant text-sm mb-4">
            Select days and shifts you can work
          </Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </Animated.View>

        <Animated.View
          style={{ opacity: contentOp, transform: [{ translateY: contentSlide }] }}
          className="px-6 pt-2 pb-2"
        >
          {/* Days */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text style={styles.sectionLabel}>Days</Text>
              <TouchableOpacity onPress={() => updateWorker({ available_days: DAYS })} activeOpacity={0.7}>
                <Text style={styles.selectAll}>Select all</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {DAYS.map((d) => {
                const sel = days.includes(d);
                return (
                  <TouchableOpacity
                    key={d}
                    onPress={() => toggleDay(d)}
                    activeOpacity={0.72}
                    style={sel ? styles.dayOn : styles.dayOff}
                  >
                    <Text style={sel ? styles.dayTextOn : styles.dayTextOff}>{d}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Shifts */}
          <View className="mb-6">
            <Text style={styles.sectionLabel} className="mb-3">Preferred Shifts</Text>
            <View className="gap-2">
              {SHIFTS.map((s) => {
                const sel = shifts.includes(s.id);
                return (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => toggleShift(s.id)}
                    activeOpacity={0.78}
                    style={sel ? styles.shiftOn : styles.shiftOff}
                  >
                    <View style={sel ? styles.shiftIconOn : styles.shiftIconOff}>
                      <LucideIcon name={s.icon} size={18} color={sel ? '#000666' : '#9CA3AF'} />
                    </View>
                    <View className="flex-1">
                      <Text style={sel ? styles.shiftLabelOn : styles.shiftLabelOff}>{s.label}</Text>
                      <Text style={styles.shiftTime}>{s.time}</Text>
                    </View>
                    {sel && (
                      <View style={styles.checkCircle}>
                        <LucideIcon name="Check" size={14} color="#000666" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Animated.View>

        <OnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/(worker)/onboarding/pay')}
          nextDisabled={days.length === 0 || shifts.length === 0}
        />
      </ScrollView>

      <VoiceSuggestionSheet
        match={match}
        speechResult={speechResult}
        multiSelect={true}
        onConfirm={handleSuggestionConfirm}
        onClose={dismiss}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  selectAll: { color: '#000666', fontSize: 13, fontWeight: '600' },
  dayOn: {
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
  dayOff: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C6C5D4',
  },
  dayTextOn: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  dayTextOff: { color: '#454652', fontWeight: '500', fontSize: 13 },
  shiftOn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#E0E0FF',
    borderWidth: 1,
    borderColor: '#BDC2FF',
    shadowColor: '#000666',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  shiftOff: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E1E7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  shiftIconOn: {
    backgroundColor: '#FFFFFF',
    padding: 9,
    borderRadius: 10,
  },
  shiftIconOff: {
    backgroundColor: '#F6F2F8',
    padding: 9,
    borderRadius: 10,
  },
  shiftLabelOn: { color: '#000666', fontWeight: '700', fontSize: 14 },
  shiftLabelOff: { color: '#1B1B1F', fontWeight: '500', fontSize: 14 },
  shiftTime: { color: '#9CA3AF', fontSize: 12, marginTop: 1 },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDC2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
