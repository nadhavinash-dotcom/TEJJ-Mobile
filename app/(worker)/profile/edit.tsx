import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import api from '@/src/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SafeScreen } from '@/src/components/shared/SafeScreen';
import { EditWorkTab, EditScheduleTab, EditMediaTab } from '@/src/components/worker/profile-edit';
import { useAuthStore } from '@/src/store/authStore';

const TABS = ['work', 'schedule', 'media'] as const;
type Tab = typeof TABS[number];

const TAB_LABELS: Record<Tab, string> = {
  work: 'Work',
  schedule: 'Schedule',
  media: 'Media',
};

export default function ProfileEditScreen() {
  const queryClient = useQueryClient();
  const { setWorkerProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('work');
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
    if (profile && !draft) setDraft(profile);
  }, [profile]);

  const updateDraft = (updates: any) =>
    setDraft((prev: any) => ({ ...prev, ...updates }));

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const formData = new FormData();

      if (draft.primary_skill) formData.append('primary_skill', draft.primary_skill);
      if (draft.years_experience !== undefined)
        formData.append('years_experience', String(draft.years_experience));
      if (draft.home_lat !== undefined) formData.append('home_lat', String(draft.home_lat));
      if (draft.home_lng !== undefined) formData.append('home_lng', String(draft.home_lng));
      if (draft.home_city) formData.append('home_city', draft.home_city);
      if (draft.home_area) formData.append('home_area', draft.home_area);
      if (draft.min_pay_per_shift !== undefined)
        formData.append('min_pay_per_shift', String(draft.min_pay_per_shift));

      if (draft.secondary_skills)
        formData.append('sub_skills', JSON.stringify(draft.secondary_skills));
      if (draft.available_days)
        formData.append('available_days', JSON.stringify(draft.available_days));
      if (draft.preferred_shifts)
        formData.append('preferred_shifts', JSON.stringify(draft.preferred_shifts));

      if (draft.profile_photo_url)
        formData.append('profile_photo_url', draft.profile_photo_url);
      if (draft.skill_video_url)
        formData.append('skill_video_url', draft.skill_video_url);

      if (draft.profile_photo_uri) {
        const uri = draft.profile_photo_uri;
        formData.append('profile_photo', {
          uri,
          name: uri.split('/').pop() || 'photo.jpg',
          type: 'image/jpeg',
        } as any);
      }

      if (draft.skill_video_uri) {
        const uri = draft.skill_video_uri;
        formData.append('skill_video', {
          uri,
          name: uri.split('/').pop() || 'video.mp4',
          type: 'video/mp4',
        } as any);
      }

      const res = await api.patch('/workers/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!res.data.success)
        throw new Error(res.data.error || 'Failed to update profile');

      setWorkerProfile(res.data.data);
      queryClient.invalidateQueries({ queryKey: ['worker-profile'] });

      Alert.alert('Saved!', 'Profile updated successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert(
        'Error',
        e?.response?.data?.message || e?.message || 'Failed to update profile',
      );
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
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const geo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      updateDraft({
        home_lat: loc.coords.latitude,
        home_lng: loc.coords.longitude,
        home_city: geo[0]?.city || geo[0]?.subregion || '',
        home_area: geo[0]?.district || geo[0]?.street || '',
      });
    } catch {
      Alert.alert('Error', 'Could not detect location.');
    } finally {
      setDetectingLoc(false);
    }
  };

  if (isLoading || !draft) {
    return (
      <SafeScreen style={styles.loadingScreen}>
        <ActivityIndicator color="#000666" size="large" />
        <Text style={styles.loadingText}>Loading profile…</Text>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.screen}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} activeOpacity={0.65}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profile</Text>

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={styles.headerBtn}
          activeOpacity={0.65}
        >
          {saving ? (
            <ActivityIndicator color="#000666" size="small" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Tabs ── */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, active ? styles.tabActive : styles.tabInactive]}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabText, active ? styles.tabTextActive : styles.tabTextInactive]}>
                {TAB_LABELS[tab]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Content ── */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'work' && (
          <EditWorkTab draft={draft} updateDraft={updateDraft} />
        )}
        {activeTab === 'schedule' && (
          <EditScheduleTab
            draft={draft}
            updateDraft={updateDraft}
            detectLocation={detectLocation}
            detectingLoc={detectingLoc}
          />
        )}
        {activeTab === 'media' && (
          <EditMediaTab draft={draft} updateDraft={updateDraft} />
        )}
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E1E7',
  },
  headerBtn: {
    minWidth: 64,
    paddingVertical: 4,
  },
  headerTitle: {
    color: '#1B1B1F',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  cancelText: {
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: '500',
  },
  saveText: {
    color: '#000666',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  tabActive: {
    backgroundColor: '#000666',
    borderColor: '#000666',
    shadowColor: '#000666',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  tabInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C6C5D4',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabTextInactive: {
    color: '#9CA3AF',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 60,
  },
});
