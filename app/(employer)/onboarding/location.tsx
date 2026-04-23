import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { MapPicker } from '../../../src/components/shared/MapPicker';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

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
    <SafeScreen className="flex-1">
      <View className="flex-1 px-6 pt-8">
        <StepIndicator currentStep={2} totalSteps={4} />
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
          <View className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 mb-4 flex-row items-center gap-2">
            <LucideIcon name="MapPin" size={16} color="#3B82F6" />
            <Text className="text-white font-medium flex-1">{employer.address}</Text>
          </View>
        )}

        <TouchableOpacity onPress={detectLocation} disabled={detecting} className="bg-navy-800 border border-blue-500/40 rounded-2xl py-3 flex-row items-center justify-center gap-2 mb-6" activeOpacity={0.8}>
          {detecting ? <ActivityIndicator color="#3B82F6" size="small" /> : <LucideIcon name="Locate" size={18} color="#3B82F6" />}
          <Text className="text-blue-400 font-semibold">{detecting ? 'Detecting...' : 'Detect my location'}</Text>
        </TouchableOpacity>

        <OnboardingFooter 
          onBack={() => router.back()}
          onNext={() => router.push('/(employer)/onboarding/contact')}
          nextDisabled={!employer.lat}
          color="bg-blue-600"
        />
      </View>
    </SafeScreen>
  );
}
