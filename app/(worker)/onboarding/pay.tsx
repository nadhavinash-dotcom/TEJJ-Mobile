import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { mapVoiceToPay } from '@/utils';

const QUICK_PICKS = [300, 400, 500, 600, 700, 800, 1000, 1200];

export default function PayScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const pay = worker.min_pay_per_shift ?? 500;

  const handleVoiceResult = useCallback(({ englishText, structured }: { englishText: string; keywords: string[]; originalText: string; structured: Record<string, unknown> }): boolean => {
    const amount = (structured.min_pay_per_shift as number | undefined) ?? mapVoiceToPay(englishText);
    if (amount) { updateWorker({ min_pay_per_shift: amount }); return true; }
    return false;
  }, [updateWorker]);

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8">
          <StepIndicator currentStep={7} totalSteps={10} />
          <Text className="text-white text-2xl font-bold mb-1">What is your minimum pay?</Text>
          <Text className="text-zinc-300 text-sm mb-4">What is your minimum pay per shift?</Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </View>

        <View className="px-6 py-6 items-center">
          <Text className="text-zinc-400 text-sm mb-1">Minimum per shift</Text>
          <Text className="text-amber-400 text-5xl font-bold mb-1">₹{pay.toLocaleString('en-IN')}</Text>
          <Text className="text-zinc-400 text-sm mb-8">≈ ₹{(pay * 26).toLocaleString('en-IN')} / month (26 shifts)</Text>

          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={200}
            maximumValue={2000}
            step={50}
            value={pay}
            onValueChange={(v) => updateWorker({ min_pay_per_shift: v })}
            minimumTrackTintColor="#F59E0B"
            maximumTrackTintColor="#374151"
            thumbTintColor="#F59E0B"
          />
          <View className="flex-row justify-between w-full mt-1 mb-6">
            <Text className="text-zinc-400 text-xs">₹200</Text>
            <Text className="text-zinc-400 text-xs">₹2,000</Text>
          </View>

          <Text className="text-zinc-300 text-sm mb-3 self-start">Quick select</Text>
          <View className="flex-row flex-wrap gap-2 w-full">
            {QUICK_PICKS.map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => updateWorker({ min_pay_per_shift: p })}
                className={`px-4 py-2 rounded-xl border ${pay === p ? 'bg-amber-500 border-amber-500' : 'bg-zinc-800 border-zinc-600'}`}
                activeOpacity={0.75}
              >
                <Text className={`font-medium text-sm ${pay === p ? 'text-white' : 'text-zinc-300'}`}>₹{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <OnboardingFooter 
          onBack={() => router.back()}
          onNext={() => router.push('/(worker)/onboarding/video')}
        />
      </ScrollView>
    </SafeScreen>
  );
}
