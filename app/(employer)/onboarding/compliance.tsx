import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useAuthStore } from '../../../src/store/authStore';
import api from '../../../src/lib/api';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function ComplianceScreen() {
  const { employer, updateEmployer, resetEmployer } = useOnboardingStore();
  const { setUser } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 gap-4">
          <StepIndicator currentStep={4} totalSteps={4} />
          <View>
            <Text className="text-white text-2xl font-bold mb-1">Business Compliance</Text>
            <Text className="text-zinc-300 text-sm mb-6">GSTIN verification builds trust with workers</Text>
          </View>

          <View>
            <Text className="text-zinc-300 text-sm mb-2">GSTIN (optional)</Text>
            <TextInput
              value={employer.gstin ?? ''}
              onChangeText={(v) => updateEmployer({ gstin: v.toUpperCase() })}
              placeholder="15-character GST number"
              placeholderTextColor="#4B5563"
              autoCapitalize="characters"
              maxLength={15}
              className="bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3 text-white text-sm font-mono"
            />
            {employer.gstin && employer.gstin.length === 15 && (
              <View className="flex-row items-center gap-1 mt-1">
                <LucideIcon name="Check" size={12} color="#4ADE80" />
                <Text className="text-green-400 text-xs">Valid GSTIN format — will be verified</Text>
              </View>
            )}
          </View>

          <View className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
            <Text className="text-white font-medium mb-1">Why add GSTIN?</Text>
            <Text className="text-zinc-300 text-sm">Verified employers get a GST badge on job cards, which increases worker applications by 40%.</Text>
          </View>

          <OnboardingFooter 
            onBack={() => router.back()}
            onNext={handleComplete}
            nextLabel={submitting ? 'Setting up...' : 'Complete Setup →'}
            nextDisabled={submitting}
            color="bg-blue-600"
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
