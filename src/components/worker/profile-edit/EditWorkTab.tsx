import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { SkillGrid } from '@/src/components/shared/SkillGrid';
import { CategorySelector } from '@/src/components/shared/CategorySelector';
import { SKILL_LIST, SUB_SKILLS_MAP } from '@/utils';

interface EditWorkTabProps {
  draft: any;
  updateDraft: (updates: any) => void;
}

const QUICK_PICKS = [300, 400, 500, 600, 700, 800, 1000, 1200];

export function EditWorkTab({ draft, updateDraft }: EditWorkTabProps) {
  const pay = draft.min_pay_per_shift ?? 500;
  const years = draft.years_experience ?? 0;

  const derivedSector = draft.primary_skill
    ? SKILL_LIST.find((s) => s.id === draft.primary_skill)?.category
    : undefined;
  const [selectedSector, setSelectedSector] = useState<string | undefined>(derivedSector);

  const availableSubSkills = draft.primary_skill ? SUB_SKILLS_MAP[draft.primary_skill] || [] : [];

  const handleSectorChange = (sectorId: string) => {
    setSelectedSector(sectorId);
    const skill = SKILL_LIST.find((s) => s.id === draft.primary_skill);
    if (skill && skill.category !== sectorId) {
      updateDraft({ primary_skill: undefined, secondary_skills: [] });
    }
  };

  const subSkillsPrompt = !selectedSector
    ? 'Pick a sector first.'
    : !draft.primary_skill
    ? 'Pick a role to see specialisations.'
    : null;

  return (
    <View style={styles.container}>

      {/* Sector */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SECTOR</Text>
        <Text style={styles.sectionHint}>Filter by department to narrow the skill list</Text>
        <CategorySelector selected={selectedSector} onSelect={handleSectorChange} />
      </View>

      {/* Primary Skill */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>PRIMARY SKILL</Text>
        {selectedSector && (
          <Text style={styles.sectionHint}>Showing roles in selected sector</Text>
        )}
        <SkillGrid
          category={selectedSector}
          grouped={!selectedSector}
          selected={draft.primary_skill}
          onSelect={(id) => updateDraft({ primary_skill: id, secondary_skills: [] })}
        />
      </View>

      {/* Sub-Skills */}
      <View style={[styles.section, styles.paddedSection]}>
        <Text style={styles.sectionLabel}>SPECIALISATION</Text>
        {subSkillsPrompt ? (
          <Text style={styles.emptyHint}>{subSkillsPrompt}</Text>
        ) : availableSubSkills.length > 0 ? (
          <View style={styles.chipRow}>
            {availableSubSkills.map((c) => {
              const sel = (draft.secondary_skills ?? []).includes(c.id);
              return (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => {
                    const current = draft.secondary_skills ?? [];
                    updateDraft({
                      secondary_skills: current.includes(c.id)
                        ? current.filter((s: string) => s !== c.id)
                        : [...current, c.id],
                    });
                  }}
                  style={sel ? styles.chipOn : styles.chipOff}
                  activeOpacity={0.72}
                >
                  <Text style={sel ? styles.chipTextOn : styles.chipTextOff}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyHint}>No sub-skills for this role.</Text>
        )}
      </View>

      {/* Experience */}
      <View style={[styles.section, styles.paddedSection]}>
        <Text style={styles.sectionLabel}>EXPERIENCE</Text>
        <View style={styles.heroCard}>
          <Text style={styles.heroNum}>{years}</Text>
          <Text style={styles.heroUnit}>{years === 1 ? 'year' : 'years'}</Text>
        </View>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={20}
          step={1}
          value={years}
          onValueChange={(val) => updateDraft({ years_experience: val })}
          minimumTrackTintColor="#000666"
          maximumTrackTintColor="#E4E1E7"
          thumbTintColor="#000666"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>Fresher</Text>
          <Text style={styles.sliderLabel}>20+ years</Text>
        </View>
      </View>

      {/* Min Pay */}
      <View style={[styles.section, styles.paddedSection, { marginBottom: 8 }]}>
        <Text style={styles.sectionLabel}>MINIMUM PAY / SHIFT</Text>
        <View style={styles.payCard}>
          <Text style={styles.paySymbol}>₹</Text>
          <Text style={styles.payAmount}>{pay}</Text>
          <Text style={styles.payPer}>per shift</Text>
        </View>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={200}
          maximumValue={2000}
          step={50}
          value={pay}
          onValueChange={(val) => updateDraft({ min_pay_per_shift: val })}
          minimumTrackTintColor="#000666"
          maximumTrackTintColor="#E4E1E7"
          thumbTintColor="#000666"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>₹200</Text>
          <Text style={styles.sliderLabel}>₹2,000</Text>
        </View>
        <Text style={styles.quickLabel}>QUICK SELECT</Text>
        <View style={styles.chipRow}>
          {QUICK_PICKS.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => updateDraft({ min_pay_per_shift: p })}
              style={pay === p ? styles.chipOn : styles.chipOff}
              activeOpacity={0.72}
            >
              <Text style={pay === p ? styles.chipTextOn : styles.chipTextOff}>₹{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  section: {
    marginBottom: 28,
  },
  paddedSection: {
    paddingHorizontal: 20,
  },
  sectionLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
    paddingHorizontal: 20,
  },
  sectionHint: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  emptyHint: {
    color: '#9CA3AF',
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chipOn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#000666',
    borderWidth: 1,
    borderColor: '#000666',
    shadowColor: '#000666',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  chipOff: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C6C5D4',
  },
  chipTextOn: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  chipTextOff: { color: '#454652', fontSize: 13, fontWeight: '500' },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#E0E0FF',
    borderWidth: 1,
    borderColor: '#BDC2FF',
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 12,
    gap: 6,
    shadowColor: '#000666',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  heroNum: {
    color: '#000666',
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 60,
  },
  heroUnit: {
    color: '#343D96',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  payCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#E0E0FF',
    borderWidth: 1,
    borderColor: '#BDC2FF',
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 12,
    gap: 4,
    shadowColor: '#000666',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  paySymbol: {
    color: '#343D96',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  payAmount: {
    color: '#000666',
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 60,
  },
  payPer: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
    marginBottom: 16,
  },
  sliderLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '500',
  },
  quickLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 4,
  },
});
