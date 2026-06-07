import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPicker } from '@/src/components/shared/MapPicker';
import { LucideIcon } from '@/src/components/shared/LucideIcon';

interface EditScheduleTabProps {
  draft: any;
  updateDraft: (updates: any) => void;
  detectLocation: () => void;
  detectingLoc: boolean;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SHIFTS = [
  { id: 'morning', label: 'Morning', time: '6am – 12pm', icon: 'Sunrise' },
  { id: 'afternoon', label: 'Afternoon', time: '12pm – 5pm', icon: 'Sun' },
  { id: 'evening', label: 'Evening', time: '5pm – 10pm', icon: 'Sunset' },
  { id: 'night', label: 'Night', time: '10pm – 6am', icon: 'Moon' },
];

export function EditScheduleTab({ draft, updateDraft, detectLocation, detectingLoc }: EditScheduleTabProps) {
  const toggleArrayItem = (field: 'available_days' | 'preferred_shifts', item: string) => {
    const list = draft[field] || [];
    updateDraft({
      [field]: list.includes(item)
        ? list.filter((i: string) => i !== item)
        : [...list, item],
    });
  };

  return (
    <View style={styles.container}>

      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>LOCATION</Text>

        <View style={styles.mapBox}>
          {draft.home_lat ? (
            <MapPicker
              latitude={draft.home_lat}
              longitude={draft.home_lng}
              onLocationChange={(lat, lng) => updateDraft({ home_lat: lat, home_lng: lng })}
            />
          ) : (
            <View style={styles.mapPlaceholder}>
              <LucideIcon name="MapPin" size={28} color="#C6C5D4" />
              <Text style={styles.mapPlaceholderText}>Location not set</Text>
            </View>
          )}
        </View>

        {draft.home_city ? (
          <View style={styles.locationPill}>
            <LucideIcon name="MapPin" size={13} color="#000666" />
            <Text style={styles.locationText}>
              {draft.home_area ? `${draft.home_area}, ` : ''}{draft.home_city}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={detectLocation}
          disabled={detectingLoc}
          style={styles.locationBtn}
          activeOpacity={0.75}
        >
          <LucideIcon name="LocateFixed" size={16} color="#000666" />
          <Text style={styles.locationBtnText}>
            {detectingLoc ? 'Detecting…' : 'Update Location'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Available Days */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>AVAILABLE DAYS</Text>
          <TouchableOpacity
            onPress={() => updateDraft({ available_days: DAYS })}
            activeOpacity={0.7}
          >
            <Text style={styles.selectAll}>Select all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chipRow}>
          {DAYS.map((d) => {
            const sel = (draft.available_days || []).includes(d);
            return (
              <TouchableOpacity
                key={d}
                onPress={() => toggleArrayItem('available_days', d)}
                style={sel ? styles.chipOn : styles.chipOff}
                activeOpacity={0.72}
              >
                <Text style={sel ? styles.chipTextOn : styles.chipTextOff}>{d}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Preferred Shifts */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>PREFERRED SHIFTS</Text>
        <View style={styles.shiftList}>
          {SHIFTS.map((s) => {
            const sel = (draft.preferred_shifts || []).includes(s.id);
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => toggleArrayItem('preferred_shifts', s.id)}
                style={sel ? styles.shiftOn : styles.shiftOff}
                activeOpacity={0.78}
              >
                <View style={sel ? styles.shiftIconOn : styles.shiftIconOff}>
                  <LucideIcon name={s.icon} size={18} color={sel ? '#000666' : '#9CA3AF'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={sel ? styles.shiftLabelOn : styles.shiftLabelOff}>{s.label}</Text>
                  <Text style={styles.shiftTime}>{s.time}</Text>
                </View>
                {sel && (
                  <View style={styles.checkCircle}>
                    <LucideIcon name="Check" size={13} color="#000666" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selectAll: {
    color: '#000666',
    fontSize: 13,
    fontWeight: '600',
  },
  mapBox: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F6F2F8',
    borderWidth: 1,
    borderColor: '#E4E1E7',
    marginBottom: 12,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapPlaceholderText: {
    color: '#C6C5D4',
    fontSize: 14,
    fontWeight: '500',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E0E0FF',
    borderWidth: 1,
    borderColor: '#BDC2FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  locationText: {
    color: '#000666',
    fontSize: 13,
    fontWeight: '600',
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDC2FF',
    borderRadius: 14,
    paddingVertical: 13,
  },
  locationBtnText: {
    color: '#000666',
    fontSize: 14,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
    shadowOpacity: 0.18,
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
  chipTextOn: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  chipTextOff: { color: '#454652', fontWeight: '500', fontSize: 13 },
  shiftList: {
    gap: 10,
  },
  shiftOn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#E0E0FF',
    borderWidth: 1,
    borderColor: '#BDC2FF',
    shadowColor: '#000666',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  shiftOff: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E1E7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  shiftIconOn: {
    backgroundColor: '#FFFFFF',
    padding: 9,
    borderRadius: 10,
  },
  shiftIconOff: {
    backgroundColor: '#F6F2F8',
    padding: 9,
    borderRadius: 10,
  },
  shiftLabelOn: { color: '#000666', fontWeight: '700', fontSize: 14 },
  shiftLabelOff: { color: '#1B1B1F', fontWeight: '500', fontSize: 14 },
  shiftTime: { color: '#9CA3AF', fontSize: 12, marginTop: 1 },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDC2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
