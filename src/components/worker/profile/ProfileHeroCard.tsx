// Hero card at the top of the Worker Profile screen
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {
  UserCircle, Star, BadgeCheck, HardHat,
  MapPin, TrendingUp, Zap,
  Edit,
} from 'lucide-react-native';
import { getAbsoluteUrl } from '@/utils';
import { ProfileColors as C } from './ProfileColors';
import { StatPill } from './ProfilePrimitives';
import type { WorkerProfile } from '@/types';
import { router } from 'expo-router';

// ── Status metadata ──────────────────────────────────────────────────────────

const STATUS_META: Record<string, { color: string; bg: string; label: string }> = {
  ACTIVE: { color: C.green, bg: C.greenBg, label: 'Active' },
  DRAFT: { color: C.outline, bg: C.surfaceContainerHigh, label: 'Draft' },
  DRAFT_ACTIVE: { color: C.teal, bg: C.tealBg, label: 'Draft Active' },
  PAUSED: { color: C.amber, bg: C.amberBg, label: 'Paused' },
  SUSPENDED: { color: C.error, bg: C.errorContainer, label: 'Suspended' },
};

// ── Props ────────────────────────────────────────────────────────────────────

interface ProfileHeroCardProps {
  profile: WorkerProfile | null;
}

// ── Component ────────────────────────────────────────────────────────────────

export function ProfileHeroCard({ profile }: ProfileHeroCardProps) {
  const p = profile;

  const displayName = p?.full_name ?? 'Worker Profile';
  const photoUrl = p?.profile_photo_url ?? null;
  const primarySkill = p?.primary_skill ?? 'Hospitality Worker';
  const city = p?.location?.city ?? null;
  const locality = p?.location?.area_locality ?? null;
  const locationStr = [locality, city].filter(Boolean).join(', ') || 'Location not set';
  const trustScore = (p?.scores?.trust ?? 0).toFixed(1);
  const showUpRate = p?.scores?.show_up != null
    ? `${(p.scores.show_up * 100).toFixed(0)}%`
    : '—';
  const experience = p?.years_experience
    ? `${p.years_experience} yr${p.years_experience !== 1 ? 's' : ''}`
    : '—';
  const isVerified = p?.verified?.aadhaar ?? false;
  const status = p?.status ?? 'DRAFT';
  const aiScore = p?.scores?.ai != null ? p.scores.ai.toFixed(1) : null;

  const sm = STATUS_META[status] ?? STATUS_META.DRAFT;

  console.log(photoUrl)

  return (
    <View
      className="mx-4 mt-5 mb-3 rounded-3xl overflow-hidden"
      style={{ backgroundColor: C.primary }}
    >
      {/* Decorative top band */}
      <View style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 70,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderBottomLeftRadius: 60, borderBottomRightRadius: 0,
      }} />

      <View className="px-5 pt-5 pb-5">
        {/* Top row: avatar + status chip */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="relative">
            {photoUrl ? (
              <Image
                source={{ uri: getAbsoluteUrl(photoUrl) }}
                style={{
                  width: 68, height: 68, borderRadius: 20,
                  borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
                }}
              />
            ) : (
              <View style={{
                width: 68, height: 68, borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.12)',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <UserCircle size={34} color={C.onPrimary} />
              </View>
            )}
            {/* Online dot when ACTIVE */}
            {status === 'ACTIVE' && (
              <View style={{
                position: 'absolute', bottom: 3, right: 3,
                width: 12, height: 12, borderRadius: 6,
                backgroundColor: '#4ade80',
                borderWidth: 2, borderColor: C.primary,
              }} />
            )}
          </View>

          {/* Status + trust score stacked */}
          <View className="items-end gap-2">
            <View className="flex-row gap-2">

              <TouchableOpacity
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                onPress={() => { router.push('/(worker)/profile/edit') }}
              >
                <Edit size={12} color={C.onPrimary} />
                <Text className="text-xs font-bold" style={{ color: C.onPrimary }}>Edit Profile</Text>
              </TouchableOpacity>
              <View
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: sm.bg }}
              >
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: sm.color }} />
                <Text className="text-xs font-bold" style={{ color: sm.color }}>{sm.label}</Text>
              </View>
            </View>
            <View
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            >
              <Star size={12} color={C.amber} fill={C.amber} />
              <Text className="text-sm font-bold" style={{ color: C.onPrimary }}>{trustScore}</Text>
              <Text className="text-[10px]" style={{ color: 'rgba(255,255,255,0.55)' }}>trust</Text>
            </View>
          </View>
        </View>

        {/* Name + role */}
        <Text className="text-xl font-bold mb-1" style={{ color: C.onPrimary }}>
          {displayName}
        </Text>
        <View className="flex-row items-center gap-2 mb-1">
          <HardHat size={12} color="rgba(255,255,255,0.55)" />
          <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>{primarySkill}</Text>
        </View>
        <View className="flex-row items-center gap-2 mb-4">
          <MapPin size={11} color="rgba(255,255,255,0.45)" />
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{locationStr}</Text>
        </View>

        {/* Badges row */}
        <View className="flex-row flex-wrap gap-2">
          {isVerified && (
            <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: C.secondaryContainer }}>
              <BadgeCheck size={11} color={C.onSecondaryContainer} />
              <Text className="text-[11px] font-bold" style={{ color: C.onSecondaryContainer }}>
                Aadhaar Verified
              </Text>
            </View>
          )}
          {experience !== '—' && (
            <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}>
              <TrendingUp size={11} color={C.onPrimary} />
              <Text className="text-[11px] font-semibold" style={{ color: C.onPrimary }}>
                {experience} exp
              </Text>
            </View>
          )}
          {aiScore && (
            <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}>
              <Zap size={11} color={C.amber} />
              <Text className="text-[11px] font-semibold" style={{ color: C.onPrimary }}>
                AI Score {aiScore}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Stat row ─────────────────────────────────────── */}
      <View className="flex-row gap-2 mx-3 mb-3">
        <StatPill value={trustScore} label="Trust" color={C.primary} bg={C.primaryFixed} />
        <StatPill value={showUpRate} label="Show-Up" color={C.green} bg={C.greenBg} />
        <StatPill value={experience} label="Exp" color={C.teal} bg={C.tealBg} />
        {aiScore && (
          <StatPill value={aiScore} label="AI Score" color="#92400e" bg={C.amberBg} />
        )}
      </View>
    </View>
  );
}
