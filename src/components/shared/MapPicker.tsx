import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  readonly?: boolean;
}

export function MapPicker({ latitude, longitude, onLocationChange, readonly }: MapPickerProps) {
  const handlePress = (e: MapPressEvent) => {
    if (readonly) return;
    const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
    onLocationChange(lat, lng);
  };

  return (
    <MapView
      style={{ flex: 1, width: '100%' }}
      region={{ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
      onPress={handlePress}
      customMapStyle={[
        { elementType: 'geometry', stylers: [{ color: '#0F1F3D' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#9CA3AF' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#0A1628' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1E3A5F' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0A1628' }] },
      ]}
    >
      <Marker coordinate={{ latitude, longitude }} pinColor="#F59E0B" />
    </MapView>
  );
}
