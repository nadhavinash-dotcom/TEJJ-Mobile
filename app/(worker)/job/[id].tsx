import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { HIRING_LANES } from '@/utils';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';
import {
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Star,
  MapPin,
  Clock,
  Users,
  Zap,
  Building2,
  AlarmClock,
} from 'lucide-react-native';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

const C = {
  primary: '#000666',
  primaryFixed: '#e0e0ff',
  onPrimary: '#ffffff',
  background: '#fbf8fe',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f6f2f8',
  surfaceContainer: '#f0edf2',
  surfaceContainerHigh: '#eae7ed',
  onSurface: '#1b1b1f',
  onSurfaceVariant: '#454652',
  outline: '#767683',
  outlineVariant: '#c6c5d4',
  secondary: '#006b5e',
  secondaryContainer: '#94f0df',
  onSecondaryContainer: '#006f62',
  tertiaryFixed: '#ffdcc6',
  onTertiaryContainer: '#ec7700',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  amber: '#F59E0B',
};

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-3"
      style={{ borderBottomWidth: 1, borderBottomColor: C.outlineVariant }}
    >
      <View className="flex-row items-center gap-2.5">
        {icon}
        <Text className="text-sm" style={{ color: C.onSurfaceVariant }}>{label}</Text>
      </View>
      <Text className="font-semibold text-sm" style={{ color: C.onSurface }}>{value}</Text>
    </View>
  );
}

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [applying, setApplying] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get(`/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
  });

  const handleApply = async () => {
    setApplying(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.post('/applications', { job_id: id }, { headers: { Authorization: `Bearer ${token}` } });
      router.replace({ pathname: '/(worker)/applied/[id]', params: { id: res.data.data._id } });
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Could not apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (isLoading || !job) {
    return (
      <SafeScreen style={{ flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C.primary} size="large" />
      </SafeScreen>
    );
  }

  const laneKey = `L${job.lane}` as keyof typeof HIRING_LANES;
  const lane = HIRING_LANES[laneKey];
  const shiftTime = job.shift_start_time
    ? new Date(job.shift_start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    : null;
  const spotsLeft = job.number_of_openings - job.openings_filled;

  return (
    <SafeScreen style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Back */}
        <View className="px-4 pt-5 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1 self-start">
            <ChevronLeft size={20} color={C.primary} />
            <Text className="text-base font-medium" style={{ color: C.primary }}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* Header Card */}
        <View
          className="mx-4 rounded-3xl p-5 mb-4"
          style={{ backgroundColor: C.primary }}
        >
          <View className="flex-row items-center gap-2 mb-4">
            <View
              className="px-2.5 py-1 rounded-lg flex-row items-center gap-1.5"
              style={{ backgroundColor: lane.color + '30' }}
            >
              <LucideIcon name={lane.icon} size={12} color={lane.color} />
              <Text className="font-bold text-[11px] uppercase tracking-tight" style={{ color: lane.color }}>
                {lane.label}
              </Text>
            </View>
            <Text className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{lane.window}</Text>
            {job.employer_gstin_verified && (
              <View
                className="flex-row items-center gap-1 px-2 py-1 rounded-lg ml-auto"
                style={{ backgroundColor: C.secondaryContainer }}
              >
                <BadgeCheck size={11} color={C.onSecondaryContainer} />
                <Text className="text-[10px] font-bold" style={{ color: C.onSecondaryContainer }}>GST Verified</Text>
              </View>
            )}
          </View>

          <Text className="text-white text-2xl font-bold mb-1">{job.job_title}</Text>
          <View className="flex-row items-center gap-1.5 mb-4">
            <Building2 size={13} color="rgba(255,255,255,0.6)" />
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
              {job.employer_property_type}{job.employer_area_locality ? ` · ${job.employer_area_locality}` : ''}
            </Text>
          </View>

          <View className="flex-row items-end justify-between">
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>Pay per shift</Text>
              <Text className="text-3xl font-bold" style={{ color: C.amber }}>
                ₹{job.pay_rate?.toLocaleString('en-IN')}
              </Text>
            </View>
            {job.distance_km != null && (
              <View
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                <MapPin size={12} color="rgba(255,255,255,0.7)" />
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' }}>
                  {job.distance_km} km
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Urgency banner */}
        {spotsLeft > 0 && spotsLeft <= 3 && (
          <View
            className="mx-4 mb-4 rounded-xl px-4 py-3 flex-row items-center gap-2"
            style={{ backgroundColor: C.errorContainer, borderWidth: 1, borderColor: '#fecdd3' }}
          >
            <Zap size={15} color={C.error} />
            <Text className="font-bold text-sm" style={{ color: C.error }}>
              Only {spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left — apply fast!
            </Text>
          </View>
        )}

        {/* Shift Details */}
        <View
          className="mx-4 rounded-2xl px-4 mb-4"
          style={{
            backgroundColor: C.surfaceContainerLowest,
            borderWidth: 1,
            borderColor: C.outlineVariant,
          }}
        >
          <Text
            className="text-xs font-bold uppercase tracking-widest pt-4 pb-2"
            style={{ color: C.outline, letterSpacing: 1 }}
          >
            Shift Details
          </Text>
          {shiftTime && (
            <InfoRow
              icon={<AlarmClock size={15} color={C.onSurfaceVariant} />}
              label="Start time"
              value={shiftTime}
            />
          )}
          {job.shift_duration_hours && (
            <InfoRow
              icon={<Clock size={15} color={C.onSurfaceVariant} />}
              label="Duration"
              value={`${job.shift_duration_hours} hours`}
            />
          )}
          <InfoRow
            icon={<Users size={15} color={C.onSurfaceVariant} />}
            label="Openings"
            value={`${job.number_of_openings} total · ${spotsLeft} left`}
          />
          <View style={{ height: 4 }} />
        </View>

        {/* Description */}
        {job.description && (
          <View
            className="mx-4 rounded-2xl p-5 mb-4"
            style={{
              backgroundColor: C.surfaceContainerLowest,
              borderWidth: 1,
              borderColor: C.outlineVariant,
            }}
          >
            <Text
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: C.outline, letterSpacing: 1 }}
            >
              Job Description
            </Text>
            <Text className="text-sm leading-6" style={{ color: C.onSurface }}>{job.description}</Text>
          </View>
        )}

        {/* Employer */}
        <View
          className="mx-4 rounded-2xl p-5 mb-4"
          style={{
            backgroundColor: C.surfaceContainerLowest,
            borderWidth: 1,
            borderColor: C.outlineVariant,
          }}
        >
          <Text
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: C.outline, letterSpacing: 1 }}
          >
            Employer
          </Text>
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: C.primaryFixed }}
            >
              <Building2 size={18} color={C.primary} />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-base" style={{ color: C.onSurface }}>
                {job.employer_property_type}
              </Text>
              {job.employer_dignity_score > 0 && (
                <View className="flex-row items-center gap-1 mt-0.5">
                  <Star size={12} color={C.amber} fill={C.amber} />
                  <Text className="text-xs font-medium" style={{ color: C.onSurfaceVariant }}>
                    {job.employer_dignity_score.toFixed(1)} Dignity Score
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Apply CTA */}
      <View
        className="px-4 pb-6 pt-3"
        style={{ borderTopWidth: 1, borderTopColor: C.outlineVariant, backgroundColor: C.background }}
      >
        <TouchableOpacity
          onPress={handleApply}
          disabled={applying}
          className="rounded-2xl py-4 items-center"
          style={{ backgroundColor: applying ? C.surfaceContainerHigh : C.primary }}
          activeOpacity={0.85}
        >
          {applying ? (
            <ActivityIndicator color={C.primary} />
          ) : (
            <View className="flex-row items-center gap-2">
              <Text className="text-white font-bold text-lg">Apply Now</Text>
              <ChevronRight size={20} color="#ffffff" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}
