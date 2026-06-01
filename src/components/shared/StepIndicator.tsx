import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { navigateHome } from '../../../utils/navigate-home';
import { LucideIcon } from './LucideIcon';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  accentColor?: string;
}

export function StepIndicator({ currentStep, totalSteps, accentColor = '#000666' }: StepIndicatorProps) {
  const { clear } = useAuthStore();
  const progress = useRef(new Animated.Value((currentStep - 1) / totalSteps)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: currentStep / totalSteps,
      useNativeDriver: false,
      tension: 22,
      friction: 7,
    }).start();
  }, [currentStep, totalSteps]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const pct = Math.round((currentStep / totalSteps) * 100);
  const bgTint = accentColor + '14';
  const borderTint = accentColor + '38';

  const handleLogout = () => {
    Alert.alert('Log out', 'Your progress will be saved. You can continue later.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => { clear(); navigateHome(); },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.overline}>ONBOARDING</Text>
          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>{currentStep}</Text>
            <Text style={styles.stepSep}> / {totalSteps}</Text>
          </View>
        </View>
        <View style={styles.rightGroup}>
          <View style={[styles.badge, { backgroundColor: bgTint, borderColor: borderTint }]}>
            <Text style={[styles.badgeText, { color: accentColor }]}>{pct}%</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} hitSlop={8}>
            <LucideIcon name="LogOut" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.track}>
        <Animated.View style={[styles.bar, { width, backgroundColor: accentColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 28 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  overline: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  stepRow: { flexDirection: 'row', alignItems: 'baseline' },
  stepNum: { color: '#1B1B1F', fontSize: 24, fontWeight: '800' },
  stepSep: { color: '#C6C5D4', fontSize: 16, fontWeight: '500' },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  logoutBtn: {
    padding: 4,
  },
  track: {
    height: 3,
    backgroundColor: '#E4E1E7',
    borderRadius: 999,
    overflow: 'hidden',
  },
  bar: { height: '100%', borderRadius: 999 },
});
