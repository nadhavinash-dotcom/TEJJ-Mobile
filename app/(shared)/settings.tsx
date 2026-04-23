import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { LANGUAGES } from '@/utils';

export default function SettingsScreen() {
  const { language, setLanguage, activeRole, setActiveRole, hasWorker, hasEmployer } = useAuthStore();

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-amber-400 text-base">← Back</Text>
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
                  className={`px-3 py-2 rounded-xl border ${language === lang.code ? 'bg-amber-500 border-amber-500' : 'bg-navy-700 border-navy-600'}`}
                  activeOpacity={0.75}
                >
                  <Text className="text-sm">{lang.flag} {lang.label}</Text>
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
                  className={`flex-1 py-3 rounded-xl border items-center ${activeRole === 'worker' ? 'bg-amber-500 border-amber-500' : 'bg-navy-700 border-navy-600'}`}
                  activeOpacity={0.75}
                >
                  <Text className={`font-semibold ${activeRole === 'worker' ? 'text-white' : 'text-navy-300'}`}>👷 Worker</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setActiveRole('employer'); router.replace('/(employer)/(tabs)/dashboard'); }}
                  className={`flex-1 py-3 rounded-xl border items-center ${activeRole === 'employer' ? 'bg-blue-600 border-blue-500' : 'bg-navy-700 border-navy-600'}`}
                  activeOpacity={0.75}
                >
                  <Text className={`font-semibold ${activeRole === 'employer' ? 'text-white' : 'text-navy-300'}`}>🏨 Employer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity onPress={() => router.push('/(shared)/plans')} className="px-4 py-4 flex-row items-center justify-between border-b border-navy-700" activeOpacity={0.7}>
            <Text className="text-white">Plans & Billing</Text>
            <Text className="text-navy-500">›</Text>
          </TouchableOpacity>

          <View className="px-4 py-4">
            <Text className="text-navy-400 text-xs text-center">TEJJ v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
