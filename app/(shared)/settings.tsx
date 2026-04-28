import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { LANGUAGES } from '@/utils';
import { ChevronLeft, ChevronRight, Languages, HardHat, Hotel, CreditCard } from 'lucide-react-native';

const C = {
  primary: '#000666',
  primaryFixed: '#e0e0ff',
  background: '#fbf8fe',
  surface: '#fbf8fe',
  surfaceContainerLow: '#f6f2f8',
  surfaceContainerLowest: '#ffffff',
  surfaceContainer: '#f0edf2',
  surfaceContainerHigh: '#eae7ed',
  onSurface: '#1b1b1f',
  onSurfaceVariant: '#454652',
  outline: '#767683',
  outlineVariant: '#c6c5d4',
  amber: '#F59E0B',
};

type SectionRowProps = {
  label: string;
  description?: string;
  onPress: () => void;
  iconBg: string;
  icon: React.ReactNode;
  isLast?: boolean;
};

function SectionRow({ label, description, onPress, icon, iconBg, isLast }: SectionRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center justify-between px-4 py-3.5"
      style={{ borderBottomWidth: isLast ? 0 : 1, borderBottomColor: C.surfaceContainer }}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View
          className="w-9 h-9 rounded-xl items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
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

export default function SettingsScreen() {
  const { language, setLanguage, activeRole, setActiveRole, hasWorker, hasEmployer } = useAuthStore();

  return (
    <SafeScreen style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-5 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="mb-5 flex-row items-center gap-1">
            <ChevronLeft size={20} color={C.primary} />
            <Text className="text-base font-medium" style={{ color: C.primary }}>Back</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold mb-5" style={{ color: C.primary }}>Settings</Text>
        </View>

        {/* Language */}
        <View className="mx-4 mb-4">
          <Text
            className="text-xs font-bold uppercase tracking-widest px-1 pb-2"
            style={{ color: C.outline, letterSpacing: 1 }}
          >
            Language
          </Text>
          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor: C.surfaceContainerLowest,
              borderWidth: 1,
              borderColor: C.outlineVariant,
            }}
          >
            <View className="flex-row flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => setLanguage(lang.code)}
                  className="px-3 py-2 rounded-xl border flex-row items-center gap-1.5"
                  style={{
                    backgroundColor: language === lang.code ? C.primary : C.surfaceContainerLow,
                    borderColor: language === lang.code ? C.primary : C.outlineVariant,
                  }}
                  activeOpacity={0.75}
                >
                  <Languages size={13} color={language === lang.code ? '#ffffff' : C.onSurfaceVariant} />
                  <Text
                    style={{
                      fontSize: 14,
                      color: language === lang.code ? '#ffffff' : C.onSurface,
                      fontWeight: language === lang.code ? '700' : '500',
                    }}
                  >
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Active Mode */}
        {hasWorker && hasEmployer && (
          <View className="mx-4 mb-4">
            <Text
              className="text-xs font-bold uppercase tracking-widest px-1 pb-2"
              style={{ color: C.outline, letterSpacing: 1 }}
            >
              Active Mode
            </Text>
            <View
              className="rounded-2xl p-4 flex-row gap-3"
              style={{
                backgroundColor: C.surfaceContainerLowest,
                borderWidth: 1,
                borderColor: C.outlineVariant,
              }}
            >
              <TouchableOpacity
                onPress={() => { setActiveRole('worker'); router.replace('/(worker)/(tabs)/feed'); }}
                className="flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2"
                style={{
                  backgroundColor: activeRole === 'worker' ? C.amber : C.surfaceContainerLow,
                  borderWidth: 1,
                  borderColor: activeRole === 'worker' ? C.amber : C.outlineVariant,
                }}
                activeOpacity={0.75}
              >
                <HardHat size={16} color={activeRole === 'worker' ? '#ffffff' : C.onSurfaceVariant} />
                <Text
                  style={{
                    fontWeight: '600',
                    color: activeRole === 'worker' ? '#ffffff' : C.onSurface,
                  }}
                >
                  Worker
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setActiveRole('employer'); router.replace('/(employer)/(tabs)/dashboard'); }}
                className="flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2"
                style={{
                  backgroundColor: activeRole === 'employer' ? C.primary : C.surfaceContainerLow,
                  borderWidth: 1,
                  borderColor: activeRole === 'employer' ? C.primary : C.outlineVariant,
                }}
                activeOpacity={0.75}
              >
                <Hotel size={16} color={activeRole === 'employer' ? '#ffffff' : C.onSurfaceVariant} />
                <Text
                  style={{
                    fontWeight: '600',
                    color: activeRole === 'employer' ? '#ffffff' : C.onSurface,
                  }}
                >
                  Employer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Account */}
        <View className="mx-4 mb-4">
          <Text
            className="text-xs font-bold uppercase tracking-widest px-1 pb-2"
            style={{ color: C.outline, letterSpacing: 1 }}
          >
            Account
          </Text>
          <View
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: C.surfaceContainerLowest,
              borderWidth: 1,
              borderColor: C.outlineVariant,
            }}
          >
            <SectionRow
              label="Plans & Billing"
              description="Subscription & invoices"
              icon={<CreditCard size={16} color={C.primary} />}
              iconBg={C.primaryFixed}
              onPress={() => router.push('/(shared)/plans')}
              isLast
            />
          </View>
        </View>

        <View className="mx-4 mb-8">
          <Text className="text-xs text-center" style={{ color: C.outline }}>TEJJ v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
