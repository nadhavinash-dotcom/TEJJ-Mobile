import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { EMPLOYER_PLANS } from '@/utils';

export default function PlansScreen() {
  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-amber-400 text-base">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold mb-1">Plans & Billing</Text>
          <Text className="text-navy-300 text-sm mb-6">Choose the right plan for your hiring needs</Text>
        </View>

        <View className="px-4 gap-4">
          {Object.entries(EMPLOYER_PLANS).map(([key, plan]: [string, any]) => {
            const isPopular = key === 'GROWTH';
            return (
              <View
                key={key}
                className={`rounded-2xl p-5 border ${isPopular ? 'border-amber-500 bg-amber-500/5' : 'border-navy-700 bg-navy-800'}`}
              >
                {isPopular && (
                  <View className="bg-amber-500 self-start px-3 py-1 rounded-full mb-3">
                    <Text className="text-white text-xs font-bold">Most Popular</Text>
                  </View>
                )}
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-white text-xl font-bold">{plan.name}</Text>
                  <View>
                    <Text className="text-amber-400 text-xl font-bold">
                      {(plan as any).price === 0 ? 'Free' : `₹${((plan as any).price)?.toLocaleString('en-IN')}`}
                    </Text>
                    {(plan as any).price > 0 && <Text className="text-navy-400 text-xs text-right">/month</Text>}
                  </View>
                </View>

                <View className="gap-2 mb-4">
                  <Text className="text-navy-300 text-sm">✓ {(plan as any).post_limit === -1 ? 'Unlimited' : (plan as any).post_limit} jobs per month</Text>
                  {((plan as any).features ?? []).map((f: string) => (
                    <Text key={f} className="text-navy-300 text-sm">✓ {f}</Text>
                  ))}
                </View>

                <TouchableOpacity
                  className={`rounded-xl py-3 items-center ${isPopular ? 'bg-amber-500' : 'bg-navy-700'}`}
                  activeOpacity={0.85}
                >
                  <Text className="text-white font-bold">{(plan as any).price === 0 ? 'Current Plan' : 'Upgrade'}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
