import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router, useLocalSearchParams } from 'expo-router';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

function StarRating({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View className="mb-4">
      <Text className="text-navy-300 text-sm mb-2">{label}</Text>
      <View className="flex-row gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <TouchableOpacity key={s} onPress={() => onChange(s)} activeOpacity={0.7}>
            <LucideIcon name="Star" size={28} color={s <= value ? '#F59E0B' : '#475569'} fill={s <= value ? '#F59E0B' : 'transparent'} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function RateWorkerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [overall, setOverall] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [skill, setSkill] = useState(0);
  const [conduct, setConduct] = useState(0);
  const [rehire, setRehire] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (overall === 0) { Alert.alert('Rating required', 'Please give an overall rating.'); return; }
    setSubmitting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      await api.post('/ratings/worker', {
        match_id: id,
        overall_score: overall,
        punctuality_score: punctuality || overall,
        skill_score: skill || overall,
        conduct_score: conduct || overall,
        would_rehire: rehire,
        comment,
      }, { headers: { Authorization: `Bearer ${token}` } });
      router.replace('/(employer)/(tabs)/dashboard');
    } catch {
      Alert.alert('Error', 'Could not submit rating.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-6">
          <Text className="text-white text-2xl font-bold mb-1">Rate the Worker</Text>
          <Text className="text-navy-300 text-sm mb-8">Help improve the quality of workers on TEJJ</Text>

          <View className="bg-navy-800 rounded-2xl p-5 border border-navy-700 mb-6">
            <StarRating label="Overall Performance" value={overall} onChange={setOverall} />
            <StarRating label="Punctuality" value={punctuality} onChange={setPunctuality} />
            <StarRating label="Skill Quality" value={skill} onChange={setSkill} />
            <StarRating label="Conduct & Behaviour" value={conduct} onChange={setConduct} />
          </View>

          <View className="mb-6">
            <Text className="text-navy-300 text-sm mb-3">Would you rehire this worker?</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => setRehire(true)} className={`flex-1 py-3 rounded-xl border flex-row items-center justify-center gap-2 ${rehire === true ? 'bg-green-600 border-green-500' : 'bg-navy-800 border-navy-600'}`} activeOpacity={0.75}>
                <LucideIcon name="ThumbsUp" size={16} color="#FFFFFF" />
                <Text className="text-white font-semibold">Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setRehire(false)} className={`flex-1 py-3 rounded-xl border flex-row items-center justify-center gap-2 ${rehire === false ? 'bg-red-600 border-red-500' : 'bg-navy-800 border-navy-600'}`} activeOpacity={0.75}>
                <LucideIcon name="ThumbsDown" size={16} color="#FFFFFF" />
                <Text className="text-white font-semibold">No</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput value={comment} onChangeText={setComment} placeholder="Additional feedback..." placeholderTextColor="#4B5563" multiline numberOfLines={3} className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 text-white text-sm mb-6" textAlignVertical="top" />

          <TouchableOpacity onPress={handleSubmit} disabled={submitting || overall === 0} className={`rounded-2xl py-4 items-center mb-4 ${overall > 0 && !submitting ? 'bg-blue-600' : 'bg-navy-700'}`} activeOpacity={0.85}>
            {submitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Submit Rating</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
