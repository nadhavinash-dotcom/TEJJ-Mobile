import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { EMPLOYER_PLANS } from '@/utils';
import { ChevronLeft, Check, Star } from 'lucide-react-native';

const C = {
  primary: '#000666',
  primaryFixed: '#e0e0ff',
  background: '#fbf8fe',
  surfaceContainerLow: '#f6f2f8',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#eae7ed',
  onSurface: '#1b1b1f',
  onSurfaceVariant: '#454652',
  outline: '#767683',
  outlineVariant: '#c6c5d4',
  amber: '#F59E0B',
};

type PlanAccent = { bg: string; border: string; badge?: string };
const PLAN_ACCENTS: Record<string, PlanAccent> = {
  FLASH_FREE: { bg: '#ffffff', border: '#c6c5d4' },
  STARTER: { bg: '#ffffff', border: '#c6c5d4' },
  GROWTH: { bg: '#fffbeb', border: '#fcd34d', badge: '#F59E0B' },
  PRO: { bg: '#f0eeff', border: '#000666' },
};

export default function PlansScreen() {
  return (
    <SafeScreen style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-5 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="mb-5 flex-row items-center gap-1">
            <ChevronLeft size={20} color={C.primary} />
            <Text className="text-base font-medium" style={{ color: C.primary }}>Back</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold mb-1" style={{ color: C.primary }}>Plans & Billing</Text>
          <Text className="text-sm mb-6" style={{ color: C.onSurfaceVariant }}>
            Choose the right plan for your hiring needs
          </Text>
        </View>

        <View className="px-4 gap-4 pb-8">
          {Object.entries(EMPLOYER_PLANS).map(([key, plan]: [string, any]) => {
            const isPopular = key === 'GROWTH';
            const isPro = key === 'PRO';
            const accent = PLAN_ACCENTS[key] ?? { bg: '#ffffff', border: C.outlineVariant };
            const priceColor = isPopular ? C.amber : isPro ? C.primary : C.onSurface;
            const checkBg = isPopular ? '#fef3c7' : C.primaryFixed;
            const checkColor = isPopular ? C.amber : C.primary;

            return (
              <View
                key={key}
                className="rounded-3xl overflow-hidden"
                style={{
                  backgroundColor: accent.bg,
                  borderWidth: isPopular || isPro ? 2 : 1,
                  borderColor: accent.border,
                }}
              >
                {isPopular && (
                  <View
                    className="flex-row items-center justify-center gap-1.5 py-2"
                    style={{ backgroundColor: C.amber }}
                  >
                    <Star size={12} color="#ffffff" fill="#ffffff" />
                    <Text className="text-white text-xs font-bold tracking-wider uppercase">
                      Most Popular
                    </Text>
                  </View>
                )}

                <View className="p-5">
                  <View className="flex-row items-start justify-between mb-4">
                    <View>
                      <Text className="text-xl font-bold mb-0.5" style={{ color: C.onSurface }}>
                        {plan.name}
                      </Text>
                      <Text className="text-xs" style={{ color: C.onSurfaceVariant }}>
                        {plan.post_limit === -1 ? 'Unlimited' : plan.post_limit} posts/month
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-2xl font-bold" style={{ color: priceColor }}>
                        {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`}
                      </Text>
                      {plan.price > 0 && (
                        <Text className="text-xs" style={{ color: C.outline }}>/month</Text>
                      )}
                    </View>
                  </View>

                  <View
                    className="gap-2 pb-4 mb-4"
                    style={{ borderBottomWidth: 1, borderBottomColor: C.outlineVariant }}
                  >
                    {(plan.features ?? []).map((f: string) => (
                      <View key={f} className="flex-row items-center gap-2">
                        <View
                          className="w-5 h-5 rounded-full items-center justify-center"
                          style={{ backgroundColor: checkBg }}
                        >
                          <Check size={11} color={checkColor} strokeWidth={2.5} />
                        </View>
                        <Text className="text-sm" style={{ color: C.onSurface }}>{f}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    className="rounded-xl py-3 items-center"
                    style={{
                      backgroundColor: isPro ? C.primary : isPopular ? C.amber : C.surfaceContainerHigh,
                      borderWidth: isPro || isPopular ? 0 : 1,
                      borderColor: C.outlineVariant,
                    }}
                    activeOpacity={0.85}
                  >
                    <Text
                      className="font-bold"
                      style={{ color: isPro || isPopular ? '#ffffff' : plan.price === 0 ? C.outline : C.onSurface }}
                    >
                      {plan.price === 0 ? 'Current Plan' : 'Upgrade'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
