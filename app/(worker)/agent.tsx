import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { auth } from '../../src/lib/firebase';

export default function AgentScreen() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['worker-agent'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/workers/me', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data;
    },
  });

  const [agentEnabled, setAgentEnabled] = useState(data?.agent_mode_enabled ?? false);
  const [autoAcceptBelow, setAutoAcceptBelow] = useState(data?.agent_rules?.auto_accept_below_km ?? 5);
  const [minPay, setMinPay] = useState(data?.agent_rules?.min_pay_override ?? 500);

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const token = await auth.currentUser?.getIdToken();
      await api.patch('/workers/agent-mode', payload, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['worker-agent'] }); Alert.alert('Saved', 'Agent settings updated!'); },
    onError: () => Alert.alert('Error', 'Could not save settings.'),
  });

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <Text className="text-amber-400 text-base">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold mb-1">Agent Mode</Text>
          <Text className="text-navy-300 text-sm mb-6">Let TEJJ auto-accept Flash jobs that match your rules</Text>
        </View>

        <View className="px-4 gap-4">
          <View className="bg-navy-800 border border-navy-700 rounded-2xl p-5">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white font-semibold text-lg">Agent Mode</Text>
              <Switch
                value={agentEnabled}
                onValueChange={setAgentEnabled}
                trackColor={{ false: '#374151', true: '#F59E0B' }}
                thumbColor="#fff"
              />
            </View>
            <Text className="text-navy-400 text-sm">
              {agentEnabled ? '🤖 Active — TEJJ can auto-accept L1 Flash jobs for you' : 'Off — you manually accept all jobs'}
            </Text>
          </View>

          {agentEnabled && (
            <>
              <View className="bg-navy-800 border border-navy-700 rounded-2xl p-5">
                <Text className="text-white font-semibold mb-4">Auto-accept if distance ≤ {autoAcceptBelow} km</Text>
                <Slider
                  minimumValue={1}
                  maximumValue={15}
                  step={1}
                  value={autoAcceptBelow}
                  onValueChange={setAutoAcceptBelow}
                  minimumTrackTintColor="#F59E0B"
                  maximumTrackTintColor="#374151"
                  thumbTintColor="#F59E0B"
                />
                <View className="flex-row justify-between mt-1">
                  <Text className="text-navy-400 text-xs">1 km</Text>
                  <Text className="text-navy-400 text-xs">15 km</Text>
                </View>
              </View>

              <View className="bg-navy-800 border border-navy-700 rounded-2xl p-5">
                <Text className="text-white font-semibold mb-4">Min pay: ₹{minPay.toLocaleString('en-IN')}/shift</Text>
                <Slider
                  minimumValue={200}
                  maximumValue={2000}
                  step={50}
                  value={minPay}
                  onValueChange={setMinPay}
                  minimumTrackTintColor="#F59E0B"
                  maximumTrackTintColor="#374151"
                  thumbTintColor="#F59E0B"
                />
                <View className="flex-row justify-between mt-1">
                  <Text className="text-navy-400 text-xs">₹200</Text>
                  <Text className="text-navy-400 text-xs">₹2,000</Text>
                </View>
              </View>
            </>
          )}

          <TouchableOpacity
            onPress={() => mutation.mutate({ agent_mode_enabled: agentEnabled, agent_rules: { auto_accept_below_km: autoAcceptBelow, min_pay_override: minPay } })}
            disabled={mutation.isPending}
            className="bg-amber-500 rounded-2xl py-4 items-center mb-8"
            activeOpacity={0.85}
          >
            {mutation.isPending ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Save Settings</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
