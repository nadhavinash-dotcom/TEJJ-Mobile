import React from 'react';
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { auth } from '../../lib/firebase';

interface PayBenchmarkBoxProps {
  skill: string;
  payRate: number;
}

export function PayBenchmarkBox({ skill, payRate }: PayBenchmarkBoxProps) {
  const { data } = useQuery({
    queryKey: ['market-rate', skill],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get(`/market-rates/${skill}`, { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data as { median: number; p25: number; p75: number };
    },
    enabled: !!skill,
    staleTime: 5 * 60_000,
  });

  if (!data || !payRate) return null;

  const diff = payRate - data.median;
  const isAbove = diff >= 0;

  return (
    <View className={`mt-2 px-3 py-2 rounded-xl border ${isAbove ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
      <Text className={`text-xs ${isAbove ? 'text-green-400' : 'text-amber-400'}`}>
        {isAbove ? '↑' : '↓'} {isAbove ? 'Above' : 'Below'} market median (₹{data.median.toLocaleString('en-IN')})
      </Text>
      <Text className="text-navy-400 text-xs mt-0.5">
        Range: ₹{data.p25.toLocaleString('en-IN')} – ₹{data.p75.toLocaleString('en-IN')}
      </Text>
    </View>
  );
}
