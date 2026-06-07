import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { HIRING_LANES } from '@/utils';
import { LucideIcon } from '../../shared/LucideIcon';
import { LANE_COLORS } from './colors';

interface TimeLeft {
  ms: number;
  days: number;
  hours: number;
  mins: number;
  display: string;
}

function computeTimeLeft(expires_at: string): TimeLeft | null {
  const ms = new Date(expires_at).getTime() - Date.now();
  if (ms <= 0) return null;

  const days = Math.floor(ms / (24 * 3600 * 1000));
  const hours = Math.floor((ms % (24 * 3600 * 1000)) / (3600 * 1000));
  const mins = Math.floor((ms % (3600 * 1000)) / 60000);

  let display: string;
  if (days > 1) display = `${days} days`;
  else if (days === 1) display = hours > 0 ? `1 day ${hours}h` : '1 day';
  else if (hours > 0) display = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  else display = `${mins}m`;

  return { ms, days, hours, mins, display };
}

function isCriticalTime(lane: number, timeLeft: TimeLeft | null): boolean {
  if (!timeLeft) return false;
  if (lane === 1) return timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.mins < 30;
  if (lane === 2) return timeLeft.days === 0 && timeLeft.hours < 2;
  return false;
}

interface JobExpiryBannerProps {
  expires_at?: string | null;
  lane: number;
  status: string;
  contract_start_date?: string | null;
  contract_duration?: string;
}

export function JobExpiryBanner({
  expires_at,
  lane,
  status,
  contract_start_date,
  contract_duration,
}: JobExpiryBannerProps) {
  const laneKey = `L${lane}` as keyof typeof HIRING_LANES;
  const laneInfo = HIRING_LANES[laneKey];
  const laneColor = LANE_COLORS[lane] ?? '#767683';

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    expires_at ? computeTimeLeft(expires_at) : null
  );

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const critical = isCriticalTime(lane, timeLeft);
  const isClosedStatus = ['EXPIRED', 'FILLED', 'CANCELLED'].includes(status);

  useEffect(() => {
    if (!expires_at) return;
    const timer = setInterval(() => {
      setTimeLeft(computeTimeLeft(expires_at));
    }, 30_000);
    return () => clearInterval(timer);
  }, [expires_at]);

  useEffect(() => {
    if (!critical) {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.2, duration: 550, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 550, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [critical]);

  const borderColor = critical ? laneColor : laneColor + '40';
  const bgColor = laneColor + (critical ? '15' : '0d');
  const hasDivider = !isClosedStatus && (expires_at || contract_start_date);

  return (
    <View
      className="mx-4 rounded-2xl mb-4 overflow-hidden"
      style={{ borderWidth: critical ? 1.5 : 1, borderColor, backgroundColor: bgColor }}
    >
      {/* Hiring window row */}
      <View
        className="flex-row items-center gap-2 px-4 py-3"
        style={hasDivider ? { borderBottomWidth: 1, borderBottomColor: laneColor + '25' } : undefined}
      >
        <LucideIcon name={laneInfo.icon} size={14} color={laneColor} />
        <Text style={{ color: laneColor, fontWeight: '700', fontSize: 13 }}>{laneInfo.label}</Text>
        <Text style={{ color: laneColor, opacity: 0.6, fontSize: 12 }}>·  {laneInfo.window}</Text>
      </View>

      {/* Expiry countdown row (L1 / L2) */}
      {!isClosedStatus && expires_at && (lane === 1 || lane === 2) && (
        <View className="flex-row items-center gap-2 px-4 py-3">
          {critical ? (
            <>
              <Animated.View style={{ opacity: pulseAnim }}>
                <LucideIcon name="AlarmClock" size={13} color={laneColor} />
              </Animated.View>
              <Text style={{ color: laneColor, fontWeight: '800', fontSize: 13, flex: 1 }}>
                Apply in {timeLeft?.display ?? '—'}  · Closes soon!
              </Text>
            </>
          ) : timeLeft ? (
            <>
              <LucideIcon name="Clock" size={13} color={laneColor} />
              <Text style={{ color: laneColor, opacity: 0.85, fontSize: 13 }}>
                Closes in {timeLeft.display}
              </Text>
            </>
          ) : (
            <>
              <LucideIcon name="Clock" size={13} color={laneColor} />
              <Text style={{ color: laneColor, opacity: 0.65, fontSize: 13 }}>Expired</Text>
            </>
          )}
        </View>
      )}

      {/* Contract closes date (L3/L4) */}
      {!isClosedStatus && expires_at && (lane === 3 || lane === 4) && (
        <View className="flex-row items-center gap-2 px-4 py-3">
          <LucideIcon name="Clock" size={13} color={laneColor} />
          <Text style={{ color: laneColor, opacity: 0.85, fontSize: 13 }}>
            Applications close{' '}
            {timeLeft
              ? `in ${timeLeft.display}`
              : new Date(expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </Text>
        </View>
      )}

      {/* Contract start date row (L3/L4) */}
      {(lane === 3 || lane === 4) && contract_start_date && (
        <View
          className="flex-row items-center gap-2 px-4 py-3"
          style={{ borderTopWidth: 1, borderTopColor: laneColor + '25' }}
        >
          <LucideIcon name="CalendarCheck" size={13} color={laneColor} />
          <Text style={{ color: laneColor, opacity: 0.9, fontSize: 13 }}>
            Starts{' '}
            {new Date(contract_start_date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
            {contract_duration ? `  ·  ${contract_duration}` : ''}
          </Text>
        </View>
      )}
    </View>
  );
}
