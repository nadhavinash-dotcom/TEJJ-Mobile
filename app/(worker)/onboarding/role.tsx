import React, { useCallback, useEffect, useRef } from "react";
import { View, Text, ScrollView, Animated } from "react-native";
import { SafeScreen } from "../../../src/components/shared/SafeScreen";
import { router } from "expo-router";
import { SkillGrid } from "../../../src/components/shared/SkillGrid";
import { VoiceMicButton } from "../../../src/components/shared/VoiceMicButton";
import { VoiceSuggestionSheet } from "../../../src/components/shared/VoiceSuggestionSheet";
import { StepIndicator } from "../../../src/components/shared/StepIndicator";
import { OnboardingFooter } from "../../../src/components/shared/OnboardingFooter";
import { useOnboardingStore } from "../../../src/store/onboardingStore";
import { useVoiceStep } from "../../../src/hooks/useVoiceStep";
import { SKILL_LIST } from "@/utils";

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

  const getOptions = useCallback(
    () => SKILL_LIST.map((s) => ({ id: s.id, label: s.labelEn, aliases: [...s.keywords] })),
    [],
  );

  const { handleVoiceResult, match, speechResult, dismiss } = useVoiceStep('role', getOptions);

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="px-6 pt-8 pb-4"
        >
          <StepIndicator currentStep={1} totalSteps={10} />
          <Text className="text-on-surface text-2xl font-bold mb-1">What work do you do?</Text>
          <Text className="text-on-surface-variant text-sm mb-5">
            Select your primary skill — we'll match you with the right jobs
          </Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </Animated.View>

        <SkillGrid
          selected={worker.primary_skill}
          onSelect={(id) => updateWorker({ primary_skill: id })}
        />

        <OnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push("/(worker)/onboarding/sub-skill")}
          nextDisabled={!worker.primary_skill}
          backDisabled={true}
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
