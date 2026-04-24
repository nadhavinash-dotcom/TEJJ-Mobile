import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SHIFTS = [
  { id: 'morning', label: 'Morning', time: '6am–12pm', icon: 'Sunrise' },
  { id: 'afternoon', label: 'Afternoon', time: '12pm–5pm', icon: 'Sun' },
  { id: 'evening', label: 'Evening', time: '5pm–10pm', icon: 'Sunset' },
  { id: 'night', label: 'Night', time: '10pm–6am', icon: 'Moon' },
];

export default function AvailabilityScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const days = worker.available_days ?? [];
  const shifts = worker.preferred_shifts ?? [];

  const toggleDay = (d: string) => {
    updateWorker({ available_days: days.includes(d) ? days.filter((x) => x !== d) : [...days, d] });
  };
  const toggleShift = (s: string) => {
    updateWorker({ preferred_shifts: shifts.includes(s) ? shifts.filter((x) => x !== s) : [...shifts, s] });
  };

  const handleVoiceResult = ({ keywords }: { keywords: string[] }) => {
    const matchedDays = DAYS.filter((d) => keywords.some((k) => k.toLowerCase().includes(d.toLowerCase())));
    if (matchedDays.length) updateWorker({ available_days: matchedDays });
  };

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8">
          <StepIndicator currentStep={6} totalSteps={10} />
          <Text className="text-white text-2xl font-bold mb-1">When are you available?</Text>
          <Text className="text-navy-300 text-sm mb-4">Which days and shifts can you work?</Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </View>

        <View className="px-6 py-4">
          <Text className="text-white font-semibold mb-3">Days</Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {DAYS.map((d) => {
              const sel = days.includes(d);
              return (
                <TouchableOpacity
                  key={d}
                  onPress={() => toggleDay(d)}
                  className={`px-4 py-2 rounded-xl border ${sel ? 'bg-amber-500 border-amber-500' : 'bg-navy-800 border-navy-600'}`}
                  activeOpacity={0.75}
                >
                  <Text className={`font-medium ${sel ? 'text-white' : 'text-navy-300'}`}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity onPress={() => updateWorker({ available_days: DAYS })} className="mb-6">
            <Text className="text-amber-400 text-sm">Select all days</Text>
          </TouchableOpacity>

          <Text className="text-white font-semibold mb-3">Preferred Shifts</Text>
          <View className="gap-2 mb-8">
            {SHIFTS.map((s) => {
              const sel = shifts.includes(s.id);
              return (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => toggleShift(s.id)}
                  className={`flex-row items-center justify-between px-4 py-3 rounded-xl border ${sel ? 'bg-amber-500/20 border-amber-500' : 'bg-navy-800 border-navy-600'}`}
                  activeOpacity={0.75}
                >
                  <View className="flex-row items-center gap-3">
                    <LucideIcon name={s.icon} size={20} color={sel ? '#F59E0B' : '#94A3B8'} />
                    <View>
                      <Text className={`font-semibold ${sel ? 'text-amber-400' : 'text-white'}`}>{s.label}</Text>
                      <Text className="text-navy-400 text-xs">{s.time}</Text>
                    </View>
                  </View>
                  {sel && <LucideIcon name="Check" size={18} color="#F59E0B" />}
                </TouchableOpacity>
              );
            })}
          </View>

          <OnboardingFooter 
            onBack={() => router.back()}
            onNext={() => router.push('/(worker)/onboarding/pay')}
            nextDisabled={days.length === 0 || shifts.length === 0}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
