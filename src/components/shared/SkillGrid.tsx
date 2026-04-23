import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SKILL_LIST } from '@/utils';

interface SkillGridProps {
  selected?: string;
  onSelect: (skillId: string) => void;
  multiSelect?: boolean;
  selectedList?: string[];
  onMultiSelect?: (skills: string[]) => void;
}

export function SkillGrid({ selected, onSelect, multiSelect, selectedList = [], onMultiSelect }: SkillGridProps) {
  const handlePress = (id: string) => {
    if (multiSelect && onMultiSelect) {
      if (selectedList.includes(id)) {
        onMultiSelect(selectedList.filter((s) => s !== id));
      } else {
        onMultiSelect([...selectedList, id]);
      }
    } else {
      onSelect(id);
    }
  };

  return (
    <View className="flex-row flex-wrap gap-2 px-4">
      {SKILL_LIST.map((skill) => {
        const isSelected = multiSelect ? selectedList.includes(skill.id) : selected === skill.id;
        return (
          <TouchableOpacity
            key={skill.id}
            onPress={() => handlePress(skill.id)}
            className={`items-center justify-center rounded-2xl border w-[22%] py-3 ${isSelected
              ? 'bg-amber-500 border-amber-500'
              : 'bg-navy-800 border-navy-600'
              }`}
            activeOpacity={0.7}
          >
            <Text className="text-2xl mb-1">{skill.icon}</Text>
            <Text className={`text-xs text-center font-medium ${isSelected ? 'text-white' : 'text-navy-200'}`} numberOfLines={1}>
              {skill.label}
            </Text>
            {isSelected && <Text className="text-white text-xs absolute top-1 right-1">✓</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
