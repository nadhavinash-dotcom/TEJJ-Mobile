import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const BENEFITS = [
  {
    icon: '🏥',
    title: 'Group Insurance',
    subtitle: 'TEJJ Retain — 90 days',
    description: 'Health & accident coverage after 90 days of continuous work through TEJJ.',
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: '90 days',
    badgeColor: 'bg-blue-500/20 text-blue-400',
  },
  {
    icon: '🛵',
    title: '2-Wheeler Loan',
    subtitle: 'TEJJ Retain — 6 months',
    description: 'Low-interest loans for a motorcycle or scooter after 6 months of steady work.',
    color: 'border-green-500/30 bg-green-500/5',
    badge: '6 months',
    badgeColor: 'bg-green-500/20 text-green-400',
  },
  {
    icon: '💸',
    title: 'Earned Wage Access',
    subtitle: 'TEJJ Retain — 12 months',
    description: 'Access wages you have already earned before payday — after 12 months with same employer.',
    color: 'border-amber-500/30 bg-amber-500/5',
    badge: '12 months',
    badgeColor: 'bg-amber-500/20 text-amber-400',
  },
];

export default function BenefitsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <Text className="text-amber-400 text-base">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold mb-1">TEJJ Benefits</Text>
          <Text className="text-navy-300 text-sm mb-6">Work steadily through TEJJ to unlock these benefits</Text>
        </View>

        <View className="px-4 gap-4">
          {BENEFITS.map((b) => (
            <View key={b.title} className={`rounded-2xl p-5 border ${b.color}`}>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-4xl">{b.icon}</Text>
                <View className={`px-3 py-1 rounded-full ${b.badgeColor}`}>
                  <Text className="text-xs font-semibold">{b.badge}</Text>
                </View>
              </View>
              <Text className="text-white text-lg font-bold mb-1">{b.title}</Text>
              <Text className="text-navy-400 text-xs mb-2">{b.subtitle}</Text>
              <Text className="text-navy-300 text-sm leading-5">{b.description}</Text>
            </View>
          ))}

          <View className="bg-navy-800 border border-navy-700 rounded-2xl p-5 mb-8">
            <Text className="text-white font-semibold mb-2">How to unlock</Text>
            <Text className="text-navy-300 text-sm leading-5">
              Work consistently through TEJJ with the same employer. Your TEJJ Retain status is tracked automatically based on shifts completed.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
