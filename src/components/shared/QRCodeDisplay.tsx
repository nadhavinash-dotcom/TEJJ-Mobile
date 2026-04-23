import React from 'react';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  if (!value) return null;
  return (
    <QRCode
      value={value}
      size={size}
      backgroundColor="white"
      color="black"
      ecl="M"
    />
  );
}
