import React, { useCallback, useEffect, useRef } from "react";
import { View, Text, ScrollView, Animated } from "react-native";
import { SafeScreen } from "../../../src/components/shared/SafeScreen";
import { router } from "expo-router";
import { SkillGrid } from "../../../src/components/shared/SkillGrid";
import { VoiceMicButton } from "../../../src/components/shared/VoiceMicButton";
import { VoiceSuggestionSheet } from "../../../src/components/shared/VoiceSuggestionSheet";
import { StepIndicator } from "../../../src/components/shared/StepIndicator";
import { OnboardingFooter } from "../../../src/components/shared/OnboardingFooter";
import { LucideIcon } from "../../../src/components/shared/LucideIcon";
import { useOnboardingStore } from "../../../src/store/onboardingStore";
import { useVoiceStep } from "../../../src/hooks/useVoiceStep";
import { SKILL_LIST, SKILL_CATEGORIES } from "@/utils";

export default function RoleScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const opacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 360, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 360, useNativeDriver: true }),
    ]).start();
  }, []);

  const sector = SKILL_CATEGORIES.find((c) => c.id === worker.sector);

  // Voice matching is limited to roles inside the chosen sector (all roles if none).
  const getOptions = useCallback(
    () =>
      SKILL_LIST.filter((s) => !worker.sector || s.category === worker.sector).map((s) => ({
        id: s.id,
        label: s.labelEn,
        aliases: [...s.keywords],
      })),
    [worker.sector],
  );

  const { handleVoiceResult, match, speechResult, dismiss } = useVoiceStep('role', getOptions);

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="px-6 pt-8 pb-4"
        >
          <StepIndicator currentStep={2} totalSteps={11} />
          <Text className="text-on-surface text-2xl font-bold mb-1">What work do you do?</Text>
          <Text className="text-on-surface-variant text-sm mb-3">
            Select your primary role — we'll match you with the right jobs
          </Text>

          {sector && (
            <View className="flex-row items-center self-start gap-2 bg-surface-container-high rounded-full px-3 py-1.5 mb-1">
              <LucideIcon name={sector.icon} size={14} color="#000666" />
              <Text className="text-primary text-xs font-semibold">{sector.label}</Text>
              <Text className="text-on-surface-variant text-xs"> · change</Text>
            </View>
          )}

          <View className="mt-3">
            <VoiceMicButton onResult={handleVoiceResult} />
          </View>
        </Animated.View>

        <SkillGrid
          category={worker.sector}
          grouped={!worker.sector}
          selected={worker.primary_skill}
          onSelect={(id) => updateWorker({ primary_skill: id })}
        />

        <OnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push("/(worker)/onboarding/sub-skill")}
          nextDisabled={!worker.primary_skill}
        />
      </ScrollView>

      <VoiceSuggestionSheet
        match={match}
        speechResult={speechResult}
        multiSelect={false}
        onConfirm={(selected) => {
          if (selected[0]) updateWorker({ primary_skill: selected[0].id });
          dismiss();
        }}
        onClose={dismiss}
      />
    </SafeScreen>
  );
}
