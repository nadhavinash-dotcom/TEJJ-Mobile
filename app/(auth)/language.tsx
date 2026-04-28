import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StyledMenu, StyledArrowRight } from '../../src/components/tell/Icons';

const languages = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'te', label: 'తెలుగు' },
  { id: 'ta', label: 'தமிழ்' },
  { id: 'bn', label: 'বাংলা' },
  { id: 'mr', label: 'मराठी' },
  { id: 'kn', label: 'ಕನ್ನಡ' },
  { id: 'or', label: 'ଓଡ଼ିଆ' },
  { id: 'pa', label: 'ਪੰਜਾਬੀ' },
];

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedLanguage) {
      router.push({ pathname: '/(auth)/phone', params: { lang: selectedLanguage } });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="bg-[#fbf8fe]/90 flex-row justify-between items-center px-6 py-4 z-50 border-b border-surface-container-highest/20">
        <View className="flex-row items-center gap-4">
          {/* <TouchableOpacity className="active:opacity-70 p-1">
            <StyledMenu color="#000666" size={24} />
          </TouchableOpacity> */}
          <Text className="font-bold text-2xl tracking-tight text-primary">TEJJ</Text>
        </View>
        <Text className="text-sm font-bold text-[#44464f]">v1.0</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-xl mx-auto flex-1 flex-col justify-center">
          <View className="mb-12 items-center sm:items-start">
            <Text className="font-extrabold text-4xl sm:text-5xl text-primary tracking-tight mb-4 text-center sm:text-left">
              Select Language
            </Text>
            <View className="h-1.5 w-12 bg-secondary rounded-full" />
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-4 mb-10">
            {languages.map((lang) => {
              const isSelected = selectedLanguage === lang.id;

              return (
                <TouchableOpacity
                  key={lang.id}
                  onPress={() => setSelectedLanguage(lang.id)}
                  className={`w-[48%] flex flex-col items-center justify-center py-10 px-4 rounded-2xl border-2 ${isSelected
                    ? 'bg-primary-fixed/20 border-primary'
                    : 'bg-surface-container-lowest border-transparent'
                    }`}
                  style={!isSelected ? {
                    shadowColor: '#1b1b1f',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.05,
                    shadowRadius: 12,
                    elevation: 3,
                  } : undefined}
                >
                  <Text className={`text-3xl font-bold ${isSelected ? 'text-primary' : 'text-on-surface'
                    }`}>
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View className="items-center my-4">
        <TouchableOpacity
          className={`flex-row items-center justify-center gap-3 py-4 px-8 rounded-full active:opacity-80 ${selectedLanguage ? 'bg-primary' : 'bg-gray-100'
            }`}
          disabled={!selectedLanguage}
          onPress={handleContinue}
        >
          <Text className={`font-bold text-lg ${selectedLanguage ? 'text-on-primary' : 'text-gray-500'
            }`}>
            Continue in {selectedLanguage ? languages.find(l => l.id === selectedLanguage)?.label : 'English'}
          </Text>
          <StyledArrowRight color={selectedLanguage ? '#ffffff' : '#000666'} size={22} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
