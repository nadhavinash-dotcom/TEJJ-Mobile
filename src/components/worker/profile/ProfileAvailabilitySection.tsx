// Availability & Pay Expectations sections of the Worker Profile screen
import React from 'react';
import { Clock, CalendarDays, ChevronUp, Wallet } from 'lucide-react-native';
import { ProfileColors as C } from './ProfileColors';
import { SectionCard, InfoRow } from './ProfilePrimitives';

// ── Availability ─────────────────────────────────────────────────────────────

interface ProfileAvailabilitySectionProps {
  days: string[];
  shifts: string[];
  availFrom: string | null;
  availTo: string | null;
}

export function ProfileAvailabilitySection({ days, shifts, availFrom, availTo }: ProfileAvailabilitySectionProps) {
  const availTimeStr = availFrom && availTo ? `${availFrom} – ${availTo}` : '—';

  return (
    <SectionCard title="Availability">
      <InfoRow
        icon={<Clock size={14} color={C.onSurfaceVariant} />}
        label="Working Hours"
        value={availTimeStr}
      />
      {days.length > 0 && (
        <InfoRow
          icon={<CalendarDays size={14} color={C.onSurfaceVariant} />}
          label="Days Available"
          value={days.join(', ')}
        />
      )}
      {shifts.length > 0 && (
        <InfoRow
          icon={<ChevronUp size={14} color={C.onSurfaceVariant} />}
          label="Preferred Shifts"
          value={shifts.join(', ')}
        />
      )}
    </SectionCard>
  );
}

// ── Pay Expectations ─────────────────────────────────────────────────────────

interface ProfilePaySectionProps {
  minShiftPay: number | null;
  minMonthlySalary: number | null;
}

export function ProfilePaySection({ minShiftPay, minMonthlySalary }: ProfilePaySectionProps) {
  const minShift   = minShiftPay   ? `₹${minShiftPay.toLocaleString()}`   : '—';
  const minMonthly = minMonthlySalary ? `₹${minMonthlySalary.toLocaleString()}` : '—';

  return (
    <SectionCard title="Pay Expectations">
      <InfoRow
        icon={<Wallet size={14} color={C.onSurfaceVariant} />}
        label="Min. Per Shift"
        value={minShift}
        color={C.green}
      />
      <InfoRow
        icon={<Wallet size={14} color={C.onSurfaceVariant} />}
        label="Min. Monthly"
        value={minMonthly}
        color={C.green}
      />
    </SectionCard>
  );
}
