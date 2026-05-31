import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
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

  const getOptions = useCallback(
    () => INDIAN_CITIES.map((city) => ({ id: city, label: city })),
    [],
  );

  const { handleVoiceResult, match, speechResult, dismiss } = useVoiceStep('location', getOptions);

  const detectLocation = async () => {
    setDetecting(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required to find nearby jobs.');
        return;
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
    } catch {
      Alert.alert('Location error', 'Could not detect location. Please set manually.');
    } finally {
      setDetecting(false);
    }
  };

  return (
    <SafeScreen className="flex-1">
      <View className="flex-1 px-6 pt-8">
        <StepIndicator currentStep={5} totalSteps={10} />
        <Text className="text-white text-2xl font-bold mb-1">Where do you live?</Text>
        <Text className="text-zinc-300 text-sm mb-4">Where do you live? We'll find jobs near you.</Text>
        <VoiceMicButton onResult={handleVoiceResult} />

        <View className="h-48 rounded-2xl overflow-hidden my-4 bg-zinc-800 items-center justify-center">
          {worker.home_lat ? (
            <MapPicker
              latitude={worker.home_lat}
              longitude={worker.home_lng!}
              onLocationChange={(lat, lng) => updateWorker({ home_lat: lat, home_lng: lng })}
            />
          ) : (
            <Text className="text-zinc-400">Tap "Detect Location" to set your pin</Text>
          )}
        </View>

        {worker.home_city && (
          <View className="bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3 mb-4 flex-row items-center gap-2">
            <LucideIcon name="MapPin" size={16} color="#F59E0B" />
            <Text className="text-white font-medium flex-1">
              {worker.home_area ? `${worker.home_area}, ` : ''}{worker.home_city}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={detectLocation}
          disabled={detecting}
          className="bg-zinc-800 border border-amber-500/40 rounded-2xl py-3 flex-row items-center justify-center gap-2 mb-6"
          activeOpacity={0.8}
        >
          {detecting
            ? <ActivityIndicator color="#F59E0B" size="small" />
            : <LucideIcon name="Locate" size={18} color="#F59E0B" />}
          <Text className="text-amber-400 font-semibold">{detecting ? 'Detecting...' : 'Detect my location'}</Text>
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
