import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { auth } from '../../src/lib/firebase';
import { LucideIcon } from '../../src/components/shared/LucideIcon';

export default function CrewPoolsScreen() {
  const qc = useQueryClient();
  const [newPoolName, setNewPoolName] = useState('');
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['crew-pools'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/crew-pools', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data as any[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const token = await auth.currentUser?.getIdToken();
      await api.post('/crew-pools', { name }, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['crew-pools'] }); setNewPoolName(''); setCreating(false); },
    onError: () => Alert.alert('Error', 'Could not create pool.'),
  });

  return (
    <SafeScreen className="flex-1">
      <View className="px-4 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mb-4 flex-row items-center gap-1">
          <LucideIcon name="ChevronLeft" size={20} color="#F59E0B" />
          <Text className="text-amber-400 text-base">Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold mb-1">Crew Pools</Text>
        <Text className="text-navy-300 text-sm mb-4">Save your best workers for future jobs</Text>
      </View>

      {creating && (
        <View className="mx-4 mb-4 bg-navy-800 border border-navy-700 rounded-2xl p-4">
          <TextInput
            value={newPoolName}
            onChangeText={setNewPoolName}
            placeholder="Pool name (e.g. Weekend Crew)"
            placeholderTextColor="#4B5563"
            autoFocus
            className="bg-navy-700 rounded-xl px-3 py-2 text-white text-sm mb-3"
          />
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={() => createMutation.mutate(newPoolName)} disabled={!newPoolName.trim()} className="flex-1 bg-blue-600 rounded-xl py-2 items-center" activeOpacity={0.85}>
              {createMutation.isPending ? <ActivityIndicator color="#fff" size="small" /> : <Text className="text-white font-semibold">Create</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCreating(false)} className="flex-1 bg-navy-700 rounded-xl py-2 items-center" activeOpacity={0.85}>
              <Text className="text-navy-300">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isLoading ? (
        <View className="py-10 items-center"><ActivityIndicator color="#3B82F6" /></View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="mx-4 mb-3 bg-navy-800 border border-navy-700 rounded-2xl p-4">
              <Text className="text-white font-bold mb-1">{item.name}</Text>
              <Text className="text-navy-300 text-sm">{item.member_count} workers</Text>
            </View>
          )}
          ListHeaderComponent={
            !creating ? (
              <TouchableOpacity onPress={() => setCreating(true)} className="mx-4 mb-3 bg-blue-600/20 border border-blue-500/40 rounded-2xl p-4 flex-row items-center gap-3" activeOpacity={0.85}>
                <LucideIcon name="Plus" size={20} color="#3B82F6" />
                <Text className="text-blue-300 font-bold">Create New Pool</Text>
              </TouchableOpacity>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeScreen>
  );
}
