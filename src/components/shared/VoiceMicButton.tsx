import React, { useState, useCallback, useEffect } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
let useSpeechRecognitionEvent = (event: string, callback: any) => {};
let SpeechRecognition: any = null;
let isVoiceSupported = false;

try {
  const speechModule = require('expo-speech-recognition');
  useSpeechRecognitionEvent = speechModule.useSpeechRecognitionEvent;
  SpeechRecognition = speechModule.ExpoSpeechRecognitionModule;
  isVoiceSupported = true;
} catch (e) {
  console.warn("expo-speech-recognition not available");
}
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { LANGUAGES } from '@/utils';

interface VoiceMicButtonProps {
  onResult: (params: {
    originalText: string;
    englishText: string;
    keywords: string[];
    structured: Record<string, unknown>;
  }) => void;
  disabled?: boolean;
}

type VoiceState = 'idle' | 'listening' | 'processing';

export function VoiceMicButton({ onResult, disabled }: VoiceMicButtonProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const language = useAuthStore((s) => s.language);

  const langCode = LANGUAGES.find((l) => l.code === language)?.code ?? 'hi';
  const localeMap: Record<string, string> = {
    hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', kn: 'kn-IN',
    mr: 'mr-IN', bn: 'bn-IN', pa: 'pa-IN', en: 'en-US',
  };
  const locale = localeMap[langCode] ?? 'hi-IN';

  // Listen for results using the new hook pattern
  useSpeechRecognitionEvent("result", async (event) => {
    const text = event.results[0]?.transcript;
    if (!text || voiceState === 'processing') return;

    setVoiceState('processing');
    try {
      const res = await api.post('/voice/transcribe-translate', {
        text,
        sourceLanguage: langCode,
      });
      onResult(res.data.data);
    } catch {
      Alert.alert('Voice Error', 'Could not process your speech. Please try again.');
    } finally {
      setVoiceState('idle');
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.error("Speech error:", event.error, event.message);
    setVoiceState('idle');
  });

  const startListening = useCallback(async () => {
    if (disabled || voiceState !== 'idle') return;
    if (!isVoiceSupported) {
      Alert.alert('Not Supported', 'Voice features are not available in this environment.');
      return;
    }

    const { granted } = await SpeechRecognition.requestPermissionsAsync();
    if (!granted) {
      Alert.alert('Microphone Error', 'Permissions are required to use voice input.');
      return;
    }

    try {
      setVoiceState('listening');
      await SpeechRecognition.start({
        lang: locale,
        interimResults: false, // Set to true if you want to see text as you speak
      });
    } catch (err) {
      setVoiceState('idle');
      Alert.alert('Error', 'Failed to start speech recognition.');
    }
  }, [disabled, voiceState, locale]);

  const stopListening = useCallback(async () => {
    if (isVoiceSupported && SpeechRecognition) {
      await SpeechRecognition.stop();
    }
    // The 'result' event above will trigger automatically after stopping
  }, []);

  const icons = { idle: '🎤', listening: '🔴', processing: '⏳' };
  const labels = { idle: 'Bolkar batao', listening: 'Sun raha hun...', processing: 'Samajh raha hun...' };

  return (
    <TouchableOpacity
      onPress={voiceState === 'listening' ? stopListening : startListening}
      disabled={disabled || voiceState === 'processing'}
      className={`flex-row items-center gap-2 px-4 py-2 rounded-xl border ${voiceState === 'listening' ? 'border-red-500 bg-red-900/20' : 'border-amber-500/40 bg-amber-500/10'
        }`}
      activeOpacity={0.8}
    >
      {voiceState === 'processing' ? (
        <ActivityIndicator size="small" color="#F59E0B" />
      ) : (
        <Text className="text-lg">{icons[voiceState]}</Text>
      )}
      <Text className={`text-sm ${voiceState === 'listening' ? 'text-red-400' : 'text-amber-400'}`}>
        {labels[voiceState]}
      </Text>
    </TouchableOpacity>
  );
}