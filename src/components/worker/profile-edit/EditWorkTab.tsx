import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { SkillGrid } from '@/src/components/shared/SkillGrid';
import { SUB_SKILLS_MAP } from '@/utils';

interface EditWorkTabProps {
  draft: any;
  updateDraft: (updates: any) => void;
}

const QUICK_PICKS = [300, 400, 500, 600, 700, 800, 1000, 1200];

export function EditWorkTab({ draft, updateDraft }: EditWorkTabProps) {
  const pay = draft.min_pay_per_shift ?? 500;
  const years = draft.years_experience ?? 0;
  const availableSubSkills = draft.primary_skill ? SUB_SKILLS_MAP[draft.primary_skill] || [] : [];

  return (
    <View className="px-6 py-4 gap-8">
      <View>
        <Text className="text-white text-lg font-bold mb-3">Primary Skill</Text>
        <SkillGrid 
          selected={draft.primary_skill} 
          onSelect={(id) => updateDraft({ primary_skill: id, secondary_skills: [] })} 
        />
      </View>

      <View>
        <Text className="text-white text-lg font-bold mb-3">Sub-Skills / Specialization</Text>
        {availableSubSkills.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {availableSubSkills.map((c) => {
              const sel = (draft.secondary_skills ?? []).includes(c.id);
              return (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => {
                    const current = draft.secondary_skills ?? [];
                    if (current.includes(c.id)) {
                      updateDraft({ secondary_skills: current.filter((s: string) => s !== c.id) });
                    } else {
                      updateDraft({ secondary_skills: [...current, c.id] });
                    }
                  }}
                  className={`px-4 py-2 rounded-xl border ${sel ? 'bg-amber-500 border-amber-500' : 'bg-zinc-800 border-zinc-600'}`}
                  activeOpacity={0.75}
                >
                  <Text className={`text-sm font-medium ${sel ? 'text-white' : 'text-zinc-400'}`}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View className="py-2">
            <Text className="text-zinc-400 text-sm">No sub-skills available for this role.</Text>
          </View>
        )}
      </View>

      <View>
        <Text className="text-white text-lg font-bold mb-1">Years of Experience</Text>
        <Text className="text-amber-400 text-2xl font-bold text-center my-2">{years} Years</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={20}
          step={1}
          value={years}
          onValueChange={(val) => updateDraft({ years_experience: val })}
          minimumTrackTintColor="#F59E0B"
          maximumTrackTintColor="#1E3A8A"
          thumbTintColor="#F59E0B"
        />
      </View>

      <View className="mb-6">
        <Text className="text-white text-lg font-bold mb-1">Minimum Pay / Shift</Text>
        <Text className="text-amber-400 text-2xl font-bold text-center my-2">₹{pay}</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={200}
          maximumValue={2000}
          step={50}
          value={pay}
          onValueChange={(val) => updateDraft({ min_pay_per_shift: val })}
          minimumTrackTintColor="#F59E0B"
          maximumTrackTintColor="#1E3A8A"
          thumbTintColor="#F59E0B"
        />
        
        <Text className="text-zinc-300 text-sm mb-3 mt-4 self-start">Quick select</Text>
        <View className="flex-row flex-wrap gap-2 w-full">
          {QUICK_PICKS.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => updateDraft({ min_pay_per_shift: p })}
              className={`px-4 py-2 rounded-xl border ${pay === p ? 'bg-amber-500 border-amber-500' : 'bg-zinc-800 border-zinc-600'}`}
              activeOpacity={0.75}
            >
              <Text className={`font-medium text-sm ${pay === p ? 'text-white' : 'text-zinc-300'}`}>₹{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
