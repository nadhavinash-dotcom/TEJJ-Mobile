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
import { SUB_SKILLS_MAP, SKILL_LIST } from '@/utils';

export default function SubSkillScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const opacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(22)).current;
  const chipOp = useRef(new Animated.Value(0)).current;
  const chipSlide = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 340, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 340, useNativeDriver: true }),
      Animated.timing(chipOp, { toValue: 1, duration: 340, delay: 90, useNativeDriver: true }),
      Animated.timing(chipSlide, { toValue: 0, duration: 340, delay: 90, useNativeDriver: true }),
    ]).start();
  }, []);

  const skillDef = SKILL_LIST.find((s) => s.id === worker.primary_skill);
  const availableSubSkills = worker.primary_skill ? SUB_SKILLS_MAP[worker.primary_skill] || [] : [];

  const getOptions = useCallback(
    () => availableSubSkills.map((s) => ({
      id: s.id,
      label: s.labelEn ?? s.label,
      aliases: s.keywords ? [...s.keywords] : undefined,
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [worker.primary_skill],
  );

  const { handleVoiceResult, match, speechResult, dismiss } = useVoiceStep('sub_skill', getOptions);

  const toggleSubSkill = (id: string) => {
    const current = worker.sub_skills ?? [];
    updateWorker({
      sub_skills: current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    });
  };

  const selectedCount = (worker.sub_skills ?? []).length;

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="px-6 pt-8 pb-4"
        >
          <StepIndicator currentStep={3} totalSteps={11} />
          <Text className="text-on-surface text-2xl font-bold mb-1">Your speciality?</Text>
          <Text className="text-on-surface-variant text-sm mb-4">
            {skillDef ? `${skillDef.label} — ` : ''}Pick everything that applies
          </Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </Animated.View>

        <Animated.View
          style={{ opacity: chipOp, transform: [{ translateY: chipSlide }] }}
          className="px-6 pb-2"
        >
          {availableSubSkills.length > 0 ? (
            <>
              <Text style={styles.sectionLabel}>Select specialisation</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {availableSubSkills.map((c) => {
                  const sel = (worker.sub_skills ?? []).includes(c.id);
                  return (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => toggleSubSkill(c.id)}
                      activeOpacity={0.72}
                      style={sel ? styles.chipOn : styles.chipOff}
                    >
                      <Text style={sel ? styles.chipTextOn : styles.chipTextOff}>{c.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {selectedCount > 0 && (
                <View style={styles.countBanner}>
                  <View style={styles.countDot} />
                  <Text style={styles.countText}>
                    {selectedCount} selected — more picks = more matches
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyCard}>
              <Text className="text-on-surface-variant text-sm">
                No sub-skills for this role. Continue to next step.
              </Text>
            </View>
          )}
        </Animated.View>

        <OnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/(worker)/onboarding/experience')}
        />
      </ScrollView>

      <VoiceSuggestionSheet
        match={match}
        speechResult={speechResult}
        multiSelect={true}
        onConfirm={(selected) => {
          const ids = selected.map((s) => s.id);
          const current = worker.sub_skills ?? [];
          updateWorker({ sub_skills: Array.from(new Set([...current, ...ids])) });
          dismiss();
        }}
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
  chipOn: {
    paddingHorizontal: 16,
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
  chipOff: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C6C5D4',
  },
  chipTextOn: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  chipTextOff: { color: '#454652', fontSize: 13, fontWeight: '500' },
  countBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E0E0FF',
    borderWidth: 1,
    borderColor: '#BDC2FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 4,
  },
  countDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000666',
  },
  countText: { color: '#000666', fontSize: 13, fontWeight: '600' },
  emptyCard: {
    backgroundColor: '#F6F2F8',
    borderWidth: 1,
    borderColor: '#E4E1E7',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
