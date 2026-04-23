import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../src/lib/firebase';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { useAuthStore } from '../../../src/store/authStore';

export default function PhotoScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const { userId } = useAuthStore();
  const [uploading, setUploading] = useState(false);

  const pickImage = async (fromCamera: boolean) => {
    const perm = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Please allow camera/gallery access.');
      return;
    }
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, aspect: [1, 1], allowsEditing: true })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, aspect: [1, 1], allowsEditing: true });

    if (!result.canceled && result.assets[0]) {
      setUploading(true);
      try {
        const uri = result.assets[0].uri;
        const blob = await fetch(uri).then((r) => r.blob());
        const storageRef = ref(storage, `workers/${userId}/profile.jpg`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        updateWorker({ profile_photo_url: url });
      } catch {
        Alert.alert('Upload failed', 'Could not upload photo. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <View className="flex-1 px-6 pt-8">
        <Text className="text-navy-400 text-sm mb-1">Step 4 of 10</Text>
        <Text className="text-white text-2xl font-bold mb-1">Apni photo daalo</Text>
        <Text className="text-navy-300 text-sm mb-8">Add a clear face photo. This builds trust with employers.</Text>

        <View className="items-center mb-8">
          {worker.profile_photo_url ? (
            <Image source={{ uri: worker.profile_photo_url }} className="w-36 h-36 rounded-full border-4 border-amber-500" />
          ) : (
            <View className="w-36 h-36 rounded-full bg-navy-800 border-2 border-dashed border-navy-600 items-center justify-center">
              <Text className="text-4xl">👤</Text>
              <Text className="text-navy-400 text-xs mt-2">No photo</Text>
            </View>
          )}
          {uploading && (
            <View className="absolute inset-0 items-center justify-center bg-navy-900/70 rounded-full">
              <ActivityIndicator color="#F59E0B" />
            </View>
          )}
        </View>

        <View className="gap-3 mb-6">
          <TouchableOpacity
            onPress={() => pickImage(true)}
            disabled={uploading}
            className="bg-navy-800 border border-navy-600 rounded-2xl py-4 flex-row items-center justify-center gap-3"
            activeOpacity={0.8}
          >
            <Text className="text-xl">📷</Text>
            <Text className="text-white font-semibold">Camera se lo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => pickImage(false)}
            disabled={uploading}
            className="bg-navy-800 border border-navy-600 rounded-2xl py-4 flex-row items-center justify-center gap-3"
            activeOpacity={0.8}
          >
            <Text className="text-xl">🖼️</Text>
            <Text className="text-white font-semibold">Gallery se chuniye</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(worker)/onboarding/location')}
          disabled={uploading}
          className={`rounded-2xl py-4 items-center ${worker.profile_photo_url ? 'bg-amber-500' : 'bg-navy-700'}`}
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-base">
            {worker.profile_photo_url ? 'Aage Badhein →' : 'Skip for now →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
