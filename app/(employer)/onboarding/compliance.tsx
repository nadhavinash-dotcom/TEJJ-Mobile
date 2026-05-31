import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, Animated, StyleSheet } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useAuthStore } from '../../../src/store/authStore';
import api from '../../../src/lib/api';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

const BLUE = '#2563EB';

export default function ComplianceScreen() {
  const { employer, updateEmployer, resetEmployer } = useOnboardingStore();
  const { setUser } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(22)).current;
  const cardOp = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 340, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 340, useNativeDriver: true }),
      Animated.timing(cardOp, { toValue: 1, duration: 360, delay: 100, useNativeDriver: true }),
      Animated.timing(cardSlide, { toValue: 0, duration: 360, delay: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/employers/create', {
        property_type: employer.property_type,
        property_name: employer.property_name,
        lat: employer.lat,
        lng: employer.lng,
        city: employer.city,
        area_locality: employer.area_locality,
        address: employer.address,
        contact_name: employer.contact_name,
        contact_phone: employer.contact_phone,
        email: employer.email,
        gstin: employer.gstin,
      });
      const user = res.data.data;
      setUser({ userId: user._id, hasWorker: false, hasEmployer: true, activeRole: 'employer' });
      resetEmployer();
      router.replace('/(employer)/onboarding/welcome');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Could not complete setup.');
    } finally {
      setSubmitting(false);
    }
  };

  const validGstin = employer.gstin && employer.gstin.length === 15;

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="px-6 pt-8"
        >
          <StepIndicator currentStep={4} totalSteps={4} accentColor={BLUE} />
          <Text className="text-on-surface text-2xl font-bold mb-1">Business compliance</Text>
          <Text className="text-on-surface-variant text-sm mb-6">
            GSTIN verification builds trust with workers
          </Text>
        </Animated.View>

        <Animated.View
          style={{ opacity: cardOp, transform: [{ translateY: cardSlide }] }}
          className="px-6 gap-5"
        >
          <View>
            <View style={styles.labelRow}>
              <Text style={styles.label}>GSTIN</Text>
              <Text style={styles.optional}>optional</Text>
            </View>
            <View style={[styles.inputWrap, focused && styles.inputFocused]}>
              <LucideIcon name="FileText" size={17} color={focused ? BLUE : '#C6C5D4'} />
              <TextInput
                value={employer.gstin ?? ''}
                onChangeText={(v) => updateEmployer({ gstin: v.toUpperCase() })}
                placeholder="15-character GST number"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
                maxLength={15}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={styles.input}
              />
              {validGstin && (
                <LucideIcon name="CheckCircle2" size={18} color="#16A34A" />
              )}
            </View>
            {validGstin && (
              <View style={styles.validRow}>
                <LucideIcon name="Check" size={12} color="#16A34A" />
                <Text style={styles.validText}>Valid GSTIN format — will be verified</Text>
              </View>
            )}
          </View>

          {/* Trust card */}
          <View style={styles.trustCard}>
            <View style={styles.trustIconWrap}>
              <LucideIcon name="ShieldCheck" size={22} color={BLUE} />
            </View>
            <View className="flex-1">
              <Text style={styles.trustTitle}>Why add GSTIN?</Text>
              <Text style={styles.trustDesc}>
                Verified employers get a GST badge on job cards —{' '}
                <Text style={{ color: BLUE, fontWeight: '700' }}>40% more applications</Text> on average.
              </Text>
            </View>
          </View>

          <OnboardingFooter
            onBack={() => router.back()}
            onNext={handleComplete}
            nextLabel={submitting ? 'Setting up...' : 'Complete Setup'}
            nextDisabled={submitting}
            color={BLUE}
          />
        </Animated.View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  label: { color: '#767683', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  optional: { color: '#C6C5D4', fontSize: 11 },
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
  inputFocused: {
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  input: { flex: 1, color: '#1B1B1F', fontSize: 15, fontFamily: 'monospace', padding: 0 },
  validRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  validText: { color: '#16A34A', fontSize: 12, fontWeight: '500' },
  trustCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 18,
    padding: 18,
  },
  trustIconWrap: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 10,
    alignSelf: 'flex-start',
  },
  trustTitle: { color: '#1B1B1F', fontWeight: '700', fontSize: 14, marginBottom: 4 },
  trustDesc: { color: '#454652', fontSize: 13, lineHeight: 19 },
});
