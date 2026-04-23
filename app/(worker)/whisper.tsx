import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { VoiceMicButton } from '../../src/components/shared/VoiceMicButton';
import api from '../../src/lib/api';
import { auth } from '../../src/lib/firebase';

const CATEGORIES = ['Late / no payment', 'Unsafe workplace', 'Harassment', 'Work mismatch', 'Other'];

export default function WhisperScreen() {
  const [category, setCategory] = useState('');
  const [employerLocality, setEmployerLocality] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleVoiceResult = ({ englishText }: { englishText: string; keywords: string[]; originalText: string; structured: Record<string, unknown> }) => {
    setText((prev) => prev ? `${prev} ${englishText}` : englishText);
  };

  const handleSubmit = async () => {
    if (!category || !text.trim()) { Alert.alert('Incomplete', 'Please select a category and describe the issue.'); return; }
    setSubmitting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      await api.post('/whisper', { category, employer_locality: employerLocality, complaint_text: text }, { headers: { Authorization: `Bearer ${token}` } });
      Alert.alert('Submitted', 'Your anonymous report has been submitted. Thank you for keeping the community safe.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Could not submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <Text className="text-amber-400 text-base">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold mb-1">Whisper Network</Text>
          <Text className="text-navy-300 text-sm mb-2">Anonymous employer report — your identity is protected</Text>
          <View className="bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 mb-6">
            <Text className="text-green-400 text-xs">🔒 Your worker ID is hashed — completely anonymous</Text>
          </View>
        </View>

        <View className="px-4 gap-4">
          <View>
            <Text className="text-navy-300 text-sm mb-2">Issue category</Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCategory(c)}
                  className={`px-3 py-2 rounded-xl border ${category === c ? 'bg-red-500/20 border-red-400' : 'bg-navy-800 border-navy-600'}`}
                  activeOpacity={0.75}
                >
                  <Text className={`text-sm ${category === c ? 'text-red-400' : 'text-navy-300'}`}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-navy-300 text-sm mb-2">Employer locality (optional)</Text>
            <TextInput
              value={employerLocality}
              onChangeText={setEmployerLocality}
              placeholder="E.g. Banjara Hills, Hyderabad"
              placeholderTextColor="#4B5563"
              className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 text-white text-sm"
            />
          </View>

          <View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-navy-300 text-sm">Describe the issue</Text>
              <VoiceMicButton onResult={handleVoiceResult} />
            </View>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="What happened? You can speak using the mic..."
              placeholderTextColor="#4B5563"
              multiline
              numberOfLines={5}
              className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 text-white text-sm"
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting || !category || !text.trim()}
            className={`rounded-2xl py-4 items-center mb-8 ${!submitting && category && text.trim() ? 'bg-red-500' : 'bg-navy-700'}`}
            activeOpacity={0.85}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Submit Anonymously</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
