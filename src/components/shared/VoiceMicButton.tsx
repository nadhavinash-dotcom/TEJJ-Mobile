import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { useSpeechToText, SpeechResult } from '../../hooks/useSpeechToText';
import { LucideIcon } from './LucideIcon';

interface VoiceMicButtonProps {
  onResult: (params: SpeechResult) => void;
  disabled?: boolean;
}

export function VoiceMicButton({ onResult, disabled }: VoiceMicButtonProps) {
  const { status, startListening, stopListening, error } = useSpeechToText(onResult);

  const isListening = status === 'listening';
  const isProcessing = status === 'processing';

  return (
    <View>
      <TouchableOpacity
        onPress={isListening ? stopListening : startListening}
        disabled={disabled || isProcessing}
        className={`flex-row items-center gap-2 px-4 py-2 rounded-xl border ${
          isListening
            ? 'border-red-500 bg-red-900/20'
            : 'border-amber-500/40 bg-amber-500/10'
        }`}
        activeOpacity={0.8}
      >
        {isProcessing ? (
          <ActivityIndicator size="small" color="#F59E0B" />
        ) : (
          <LucideIcon
            name="Mic"
            size={18}
            color={isListening ? '#EF4444' : '#F59E0B'}
          />
        )}
        <Text
          className={`text-sm ${
            isListening ? 'text-red-400' : 'text-amber-400'
          }`}
        >
          {isListening
            ? 'Listening...'
            : isProcessing
            ? 'Processing...'
            : 'Speak now'}
        </Text>
      </TouchableOpacity>
      {error ? (
        <Text className="text-red-400 text-xs mt-1">{error}</Text>
      ) : null}
    </View>
  );
}