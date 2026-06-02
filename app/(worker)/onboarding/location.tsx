import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Animated, StyleSheet, Linking } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { VoiceSuggestionSheet } from '../../../src/components/shared/VoiceSuggestionSheet';
import { MapPicker } from '../../../src/components/shared/MapPicker';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { useVoiceStep } from '../../../src/hooks/useVoiceStep';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';
import { INDIAN_CITIES } from '@/utils';

export default function LocationScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const [detecting, setDetecting] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 340, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 340, useNativeDriver: true }),
    ]).start();
  }, []);

  const getOptions = useCallback(
    () => INDIAN_CITIES.map((city) => ({ id: city, label: city })),
    [],
  );

  const { handleVoiceResult, match, speechResult, dismiss } = useVoiceStep('location', getOptions);

  const detectLocation = async () => {
    setDetecting(true);
    try {
      const existing = await Location.getForegroundPermissionsAsync();

      if (existing.status !== 'granted') {
        if (!existing.canAskAgain) {
          Alert.alert(
            'Permission denied',
            'Location access was blocked. Enable it in Settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
          return;
        }
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Location permission is required to find nearby jobs.');
          return;
        }
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      updateWorker({ home_lat: loc.coords.latitude, home_lng: loc.coords.longitude });
      const geo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geo[0]) {
        updateWorker({
          home_city: geo[0].city ?? geo[0].subregion ?? '',
          home_area: geo[0].district ?? geo[0].street ?? '',
        });
      }
    } catch (err) {
      console.error('Location detection failed:', err);
      Alert.alert('Location error', 'Could not detect location. Please set manually.');
    } finally {
      setDetecting(false);
    }
  };

  return (
    <SafeScreen className="flex-1">
      <View className="flex-1 px-6 pt-8">
        <Animated.View style={{ opacity, transform: [{ translateY: slideY }] }}>
          <StepIndicator currentStep={6} totalSteps={11} />
          <Text className="text-on-surface text-2xl font-bold mb-1">Where do you live?</Text>
          <Text className="text-on-surface-variant text-sm mb-4">We'll find jobs closest to your home</Text>
          <VoiceMicButton onResult={handleVoiceResult} />
        </Animated.View>

        <View style={styles.mapContainer}>
          {worker.home_lat ? (
            <MapPicker
              latitude={worker.home_lat}
              longitude={worker.home_lng!}
              onLocationChange={(lat, lng) => updateWorker({ home_lat: lat, home_lng: lng })}
            />
          ) : (
            <View style={styles.mapPlaceholder}>
              <LucideIcon name="Map" size={32} color="#C6C5D4" />
              <Text style={styles.mapPlaceholderText}>Tap below to detect your location</Text>
            </View>
          )}
        </View>

        {worker.home_city && (
          <View style={styles.locationPill}>
            <LucideIcon name="MapPin" size={15} color="#000666" />
            <Text style={styles.locationText}>
              {worker.home_area ? `${worker.home_area}, ` : ''}{worker.home_city}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={detectLocation}
          disabled={detecting}
          style={styles.detectBtn}
          activeOpacity={0.8}
        >
          {detecting
            ? <ActivityIndicator color="#000666" size="small" />
            : <LucideIcon name="Locate" size={18} color="#000666" />}
          <Text style={styles.detectText}>{detecting ? 'Detecting...' : 'Detect my location'}</Text>
        </TouchableOpacity>

        <OnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/(worker)/onboarding/availability')}
          nextDisabled={!worker.home_lat && !worker.home_city}
        />
      </View>

      <VoiceSuggestionSheet
        match={match}
        speechResult={speechResult}
        multiSelect={false}
        onConfirm={(selected) => {
          if (selected[0]) updateWorker({ home_city: selected[0].id });
          dismiss();
        }}
        onClose={dismiss}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 192,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 16,
    backgroundColor: '#F6F2F8',
    borderWidth: 1,
    borderColor: '#E4E1E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholder: { alignItems: 'center', gap: 10 },
  mapPlaceholderText: { color: '#9CA3AF', fontSize: 13 },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E1E7',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  locationText: { color: '#1B1B1F', fontWeight: '500', fontSize: 14, flex: 1 },
  detectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C6C5D4',
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  detectText: { color: '#000666', fontWeight: '600', fontSize: 15 },
});
