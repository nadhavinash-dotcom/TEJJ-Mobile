import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { C } from './colors';

interface JobApplyCTAProps {
  status: string;
  has_applied: boolean;
  application_id?: string | null;
  applying: boolean;
  onApply: () => void;
}

export function JobApplyCTA({ status, has_applied, application_id, applying, onApply }: JobApplyCTAProps) {
  const isClosed = status === 'EXPIRED' || status === 'FILLED' || status === 'CANCELLED';

  return (
    <View
      className="px-4 pb-6 pt-3"
      style={{ borderTopWidth: 1, borderTopColor: C.outlineVariant, backgroundColor: C.background }}
    >
      {has_applied ? (
        <View style={{ gap: 10 }}>
          <View
            className="rounded-2xl py-4 items-center"
            style={{ backgroundColor: C.secondaryContainer }}
          >
            <Text style={{ color: C.onSecondaryContainer, fontWeight: '800', fontSize: 17 }}>
              Application Submitted
            </Text>
          </View>

          {application_id && (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/(worker)/applied/[id]', params: { id: application_id } })}
              className="rounded-2xl py-3.5 items-center border"
              style={{ borderColor: C.outlineVariant }}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center gap-2">
                <Text style={{ color: C.primary, fontSize: 15, fontWeight: '600' }}>View Application</Text>
                <ChevronRight size={18} color={C.primary} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity
          onPress={onApply}
          disabled={applying || isClosed}
          className="rounded-2xl py-4 items-center"
          style={{
            backgroundColor: applying || isClosed ? C.surfaceContainerHigh : C.primary,
          }}
          activeOpacity={0.85}
        >
          {applying ? (
            <ActivityIndicator color={C.primary} />
          ) : isClosed ? (
            <Text style={{ color: C.onSurfaceVariant, fontWeight: '700', fontSize: 17 }}>
              {status === 'EXPIRED' ? 'Job Expired' : status === 'FILLED' ? 'No Openings Left' : 'Job Closed'}
            </Text>
          ) : (
            <View className="flex-row items-center gap-2">
              <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 17 }}>Apply Now</Text>
              <ChevronRight size={20} color="#ffffff" />
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
