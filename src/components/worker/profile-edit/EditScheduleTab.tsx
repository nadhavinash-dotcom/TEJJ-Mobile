import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
  { id: 'morning', label: 'Morning', time: '6am–12pm', icon: 'Sunrise' },
  { id: 'afternoon', label: 'Afternoon', time: '12pm–5pm', icon: 'Sun' },
  { id: 'evening', label: 'Evening', time: '5pm–10pm', icon: 'Sunset' },
  { id: 'night', label: 'Night', time: '10pm–6am', icon: 'Moon' },
];

export function EditScheduleTab({ draft, updateDraft, detectLocation, detectingLoc }: EditScheduleTabProps) {
  const toggleArrayItem = (field: 'available_days' | 'preferred_shifts', item: string) => {
    const list = draft[field] || [];
    if (list.includes(item)) {
      updateDraft({ [field]: list.filter((i: string) => i !== item) });
    } else {
      updateDraft({ [field]: [...list, item] });
    }
  };

  return (
    <View className="px-6 py-4 gap-8 mb-6">
      <View>
        <Text className="text-white text-lg font-bold mb-3">Location</Text>
        <View className="h-48 rounded-2xl overflow-hidden bg-zinc-800 mb-4">
          {draft.home_lat ? (
            <MapPicker 
              latitude={draft.home_lat} 
              longitude={draft.home_lng} 
              onLocationChange={(lat, lng) => updateDraft({ home_lat: lat, home_lng: lng })} 
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-zinc-400">Location not set</Text>
            </View>
          )}
        </View>
        {draft.home_city && (
          <Text className="text-white mb-4">📍 {draft.home_area ? draft.home_area + ', ' : ''}{draft.home_city}</Text>
        )}
        <TouchableOpacity 
          onPress={detectLocation} 
          disabled={detectingLoc} 
          className="bg-zinc-800 border border-amber-500/40 rounded-xl py-3 items-center"
        >
          <Text className="text-amber-400 font-semibold">{detectingLoc ? 'Detecting...' : 'Update Location'}</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text className="text-white text-lg font-bold mb-3">Available Days</Text>
        <View className="flex-row flex-wrap gap-2">
          {DAYS.map((d) => {
            const active = (draft.available_days || []).includes(d);
            return (
              <TouchableOpacity
                key={d}
                onPress={() => toggleArrayItem('available_days', d)}
                className={`px-4 py-2 rounded-xl border ${active ? 'bg-amber-500 border-amber-400' : 'bg-zinc-800 border-zinc-600'}`}
              >
                <Text className={`font-medium ${active ? 'text-white' : 'text-zinc-300'}`}>{d}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View>
        <Text className="text-white text-lg font-bold mb-3">Preferred Shifts</Text>
        <View className="gap-2 mb-2">
          {SHIFTS.map((s) => {
            const active = (draft.preferred_shifts || []).includes(s.id);
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => toggleArrayItem('preferred_shifts', s.id)}
                className={`flex-row items-center justify-between px-4 py-3 rounded-xl border ${active ? 'bg-amber-500/20 border-amber-500' : 'bg-zinc-800 border-zinc-600'}`}
                activeOpacity={0.75}
              >
                <View className="flex-row items-center gap-3">
                  <LucideIcon name={s.icon} size={20} color={active ? '#F59E0B' : '#94A3B8'} />
                  <View>
                    <Text className={`font-semibold ${active ? 'text-amber-400' : 'text-white'}`}>{s.label}</Text>
                    <Text className="text-zinc-400 text-xs">{s.time}</Text>
                  </View>
                </View>
                {active && <LucideIcon name="Check" size={18} color="#F59E0B" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
