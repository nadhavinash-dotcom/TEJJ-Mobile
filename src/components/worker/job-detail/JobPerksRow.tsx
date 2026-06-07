import React from 'react';
import { View, Text } from 'react-native';
import { Utensils, Home, Bus, Shirt } from 'lucide-react-native';
import { C } from './colors';

interface Perk {
  key: string;
  label: string;
  detail?: string;
  Icon: React.ComponentType<any>;
  color: string;
  bg: string;
}

interface JobPerksRowProps {
  meals_provided: boolean;
  accommodation_provided: boolean;
  transport_provided: boolean;
  uniform_provided: boolean;
  uniform_details?: string;
}

export function JobPerksRow({
  meals_provided,
  accommodation_provided,
  transport_provided,
  uniform_provided,
  uniform_details,
}: JobPerksRowProps) {
  const perks: Perk[] = [];

  if (meals_provided) {
    perks.push({ key: 'meals', label: 'Meals', Icon: Utensils, color: '#006b5e', bg: '#94f0df40' });
  }
  if (accommodation_provided) {
    perks.push({ key: 'accom', label: 'Accommodation', Icon: Home, color: '#3B82F6', bg: '#3B82F620' });
  }
  if (transport_provided) {
    perks.push({ key: 'transport', label: 'Transport', Icon: Bus, color: '#8B5CF6', bg: '#8B5CF620' });
  }
  if (uniform_provided) {
    perks.push({
      key: 'uniform',
      label: 'Uniform',
      detail: uniform_details || undefined,
      Icon: Shirt,
      color: C.onTertiaryContainer,
      bg: C.tertiaryFixed + '50',
    });
  }

  if (perks.length === 0) return null;

  return (
    <View className="mx-4 mb-4">
      <Text
        className="text-xs font-bold uppercase mb-2"
        style={{ color: C.outline, letterSpacing: 1.5 }}
      >
        Included Perks
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {perks.map(({ key, label, detail, Icon, color, bg }) => (
          <View
            key={key}
            className="flex-row items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ backgroundColor: bg, borderWidth: 1, borderColor: color + '35' }}
          >
            <Icon size={13} color={color} />
            <Text style={{ color, fontSize: 12, fontWeight: '700' }}>
              {label}
              {detail ? (
                <Text style={{ fontWeight: '400', opacity: 0.75 }}>  {detail}</Text>
              ) : null}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
