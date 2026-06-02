import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { SKILL_CATEGORIES, SKILL_LIST } from '@/utils';

export default function SectorScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const opacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 360, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 360, useNativeDriver: true }),
    ]).start();
  }, []);

  const selectSector = (sectorId: string) => {
    // If the current primary skill no longer belongs to the chosen sector, reset it.
    const skill = SKILL_LIST.find((s) => s.id === worker.primary_skill);
    if (skill && skill.category !== sectorId) {
      updateWorker({ sector: sectorId, primary_skill: undefined, sub_skills: [] });
    } else {
      updateWorker({ sector: sectorId });
    }
  };

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="px-6 pt-8 pb-4"
        >
          <StepIndicator currentStep={1} totalSteps={11} />
          <Text className="text-on-surface text-2xl font-bold mb-1">Which industry do you work in?</Text>
          <Text className="text-on-surface-variant text-sm">
            Pick your sector — next we'll narrow down your exact role
          </Text>
        </Animated.View>

        <View className="px-6 pb-2">
          {SKILL_CATEGORIES.map((cat) => {
            const isSelected = worker.sector === cat.id;
            const roleCount = SKILL_LIST.filter((s) => s.category === cat.id).length;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => selectSector(cat.id)}
                activeOpacity={0.75}
                className={`flex-row items-center p-4 rounded-2xl border-2 mb-3 ${isSelected
                  ? 'bg-surface-container-lowest border-primary'
                  : 'bg-surface-container-lowest border-transparent'
                  }`}
                style={!isSelected ? {
                  shadowColor: '#1b1b1f',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  elevation: 2,
                } : undefined}
              >
                <View className={`p-3 rounded-xl mr-4 ${isSelected ? 'bg-primary' : 'bg-gray-100'}`}>
                  <LucideIcon name={cat.icon} size={22} color={isSelected ? '#FFFFFF' : '#000666'} />
                </View>
                <View className="flex-1">
                  <Text className={`text-base font-bold mb-0.5 ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                    {cat.label}
                  </Text>
                  <Text className="text-xs text-gray-500">{cat.description} · {roleCount} roles</Text>
                </View>
                {isSelected && <LucideIcon name="CheckCircle" size={20} color="#000666" />}
              </TouchableOpacity>
            );
          })}
        </View>

        <OnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/(worker)/onboarding/role')}
          nextDisabled={!worker.sector}
          backDisabled={true}
        />
      </ScrollView>
    </SafeScreen>
  );
}
