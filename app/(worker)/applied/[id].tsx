import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

const STEPS = [
  { icon: 'Search', label: 'Employer reviews your profile' },
  { icon: 'Star', label: 'You get shortlisted if matched' },
  { icon: 'MapPin', label: 'Venue details revealed on match' },
  { icon: 'Clock', label: 'Show up on time for the shift' },
];

export default function AppliedScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeScreen className="bg-surface flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 48, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Icon ── */}
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }], opacity: fadeAnim }}
          className="items-center mb-6"
        >
          <View className="w-28 h-28 rounded-full bg-secondary-container items-center justify-center shadow-md">
            <LucideIcon name="PartyPopper" size={52} color="#006f62" />
          </View>
          {/* Subtle pulse ring */}
          <View
            className="absolute w-28 h-28 rounded-full border-2 border-secondary opacity-30"
            style={{ transform: [{ scale: 1.25 }] }}
          />
        </Animated.View>

        {/* ── Heading ── */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="items-center mb-10"
        >
          <Text className="text-on-surface text-3xl font-black text-center tracking-tight mb-3">
            Application Submitted!
          </Text>
          <Text className="text-on-surface-variant text-base text-center leading-relaxed max-w-xs">
            Your profile has been securely sent. We'll notify you instantly if you're shortlisted or matched.
          </Text>
        </Animated.View>

        {/* ── Steps Card ── */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 mb-8 shadow-sm"
        >
          <View className="flex-row items-center gap-2 mb-5">
            <LucideIcon name="ListChecks" size={16} color="#6b7280" />
            <Text className="text-on-surface-variant text-xs font-bold tracking-widest uppercase">
              What happens next?
            </Text>
          </View>

          {STEPS.map((step, i) => (
            <View key={i} className={`flex-row items-center gap-1 justify-center ${i < STEPS.length - 1 ? 'mb-5' : ''}`}>
              {/* Number + connector */}
              {/* <View className="items-center">
                <View className="w-8 h-8 rounded-full bg-secondary items-center justify-center shadow-sm">
                  <Text className="text-on-secondary text-xs font-bold">{i + 1}</Text>
                </View>
                {i < STEPS.length - 1 && (
                  <View className="w-px h-5 bg-outline-variant" />
                )}
              </View> */}

              {/* Icon + text */}
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-8 h-8 rounded-full bg-secondary items-center justify-center shadow-sm">
                  <LucideIcon name={step.icon as any} size={15} color="#fff" />
                </View>
                <Text className="text-on-surface font-medium text-sm flex-1 leading-snug">
                  {step.label}
                </Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* ── Status Badge ── */}
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="flex-row items-center justify-center gap-2 bg-secondary-container/50 rounded-2xl py-3 px-5 mb-8 self-center"
        >
          <View className="w-2 h-2 rounded-full bg-secondary" />
          <Text className="text-secondary font-semibold text-sm">
            Application under review
          </Text>
        </Animated.View>

        {/* ── CTAs ── */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="flex gap-3"
        >
          <TouchableOpacity
            onPress={() => router.replace('/(worker)/(tabs)/feed')}
            className="bg-primary rounded-2xl py-4 px-8 w-full shadow-md flex-row items-center justify-center gap-2 active:opacity-90"
            activeOpacity={0.85}
          >
            <LucideIcon name="Briefcase" size={18} color="#ffffff" />
            <Text className="text-on-primary font-bold text-base tracking-wide">
              Browse More Jobs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(worker)/(tabs)/applications')}
            className="rounded-2xl py-4 px-8 w-full flex-row items-center justify-center gap-2 border border-outline-variant"
            activeOpacity={0.75}
          >
            <LucideIcon name="ClipboardList" size={16} color="#006f62" />
            <Text className="text-primary font-semibold text-sm">
              View My Applications
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeScreen>
  );
}