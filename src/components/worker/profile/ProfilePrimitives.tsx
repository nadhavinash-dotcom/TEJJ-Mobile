// Reusable UI primitives for the Worker Profile screen
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { ProfileColors as C } from './ProfileColors';

// ── StatPill ─────────────────────────────────────────────────────────────────

interface StatPillProps {
  value: string;
  label: string;
  color: string;
  bg: string;
}

export function StatPill({ value, label, color, bg }: StatPillProps) {
  return (
    <View
      className="flex-1 items-center justify-center rounded-2xl py-3 px-2"
      style={{ backgroundColor: bg }}
    >
      <Text className="text-lg font-bold" style={{ color }}>{value}</Text>
      <Text className="text-[10px] font-semibold uppercase tracking-wide mt-0.5" style={{ color, opacity: 0.65 }}>
        {label}
      </Text>
    </View>
  );
}

// ── InfoRow ──────────────────────────────────────────────────────────────────

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}

export function InfoRow({ icon, label, value, color }: InfoRowProps) {
  return (
    <View className="flex-row items-center gap-3 py-2.5">
      <View className="w-7 h-7 items-center justify-center rounded-lg" style={{ backgroundColor: C.surfaceContainer }}>
        {icon}
      </View>
      <Text className="text-xs flex-1" style={{ color: C.outline }}>{label}</Text>
      <Text className="text-sm font-semibold text-right flex-shrink-0 max-w-[55%]" style={{ color: color ?? C.onSurface }}>
        {value}
      </Text>
    </View>
  );
}

// ── SectionCard ──────────────────────────────────────────────────────────────

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <View className="mx-4 mb-3 rounded-2xl overflow-hidden" style={{ backgroundColor: C.surface }}>
      <Text
        className="text-[10px] font-bold uppercase px-4 pt-4 pb-2"
        style={{ color: C.outline, letterSpacing: 1.4 }}
      >
        {title}
      </Text>
      <View className="px-4 pb-3">{children}</View>
    </View>
  );
}

// ── SkillChip ────────────────────────────────────────────────────────────────

export function SkillChip({ label }: { label: string }) {
  return (
    <View className="px-3 py-1.5 rounded-full mr-2 mb-2" style={{ backgroundColor: C.primaryMuted }}>
      <Text className="text-xs font-semibold" style={{ color: C.primary }}>{label}</Text>
    </View>
  );
}

// ── MenuItem ─────────────────────────────────────────────────────────────────

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onPress: () => void;
  accent?: string;
  isLast?: boolean;
}

export function MenuItem({ icon, label, description, onPress, accent, isLast }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center justify-between px-4 py-3.5"
      style={{ borderBottomWidth: isLast ? 0 : 1, borderBottomColor: C.surfaceContainer }}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View className="w-9 h-9 rounded-xl items-center justify-center" style={{ backgroundColor: accent ?? C.surfaceContainerHigh }}>
          {icon}
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-[15px]" style={{ color: C.onSurface }}>{label}</Text>
          {description && (
            <Text className="text-xs mt-0.5" style={{ color: C.outline }}>{description}</Text>
          )}
        </View>
      </View>
      <ChevronRight size={16} color={C.outline} />
    </TouchableOpacity>
  );
}
