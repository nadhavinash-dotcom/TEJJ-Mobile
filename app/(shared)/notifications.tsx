import React from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { auth } from '../../src/lib/firebase';

export default function NotificationsScreen() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/notifications', { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data as any[];
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await auth.currentUser?.getIdToken();
      await api.patch(`/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const ICONS: Record<string, string> = {
    job_match: '✅',
    job_posted: '📋',
    application_received: '👤',
    reminder: '⏰',
    system: '📢',
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <View className="px-4 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-amber-400 text-base">← Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Notifications</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator color="#F59E0B" size="large" /></View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => markReadMutation.mutate(item._id)}
              className={`mx-4 mb-2 rounded-2xl p-4 border ${item.read ? 'bg-navy-800 border-navy-700' : 'bg-navy-700 border-amber-500/20'}`}
              activeOpacity={0.85}
            >
              <View className="flex-row items-start gap-3">
                <Text className="text-xl">{ICONS[item.type] ?? '🔔'}</Text>
                <View className="flex-1">
                  <Text className={`font-semibold ${item.read ? 'text-navy-300' : 'text-white'}`}>{item.title}</Text>
                  <Text className="text-navy-400 text-sm mt-1">{item.body}</Text>
                  <Text className="text-navy-500 text-xs mt-1">{new Date(item.created_at).toLocaleDateString('en-IN')}</Text>
                </View>
                {!item.read && <View className="w-2 h-2 rounded-full bg-amber-400 mt-1" />}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-4xl mb-4">🔔</Text>
              <Text className="text-white font-semibold mb-2">No notifications yet</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        />
      )}
    </SafeAreaView>
  );
}
