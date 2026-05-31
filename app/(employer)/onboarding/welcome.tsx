import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView, StyleSheet } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { EMPLOYER_PLANS } from '@/utils';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';
import { navigateHome } from '@/utils/navigate-home';

const BLUE = '#2563EB';

export default function EmployerWelcomeScreen() {
  const iconScale = useRef(new Animated.Value(0.4)).current;
  const iconOp = useRef(new Animated.Value(0)).current;
  const titleOp = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(16)).current;
  const cardsOp = useRef(new Animated.Value(0)).current;
  const cardsSlide = useRef(new Animated.Value(20)).current;
  const btnOp = useRef(new Animated.Value(0)).current;
  const btnSlide = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(iconScale, { toValue: 1, tension: 55, friction: 7, useNativeDriver: true }),
        Animated.timing(iconOp, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(titleOp, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(titleSlide, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardsOp, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(cardsSlide, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(btnOp, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.timing(btnSlide, { toValue: 0, duration: 260, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeScreen className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Hero */}
        <Animated.View
          style={{ opacity: iconOp, transform: [{ scale: iconScale }] }}
          className="items-center mb-2"
        >
          <View style={styles.iconRing}>
            <LucideIcon name="PartyPopper" size={52} color={BLUE} />
          </View>
        </Animated.View>

        <Animated.View
          style={{ opacity: titleOp, transform: [{ translateY: titleSlide }] }}
          className="items-center mb-8"
        >
          <Text style={styles.headline}>You're all set!</Text>
          <Text style={styles.subline}>
            Your employer account is ready.{'\n'}Start posting jobs today.
          </Text>
        </Animated.View>

        {/* Plans */}
        <Animated.View style={{ opacity: cardsOp, transform: [{ translateY: cardsSlide }] }}>
          <Text style={styles.plansLabel}>Your plan</Text>
          <View style={styles.plansList}>
            {Object.entries(EMPLOYER_PLANS).map(([key, plan]: [string, any]) => {
              const isCurrent = key === 'GROWTH';
              return (
                <View
                  key={key}
                  style={[styles.planCard, isCurrent && styles.planCardHighlight]}
                >
                  <View style={styles.planCardLeft}>
                    <Text style={[styles.planName, isCurrent && styles.planNameHighlight]}>
                      {plan.name}
                    </Text>
                    <Text style={styles.planDesc}>
                      {plan.post_limit === -1 ? 'Unlimited' : `${plan.post_limit} posts`} / month
                    </Text>
                  </View>
                  {isCurrent && (
                    <View style={styles.currentBadge}>
                      <LucideIcon name="Check" size={12} color={BLUE} />
                      <Text style={styles.currentBadgeText}>Current</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      {/* CTA */}
      <Animated.View
        style={[styles.ctaWrap, { opacity: btnOp, transform: [{ translateY: btnSlide }] }]}
      >
        <TouchableOpacity
          onPress={navigateHome}
          style={styles.ctaBtn}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaText}>Go to Dashboard</Text>
          <LucideIcon name="ArrowRight" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 120,
  },
  iconRing: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 36,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  headline: {
    color: '#1B1B1F',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  subline: {
    color: '#767683',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  plansLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  plansList: { gap: 10 },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E1E7',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  planCardHighlight: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  planCardLeft: { gap: 2 },
  planName: { color: '#9CA3AF', fontSize: 14, fontWeight: '600' },
  planNameHighlight: { color: '#1B1B1F', fontWeight: '700' },
  planDesc: { color: '#C6C5D4', fontSize: 12 },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  currentBadgeText: { color: '#2563EB', fontSize: 12, fontWeight: '700' },
  ctaWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: '#FBFAFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EDF2',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: BLUE,
    borderRadius: 16,
    paddingVertical: 18,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaText: { color: '#FFFFFF', fontWeight: '700', fontSize: 17 },
});
