import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { useQuery } from '@tanstack/react-query';
import { TrustGauge } from '../../../src/components/worker/TrustGauge';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';
import { Star, TrendingUp } from 'lucide-react-native';

const C = {
  primary: '#000666',
  primaryFixed: '#e0e0ff',
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
  amber: '#F59E0B',
};

const METRIC_COLORS = {
  showUp: '#006b5e',
  rating: '#F59E0B',
  profile: '#000666',
  conduct: '#8B5CF6',
};

function MetricBar({
  label,
  value,
  color,
  isLast,
}: {
  label: string;
  value: number;
  color: string;
  isLast?: boolean;
}) {
  const pct = Math.round(value * 100);
  return (
    <View
      className="py-3"
      style={{ borderBottomWidth: isLast ? 0 : 1, borderBottomColor: C.outlineVariant }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-medium" style={{ color: C.onSurface }}>{label}</Text>
        <Text className="text-sm font-bold" style={{ color }}>{pct}%</Text>
      </View>
      <View className="h-2 rounded-full" style={{ backgroundColor: C.surfaceContainerHigh }}>
        <View
          className="h-2 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
}

export default function TrustScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['worker-trust'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/workers/me', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
    staleTime: 120_000,
  });

  if (isLoading) {
    return (
      <SafeScreen style={{ flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C.primary} size="large" />
      </SafeScreen>
    );
  }

  const score = data?.trust_score ?? 0;
  const metrics = data?.trust_score_breakdown ?? {};
  const statusLabel =
    score >= 4.0 ? 'Excellent — Top worker' : score >= 3.0 ? 'Good standing' : 'Needs improvement';
  const statusColor =
    score >= 4.0 ? C.secondary : score >= 3.0 ? C.amber : '#ba1a1a';
  const statusBg =
    score >= 4.0 ? C.secondaryContainer : score >= 3.0 ? '#fef3c7' : '#ffdad6';

  return (
    <SafeScreen style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-4 pt-6 pb-2">
          <Text className="text-2xl font-bold mb-1" style={{ color: C.primary }}>Trust Score</Text>
          <Text className="text-sm" style={{ color: C.onSurfaceVariant }}>
            Your reliability rating with employers
          </Text>
        </View>

        {/* Gauge Card */}
        <View
          className="mx-4 mt-4 rounded-2xl items-center py-6 mb-4"
          style={{
            backgroundColor: C.surfaceContainerLowest,
            borderWidth: 1,
            borderColor: C.outlineVariant,
          }}
        >
          <TrustGauge score={score} size={220} />
          <View
            className="flex-row items-center gap-2 px-4 py-2 rounded-full mt-3"
            style={{ backgroundColor: statusBg }}
          >
            <TrendingUp size={14} color={statusColor} />
            <Text className="text-sm font-semibold" style={{ color: statusColor }}>
              {statusLabel}
            </Text>
          </View>
        </View>

        {/* Breakdown */}
        <View
          className="mx-4 rounded-2xl px-5 mb-4"
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
            Score Breakdown
          </Text>
          <MetricBar
            label="Show-up Rate (40%)"
            value={metrics.show_up_rate ?? 0}
            color={METRIC_COLORS.showUp}
          />
          <MetricBar
            label="Employer Rating (30%)"
            value={(metrics.employer_rating_avg ?? 0) / 5}
            color={METRIC_COLORS.rating}
          />
          <MetricBar
            label="Profile Depth (20%)"
            value={metrics.profile_depth_score ?? 0}
            color={METRIC_COLORS.profile}
          />
          <MetricBar
            label="Conduct (10%)"
            value={metrics.conduct_score ?? 0}
            color={METRIC_COLORS.conduct}
            isLast
          />
        </View>

        {/* Recent Ratings */}
        <View className="mx-4 mb-6">
          <Text
            className="text-xs font-bold uppercase tracking-widest px-1 pb-3"
            style={{ color: C.outline, letterSpacing: 1 }}
          >
            Recent Ratings
          </Text>
          {(data?.recent_ratings ?? []).length === 0 ? (
            <View
              className="rounded-2xl p-5 items-center"
              style={{
                backgroundColor: C.surfaceContainerLowest,
                borderWidth: 1,
                borderColor: C.outlineVariant,
              }}
            >
              <Text className="text-sm text-center" style={{ color: C.onSurfaceVariant }}>
                No ratings yet. Complete your first shift!
              </Text>
            </View>
          ) : (
            (data.recent_ratings as any[]).map((r: any, i: number) => (
              <View
                key={i}
                className="rounded-2xl p-4 mb-2"
                style={{
                  backgroundColor: C.surfaceContainerLowest,
                  borderWidth: 1,
                  borderColor: C.outlineVariant,
                }}
              >
                <View className="flex-row items-center justify-between mb-1.5">
                  <Text className="font-semibold text-base" style={{ color: C.onSurface }}>
                    {r.employer_property_type}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    {Array.from({ length: Math.round(r.overall_score) }).map((_, j) => (
                      <Star key={j} size={13} color={C.amber} fill={C.amber} />
                    ))}
                  </View>
                </View>
                {r.comment && (
                  <Text className="text-sm mb-1.5" style={{ color: C.onSurfaceVariant }}>{r.comment}</Text>
                )}
                <Text className="text-xs" style={{ color: C.outline }}>
                  {new Date(r.created_at).toLocaleDateString('en-IN')}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
