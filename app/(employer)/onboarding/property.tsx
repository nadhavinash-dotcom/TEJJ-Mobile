import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Animated, StyleSheet } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { PROPERTY_TYPES } from '@/utils';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

const BLUE = '#2563EB';

export default function PropertyScreen() {
  const { employer, updateEmployer } = useOnboardingStore();

  const opacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(22)).current;
  const gridOp = useRef(new Animated.Value(0)).current;
  const gridSlide = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 340, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 340, useNativeDriver: true }),
      Animated.timing(gridOp, { toValue: 1, duration: 340, delay: 90, useNativeDriver: true }),
      Animated.timing(gridSlide, { toValue: 0, duration: 340, delay: 90, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleVoiceResult = ({ englishText }: { englishText: string; keywords: string[]; originalText: string; structured: Record<string, unknown> }) => {
    const match = PROPERTY_TYPES.find(
      (p: any) => englishText.toLowerCase().includes(p.id.toLowerCase()) || englishText.toLowerCase().includes(p.labelEn?.toLowerCase() ?? ''),
    );
    if (match) updateEmployer({ property_type: match.id });
  };

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="px-6 pt-8"
        >
          <StepIndicator currentStep={1} totalSteps={4} accentColor={BLUE} />
          <Text className="text-on-surface text-2xl font-bold mb-1">Property details</Text>
          <Text className="text-on-surface-variant text-sm mb-4">Tell us about your establishment</Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </Animated.View>

        <Animated.View
          style={{ opacity: gridOp, transform: [{ translateY: gridSlide }] }}
          className="px-6 py-4 gap-5"
        >
          <View>
            <Text style={styles.sectionLabel}>Property type</Text>
            <View className="flex-row flex-wrap gap-2">
              {PROPERTY_TYPES.map((pt) => {
                const sel = employer.property_type === pt.id;
                return (
                  <TouchableOpacity
                    key={pt.id}
                    onPress={() => updateEmployer({ property_type: pt.id })}
                    activeOpacity={0.75}
                    style={sel ? styles.typeOn : styles.typeOff}
                  >
                    <LucideIcon
                      name={pt.icon || 'Home'}
                      size={15}
                      color={sel ? '#FFFFFF' : '#9CA3AF'}
                    />
                    <Text style={sel ? styles.typeTextOn : styles.typeTextOff}>{pt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={styles.sectionLabel}>Property name</Text>
            <TextInput
              value={employer.property_name ?? ''}
              onChangeText={(v) => updateEmployer({ property_name: v })}
              placeholder="e.g. The Grand Café, Hotel Sunrise"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          <OnboardingFooter
            onBack={() => router.back()}
            onNext={() => router.push('/(employer)/onboarding/location')}
            nextDisabled={!employer.property_type || !employer.property_name}
            color={BLUE}
          />
        </Animated.View>
      </ScrollView>
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
  typeOn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    borderWidth: 1,
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  typeOff: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C6C5D4',
  },
  typeTextOn: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  typeTextOff: { color: '#454652', fontSize: 13, fontWeight: '500' },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C6C5D4',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#1B1B1F',
    fontSize: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
});
