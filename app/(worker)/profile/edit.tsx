import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import api from '@/src/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SKILL_LIST, CUISINE_LIST } from '@/utils';
import { SkillGrid } from '@/src/components/shared/SkillGrid';
import { MapPicker } from '@/src/components/shared/MapPicker';
import { AIScoreBar } from '@/src/components/worker/AIScoreBar';
import { SafeScreen } from '@/src/components/shared/SafeScreen';
import { auth, storage } from '@/src/lib/firebase';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Night'];

export default function ProfileEditScreen() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'work' | 'schedule' | 'media'>('work');
  
  // Local state for the form draft
  const [draft, setDraft] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [detectingLoc, setDetectingLoc] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['worker-profile'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/workers/me', { headers: { Authorization: `Bearer ${token}` } });
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
      const token = await auth.currentUser?.getIdToken();
      await api.patch('/workers/me', {
        primary_skill: draft.primary_skill,
        sub_skills: draft.sub_skills,
        years_experience: draft.years_experience,
        min_pay_per_shift: draft.min_pay_per_shift,
        home_lat: draft.home_lat,
        home_lng: draft.home_lng,
        home_city: draft.home_city,
        home_area: draft.home_area,
        available_days: draft.available_days,
        preferred_shifts: draft.preferred_shifts,
        profile_photo_url: draft.profile_photo_url,
        skill_video_url: draft.skill_video_url
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      queryClient.invalidateQueries({ queryKey: ['worker-profile'] });
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      await uploadMedia(result.assets[0].uri, 'profile_photos', 'profile_photo_url');
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      await uploadMedia(result.assets[0].uri, 'skill_videos', 'skill_video_url');
    }
  };

  const uploadMedia = async (uri: string, folder: string, field: string) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `${folder}/${auth.currentUser!.uid}_${Date.now()}_${filename}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      updateDraft({ [field]: downloadURL });
    } catch (error) {
      Alert.alert('Upload Failed', 'There was an error uploading your file.');
    } finally {
      setUploading(false);
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
        home_city: geo[0]?.city || '',
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

  const primarySkillObj = SKILL_LIST.find((s) => s.id === draft.primary_skill);
  const subSkillOptions = primarySkillObj?.id === 'cook' ? CUISINE_LIST : SKILL_LIST.filter(s => s.id !== draft.primary_skill);

  const toggleArrayItem = (field: 'available_days' | 'preferred_shifts' | 'sub_skills', item: string) => {
    const list = draft[field] || [];
    if (list.includes(item)) {
      updateDraft({ [field]: list.filter((i: string) => i !== item) });
    } else {
      updateDraft({ [field]: [...list, item] });
    }
  };

  return (
    <SafeScreen className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-navy-800">
        <TouchableOpacity onPress={() => router.back()} className="py-2 pr-4">
          <Text className="text-navy-300 font-bold">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving || uploading} className="py-2 pl-4">
          {saving ? (
            <ActivityIndicator color="#F59E0B" size="small" />
          ) : (
            <Text className={`font-bold ${uploading ? 'text-navy-500' : 'text-amber-500'}`}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 py-4 gap-2">
        {(['work', 'schedule', 'media'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-2 items-center rounded-lg border ${activeTab === tab ? 'bg-amber-500/20 border-amber-500' : 'bg-navy-800 border-navy-700'}`}
          >
            <Text className={`text-sm font-semibold capitalize ${activeTab === tab ? 'text-amber-400' : 'text-navy-400'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {activeTab === 'work' && (
          <View className="px-6 py-4 gap-8">
            <View>
              <Text className="text-white text-lg font-bold mb-3">Primary Skill</Text>
              <SkillGrid selected={draft.primary_skill} onSelect={(id) => updateDraft({ primary_skill: id, sub_skills: [] })} />
            </View>

            <View>
              <Text className="text-white text-lg font-bold mb-3">Sub-Skills / Specialization</Text>
              <SkillGrid
                multiSelect
                selectedList={draft.sub_skills || []}
                onMultiSelect={(list) => updateDraft({ sub_skills: list })}
              />
            </View>

            <View>
              <Text className="text-white text-lg font-bold mb-1">Years of Experience</Text>
              <Text className="text-amber-400 text-2xl font-bold text-center my-2">{draft.years_experience} Years</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={20}
                step={1}
                value={draft.years_experience}
                onValueChange={(val) => updateDraft({ years_experience: val })}
                minimumTrackTintColor="#F59E0B"
                maximumTrackTintColor="#1E3A8A"
                thumbTintColor="#F59E0B"
              />
            </View>

            <View className="mb-6">
              <Text className="text-white text-lg font-bold mb-1">Minimum Pay / Shift</Text>
              <Text className="text-amber-400 text-2xl font-bold text-center my-2">₹{draft.min_pay_per_shift}</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={200}
                maximumValue={2000}
                step={50}
                value={draft.min_pay_per_shift}
                onValueChange={(val) => updateDraft({ min_pay_per_shift: val })}
                minimumTrackTintColor="#F59E0B"
                maximumTrackTintColor="#1E3A8A"
                thumbTintColor="#F59E0B"
              />
            </View>
          </View>
        )}

        {activeTab === 'schedule' && (
          <View className="px-6 py-4 gap-8 mb-6">
            <View>
              <Text className="text-white text-lg font-bold mb-3">Location</Text>
              <View className="h-48 rounded-2xl overflow-hidden bg-navy-800 mb-4">
                {draft.home_lat ? (
                  <MapPicker latitude={draft.home_lat} longitude={draft.home_lng} onLocationChange={(lat, lng) => updateDraft({ home_lat: lat, home_lng: lng })} />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-navy-400">Location not set</Text>
                  </View>
                )}
              </View>
              {draft.home_city && (
                <Text className="text-white mb-4">📍 {draft.home_area ? draft.home_area + ', ' : ''}{draft.home_city}</Text>
              )}
              <TouchableOpacity onPress={detectLocation} disabled={detectingLoc} className="bg-navy-800 border border-amber-500/40 rounded-xl py-3 items-center">
                <Text className="text-amber-400 font-semibold">{detectingLoc ? 'Detecting...' : 'Update Location'}</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text className="text-white text-lg font-bold mb-3">Available Days</Text>
              <View className="flex-row flex-wrap gap-2">
                {DAYS.map((d) => {
                  const active = (draft.available_days || []).includes(d);
                  return (
                    <TouchableOpacity
                      key={d}
                      onPress={() => toggleArrayItem('available_days', d)}
                      className={`px-4 py-2 rounded-xl border ${active ? 'bg-amber-500 border-amber-400' : 'bg-navy-800 border-navy-600'}`}
                    >
                      <Text className={`font-medium ${active ? 'text-white' : 'text-navy-300'}`}>{d}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View>
              <Text className="text-white text-lg font-bold mb-3">Preferred Shifts</Text>
              <View className="flex-row flex-wrap gap-2">
                {SHIFTS.map((s) => {
                  const active = (draft.preferred_shifts || []).includes(s);
                  return (
                    <TouchableOpacity
                      key={s}
                      onPress={() => toggleArrayItem('preferred_shifts', s)}
                      className={`px-4 py-2 rounded-xl border ${active ? 'bg-amber-500 border-amber-400' : 'bg-navy-800 border-navy-600'}`}
                    >
                      <Text className={`font-medium ${active ? 'text-white' : 'text-navy-300'}`}>{s}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'media' && (
          <View className="px-6 py-4 gap-8 mb-6">
            <View>
              <Text className="text-white text-lg font-bold mb-4">Profile Photo</Text>
              <View className="items-center">
                {draft.profile_photo_url ? (
                  <Image source={{ uri: draft.profile_photo_url }} className="w-32 h-32 rounded-full border-4 border-amber-500 mb-4" />
                ) : (
                  <View className="w-32 h-32 rounded-full bg-navy-800 border-4 border-navy-600 items-center justify-center mb-4">
                    <Text className="text-4xl">👤</Text>
                  </View>
                )}
                <TouchableOpacity onPress={pickImage} disabled={uploading} className="bg-navy-800 border border-amber-500/40 rounded-xl px-6 py-3">
                  <Text className="text-amber-400 font-semibold">{uploading ? 'Uploading...' : 'Change Photo'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-white text-lg font-bold mb-4">Skill Video</Text>
              {draft.skill_video_url ? (
                <View className="bg-navy-800 p-4 rounded-2xl border border-green-500/30 mb-4">
                  <Text className="text-green-400 font-bold mb-2">✓ Video Uploaded</Text>
                  {draft.ai_score && <AIScoreBar score={draft.ai_score} />}
                </View>
              ) : (
                <View className="bg-navy-800 p-4 rounded-2xl border border-navy-700 mb-4 items-center">
                  <Text className="text-navy-400 mb-2">No video uploaded yet</Text>
                </View>
              )}
              <TouchableOpacity onPress={pickVideo} disabled={uploading} className="bg-navy-800 border border-amber-500/40 rounded-xl py-3 items-center">
                <Text className="text-amber-400 font-semibold">{uploading ? 'Uploading...' : draft.skill_video_url ? 'Replace Video' : 'Upload Video'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
}
