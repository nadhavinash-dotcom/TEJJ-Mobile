import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';

export default function EmployerContactScreen() {
  const { employer, updateEmployer } = useOnboardingStore();

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 gap-4">
          <StepIndicator currentStep={3} totalSteps={4} />
          <View>
            <Text className="text-white text-2xl font-bold mb-1">Contact Details</Text>
            <Text className="text-navy-300 text-sm mb-6">Who should workers contact on arrival?</Text>
          </View>

          <View>
            <Text className="text-navy-300 text-sm mb-2">Contact person name</Text>
            <TextInput
              value={employer.contact_name ?? ''}
              onChangeText={(v) => updateEmployer({ contact_name: v })}
              placeholder="E.g. Ravi Kumar"
              placeholderTextColor="#4B5563"
              className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 text-white text-sm"
            />
          </View>

          <View>
            <Text className="text-navy-300 text-sm mb-2">Contact phone</Text>
            <TextInput
              value={employer.contact_phone ?? ''}
              onChangeText={(v) => updateEmployer({ contact_phone: v })}
              placeholder="10-digit mobile number"
              placeholderTextColor="#4B5563"
              keyboardType="phone-pad"
              maxLength={10}
              className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 text-white text-sm"
            />
          </View>

          <View>
            <Text className="text-navy-300 text-sm mb-2">Email (optional)</Text>
            <TextInput
              value={employer.email ?? ''}
              onChangeText={(v) => updateEmployer({ email: v })}
              placeholder="business@example.com"
              placeholderTextColor="#4B5563"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 text-white text-sm"
            />
          </View>

          <OnboardingFooter 
            onBack={() => router.back()}
            onNext={() => router.push('/(employer)/onboarding/compliance')}
            nextDisabled={!employer.contact_name || !employer.contact_phone}
            color="bg-blue-600"
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
