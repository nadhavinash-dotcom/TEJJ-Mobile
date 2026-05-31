import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Animated, StyleSheet } from 'react-native';
import { SafeScreen } from '../../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { MapPicker } from '../../../src/components/shared/MapPicker';
import { StepIndicator } from '../../../src/components/shared/StepIndicator';
import { OnboardingFooter } from '../../../src/components/shared/OnboardingFooter';
import { useOnboardingStore } from '../../../src/store/onboardingStore';
import { LucideIcon } from '../../../src/components/shared/LucideIcon';

const BLUE = '#2563EB';

export default function EmployerLocationScreen() {
  const { employer, updateEmployer } = useOnboardingStore();
  const [detecting, setDetecting] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 340, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 340, useNativeDriver: true }),
    ]).start();
  }, []);

  const detectLocation = async () => {
    setDetecting(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location access required.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      updateEmployer({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      const geo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geo[0]) {
        updateEmployer({
          city: geo[0].city ?? '',
          area_locality: geo[0].district ?? geo[0].street ?? '',
          address: [geo[0].street, geo[0].district, geo[0].city].filter(Boolean).join(', '),
        });
      }
    } catch {
      Alert.alert('Error', 'Could not detect location.');
    } finally {
      setDetecting(false);
    }
  };

  return (
    <SafeScreen className="flex-1">
      <View className="flex-1 px-6 pt-8">
        <Animated.View style={{ opacity, transform: [{ translateY: slideY }] }}>
          <StepIndicator currentStep={2} totalSteps={4} accentColor={BLUE} />
          <Text className="text-on-surface text-2xl font-bold mb-1">Property location</Text>
          <Text className="text-on-surface-variant text-sm mb-4">Pin your property so workers can find you</Text>
        </Animated.View>

        <View style={styles.mapContainer}>
          {employer.lat ? (
            <MapPicker
              latitude={employer.lat}
              longitude={employer.lng!}
              onLocationChange={(lat, lng) => updateEmployer({ lat, lng })}
            />
          ) : (
            <View style={styles.mapPlaceholder}>
              <LucideIcon name="Building2" size={32} color="#C6C5D4" />
              <Text style={styles.mapPlaceholderText}>Tap below to detect your location</Text>
            </View>
          )}
        </View>

        {employer.address && (
          <View style={styles.addressPill}>
            <LucideIcon name="MapPin" size={15} color={BLUE} />
            <Text style={styles.addressText}>{employer.address}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={detectLocation}
          disabled={detecting}
          style={styles.detectBtn}
          activeOpacity={0.8}
        >
          {detecting
            ? <ActivityIndicator color={BLUE} size="small" />
            : <LucideIcon name="Locate" size={18} color={BLUE} />}
          <Text style={styles.detectText}>{detecting ? 'Detecting...' : 'Detect my location'}</Text>
        </TouchableOpacity>

        <OnboardingFooter
          onBack={() => router.back()}
          onNext={() => router.push('/(employer)/onboarding/contact')}
          nextDisabled={!employer.lat}
          color={BLUE}
        />
      </View>
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
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  addressText: { color: '#1B1B1F', fontWeight: '500', fontSize: 14, flex: 1 },
  detectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  detectText: { color: '#2563EB', fontWeight: '600', fontSize: 15 },
});
