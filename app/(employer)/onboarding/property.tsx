import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { PROPERTY_TYPES } from '@/utils';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function PropertyScreen() {
  const { employer, updateEmployer } = useOnboardingStore();

  const handleVoiceResult = ({ englishText }: { englishText: string; keywords: string[]; originalText: string; structured: Record<string, unknown> }) => {
    const match = PROPERTY_TYPES.find((p) => englishText.toLowerCase().includes(p.id.toLowerCase()) || englishText.toLowerCase().includes(p.labelEn?.toLowerCase() ?? ''));
    if (match) updateEmployer({ property_type: match.id });
  };

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8">
          <StepIndicator currentStep={1} totalSteps={4} />
          <Text className="text-white text-2xl font-bold mb-1">Property Details</Text>
          <Text className="text-zinc-300 text-sm mb-4">Tell us about your establishment</Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </View>

        <View className="px-6 py-4 gap-4">
          <View>
            <Text className="text-zinc-300 text-sm mb-2">Property type</Text>
            <View className="flex-row flex-wrap gap-2">
              {PROPERTY_TYPES.map((pt) => (
                <TouchableOpacity
                  key={pt.id}
                  onPress={() => updateEmployer({ property_type: pt.id })}
                  className={`px-4 py-3 rounded-xl border flex-row items-center gap-2 ${employer.property_type === pt.id ? 'bg-blue-600 border-blue-500' : 'bg-zinc-800 border-zinc-600'}`}
                  activeOpacity={0.75}
                >
                  <LucideIcon name={pt.icon || 'Home'} size={16} color={employer.property_type === pt.id ? '#FFFFFF' : '#94A3B8'} />
                  <Text className={`text-sm font-medium ${employer.property_type === pt.id ? 'text-white' : 'text-zinc-300'}`}>{pt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-zinc-300 text-sm mb-2">Property name</Text>
            <TextInput
              value={employer.property_name ?? ''}
              onChangeText={(v) => updateEmployer({ property_name: v })}
              placeholder="E.g. The Grand Cafe, Hotel Sunrise"
              placeholderTextColor="#4B5563"
              className="bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3 text-white text-sm"
            />
          </View>

          <OnboardingFooter 
            onBack={() => router.back()}
            onNext={() => router.push('/(employer)/onboarding/location')}
            nextDisabled={!employer.property_type || !employer.property_name}
            color="bg-blue-600"
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
