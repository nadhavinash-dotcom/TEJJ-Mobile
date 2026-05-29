import React, { useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeScreen } from "../../../src/components/shared/SafeScreen";
import { router } from "expo-router";
import { SkillGrid } from "../../../src/components/shared/SkillGrid";
import { VoiceMicButton } from "../../../src/components/shared/VoiceMicButton";
import { StepIndicator } from "../../../src/components/shared/StepIndicator";
import { OnboardingFooter } from "../../../src/components/shared/OnboardingFooter";
import { useOnboardingStore } from "../../../src/store/onboardingStore";
import { SKILL_LIST } from "@/utils";

export default function RoleScreen() {
  const { worker, updateWorker } = useOnboardingStore();

  const handleVoiceResult = useCallback(
    ({
      keywords,
      structured,
    }: {
      keywords: string[];
      englishText: string;
      originalText: string;
      structured: Record<string, unknown>;
    }): boolean => {
      // structured.primary_skill is set by mapVoiceToSkill on the backend (most reliable)
      console.log({ keywords, structured });
      const directId = structured.primary_skill as string | undefined;
      if (directId) {
        const direct = SKILL_LIST.find((s: any) => s.id === directId);
        if (direct) {
          updateWorker({ primary_skill: direct.id });
          return true;
        }
      }
      // Fallback: keywords contains skill IDs from extractKeywords
      const byKeyword = SKILL_LIST.find((s: any) => keywords.includes(s.id));
      if (byKeyword) {
        updateWorker({ primary_skill: byKeyword.id });
        return true;
      }
      return false;
    },
    [updateWorker],
  );

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 pb-4">
          <StepIndicator currentStep={1} totalSteps={10} />
          <Text className="text-white text-2xl font-bold mb-1">
            What work do you do?
          </Text>
          <Text className="text-white text-sm mb-4">
            What is your primary skill?
          </Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </View>

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
    </SafeScreen>
  );
}
