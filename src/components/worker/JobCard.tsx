import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { HIRING_LANES } from '@/utils';

interface JobCardProps {
  job: {
    _id: string;
    job_title: string;
    primary_skill: string;
    pay_rate?: number;
    shift_start_time?: string;
    shift_duration_hours?: number;
    lane: number;
    distance_km: number;
    sups_score: number;
    employer_property_type: string;
    employer_area_locality: string;
    employer_dignity_score: number;
    employer_gstin_verified?: boolean;
    market_rate_delta?: number;
    number_of_openings: number;
    openings_filled: number;
  };
  onPress: () => void;
}

export function JobCard({ job, onPress }: JobCardProps) {
  const laneKey = `L${job.lane}` as keyof typeof HIRING_LANES;
  const lane = HIRING_LANES[laneKey];

  const supsColor = job.sups_score >= 75 ? 'bg-green-500' : job.sups_score >= 60 ? 'bg-amber-400' : 'bg-red-400';

  const shiftTime = job.shift_start_time
    ? new Date(job.shift_start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    : null;

  const spotsLeft = job.number_of_openings - job.openings_filled;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="mx-4 mb-3 bg-navy-800 rounded-3xl p-4 border border-navy-700"
      activeOpacity={0.85}
    >
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <View className="px-2 py-1 rounded-lg" style={{ backgroundColor: lane.color }}>
            <Text className="text-white text-xs font-bold">{lane.icon} {lane.label}</Text>
          </View>
          <View className={`w-2 h-2 rounded-full ${supsColor}`} />
        </View>
        <Text className="text-navy-400 text-xs">{job.distance_km} km</Text>
      </View>

      {/* Job title */}
      <Text className="text-white text-base font-bold mb-1" numberOfLines={1}>{job.job_title}</Text>

      {/* Property */}
      <Text className="text-navy-300 text-sm mb-2">
        {job.employer_property_type} · {job.employer_area_locality}
      </Text>

      {/* Shift info */}
      {shiftTime && (
        <Text className="text-navy-300 text-sm mb-2">
          {shiftTime} · {job.shift_duration_hours} hrs
        </Text>
      )}

      {/* Bottom row */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Text className="text-white text-lg font-bold">
            ₹{job.pay_rate?.toLocaleString('en-IN')}
            <Text className="text-navy-400 text-sm font-normal"> /shift</Text>
          </Text>
          {job.employer_dignity_score >= 4.0 && (
            <Text className="text-amber-400 text-xs">⭐ {job.employer_dignity_score.toFixed(1)}</Text>
          )}
          {job.employer_gstin_verified && (
            <Text className="text-green-400 text-xs">✓ GST</Text>
          )}
        </View>
        <View className="bg-amber-500 px-4 py-2 rounded-xl">
          <Text className="text-white font-bold text-sm">Apply →</Text>
        </View>
      </View>

      {/* Market rate indicator */}
      {job.market_rate_delta !== undefined && job.market_rate_delta > 0 && (
        <Text className="text-green-400 text-xs mt-2">↑ Market rate se upar</Text>
      )}

      {/* Spots left */}
      {spotsLeft <= 2 && spotsLeft > 0 && (
        <Text className="text-red-400 text-xs mt-1">⚡ Sirf {spotsLeft} jagah baaki</Text>
      )}
    </TouchableOpacity>
  );
}
