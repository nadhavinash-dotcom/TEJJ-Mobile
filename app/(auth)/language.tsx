import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { LANGUAGES } from '@/utils';

export default function LanguageScreen() {
  const setLanguage = useAuthStore((s) => s.setLanguage);

  const handleSelect = (code: string) => {
    setLanguage(code);
    router.push('/(auth)/phone');
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <View className="flex-1 px-6 pt-12">
        <Text className="text-white text-3xl font-bold mb-2">TEJJ</Text>
        <Text className="text-amber-400 text-lg mb-8">Apni bhasha chuniye</Text>
        <Text className="text-navy-300 text-sm mb-6">Choose your language / अपनी भाषा चुनें</Text>

        <View className="flex-row flex-wrap gap-3">
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => handleSelect(lang.code)}
              className="w-[30%] bg-navy-800 border border-navy-600 rounded-2xl p-4 items-center"
              activeOpacity={0.75}
            >
              <Text className="text-3xl mb-2">{lang.flag}</Text>
              <Text className="text-white font-semibold text-sm text-center">{lang.label}</Text>
              <Text className="text-navy-400 text-xs text-center mt-1">{lang.labelEn}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
