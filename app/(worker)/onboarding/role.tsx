import React, { useCallback, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
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

  const getOptions = useCallback(
    () => SKILL_LIST.map((s) => ({ id: s.id, label: s.labelEn, aliases: [...s.keywords] })),
    [],
  );

  const { handleVoiceResult, match, speechResult, dismiss } = useVoiceStep('role', getOptions);

  // Log whenever match state changes
  useEffect(() => {
    console.log('[RoleScreen] match state changed:', JSON.stringify(match));
  }, [match]);

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 pb-4">
          <StepIndicator currentStep={1} totalSteps={10} />
          <Text className="text-white text-2xl font-bold mb-1">What work do you do?</Text>
          <Text className="text-white text-sm mb-4">What is your primary skills?</Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </View>

        <SkillGrid
          selected={worker.primary_skill}
          onSelect={(id) => {
            console.log('[RoleScreen] SkillGrid manual select:', id);
            updateWorker({ primary_skill: id });
          }}
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
          console.log('[RoleScreen] VoiceSuggestionSheet confirmed:', JSON.stringify(selected));
          if (selected[0]) updateWorker({ primary_skill: selected[0].id });
          dismiss();
        }}
        onClose={() => {
          console.log('[RoleScreen] VoiceSuggestionSheet closed/cancelled');
          dismiss();
        }}
      />
    </SafeScreen>
  );
}
