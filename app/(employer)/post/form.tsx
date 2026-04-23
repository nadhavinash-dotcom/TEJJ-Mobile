import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { SkillGrid } from '../../../src/components/shared/SkillGrid';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { PayBenchmarkBox } from '../../../src/components/employer/PayBenchmarkBox';
import api from '../../../src/lib/api';
import { auth } from '../../../src/lib/firebase';

export default function JobFormScreen() {
  const { jobDraft, updateJobDraft, clearJobDraft } = useOnboardingStore();
  const [submitting, setSubmitting] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleVoiceResult = ({ englishText, keywords, structured }: { englishText: string; keywords: string[]; originalText: string; structured: Record<string, unknown> }) => {
    if (structured.pay_rate) updateJobDraft({ pay_rate: structured.pay_rate as number });
    if (keywords.length > 0) updateJobDraft({ keywords_extracted: keywords });
    if (englishText && !jobDraft.description) updateJobDraft({ description: englishText });
  };

  const handleSubmit = async () => {
    if (!jobDraft.job_title || !jobDraft.primary_skill || !jobDraft.pay_rate) {
      Alert.alert('Incomplete', 'Please fill in job title, skill, and pay rate.');
      return;
    }
    setSubmitting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      await api.post('/jobs', jobDraft, { headers: { Authorization: `Bearer ${token}` } });
      clearJobDraft();
      router.replace('/(employer)/(tabs)/dashboard');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Could not post job.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-amber-400 text-base">← Back</Text>
          </TouchableOpacity>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-xl font-bold">Post a Job</Text>
            <VoiceMicButton onResult={handleVoiceResult} />
          </View>
        </View>

        <View className="px-4 gap-4 pb-8">
          <View>
            <Text className="text-navy-300 text-sm mb-2">Job Title *</Text>
            <TextInput
              value={jobDraft.job_title ?? ''}
              onChangeText={(v) => updateJobDraft({ job_title: v })}
              placeholder="E.g. Senior Cook, Waiter, Housekeeper"
              placeholderTextColor="#4B5563"
              className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 text-white text-sm"
            />
          </View>

          <View>
            <Text className="text-navy-300 text-sm mb-2">Primary Skill *</Text>
            <SkillGrid
              selected={jobDraft.primary_skill}
              onSelect={(id) => updateJobDraft({ primary_skill: id })}
            />
          </View>

          <View>
            <Text className="text-navy-300 text-sm mb-2">Pay Rate (₹ per shift) *</Text>
            <TextInput
              value={jobDraft.pay_rate?.toString() ?? ''}
              onChangeText={(v) => updateJobDraft({ pay_rate: parseInt(v) || 0 })}
              placeholder="E.g. 700"
              placeholderTextColor="#4B5563"
              keyboardType="number-pad"
              className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 text-white text-sm"
            />
            {jobDraft.primary_skill && <PayBenchmarkBox skill={jobDraft.primary_skill} payRate={jobDraft.pay_rate ?? 0} />}
          </View>

          <View>
            <Text className="text-navy-300 text-sm mb-2">Number of Openings</Text>
            <View className="flex-row gap-2">
              {[1, 2, 3, 5].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => updateJobDraft({ number_of_openings: n })}
                  className={`px-4 py-2 rounded-xl border ${jobDraft.number_of_openings === n ? 'bg-blue-600 border-blue-500' : 'bg-navy-800 border-navy-600'}`}
                  activeOpacity={0.75}
                >
                  <Text className={`font-medium ${jobDraft.number_of_openings === n ? 'text-white' : 'text-navy-300'}`}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-navy-300 text-sm mb-2">Shift Duration (hours)</Text>
            <View className="flex-row gap-2">
              {[4, 6, 8, 10, 12].map((h) => (
                <TouchableOpacity
                  key={h}
                  onPress={() => updateJobDraft({ shift_duration_hours: h })}
                  className={`px-4 py-2 rounded-xl border ${jobDraft.shift_duration_hours === h ? 'bg-blue-600 border-blue-500' : 'bg-navy-800 border-navy-600'}`}
                  activeOpacity={0.75}
                >
                  <Text className={`font-medium ${jobDraft.shift_duration_hours === h ? 'text-white' : 'text-navy-300'}`}>{h}h</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-navy-300 text-sm mb-2">Job Description (optional)</Text>
            <TextInput
              value={jobDraft.description ?? ''}
              onChangeText={(v) => updateJobDraft({ description: v })}
              placeholder="Describe the role, requirements, and workplace..."
              placeholderTextColor="#4B5563"
              multiline
              numberOfLines={3}
              className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 text-white text-sm"
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting || !jobDraft.job_title || !jobDraft.primary_skill}
            className={`rounded-2xl py-4 items-center mt-2 ${!submitting && jobDraft.job_title && jobDraft.primary_skill ? 'bg-blue-600' : 'bg-navy-700'}`}
            activeOpacity={0.85}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Post Job →</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
