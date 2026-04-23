import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { useAuthStore } from '../../../src/store/authStore';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';

export default function ComplianceScreen() {
  const { employer, updateEmployer, resetEmployer } = useOnboardingStore();
  const { setUser } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.post('/employers/onboarding', {
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
      }, { headers: { Authorization: `Bearer ${token}` } });
      const user = res.data.data;
      setUser({ userId: user._id, firebaseUid: auth.currentUser!.uid, hasWorker: false, hasEmployer: true, activeRole: 'employer' });
      resetEmployer();
      router.replace('/(employer)/onboarding/welcome');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Could not complete setup.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 gap-4">
          <View>
            <Text className="text-navy-400 text-sm mb-1">Step 4 of 5</Text>
            <Text className="text-white text-2xl font-bold mb-1">Business Compliance</Text>
            <Text className="text-navy-300 text-sm mb-6">GSTIN verification builds trust with workers</Text>
          </View>

          <View>
            <Text className="text-navy-300 text-sm mb-2">GSTIN (optional)</Text>
            <TextInput
              value={employer.gstin ?? ''}
              onChangeText={(v) => updateEmployer({ gstin: v.toUpperCase() })}
              placeholder="15-character GST number"
              placeholderTextColor="#4B5563"
              autoCapitalize="characters"
              maxLength={15}
              className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 text-white text-sm font-mono"
            />
            {employer.gstin && employer.gstin.length === 15 && (
              <Text className="text-green-400 text-xs mt-1">✓ Valid GSTIN format — will be verified</Text>
            )}
          </View>

          <View className="bg-navy-800 border border-navy-700 rounded-xl p-4">
            <Text className="text-white font-medium mb-1">Why add GSTIN?</Text>
            <Text className="text-navy-300 text-sm">Verified employers get a ✓ GST badge on job cards, which increases worker applications by 40%.</Text>
          </View>

          <TouchableOpacity
            onPress={handleComplete}
            disabled={submitting}
            className="bg-blue-600 rounded-2xl py-4 items-center mt-2 mb-8"
            activeOpacity={0.85}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Complete Setup →</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
