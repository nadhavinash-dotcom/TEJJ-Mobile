import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Animated, StyleSheet } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

export default function PhotoScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const opacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(22)).current;
  const photoScale = useRef(new Animated.Value(0.9)).current;
  const photoOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 340, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 340, useNativeDriver: true }),
      Animated.timing(photoOp, { toValue: 1, duration: 400, delay: 80, useNativeDriver: true }),
      Animated.spring(photoScale, {
        toValue: 1,
        tension: 55,
        friction: 8,
        delay: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
          onPress: () => updateWorker({ profile_photo_uri: '' }),
        },
      ],
    );
  };

  const hasPhoto = !!worker.profile_photo_uri;

  return (
    <SafeScreen className="flex-1">
      <View className="flex-1 px-6 pt-8">
        <Animated.View style={{ opacity, transform: [{ translateY: slideY }] }}>
          <StepIndicator currentStep={4} totalSteps={10} />
          <Text className="text-on-surface text-2xl font-bold mb-1">Add your photo</Text>
          <Text className="text-on-surface-variant text-sm mb-8">
            A clear face photo builds trust with employers
          </Text>
        </Animated.View>

        <Animated.View
          style={{ opacity: photoOp, transform: [{ scale: photoScale }] }}
          className="items-center mb-8"
        >
          <View style={hasPhoto ? styles.photoRingOn : styles.photoRingOff}>
            {hasPhoto ? (
              <Image
                source={{ uri: worker.profile_photo_uri }}
                style={styles.photoImg}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <LucideIcon name="User" size={56} color="#C6C5D4" />
                <Text style={styles.noPhotoText}>No photo</Text>
              </View>
            )}

            {hasPhoto && (
              <TouchableOpacity
                onPress={handleRemovePhoto}
                style={styles.removeBtn}
                activeOpacity={0.8}
              >
                <LucideIcon name="X" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>

          {hasPhoto && (
            <View style={styles.readyBadge}>
              <LucideIcon name="Check" size={12} color="#166534" />
              <Text style={styles.readyText}>Photo added</Text>
            </View>
          )}
        </Animated.View>

        <Animated.View
          style={{ opacity, transform: [{ translateY: slideY }] }}
          className="gap-3 mb-4"
        >
          <TouchableOpacity
            onPress={() => pickImage(true)}
            style={styles.actionBtn}
            activeOpacity={0.78}
          >
            <View style={styles.iconWrap}>
              <LucideIcon name="Camera" size={20} color="#000666" />
            </View>
            <Text style={styles.actionText}>Take from Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => pickImage(false)}
            style={styles.actionBtn}
            activeOpacity={0.78}
          >
            <View style={styles.iconWrap}>
              <LucideIcon name="Image" size={20} color="#000666" />
            </View>
            <Text style={styles.actionText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </Animated.View>

        <OnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/(worker)/onboarding/location')}
          nextLabel={hasPhoto ? 'Next' : 'Skip for now'}
        />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  photoRingOn: {
    width: 152,
    height: 152,
    borderRadius: 76,
    padding: 3,
    backgroundColor: '#000666',
    shadowColor: '#000666',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    position: 'relative',
  },
  photoRingOff: {
    width: 152,
    height: 152,
    borderRadius: 76,
    borderWidth: 2,
    borderColor: '#E4E1E7',
    position: 'relative',
    overflow: 'hidden',
  },
  photoImg: {
    width: '100%',
    height: '100%',
    borderRadius: 72,
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F2F8',
    borderRadius: 76,
  },
  noPhotoText: { color: '#9CA3AF', fontSize: 12, marginTop: 6 },
  removeBtn: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  readyText: { color: '#166534', fontSize: 12, fontWeight: '600' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E1E7',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrap: {
    backgroundColor: '#E0E0FF',
    padding: 10,
    borderRadius: 12,
  },
  actionText: { color: '#1B1B1F', fontWeight: '600', fontSize: 15 },
});
