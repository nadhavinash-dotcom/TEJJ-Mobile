import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { MapPicker } from '../../../src/components/shared/MapPicker';
import { useOnboardingStore } from '../../../src/store/onboardingStore';

export default function EmployerLocationScreen() {
  const { employer, updateEmployer } = useOnboardingStore();
  const [detecting, setDetecting] = useState(false);

  const detectLocation = async () => {
    setDetecting(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Permission needed', 'Location access required.'); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      updateEmployer({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      const geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      if (geo[0]) {
        updateEmployer({
          city: geo[0].city ?? '',
          area_locality: geo[0].district ?? geo[0].street ?? '',
          address: [geo[0].street, geo[0].district, geo[0].city].filter(Boolean).join(', '),
        });
      }
    } catch { Alert.alert('Error', 'Could not detect location.'); }
    finally { setDetecting(false); }
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-900">
      <View className="flex-1 px-6 pt-8">
        <Text className="text-navy-400 text-sm mb-1">Step 2 of 5</Text>
        <Text className="text-white text-2xl font-bold mb-1">Property Location</Text>
        <Text className="text-navy-300 text-sm mb-4">Pin your property on the map</Text>

        <View className="h-48 rounded-2xl overflow-hidden mb-4 bg-navy-800 items-center justify-center">
          {employer.lat ? (
            <MapPicker latitude={employer.lat} longitude={employer.lng!} onLocationChange={(lat, lng) => updateEmployer({ lat, lng })} />
          ) : (
            <Text className="text-navy-400">Tap below to detect your location</Text>
          )}
        </View>

        {employer.address && (
          <View className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 mb-4">
            <Text className="text-white font-medium">📍 {employer.address}</Text>
          </View>
        )}

        <TouchableOpacity onPress={detectLocation} disabled={detecting} className="bg-navy-800 border border-blue-500/40 rounded-2xl py-3 flex-row items-center justify-center gap-2 mb-6" activeOpacity={0.8}>
          {detecting ? <ActivityIndicator color="#3B82F6" size="small" /> : <Text className="text-blue-400">📍</Text>}
          <Text className="text-blue-400 font-semibold">{detecting ? 'Detecting...' : 'Detect my location'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(employer)/onboarding/contact')}
          disabled={!employer.lat}
          className={`rounded-2xl py-4 items-center ${employer.lat ? 'bg-blue-600' : 'bg-navy-700'}`}
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-base">Next →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
