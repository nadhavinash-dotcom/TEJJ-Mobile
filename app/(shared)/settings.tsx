import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { LANGUAGES } from '@/utils';
import { LucideIcon } from '../../src/components/shared/LucideIcon';

export default function SettingsScreen() {
  const { language, setLanguage, activeRole, setActiveRole, hasWorker, hasEmployer } = useAuthStore();

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="mb-4 flex-row items-center gap-1">
            <LucideIcon name="ChevronLeft" size={20} color="#F59E0B" />
            <Text className="text-amber-400 text-base">Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold mb-4">Settings</Text>
        </View>

        <View className="mx-4 bg-navy-800 border border-navy-700 rounded-2xl overflow-hidden mb-4">
          <View className="px-4 py-4 border-b border-navy-700">
            <Text className="text-navy-400 text-xs mb-2 uppercase tracking-wider">Language</Text>
            <View className="flex-row flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => setLanguage(lang.code)}
                  className={`px-3 py-2 rounded-xl border flex-row items-center gap-1.5 ${language === lang.code ? 'bg-amber-500 border-amber-500' : 'bg-navy-700 border-navy-600'}`}
                  activeOpacity={0.75}
                >
                  <LucideIcon name={lang.flag} size={14} color={language === lang.code ? '#FFFFFF' : '#F59E0B'} />
                  <Text className={`text-sm ${language === lang.code ? 'text-white font-bold' : 'text-navy-300'}`}>{lang.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {hasWorker && hasEmployer && (
            <View className="px-4 py-4 border-b border-navy-700">
              <Text className="text-navy-400 text-xs mb-3 uppercase tracking-wider">Active Mode</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => { setActiveRole('worker'); router.replace('/(worker)/(tabs)/feed'); }}
                  className={`flex-1 py-3 rounded-xl border flex-row items-center justify-center gap-2 ${activeRole === 'worker' ? 'bg-amber-500 border-amber-500' : 'bg-navy-700 border-navy-600'}`}
                  activeOpacity={0.75}
                >
                  <LucideIcon name="HardHat" size={16} color={activeRole === 'worker' ? '#FFFFFF' : '#94A3B8'} />
                  <Text className={`font-semibold ${activeRole === 'worker' ? 'text-white' : 'text-navy-300'}`}>Worker</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setActiveRole('employer'); router.replace('/(employer)/(tabs)/dashboard'); }}
                  className={`flex-1 py-3 rounded-xl border flex-row items-center justify-center gap-2 ${activeRole === 'employer' ? 'bg-blue-600 border-blue-500' : 'bg-navy-700 border-navy-600'}`}
                  activeOpacity={0.75}
                >
                  <LucideIcon name="Hotel" size={16} color={activeRole === 'employer' ? '#FFFFFF' : '#94A3B8'} />
                  <Text className={`font-semibold ${activeRole === 'employer' ? 'text-white' : 'text-navy-300'}`}>Employer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity onPress={() => router.push('/(shared)/plans')} className="px-4 py-4 flex-row items-center justify-between border-b border-navy-700" activeOpacity={0.7}>
            <Text className="text-white">Plans & Billing</Text>
            <LucideIcon name="ChevronRight" size={16} color="#475569" />
          </TouchableOpacity>

          <View className="px-4 py-4">
            <Text className="text-navy-400 text-xs text-center">TEJJ v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
