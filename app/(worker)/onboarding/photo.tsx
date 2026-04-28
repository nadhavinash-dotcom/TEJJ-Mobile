import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function PhotoScreen() {
  const { worker, updateWorker } = useOnboardingStore();

  const pickImage = async (fromCamera: boolean) => {
    const perm = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Please allow camera/gallery access in settings.');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          aspect: [1, 1],
          allowsEditing: true,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          aspect: [1, 1],
          allowsEditing: true,
        });

    if (!result.canceled && result.assets[0]) {
      updateWorker({ profile_photo_uri: result.assets[0].uri });
    }
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => updateWorker({ profile_photo_uri: '' })
        },
      ]
    );
  };

  return (
    <SafeScreen className="flex-1">
      <View className="flex-1 px-6 pt-8">
        <StepIndicator currentStep={4} totalSteps={10} />
        <Text className="text-white text-2xl font-bold mb-1">Add your photo</Text>
        <Text className="text-zinc-400 text-sm mb-8">Add a clear face photo. This builds trust with employers.</Text>

        <View className="items-center mb-8">
          <View className="relative">
            {worker.profile_photo_uri ? (
              <Image source={{ uri: worker.profile_photo_uri }} className="w-40 h-40 rounded-full border-4 border-amber-500" />
            ) : (
              <View className="w-40 h-40 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 items-center justify-center">
                <LucideIcon name="User" size={56} color="#475569" />
                <Text className="text-zinc-400 text-xs mt-2">No photo</Text>
              </View>
            )}

            {worker.profile_photo_uri && (
              <TouchableOpacity
                onPress={handleRemovePhoto}
                className="absolute -top-1 -right-1 bg-red-500 w-10 h-10 rounded-full items-center justify-center border-4 border-zinc-900"
                activeOpacity={0.8}
              >
                <LucideIcon name="X" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="gap-3 mb-6">
          <TouchableOpacity
            onPress={() => pickImage(true)}
            className="bg-zinc-800 border border-zinc-700 rounded-2xl py-4 flex-row items-center justify-center gap-3"
            activeOpacity={0.8}
          >
            <View className="bg-amber-500/10 p-2 rounded-xl">
              <LucideIcon name="Camera" size={20} color="#F59E0B" />
            </View>
            <Text className="text-white font-semibold text-base">Take from Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => pickImage(false)}
            className="bg-zinc-800 border border-zinc-700 rounded-2xl py-4 flex-row items-center justify-center gap-3"
            activeOpacity={0.8}
          >
            <View className="bg-amber-500/10 p-2 rounded-xl">
              <LucideIcon name="Image" size={20} color="#F59E0B" />
            </View>
            <Text className="text-white font-semibold text-base">Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

        <OnboardingFooter 
          onBack={() => router.back()}
          onNext={() => router.push('/(worker)/onboarding/location')}
          nextLabel={worker.profile_photo_uri ? 'Next →' : 'Skip for now →'}
        />
      </View>
    </SafeScreen>
  );
}
