import React from 'react';
import { ScrollView, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { SKILL_CATEGORIES, SKILL_LIST } from '@/utils';
import { LucideIcon } from './LucideIcon';

interface CategorySelectorProps {
  selected?: string;
  onSelect: (id: string) => void;
  /** Dark background variant (employer form). Default: light. */
  dark?: boolean;
}

export function CategorySelector({ selected, onSelect, dark = false }: CategorySelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {SKILL_CATEGORIES.map((cat) => {
        const isSelected = selected === cat.id;
        const roleCount = SKILL_LIST.filter((s) => s.category === cat.id).length;

        const chipStyle = [
          styles.chip,
          isSelected
            ? styles.chipSelected
            : dark
            ? styles.chipDarkUnselected
            : styles.chipLightUnselected,
        ];

        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.75}
            style={chipStyle}
          >
            <LucideIcon
              name={cat.icon}
              size={14}
              color={isSelected ? '#FFFFFF' : dark ? '#9CA3AF' : '#64748B'}
            />
            <Text style={[styles.chipLabel, isSelected ? styles.chipLabelSelected : dark ? styles.chipLabelDark : styles.chipLabelLight]}>
              {cat.label}
            </Text>
            <View style={[styles.badge, isSelected ? styles.badgeSelected : dark ? styles.badgeDark : styles.badgeLight]}>
              <Text style={[styles.badgeText, isSelected ? styles.badgeTextSelected : dark ? styles.badgeTextDark : styles.badgeTextLight]}>
                {roleCount}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 2,
  },
  chipSelected: {
    backgroundColor: '#000666',
    borderColor: '#000666',
    shadowColor: '#000666',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  chipLightUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C6C5D4',
  },
  chipDarkUnselected: {
    backgroundColor: '#27272A',
    borderColor: '#3F3F46',
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipLabelSelected: { color: '#FFFFFF' },
  chipLabelLight: { color: '#454652' },
  chipLabelDark: { color: '#9CA3AF' },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeSelected: { backgroundColor: 'rgba(255,255,255,0.25)' },
  badgeLight: { backgroundColor: '#F6F2F8' },
  badgeDark: { backgroundColor: '#3F3F46' },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  badgeTextSelected: { color: '#FFFFFF' },
  badgeTextLight: { color: '#9CA3AF' },
  badgeTextDark: { color: '#71717A' },
});
