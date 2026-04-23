import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { PROPERTY_TYPES } from '@/utils';

export default function PropertyScreen() {
  const { employer, updateEmployer } = useOnboardingStore();

  const handleVoiceResult = ({ englishText }: { englishText: string; keywords: string[]; originalText: string; structured: Record<string, unknown> }) => {
    const match = PROPERTY_TYPES.find((p) => englishText.toLowerCase().includes(p.id.toLowerCase()) || englishText.toLowerCase().includes(p.labelEn?.toLowerCase() ?? ''));
    if (match) updateEmployer({ property_type: match.id });
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8">
          <Text className="text-navy-400 text-sm mb-1">Step 1 of 5</Text>
          <Text className="text-white text-2xl font-bold mb-1">Property Details</Text>
          <Text className="text-navy-300 text-sm mb-4">Tell us about your establishment</Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </View>

        <View className="px-6 py-4 gap-4">
          <View>
            <Text className="text-navy-300 text-sm mb-2">Property type</Text>
            <View className="flex-row flex-wrap gap-2">
              {PROPERTY_TYPES.map((pt) => (
                <TouchableOpacity
                  key={pt.id}
                  onPress={() => updateEmployer({ property_type: pt.id })}
                  className={`px-4 py-2 rounded-xl border ${employer.property_type === pt.id ? 'bg-blue-500/20 border-blue-400' : 'bg-navy-800 border-navy-600'}`}
                  activeOpacity={0.75}
                >
                  <Text className={`text-sm font-medium ${employer.property_type === pt.id ? 'text-blue-300' : 'text-navy-300'}`}>{pt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-navy-300 text-sm mb-2">Property name</Text>
            <TextInput
              value={employer.property_name ?? ''}
              onChangeText={(v) => updateEmployer({ property_name: v })}
              placeholder="E.g. The Grand Cafe, Hotel Sunrise"
              placeholderTextColor="#4B5563"
              className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 text-white text-sm"
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(employer)/onboarding/location')}
            disabled={!employer.property_type || !employer.property_name}
            className={`rounded-2xl py-4 items-center mt-2 ${employer.property_type && employer.property_name ? 'bg-blue-600' : 'bg-navy-700'}`}
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">Next →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
