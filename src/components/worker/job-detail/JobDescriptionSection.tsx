import React from 'react';
import { View, Text } from 'react-native';
import { Info } from 'lucide-react-native';
import { C } from './colors';

interface JobDescriptionSectionProps {
  description?: string;
  secondary_skills_preferred?: string[];
  cuisine_preferred?: string[];
  special_instructions?: string;
}

function TagChip({ label }: { label: string }) {
  return (
    <View
      className="px-2.5 py-1 rounded-lg"
      style={{ backgroundColor: C.surfaceContainerHigh, borderWidth: 1, borderColor: C.outlineVariant }}
    >
      <Text style={{ color: C.onSurfaceVariant, fontSize: 12, fontWeight: '500' }}>{label}</Text>
    </View>
  );
}

export function JobDescriptionSection({
  description,
  secondary_skills_preferred,
  cuisine_preferred,
  special_instructions,
}: JobDescriptionSectionProps) {
  const hasDescription = description && description.trim().length > 0;
  const hasSkills = secondary_skills_preferred && secondary_skills_preferred.length > 0;
  const hasCuisine = cuisine_preferred && cuisine_preferred.length > 0;
  const hasInstructions = special_instructions && special_instructions.trim().length > 0;

  if (!hasDescription && !hasSkills && !hasCuisine && !hasInstructions) return null;

  return (
    <View
      className="mx-4 rounded-2xl p-4 mb-4"
      style={{
        backgroundColor: C.surfaceContainerLowest,
        borderWidth: 1,
        borderColor: C.outlineVariant,
        gap: 14,
      }}
    >
      {hasDescription && (
        <View>
          <Text className="text-xs font-bold uppercase mb-2" style={{ color: C.outline, letterSpacing: 1.5 }}>
            Job Description
          </Text>
          <Text style={{ color: C.onSurface, fontSize: 13.5, lineHeight: 21 }}>{description}</Text>
        </View>
      )}

      {(hasSkills || hasCuisine) && (
        <View>
          <Text className="text-xs font-bold uppercase mb-2" style={{ color: C.outline, letterSpacing: 1.5 }}>
            {hasCuisine ? 'Cuisine & Skills' : 'Preferred Skills'}
          </Text>
          <View className="flex-row flex-wrap gap-1.5">
            {hasCuisine && cuisine_preferred!.map(c => <TagChip key={c} label={c} />)}
            {hasSkills && secondary_skills_preferred!.map(s => <TagChip key={s} label={s} />)}
          </View>
        </View>
      )}

      {hasInstructions && (
        <View
          className="flex-row gap-2 p-3 rounded-xl"
          style={{ backgroundColor: C.tertiaryFixed + '60', borderWidth: 1, borderColor: C.onTertiaryContainer + '30' }}
        >
          <Info size={14} color={C.onTertiaryContainer} style={{ marginTop: 1 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.onTertiaryContainer, fontSize: 11, fontWeight: '700', marginBottom: 2 }}>
              Special Instructions
            </Text>
            <Text style={{ color: C.onSurface, fontSize: 13, lineHeight: 19 }}>{special_instructions}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
