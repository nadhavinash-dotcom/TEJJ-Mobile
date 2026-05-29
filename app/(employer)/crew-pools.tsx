import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { ChevronLeft, Plus, Users, X } from 'lucide-react-native';

const C = {
  primary: '#000666',
  primaryFixed: '#e0e0ff',
  background: '#fbf8fe',
  surfaceContainerLow: '#f6f2f8',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerHigh: '#eae7ed',
  onSurface: '#1b1b1f',
  onSurfaceVariant: '#454652',
  outline: '#767683',
  outlineVariant: '#c6c5d4',
};

export default function CrewPoolsScreen() {
  const qc = useQueryClient();
  const [newPoolName, setNewPoolName] = useState('');
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['crew-pools'],
    queryFn: async () => {
      const res = await api.get('/crew-pools');
      return res.data.data as any[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      await api.post('/crew-pools', { name });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crew-pools'] });
      setNewPoolName('');
      setCreating(false);
    },
    onError: () => Alert.alert('Error', 'Could not create pool.'),
  });

  return (
    <SafeScreen style={{ flex: 1, backgroundColor: C.background }}>
      <View className="px-4 pt-5 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mb-5 flex-row items-center gap-1">
          <ChevronLeft size={20} color={C.primary} />
          <Text className="text-base font-medium" style={{ color: C.primary }}>Back</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold mb-1" style={{ color: C.primary }}>Crew Pools</Text>
        <Text className="text-sm mb-4" style={{ color: C.onSurfaceVariant }}>
          Save your best workers for future jobs
        </Text>
      </View>

      {creating && (
        <View
          className="mx-4 mb-4 rounded-2xl p-4"
          style={{
            backgroundColor: C.surfaceContainerLowest,
            borderWidth: 1,
            borderColor: C.outlineVariant,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-semibold text-base" style={{ color: C.onSurface }}>New Pool</Text>
            <TouchableOpacity onPress={() => setCreating(false)}>
              <X size={18} color={C.outline} />
            </TouchableOpacity>
          </View>
          <TextInput
            value={newPoolName}
            onChangeText={setNewPoolName}
            placeholder="e.g. Weekend Crew"
            placeholderTextColor={C.outline}
            autoFocus
            className="rounded-xl px-3 py-3 text-sm mb-3"
            style={{
              backgroundColor: C.surfaceContainerLow,
              color: C.onSurface,
              borderWidth: 1,
              borderColor: C.outlineVariant,
            }}
          />
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => createMutation.mutate(newPoolName)}
              disabled={!newPoolName.trim()}
              className="flex-1 rounded-xl py-2.5 items-center"
              style={{ backgroundColor: !newPoolName.trim() ? C.surfaceContainerHigh : C.primary }}
              activeOpacity={0.85}
            >
              {createMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text
                  className="font-bold text-sm"
                  style={{ color: !newPoolName.trim() ? C.outline : '#ffffff' }}
                >
                  Create
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCreating(false)}
              className="flex-1 rounded-xl py-2.5 items-center"
              style={{ backgroundColor: C.surfaceContainerHigh, borderWidth: 1, borderColor: C.outlineVariant }}
              activeOpacity={0.85}
            >
              <Text className="text-sm font-medium" style={{ color: C.onSurfaceVariant }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isLoading ? (
        <View className="py-10 items-center">
          <ActivityIndicator color={C.primary} />
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              className="mx-4 mb-3 rounded-2xl p-4 flex-row items-center gap-3"
              style={{
                backgroundColor: C.surfaceContainerLowest,
                borderWidth: 1,
                borderColor: C.outlineVariant,
              }}
            >
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: C.primaryFixed }}
              >
                <Users size={18} color={C.primary} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-base" style={{ color: C.onSurface }}>{item.name}</Text>
                <Text className="text-sm mt-0.5" style={{ color: C.onSurfaceVariant }}>
                  {item.member_count} workers
                </Text>
              </View>
            </View>
          )}
          ListHeaderComponent={
            !creating ? (
              <TouchableOpacity
                onPress={() => setCreating(true)}
                className="mx-4 mb-3 rounded-2xl p-4 flex-row items-center gap-3"
                style={{
                  backgroundColor: C.surfaceContainerLowest,
                  borderWidth: 1.5,
                  borderColor: C.primary,
                  borderStyle: 'dashed',
                }}
                activeOpacity={0.85}
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: C.primaryFixed }}
                >
                  <Plus size={18} color={C.primary} />
                </View>
                <Text className="font-bold" style={{ color: C.primary }}>Create New Pool</Text>
              </TouchableOpacity>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeScreen>
  );
}
