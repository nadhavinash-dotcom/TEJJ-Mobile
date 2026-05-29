import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import api from '@/src/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SafeScreen } from '@/src/components/shared/SafeScreen';
import { EditWorkTab, EditScheduleTab, EditMediaTab } from '@/src/components/worker/profile-edit';
import { useAuthStore } from '@/src/store/authStore';
import { refreshUser } from '@/utils/referesh-user';

export default function ProfileEditScreen() {
  const queryClient = useQueryClient();
  const { setWorkerProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'work' | 'schedule' | 'media'>('work');
  
  // Local state for the form draft
  const [draft, setDraft] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [detectingLoc, setDetectingLoc] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['worker-profile'],
    queryFn: async () => {
      const res = await api.get('/workers/me');
      return res.data.data;
    },
  });

  useEffect(() => {
    if (profile && !draft) {
      setDraft(profile);
    }
  }, [profile]);

  const updateDraft = (updates: any) => {
    setDraft((prev: any) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const formData = new FormData();

      // Append text fields
      if (draft.primary_skill) formData.append('primary_skill', draft.primary_skill);
      if (draft.years_experience !== undefined) formData.append('years_experience', String(draft.years_experience));
      if (draft.home_lat !== undefined) formData.append('home_lat', String(draft.home_lat));
      if (draft.home_lng !== undefined) formData.append('home_lng', String(draft.home_lng));
      if (draft.home_city) formData.append('home_city', draft.home_city);
      if (draft.home_area) formData.append('home_area', draft.home_area);
      if (draft.min_pay_per_shift !== undefined) formData.append('min_pay_per_shift', String(draft.min_pay_per_shift));

      // Append JSON fields
      if (draft.secondary_skills) formData.append('sub_skills', JSON.stringify(draft.secondary_skills));
      if (draft.available_days) formData.append('available_days', JSON.stringify(draft.available_days));
      if (draft.preferred_shifts) formData.append('preferred_shifts', JSON.stringify(draft.preferred_shifts));

      // Retain existing media URLs if not overwritten
      if (draft.profile_photo_url) formData.append('profile_photo_url', draft.profile_photo_url);
      if (draft.skill_video_url) formData.append('skill_video_url', draft.skill_video_url);

      // Append new files if selected
      if (draft.profile_photo_uri) {
        const uri = draft.profile_photo_uri;
        const name = uri.split('/').pop() || 'photo.jpg';
        const type = 'image/jpeg';
        formData.append('profile_photo', { uri, name, type } as any);
      }

      if (draft.skill_video_uri) {
        const uri = draft.skill_video_uri;
        const name = uri.split('/').pop() || 'video.mp4';
        const type = 'video/mp4';
        formData.append('skill_video', { uri, name, type } as any);
      }

      const res = await api.patch('/workers/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!res.data.success) {
        throw new Error(res.data.error || 'Failed to update profile');
      }
      
      // Update store and invalidate queries to refresh UI
      // setWorkerProfile(res.data.data);
      const { ok, user } = await refreshUser(() => {});
      console.log('user', user)
      // queryClient.invalidateQueries({ queryKey: ['worker-profile'] });

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const detectLocation = async () => {
    setDetectingLoc(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location access is required.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      updateDraft({
        home_lat: loc.coords.latitude,
        home_lng: loc.coords.longitude,
        home_city: geo[0]?.city || geo[0]?.subregion || '',
        home_area: geo[0]?.district || geo[0]?.street || ''
      });
    } catch {
      Alert.alert('Error', 'Could not detect location.');
    } finally {
      setDetectingLoc(false);
    }
  };

  if (isLoading || !draft) {
    return (
      <SafeScreen className="justify-center items-center">
        <ActivityIndicator color="#F59E0B" size="large" />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-zinc-800">
        <TouchableOpacity onPress={() => router.back()} className="py-2 pr-4">
          <Text className="text-zinc-300 font-bold">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} className="py-2 pl-4">
          {saving ? (
            <ActivityIndicator color="#F59E0B" size="small" />
          ) : (
            <Text className="font-bold text-amber-500">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 py-4 gap-2">
        {(['work', 'schedule', 'media'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-2 items-center rounded-lg border ${activeTab === tab ? 'bg-amber-500/20 border-amber-500' : 'bg-zinc-800 border-zinc-700'}`}
          >
            <Text className={`text-sm font-semibold capitalize ${activeTab === tab ? 'text-amber-400' : 'text-zinc-400'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        className="flex-1" 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
      >
        {activeTab === 'work' && (
          <EditWorkTab draft={draft} updateDraft={updateDraft} />
        )}
        {activeTab === 'schedule' && (
          <EditScheduleTab draft={draft} updateDraft={updateDraft} detectLocation={detectLocation} detectingLoc={detectingLoc} />
        )}
        {activeTab === 'media' && (
          <EditMediaTab draft={draft} updateDraft={updateDraft} />
        )}
      </ScrollView>
    </SafeScreen>
  );
}
