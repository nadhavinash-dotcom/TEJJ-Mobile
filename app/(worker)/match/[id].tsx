import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../../src/lib/api';
import { CheckCircle, MapPin, Clock, Banknote, User, QrCode, ArrowLeft } from 'lucide-react-native';

const C = {
  primary: '#000666',
  primaryFixed: '#e0e0ff',
  background: '#fbf8fe',
  surfaceContainerLowest: '#ffffff',
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

function DetailRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <View className="flex-row items-start gap-3 py-3"
      style={{ borderBottomWidth: 1, borderBottomColor: C.outlineVariant }}
    >
      <View className="mt-0.5">{icon}</View>
      <Text className="flex-1 text-sm font-medium" style={{ color: C.onSurface }}>{value}</Text>
    </View>
  );
}

export default function MatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: match, isLoading } = useQuery({
    queryKey: ['match', id],
    queryFn: async () => {
      const res = await api.get(`/matches/${id}`);
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <SafeScreen style={{ flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C.primary} size="large" />
      </SafeScreen>
    );
  }

  const shiftTime = match?.shift_start_time
    ? new Date(match.shift_start_time).toLocaleString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : null;

  return (
    <SafeScreen style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Success header */}
        <View
          className="mx-4 mt-6 mb-5 rounded-3xl p-6 items-center"
          style={{ backgroundColor: C.primary }}
        >
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: C.secondaryContainer }}
          >
            <CheckCircle size={40} color={C.secondary} />
          </View>
          <Text className="text-white text-2xl font-bold mb-1">Match Confirmed!</Text>
          <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, textAlign: 'center' }}>
            You got the job. Show up on time and scan your QR code.
          </Text>
        </View>

        {/* Job Details */}
        <View
          className="mx-4 rounded-2xl mb-5"
          style={{
            backgroundColor: C.surfaceContainerLowest,
            borderWidth: 1,
            borderColor: C.outlineVariant,
          }}
        >
          <View className="px-5 pt-5 pb-3">
            <Text
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: C.outline, letterSpacing: 1 }}
            >
              Job Details
            </Text>
            <Text className="text-xl font-bold mb-1" style={{ color: C.onSurface }}>
              {match?.job_title}
            </Text>
            <Text className="text-sm mb-1" style={{ color: C.onSurfaceVariant }}>
              {match?.employer_property_type}
            </Text>
          </View>

          <View className="px-5 pb-4">
            {match?.venue_address && (
              <DetailRow
                icon={<MapPin size={16} color={C.secondary} />}
                value={match.venue_address}
              />
            )}
            {shiftTime && (
              <DetailRow
                icon={<Clock size={16} color={C.secondary} />}
                value={shiftTime}
              />
            )}
            <DetailRow
              icon={<Banknote size={16} color={C.secondary} />}
              value={`₹${match?.pay_rate?.toLocaleString('en-IN')} for ${match?.shift_duration_hours} hrs`}
            />
            {match?.contact_name && (
              <View className="flex-row items-center gap-3 pt-3">
                <User size={16} color={C.secondary} />
                <Text className="text-sm font-medium" style={{ color: C.onSurface }}>
                  Ask for: <Text className="font-bold">{match.contact_name}</Text>
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Reminder */}
        <View
          className="mx-4 rounded-2xl px-4 py-3 flex-row items-center gap-3 mb-6"
          style={{ backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a' }}
        >
          <View
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: '#fef3c7' }}
          >
            <Clock size={15} color={C.amber} />
          </View>
          <Text className="text-sm flex-1" style={{ color: '#92400e' }}>
            Scan your QR code when you arrive so the employer can verify attendance.
          </Text>
        </View>

        {/* Actions */}
        <View className="mx-4 gap-3">
          <TouchableOpacity
            onPress={() => router.push('/(worker)/qr-code')}
            className="rounded-2xl py-4 flex-row items-center justify-center gap-2"
            style={{ backgroundColor: C.primary }}
            activeOpacity={0.85}
          >
            <QrCode size={20} color="#ffffff" />
            <Text className="text-white font-bold text-base">Show My QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace('/(worker)/(tabs)/feed')}
            className="rounded-2xl py-4 flex-row items-center justify-center gap-2"
            style={{
              backgroundColor: C.surfaceContainerLowest,
              borderWidth: 1,
              borderColor: C.outlineVariant,
            }}
            activeOpacity={0.8}
          >
            <ArrowLeft size={16} color={C.onSurfaceVariant} />
            <Text className="font-medium" style={{ color: C.onSurfaceVariant }}>Back to Feed</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
