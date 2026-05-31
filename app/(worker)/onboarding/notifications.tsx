import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated, StyleSheet } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
} catch (e) {
  // Ignored in Expo Go
}

import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function NotificationsScreen() {
  const { updateWorker } = useOnboardingStore();
  const [requesting, setRequesting] = useState(false);
  const [granted, setGranted] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(22)).current;
  const cardOp = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.92)).current;
  const bellBounce = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 340, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 340, useNativeDriver: true }),
      Animated.timing(cardOp, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 55,
        friction: 8,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bellBounce, { toValue: 1.12, duration: 600, useNativeDriver: true }),
          Animated.timing(bellBounce, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.delay(1800),
        ]),
      ).start();
    });
  }, []);

  const requestPermission = async () => {
    setRequesting(true);
    try {
      if (!Notifications) {
        setGranted(false);
        return;
      }
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        const token = await Notifications.getExpoPushTokenAsync();
        updateWorker({ fcm_token: token.data });
        setGranted(true);
      }
    } finally {
      setRequesting(false);
    }
  };

  return (
    <SafeScreen className="flex-1">
      <View className="flex-1 px-6 pt-8 justify-between">
        <View>
          <Animated.View style={{ opacity, transform: [{ translateY: slideY }] }}>
            <StepIndicator currentStep={9} totalSteps={10} />
            <Text className="text-on-surface text-2xl font-bold mb-1">Turn on job alerts</Text>
            <Text className="text-on-surface-variant text-sm mb-6">
              Flash jobs fill in minutes — don't miss a gig near you
            </Text>
          </Animated.View>

          <Animated.View
            style={[{ opacity: cardOp, transform: [{ scale: cardScale }] }, styles.alertCard]}
          >
            <Animated.View style={{ transform: [{ scale: bellBounce }] }}>
              <View style={styles.bellWrap}>
                <LucideIcon name="Bell" size={44} color="#D97706" />
              </View>
            </Animated.View>
            <Text style={styles.cardTitle}>Flash Job Alerts</Text>
            <Text style={styles.cardDesc}>
              L1 Flash jobs fill in minutes. Be the first to know about high-paying same-day gigs nearby.
            </Text>

            <View style={styles.statRow}>
              <View style={styles.stat}>
                <Text style={styles.statNum}>3 min</Text>
                <Text style={styles.statLabel}>avg fill time</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statNum}>2×</Text>
                <Text style={styles.statLabel}>more jobs seen</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statNum}>Free</Text>
                <Text style={styles.statLabel}>always</Text>
              </View>
            </View>
          </Animated.View>

          {granted && (
            <Animated.View style={[styles.grantedBadge, { opacity }]}>
              <LucideIcon name="CheckCircle2" size={20} color="#166534" />
              <Text style={styles.grantedText}>Notifications enabled!</Text>
            </Animated.View>
          )}
        </View>

        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="gap-3 pb-6"
        >
          {!granted && (
            <TouchableOpacity
              onPress={requestPermission}
              disabled={requesting}
              style={styles.enableBtn}
              activeOpacity={0.85}
            >
              {requesting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <LucideIcon name="Bell" size={20} color="#FFFFFF" />
              )}
              <Text style={styles.enableText}>Turn on notifications</Text>
            </TouchableOpacity>
          )}
          <OnboardingFooter
            onBack={() => router.back()}
            onNext={() => router.push('/(worker)/onboarding/preview')}
            nextLabel={granted ? 'Next' : 'Skip for now'}
          />
        </Animated.View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  alertCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  bellWrap: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#1B1B1F',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDesc: {
    color: '#767683',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  statRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { color: '#D97706', fontSize: 16, fontWeight: '800' },
  statLabel: { color: '#9CA3AF', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: '#E4E1E7' },
  grantedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  grantedText: { color: '#166534', fontWeight: '700', fontSize: 15 },
  enableBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#000666',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000666',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  enableText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
