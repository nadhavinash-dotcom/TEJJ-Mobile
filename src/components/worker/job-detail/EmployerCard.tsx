import React from 'react';
import { View, Text } from 'react-native';
import {
  Building2,
  Star,
  BadgeCheck,
  MapPin,
  Train,
  Car,
  Users,
  ChefHat,
  ShieldCheck,
  Beer,
  CheckCircle,
} from 'lucide-react-native';
import { C } from './colors';

interface EmployerCardProps {
  employer_property_name: string;
  employer_property_type: string;
  employer_property_segment?: string;
  employer_area_locality?: string;
  employer_city?: string;
  employer_location_landmark?: string;
  employer_nearest_metro?: string;
  employer_parking_available?: boolean;
  employer_cuisine_types?: string[];
  employer_covers_capacity?: number | null;
  employer_number_of_rooms?: number | null;
  employer_brand_affiliation?: string;
  employer_year_established?: number | null;
  employer_dignity_score: number;
  employer_dignity_state?: string;
  employer_gstin_verified: boolean;
  employer_fssai_verified?: boolean;
  employer_liquor_license?: boolean;
  employer_psara_registered?: boolean;
  employer_verified_badge?: boolean;
  employer_confirmation_rate?: number | null;
  employer_pay_accuracy_rate?: number | null;
  employer_fair_treatment_rate?: number | null;
  employer_worker_return_rate?: number | null;
  employer_total_confirmed_arrivals?: number;
}

function MetricBar({ label, rate }: { label: string; rate: number }) {
  const pct = Math.min(100, Math.round(rate * 100));
  const barColor = pct >= 80 ? C.secondary : pct >= 60 ? C.amber : C.error;
  return (
    <View style={{ flex: 1, minWidth: 90 }}>
      <View className="flex-row items-center justify-between mb-1">
        <Text style={{ color: C.onSurfaceVariant, fontSize: 11 }}>{label}</Text>
        <Text style={{ color: barColor, fontSize: 11, fontWeight: '700' }}>{pct}%</Text>
      </View>
      <View style={{ height: 4, backgroundColor: C.surfaceContainerHigh, borderRadius: 2 }}>
        <View style={{ height: 4, width: `${pct}%`, backgroundColor: barColor, borderRadius: 2 }} />
      </View>
    </View>
  );
}

function Badge({ icon, label, color, bg }: { icon: React.ReactNode; label: string; color: string; bg: string }) {
  return (
    <View
      className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-xl"
      style={{ backgroundColor: bg, borderWidth: 1, borderColor: color + '40' }}
    >
      {icon}
      <Text style={{ color, fontSize: 11, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}

function dignityLabel(score: number, state: string): { label: string; color: string } {
  if (state === 'WARNING' || state === 'RESTRICTED') return { label: 'Caution', color: C.amber };
  if (state === 'SUSPENDED') return { label: 'Suspended', color: C.error };
  if (score >= 4.5) return { label: 'Excellent', color: C.secondary };
  if (score >= 4.0) return { label: 'Good', color: C.secondary };
  if (score >= 3.5) return { label: 'Average', color: C.amber };
  return { label: 'Below Avg', color: C.error };
}

export function EmployerCard(props: EmployerCardProps) {
  const {
    employer_property_name,
    employer_property_type,
    employer_property_segment,
    employer_area_locality,
    employer_city,
    employer_location_landmark,
    employer_nearest_metro,
    employer_parking_available,
    employer_cuisine_types,
    employer_covers_capacity,
    employer_number_of_rooms,
    employer_brand_affiliation,
    employer_year_established,
    employer_dignity_score,
    employer_dignity_state = 'NEW',
    employer_gstin_verified,
    employer_fssai_verified,
    employer_liquor_license,
    employer_psara_registered,
    employer_verified_badge,
    employer_confirmation_rate,
    employer_pay_accuracy_rate,
    employer_fair_treatment_rate,
    employer_worker_return_rate,
    employer_total_confirmed_arrivals = 0,
  } = props;

  const badges: React.ReactNode[] = [];
  if (employer_verified_badge) badges.push(<Badge key="v" icon={<BadgeCheck size={11} color={C.secondary} />} label="Verified" color={C.secondary} bg={C.secondaryContainer + '60'} />);
  if (employer_gstin_verified) badges.push(<Badge key="gst" icon={<CheckCircle size={11} color={C.secondary} />} label="GST" color={C.secondary} bg={C.secondaryContainer + '60'} />);
  if (employer_fssai_verified) badges.push(<Badge key="fssai" icon={<ShieldCheck size={11} color="#3B82F6" />} label="FSSAI" color="#3B82F6" bg="#3B82F615" />);
  if (employer_psara_registered) badges.push(<Badge key="psara" icon={<ShieldCheck size={11} color="#8B5CF6" />} label="PSARA" color="#8B5CF6" bg="#8B5CF615" />);
  if (employer_liquor_license) badges.push(<Badge key="liq" icon={<Beer size={11} color={C.onSurfaceVariant} />} label="Liquor Lic." color={C.onSurfaceVariant} bg={C.surfaceContainerHigh} />);

  const { label: dignityLbl, color: dignityColor } = dignityLabel(employer_dignity_score, employer_dignity_state);
  const hasMetrics = employer_total_confirmed_arrivals >= 5;
  const locationParts = [employer_area_locality, employer_city].filter(Boolean);
  const subtitleParts = [employer_property_type, employer_property_segment].filter(Boolean);
  if (employer_brand_affiliation) subtitleParts.push(employer_brand_affiliation);

  return (
    <View
      className="mx-4 rounded-2xl p-4 mb-4"
      style={{
        backgroundColor: C.surfaceContainerLowest,
        borderWidth: 1,
        borderColor: C.outlineVariant,
        gap: 14,
      }}
    >
      {/* Header */}
      <View>
        <Text className="text-xs font-bold uppercase mb-3" style={{ color: C.outline, letterSpacing: 1.5 }}>
          About the Employer
        </Text>

        <View className="flex-row items-start gap-3">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center"
            style={{ backgroundColor: C.primaryFixed }}
          >
            <Building2 size={22} color={C.primary} />
          </View>

          <View style={{ flex: 1, gap: 3 }}>
            <Text style={{ color: C.onSurface, fontSize: 16, fontWeight: '800', lineHeight: 20 }}>
              {employer_property_name || employer_property_type}
            </Text>

            {subtitleParts.length > 0 && (
              <Text style={{ color: C.onSurfaceVariant, fontSize: 12 }}>
                {subtitleParts.join('  ·  ')}
                {employer_year_established ? `  ·  Est. ${employer_year_established}` : ''}
              </Text>
            )}

            {/* Dignity score */}
            <View className="flex-row items-center gap-1.5 mt-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  size={11}
                  color={i <= Math.round(employer_dignity_score) ? C.amber : C.outlineVariant}
                  fill={i <= Math.round(employer_dignity_score) ? C.amber : 'transparent'}
                />
              ))}
              <Text style={{ color: C.onSurfaceVariant, fontSize: 11, marginLeft: 2 }}>
                {employer_dignity_score.toFixed(1)}  ·
              </Text>
              <Text style={{ color: dignityColor, fontSize: 11, fontWeight: '700' }}>{dignityLbl}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Badges */}
      {badges.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {badges}
        </View>
      )}

      {/* Location */}
      {(locationParts.length > 0 || employer_location_landmark || employer_nearest_metro) && (
        <View style={{ gap: 6 }}>
          <Text className="text-xs font-bold uppercase" style={{ color: C.outline, letterSpacing: 1.5 }}>
            Location
          </Text>

          {locationParts.length > 0 && (
            <View className="flex-row items-start gap-2">
              <MapPin size={13} color={C.onSurfaceVariant} style={{ marginTop: 1 }} />
              <Text style={{ color: C.onSurface, fontSize: 13, flex: 1 }}>
                {locationParts.join(', ')}
              </Text>
            </View>
          )}

          {employer_location_landmark && (
            <View className="flex-row items-start gap-2">
              <MapPin size={13} color={C.onSurfaceVariant} style={{ marginTop: 1, opacity: 0.5 }} />
              <Text style={{ color: C.onSurfaceVariant, fontSize: 12, flex: 1 }}>
                Near {employer_location_landmark}
              </Text>
            </View>
          )}

          {employer_nearest_metro && (
            <View className="flex-row items-center gap-2">
              <Train size={13} color={C.onSurfaceVariant} />
              <Text style={{ color: C.onSurfaceVariant, fontSize: 12 }}>
                {employer_nearest_metro}
              </Text>
            </View>
          )}

          {employer_parking_available && (
            <View className="flex-row items-center gap-2">
              <Car size={13} color={C.secondary} />
              <Text style={{ color: C.secondary, fontSize: 12, fontWeight: '600' }}>
                Parking available
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Cuisine / Capacity */}
      {((employer_cuisine_types && employer_cuisine_types.length > 0) ||
        employer_covers_capacity ||
        employer_number_of_rooms) && (
        <View style={{ gap: 6 }}>
          {employer_cuisine_types && employer_cuisine_types.length > 0 && (
            <View className="flex-row items-start gap-2">
              <ChefHat size={13} color={C.onSurfaceVariant} style={{ marginTop: 1 }} />
              <Text style={{ color: C.onSurface, fontSize: 13, flex: 1 }}>
                {employer_cuisine_types.join(' · ')}
              </Text>
            </View>
          )}

          {(employer_covers_capacity || employer_number_of_rooms) && (
            <View className="flex-row items-center gap-2">
              <Users size={13} color={C.onSurfaceVariant} />
              <Text style={{ color: C.onSurfaceVariant, fontSize: 12 }}>
                {employer_covers_capacity
                  ? `${employer_covers_capacity} covers capacity`
                  : `${employer_number_of_rooms} rooms`}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Employer Metrics */}
      {hasMetrics && (
        <View style={{ gap: 8 }}>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-bold uppercase" style={{ color: C.outline, letterSpacing: 1.5 }}>
              Employer Track Record
            </Text>
            <Text style={{ color: C.onSurfaceVariant, fontSize: 11 }}>
              {employer_total_confirmed_arrivals} hires
            </Text>
          </View>
          <View className="flex-row gap-3 flex-wrap">
            {employer_confirmation_rate != null && (
              <MetricBar label="Confirmation" rate={employer_confirmation_rate} />
            )}
            {employer_pay_accuracy_rate != null && (
              <MetricBar label="Pay Accuracy" rate={employer_pay_accuracy_rate} />
            )}
            {employer_fair_treatment_rate != null && (
              <MetricBar label="Fair Treatment" rate={employer_fair_treatment_rate} />
            )}
            {employer_worker_return_rate != null && employer_worker_return_rate > 0 && (
              <MetricBar label="Worker Return" rate={employer_worker_return_rate} />
            )}
          </View>
        </View>
      )}

      {!hasMetrics && employer_total_confirmed_arrivals === 0 && (
        <View
          className="px-3 py-2 rounded-xl"
          style={{ backgroundColor: C.surfaceContainerLow }}
        >
          <Text style={{ color: C.onSurfaceVariant, fontSize: 12 }}>
            New employer on Tejj — no track record yet
          </Text>
        </View>
      )}
    </View>
  );
}
