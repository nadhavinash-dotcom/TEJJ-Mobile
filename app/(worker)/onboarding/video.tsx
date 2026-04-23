import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../src/lib/firebase';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { useAuthStore } from '../../../src/store/authStore';
import { AIScoreBar } from '../../../src/components/worker/AIScoreBar';

export default function VideoScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const { userId } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [scoring, setScoring] = useState(false);

  const handleRecordVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Camera access required.'); return; }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoMaxDuration: 60,
      quality: ImagePicker.UIImagePickerControllerQualityType.Medium,
    });
    if (!result.canceled && result.assets[0]) {
      setUploading(true);
      try {
        const blob = await fetch(result.assets[0].uri).then((r) => r.blob());
        const storageRef = ref(storage, `workers/${userId}/skill-video.mp4`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        updateWorker({ skill_video_url: url });
        setScoring(true);
        // Mock AI scoring — simulate 60s delay then random scores
        await new Promise((r) => setTimeout(r, 3000));
        const mockScore = {
          technique: parseFloat((Math.random() * 1.5 + 3.0).toFixed(1)),
          speed: parseFloat((Math.random() * 1.5 + 3.0).toFixed(1)),
          hygiene: parseFloat((Math.random() * 1.5 + 3.0).toFixed(1)),
          warmth: parseFloat((Math.random() * 1.5 + 3.0).toFixed(1)),
        };
        updateWorker({ ai_score: mockScore });
      } catch {
        Alert.alert('Upload failed', 'Could not upload video. Please try again.');
      } finally {
        setUploading(false);
        setScoring(false);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <View className="flex-1 px-6 pt-8">
        <Text className="text-navy-400 text-sm mb-1">Step 8 of 10</Text>
        <Text className="text-white text-2xl font-bold mb-1">Apna skill video daalo</Text>
        <Text className="text-navy-300 text-sm mb-6">Record a 30–60 sec video showing your skill. AI will score it.</Text>

        {!worker.skill_video_url && !uploading && !scoring && (
          <View className="bg-navy-800 border-2 border-dashed border-navy-600 rounded-2xl py-12 items-center mb-6">
            <Text className="text-6xl mb-4">🎥</Text>
            <Text className="text-white font-semibold mb-1">Record your skill video</Text>
            <Text className="text-navy-400 text-sm text-center px-6">Show your cooking, serving, or housekeeping skills in 30–60 seconds</Text>
          </View>
        )}

        {(uploading || scoring) && (
          <View className="bg-navy-800 rounded-2xl py-12 items-center mb-6">
            <ActivityIndicator color="#F59E0B" size="large" />
            <Text className="text-amber-400 font-semibold mt-4">
              {uploading ? 'Uploading video...' : 'AI scoring your video...'}
            </Text>
            <Text className="text-navy-400 text-sm mt-2">Please wait</Text>
          </View>
        )}

        {worker.ai_score && (
          <View className="mb-6">
            <Text className="text-white font-semibold mb-3">Your AI Score</Text>
            <AIScoreBar scores={worker.ai_score} />
          </View>
        )}

        {!uploading && !scoring && (
          <TouchableOpacity
            onPress={handleRecordVideo}
            className="bg-navy-800 border border-amber-500/40 rounded-2xl py-4 flex-row items-center justify-center gap-2 mb-6"
            activeOpacity={0.8}
          >
            <Text className="text-amber-400 text-xl">🎥</Text>
            <Text className="text-amber-400 font-semibold">{worker.skill_video_url ? 'Re-record video' : 'Record video'}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => router.push('/(worker)/onboarding/notifications')}
          disabled={uploading || scoring}
          className={`rounded-2xl py-4 items-center ${!uploading && !scoring ? 'bg-amber-500' : 'bg-navy-700'}`}
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-base">
            {worker.skill_video_url ? 'Aage Badhein →' : 'Skip for now →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
