import React, { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
}

export function OTPInput({ length = 6, onComplete }: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<Array<TextInput | null>>(Array(length).fill(null));

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newValues = [...values];
    newValues[index] = digit;
    setValues(newValues);

    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    const otp = newValues.join('');
    if (otp.length === length && !otp.includes('')) {
      onComplete(otp);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !values[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const newValues = [...values];
      newValues[index - 1] = '';
      setValues(newValues);
    }
  };

  return (
    <View className="flex-row justify-center gap-3">
      {Array(length).fill(null).map((_, i) => (
        <TextInput
          key={i}
          ref={(ref) => { inputs.current[i] = ref; }}
          value={values[i]}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
          keyboardType="number-pad"
          maxLength={1}
          autoFocus={i === 0}
          className="w-12 h-14 border-2 border-navy-600 bg-navy-800 rounded-xl text-center text-white text-xl font-bold"
          style={{ borderColor: values[i] ? '#F59E0B' : undefined }}
          selectionColor="#F59E0B"
        />
      ))}
    </View>
  );
}
