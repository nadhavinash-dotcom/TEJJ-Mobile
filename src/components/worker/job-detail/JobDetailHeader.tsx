import React from 'react';
import { View, Text } from 'react-native';
import { BadgeCheck, Building2, MapPin, TrendingUp } from 'lucide-react-native';
import { HIRING_LANES } from '@/utils';
import { LucideIcon } from '../../shared/LucideIcon';
import { C, LANE_COLORS } from './colors';

const PAY_LABEL: Record<string, string> = {
  PER_SHIFT: 'Pay per shift',
  DAILY: 'Pay per day',
  MONTHLY: 'Monthly salary',
  ANNUAL: 'Annual CTC',
};

const PAY_SUFFIX: Record<string, string> = {
  PER_SHIFT: '/ shift',
  DAILY: '/ day',
  MONTHLY: '/ month',
  ANNUAL: '/ year',
};

interface JobDetailHeaderProps {
  job: {
    lane: number;
    job_title: string;
    pay_rate?: number | null;
    pay_type: string;
    pay_min?: number | null;
    pay_max?: number | null;
    pay_vs_market?: number | null;
    boost_active?: boolean;
    cream_pool_first?: boolean;
    employer_property_name?: string;
    employer_property_type?: string;
    employer_area_locality?: string;
    employer_city?: string;
    employer_gstin_verified?: boolean;
    distance_km?: number | null;
  };
}

function PayDisplay({ pay_rate, pay_min, pay_max, pay_type }: {
  pay_rate?: number | null;
  pay_min?: number | null;
  pay_max?: number | null;
  pay_type: string;
}) {
  const suffix = PAY_SUFFIX[pay_type] ?? '/ shift';
  const label = PAY_LABEL[pay_type] ?? 'Pay per shift';

  if (pay_rate != null) {
    return (
      <View>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 2 }}>{label}</Text>
        <View className="flex-row items-baseline gap-1">
          <Text style={{ color: C.amber, fontSize: 30, fontWeight: '800', letterSpacing: -0.5 }}>
            ₹{pay_rate.toLocaleString('en-IN')}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{suffix}</Text>
        </View>
      </View>
    );
  }

  if (pay_min != null) {
    return (
      <View>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 2 }}>
          {pay_max != null ? 'Pay range' : 'Starting pay'}{pay_type !== 'PER_SHIFT' ? ` (${PAY_SUFFIX[pay_type]?.replace('/ ', '')})` : ''}
        </Text>
        <View className="flex-row items-baseline gap-1 flex-wrap">
          <Text style={{ color: C.amber, fontSize: 22, fontWeight: '800' }}>
            ₹{pay_min.toLocaleString('en-IN')}
            {pay_max != null && (
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18, fontWeight: '600' }}>
                {' – '}₹{pay_max.toLocaleString('en-IN')}
              </Text>
            )}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{suffix}</Text>
        </View>
      </View>
    );
  }

  return null;
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const laneKey = `L${job.lane}` as keyof typeof HIRING_LANES;
  const lane = HIRING_LANES[laneKey];
  const laneColor = LANE_COLORS[job.lane] ?? '#767683';

  const locationLine = [job.employer_area_locality, job.employer_city]
    .filter(Boolean)
    .join(', ');

  return (
    <View className="mx-4 rounded-3xl p-5 mb-4" style={{ backgroundColor: C.primary }}>
      {/* Top badge row */}
      <View className="flex-row items-center gap-2 mb-4 flex-wrap">
        <View
          className="px-2.5 py-1 rounded-lg flex-row items-center gap-1.5"
          style={{ backgroundColor: laneColor + '30' }}
        >
          <LucideIcon name={lane.icon} size={12} color={laneColor} />
          <Text className="font-bold text-[11px] uppercase tracking-tight" style={{ color: laneColor }}>
            {lane.label}
          </Text>
        </View>

        <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{lane.window}</Text>

        <View style={{ flex: 1 }} />

        {job.boost_active && (
          <View
            className="px-2 py-1 rounded-lg flex-row items-center gap-1"
            style={{ backgroundColor: C.amber + '25' }}
          >
            <LucideIcon name="Zap" size={10} color={C.amber} />
            <Text style={{ color: C.amber, fontSize: 10, fontWeight: '700' }}>Boosted</Text>
          </View>
        )}

        {job.cream_pool_first && (
          <View
            className="px-2 py-1 rounded-lg"
            style={{ backgroundColor: '#8B5CF620' }}
          >
            <Text style={{ color: '#A78BFA', fontSize: 10, fontWeight: '700' }}>Cream Pool</Text>
          </View>
        )}

        {job.employer_gstin_verified && (
          <View
            className="flex-row items-center gap-1 px-2 py-1 rounded-lg"
            style={{ backgroundColor: C.secondaryContainer }}
          >
            <BadgeCheck size={11} color={C.onSecondaryContainer} />
            <Text style={{ color: C.onSecondaryContainer, fontSize: 10, fontWeight: '700' }}>GST</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '800', lineHeight: 28, marginBottom: 6 }}>
        {job.job_title}
      </Text>

      {/* Employer/Location */}
      <View className="flex-row items-center gap-1.5 mb-5">
        <Building2 size={12} color="rgba(255,255,255,0.5)" />
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }} numberOfLines={1}>
          {[job.employer_property_name, job.employer_property_type].filter(Boolean).join(' · ')}
          {locationLine ? `  ·  ${locationLine}` : ''}
        </Text>
      </View>

      {/* Pay + Distance */}
      <View className="flex-row items-end justify-between">
        <PayDisplay
          pay_rate={job.pay_rate}
          pay_min={job.pay_min}
          pay_max={job.pay_max}
          pay_type={job.pay_type}
        />

        <View style={{ alignItems: 'flex-end', gap: 4 }}>
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

          {job.pay_vs_market != null && job.pay_vs_market > 0 && (
            <View className="flex-row items-center gap-1 px-2 py-1 rounded-lg" style={{ backgroundColor: '#006b5e30' }}>
              <TrendingUp size={10} color="#7ad7c6" />
              <Text style={{ color: '#7ad7c6', fontSize: 10, fontWeight: '700' }}>
                +{job.pay_vs_market}% market
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
