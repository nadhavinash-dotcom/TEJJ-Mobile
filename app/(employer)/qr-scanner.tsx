import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeScreen } from '../../src/components/shared/SafeScreen';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useMutation } from '@tanstack/react-query';
import api from '../../src/lib/api';
import { LucideIcon } from '../../src/components/shared/LucideIcon';

export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const mutation = useMutation({
    mutationFn: async (qrToken: string) => {
      const res = await api.post('/dispatch/verify-arrival', { qr_token: qrToken });
      return res.data.data;
    },
    onSuccess: () => {
      Alert.alert('Arrival Confirmed!', 'Worker has been checked in successfully.', [
        { text: 'OK', onPress: () => router.replace('/(employer)/(tabs)/dashboard') },
      ]);
    },
    onError: (e: any) => {
      Alert.alert('Invalid QR', e?.response?.data?.message ?? 'Could not verify QR code.', [
        { text: 'Retry', onPress: () => setScanned(false) },
      ]);
    },
  });

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned || mutation.isPending) return;
    setScanned(true);
    mutation.mutate(data);
  };

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <SafeScreen className="px-6 justify-center items-center">
        <View className="mb-4">
          <LucideIcon name="Camera" size={64} color="#3B82F6" />
        </View>
        <Text className="text-white text-lg font-bold mb-2">Camera Access Required</Text>
        <Text className="text-navy-300 text-sm text-center mb-6">Please allow camera access to scan worker QR codes</Text>
        <TouchableOpacity onPress={requestPermission} className="bg-blue-600 rounded-2xl py-4 px-8" activeOpacity={0.85}>
          <Text className="text-white font-bold">Allow Camera</Text>
        </TouchableOpacity>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen className="flex-1">
      <View className="px-4 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1">
          <LucideIcon name="ChevronLeft" size={20} color="#F59E0B" />
          <Text className="text-amber-400 text-base">Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold mt-3 mb-1">Scan Worker QR</Text>
        <Text className="text-navy-300 text-sm">Point camera at worker's QR code to confirm arrival</Text>
      </View>

      <View className="flex-1 mx-4 mb-4 rounded-2xl overflow-hidden">
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View className="flex-1 items-center justify-center">
            <View className="w-60 h-60 border-2 border-amber-400 rounded-2xl" />
            <Text className="text-white text-sm mt-4 bg-navy-900/60 px-4 py-2 rounded-xl">
              {mutation.isPending ? 'Verifying...' : 'Align QR code within the frame'}
            </Text>
          </View>
        </CameraView>
      </View>
    </SafeScreen>
  );
}
