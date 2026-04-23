import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router, useLocalSearchParams } from 'expo-router';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';

const STARS = [1, 2, 3, 4, 5];

function StarRating({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View className="mb-4">
      <Text className="text-navy-300 text-sm mb-2">{label}</Text>
      <View className="flex-row gap-2">
        {STARS.map((s) => (
          <TouchableOpacity key={s} onPress={() => onChange(s)} activeOpacity={0.7}>
            <Text className="text-2xl">{s <= value ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function RateEmployerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [overall, setOverall] = useState(0);
  const [payment, setPayment] = useState(0);
  const [respect, setRespect] = useState(0);
  const [workEnv, setWorkEnv] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (overall === 0) { Alert.alert('Rating required', 'Please give an overall rating.'); return; }
    setSubmitting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      await api.post('/ratings/employer', {
        match_id: id,
        overall_score: overall,
        payment_score: payment || overall,
        respect_score: respect || overall,
        work_env_score: workEnv || overall,
        comment,
      }, { headers: { Authorization: `Bearer ${token}` } });
      router.replace('/(worker)/(tabs)/feed');
    } catch {
      Alert.alert('Error', 'Could not submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeScreen className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-6">
          <Text className="text-white text-2xl font-bold mb-1">Rate the Employer</Text>
          <Text className="text-navy-300 text-sm mb-8">Your honest feedback helps other workers</Text>

          <View className="bg-navy-800 rounded-2xl p-5 border border-navy-700 mb-6">
            <StarRating label="Overall Experience" value={overall} onChange={setOverall} />
            <StarRating label="Payment & Punctuality" value={payment} onChange={setPayment} />
            <StarRating label="Respect & Behaviour" value={respect} onChange={setRespect} />
            <StarRating label="Work Environment" value={workEnv} onChange={setWorkEnv} />
          </View>

          <View className="mb-6">
            <Text className="text-navy-300 text-sm mb-2">Comments (optional)</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Share your experience..."
              placeholderTextColor="#4B5563"
              multiline
              numberOfLines={3}
              className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 text-white text-sm"
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting || overall === 0}
            className={`rounded-2xl py-4 items-center mb-4 ${overall > 0 && !submitting ? 'bg-amber-500' : 'bg-navy-700'}`}
            activeOpacity={0.85}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Submit Rating</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/(worker)/(tabs)/feed')} className="items-center py-2">
            <Text className="text-navy-400 text-sm">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
