// Skills section of the Worker Profile screen
import React from 'react';
import { View, Text } from 'react-native';
import { ProfileColors as C } from './ProfileColors';
import { SectionCard, SkillChip } from './ProfilePrimitives';

interface ProfileSkillsSectionProps {
  primarySkill: string | null;
  secondarySkills: string[];
}

export function ProfileSkillsSection({ primarySkill, secondarySkills }: ProfileSkillsSectionProps) {
  if (!primarySkill && secondarySkills.length === 0) return null;

  return (
    <SectionCard title="Skills">
      <View className="flex-row flex-wrap pt-1">
        {primarySkill && (
          <View className="px-3 py-1.5 rounded-full mr-2 mb-2"
            style={{ backgroundColor: C.primary }}>
            <Text className="text-xs font-bold" style={{ color: C.onPrimary }}>{primarySkill}</Text>
          </View>
        )}
        {secondarySkills.map((s) => <SkillChip key={s} label={s} />)}
      </View>
    </SectionCard>
  );
}
