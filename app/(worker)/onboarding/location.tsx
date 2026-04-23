import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { VoiceMicButton } from '../../../src/components/shared/VoiceMicButton';
import { MapPicker } from '../../../src/components/shared/MapPicker';
import { useOnboardingStore } from '../../../src/store/onboardingStore';

export default function LocationScreen() {
  const { worker, updateWorker } = useOnboardingStore();
  const [detecting, setDetecting] = useState(false);

  const handleVoiceResult = ({ structured }: { structured: Record<string, unknown>; englishText: string; keywords: string[]; originalText: string }) => {
    if (structured.city) {
      updateWorker({ home_city: structured.city as string });
    }
  };

  const detectLocation = async () => {
    setDetecting(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required to find nearby jobs.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      updateWorker({
        home_lat: loc.coords.latitude,
        home_lng: loc.coords.longitude,
      });
      const geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      if (geo[0]) {
        const city = geo[0].city ?? geo[0].subregion ?? '';
        const area = geo[0].district ?? geo[0].street ?? '';
        updateWorker({ home_city: city, home_area: area });
      }
    } catch {
      Alert.alert('Location error', 'Could not detect location. Please set manually.');
    } finally {
      setDetecting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <View className="flex-1 px-6 pt-8">
        <Text className="text-navy-400 text-sm mb-1">Step 5 of 10</Text>
        <Text className="text-white text-2xl font-bold mb-1">Aap kahan rehte hain?</Text>
        <Text className="text-navy-300 text-sm mb-4">Where do you live? We'll find jobs near you.</Text>
        <VoiceMicButton onResult={handleVoiceResult} />

        <View className="h-48 rounded-2xl overflow-hidden my-4 bg-navy-800 items-center justify-center">
          {worker.home_lat ? (
            <MapPicker
              latitude={worker.home_lat}
              longitude={worker.home_lng!}
              onLocationChange={(lat, lng) => updateWorker({ home_lat: lat, home_lng: lng })}
            />
          ) : (
            <Text className="text-navy-400">Tap "Detect Location" to set your pin</Text>
          )}
        </View>

        {worker.home_city && (
          <View className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 mb-4">
            <Text className="text-white font-medium">📍 {worker.home_area ? `${worker.home_area}, ` : ''}{worker.home_city}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={detectLocation}
          disabled={detecting}
          className="bg-navy-800 border border-amber-500/40 rounded-2xl py-3 flex-row items-center justify-center gap-2 mb-6"
          activeOpacity={0.8}
        >
          {detecting ? <ActivityIndicator color="#F59E0B" size="small" /> : <Text className="text-amber-400">📍</Text>}
          <Text className="text-amber-400 font-semibold">{detecting ? 'Detecting...' : 'Apni location detect karo'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(worker)/onboarding/availability')}
          disabled={!worker.home_lat && !worker.home_city}
          className={`rounded-2xl py-4 items-center ${worker.home_lat || worker.home_city ? 'bg-amber-500' : 'bg-navy-700'}`}
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-base">Aage Badhein →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
