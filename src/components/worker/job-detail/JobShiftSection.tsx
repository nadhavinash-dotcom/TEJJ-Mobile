import React from 'react';
import { View, Text } from 'react-native';
import {
  AlarmClock,
  Clock,
  Users,
  Briefcase,
  GraduationCap,
  Calendar,
  Timer,
  Video,
  Building,
  CalendarRange,
} from 'lucide-react-native';
import { InfoRow } from './InfoRow';
import { C } from './colors';

interface JobShiftSectionProps {
  lane: number;
  shift_start_time?: string | null;
  shift_end_time?: string | null;
  shift_duration_hours?: number | null;
  number_of_openings: number;
  openings_filled: number;
  experience_years_min?: number | null;
  minimum_qualification?: string;
  contract_start_date?: string | null;
  contract_duration?: string;
  notice_period_max_days?: number | null;
  interview_required?: boolean;
  interview_format?: string | null;
}

function sectionTitle(lane: number): string {
  if (lane === 1 || lane === 2) return 'Shift Details';
  if (lane === 3) return 'Contract Details';
  return 'Role Details';
}

function fmt(time: string) {
  return new Date(time).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function fmtDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function JobShiftSection({
  lane,
  shift_start_time,
  shift_end_time,
  shift_duration_hours,
  number_of_openings,
  openings_filled,
  experience_years_min,
  minimum_qualification,
  contract_start_date,
  contract_duration,
  notice_period_max_days,
  interview_required,
  interview_format,
}: JobShiftSectionProps) {
  const spotsLeft = number_of_openings - openings_filled;

  const rows: React.ReactNode[] = [];

  if (lane === 1 || lane === 2) {
    if (shift_start_time) {
      rows.push(
        <InfoRow
          key="start"
          icon={<AlarmClock size={15} color={C.onSurfaceVariant} />}
          label="Start time"
          value={fmt(shift_start_time)}
        />
      );
    }
    if (shift_end_time) {
      rows.push(
        <InfoRow
          key="end"
          icon={<Clock size={15} color={C.onSurfaceVariant} />}
          label="End time"
          value={fmt(shift_end_time)}
        />
      );
    }
    if (shift_duration_hours) {
      rows.push(
        <InfoRow
          key="dur"
          icon={<Timer size={15} color={C.onSurfaceVariant} />}
          label="Duration"
          value={`${shift_duration_hours} hours`}
        />
      );
    }
  }

  if (lane === 3 || lane === 4) {
    if (contract_start_date) {
      rows.push(
        <InfoRow
          key="cstart"
          icon={<Calendar size={15} color={C.onSurfaceVariant} />}
          label="Start date"
          value={fmtDate(contract_start_date)}
        />
      );
    }
    if (contract_duration) {
      rows.push(
        <InfoRow
          key="cdur"
          icon={<CalendarRange size={15} color={C.onSurfaceVariant} />}
          label="Duration"
          value={contract_duration}
        />
      );
    }
    if (notice_period_max_days != null) {
      rows.push(
        <InfoRow
          key="notice"
          icon={<Clock size={15} color={C.onSurfaceVariant} />}
          label="Notice period"
          value={`${notice_period_max_days} days max`}
        />
      );
    }
    if (interview_required) {
      rows.push(
        <InfoRow
          key="interview"
          icon={<Video size={15} color={C.onSurfaceVariant} />}
          label="Interview"
          value={interview_format ?? 'Required'}
        />
      );
    }
  }

  rows.push(
    <InfoRow
      key="openings"
      icon={<Users size={15} color={C.onSurfaceVariant} />}
      label="Openings"
      value={`${number_of_openings} total  ·  ${spotsLeft} left`}
    />
  );

  if (experience_years_min != null && experience_years_min > 0) {
    rows.push(
      <InfoRow
        key="exp"
        icon={<Briefcase size={15} color={C.onSurfaceVariant} />}
        label="Experience"
        value={`${experience_years_min}+ years`}
      />
    );
  }

  if (minimum_qualification) {
    rows.push(
      <InfoRow
        key="qual"
        icon={<GraduationCap size={15} color={C.onSurfaceVariant} />}
        label="Qualification"
        value={minimum_qualification}
      />
    );
  }

  if (rows.length === 0) return null;

  // Remove border from last row
  const withNoBorder = rows.map((row, i) =>
    i === rows.length - 1
      ? React.cloneElement(row as React.ReactElement, { noBorder: true })
      : row
  );

  return (
    <View
      className="mx-4 rounded-2xl px-4 mb-4"
      style={{
        backgroundColor: C.surfaceContainerLowest,
        borderWidth: 1,
        borderColor: C.outlineVariant,
      }}
    >
      <Text
        className="text-xs font-bold uppercase pt-4 pb-1"
        style={{ color: C.outline, letterSpacing: 1.5 }}
      >
        {sectionTitle(lane)}
      </Text>
      {withNoBorder}
      <View style={{ height: 4 }} />
    </View>
  );
}
