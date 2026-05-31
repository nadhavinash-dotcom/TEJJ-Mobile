import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TextInput,
  Animated, StyleSheet, TextInputProps,
} from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

const BLUE = '#2563EB';

function InputField({
  label,
  iconName,
  optional,
  ...props
}: TextInputProps & { label: string; iconName: string; optional?: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.fieldWrap}>
      <View style={styles.fieldLabelRow}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {optional && <Text style={styles.optionalTag}>optional</Text>}
      </View>
      <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
        <LucideIcon name={iconName} size={17} color={focused ? BLUE : '#C6C5D4'} />
        <TextInput
          {...props}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
}

export default function EmployerContactScreen() {
  const { employer, updateEmployer } = useOnboardingStore();

  const opacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(22)).current;
  const formOp = useRef(new Animated.Value(0)).current;
  const formSlide = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 340, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 340, useNativeDriver: true }),
      Animated.timing(formOp, { toValue: 1, duration: 340, delay: 90, useNativeDriver: true }),
      Animated.timing(formSlide, { toValue: 0, duration: 340, delay: 90, useNativeDriver: true }),
    ]).start();
  }, []);

  const isValid = !!employer.contact_name && !!employer.contact_phone;

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="px-6 pt-8"
        >
          <StepIndicator currentStep={3} totalSteps={4} accentColor={BLUE} />
          <Text className="text-on-surface text-2xl font-bold mb-1">Contact details</Text>
          <Text className="text-on-surface-variant text-sm mb-6">
            Who should workers contact on arrival?
          </Text>
        </Animated.View>

        <Animated.View
          style={{ opacity: formOp, transform: [{ translateY: formSlide }] }}
          className="px-6 gap-4"
        >
          <InputField
            label="Contact person"
            iconName="User"
            value={employer.contact_name ?? ''}
            onChangeText={(v) => updateEmployer({ contact_name: v })}
            placeholder="e.g. Ravi Kumar"
            autoCapitalize="words"
          />

          <InputField
            label="Mobile number"
            iconName="Phone"
            value={employer.contact_phone ?? ''}
            onChangeText={(v) => updateEmployer({ contact_phone: v })}
            placeholder="10-digit number"
            keyboardType="phone-pad"
            maxLength={10}
          />

          <InputField
            label="Email address"
            iconName="Mail"
            optional
            value={employer.email ?? ''}
            onChangeText={(v) => updateEmployer({ email: v })}
            placeholder="business@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <OnboardingFooter
            onBack={() => router.back()}
            onNext={() => router.push('/(employer)/onboarding/compliance')}
            nextDisabled={!isValid}
            color={BLUE}
          />
        </Animated.View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  fieldWrap: { gap: 8 },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fieldLabel: {
    color: '#767683',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  optionalTag: { color: '#C6C5D4', fontSize: 11 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E1E7',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  inputWrapFocused: {
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  input: { flex: 1, color: '#1B1B1F', fontSize: 15, padding: 0 },
});
