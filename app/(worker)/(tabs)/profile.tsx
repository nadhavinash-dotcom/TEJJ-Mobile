// app/(worker)/(tabs)/profile.tsx
import React from 'react';
import { ScrollView, Alert } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useAuthStore } from '../../../src/store/authStore';
import {
  ProfileColors as C,
  ProfileHeroCard,
  ProfileSkillsSection,
  ProfileAvailabilitySection,
  ProfilePaySection,
  ProfileVerificationSection,
  ProfileActivitySection,
  ProfileAccountSection,
  ProfileSignOutButton,
} from '../../../src/components/worker/profile';

export default function ProfileScreen() {
  const { clear, workerProfile } = useAuthStore();

  const p = workerProfile; // shorthand

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: () => { clear(); router.replace('/(auth)/phone'); },
      },
    ]);
  };

  // ── Derived values needed by multiple sections ─────────────────────────────
  const primarySkill    = p?.primary_skill ?? null;
  const secondarySkills = p?.secondary_skills ?? [];
  const status          = p?.status ?? 'DRAFT';
  const isVerified      = p?.verified?.aadhaar ?? false;
  const aiScore         = p?.scores?.ai != null ? p.scores.ai.toFixed(1) : null;
  const aiScoreStatus   = p?.scores?.ai_status ?? '—';

  return (
    <SafeScreen style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* ── Hero Card ──────────────────────────────────────────────── */}
        <ProfileHeroCard profile={p} />

        {/* ── Skills ─────────────────────────────────────────────────── */}
        <ProfileSkillsSection
          primarySkill={primarySkill}
          secondarySkills={secondarySkills}
        />

        {/* ── Availability ───────────────────────────────────────────── */}
        <ProfileAvailabilitySection
          days={p?.availability?.days ?? []}
          shifts={p?.availability?.shifts ?? []}
          availFrom={p?.availability?.from ?? null}
          availTo={p?.availability?.to ?? null}
        />

        {/* ── Pay Preferences ────────────────────────────────────────── */}
        <ProfilePaySection
          minShiftPay={p?.preferences?.min_pay_per_shift ?? null}
          minMonthlySalary={p?.preferences?.min_monthly_salary ?? null}
        />

        {/* ── Verification & Trust ───────────────────────────────────── */}
        <ProfileVerificationSection
          isVerified={isVerified}
          aiScore={aiScore}
          aiScoreStatus={aiScoreStatus}
          status={status}
        />

        {/* ── Activity ───────────────────────────────────────────────── */}
        <ProfileActivitySection />

        {/* ── Account ────────────────────────────────────────────────── */}
        <ProfileAccountSection />

        {/* ── Sign Out ───────────────────────────────────────────────── */}
        <ProfileSignOutButton onPress={handleSignOut} />

      </ScrollView>
    </SafeScreen>
  );
}