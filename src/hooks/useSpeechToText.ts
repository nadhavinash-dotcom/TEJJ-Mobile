import { useState, useCallback } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

// Graceful fallback: expo-speech-recognition is unavailable on web
let useSpeechRecognitionEvent = (_event: string, _handler: any) => {};
let SpeechRecognition: any = null;
let isVoiceSupported = false;

try {
  const m = require('expo-speech-recognition');
  useSpeechRecognitionEvent = m.useSpeechRecognitionEvent;
  SpeechRecognition = m.ExpoSpeechRecognitionModule;
  isVoiceSupported = true;
} catch {
  // Running in web or environment without native speech recognition
}

export type SpeechResult = {
  originalText: string;
  englishText: string;
  keywords: string[];
  structured: Record<string, unknown>;
};

export type SpeechStatus = 'idle' | 'listening' | 'processing';

const LOCALE_MAP: Record<string, string> = {
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  pa: 'pa-IN',
  en: 'en-US',
};

// Exported for unit testing — pure function with no side effects
export const resolveLocale = (language: string | null | undefined): string =>
  LOCALE_MAP[language ?? ''] ?? 'en-US';

export function useSpeechToText(onResult: (result: SpeechResult) => void) {
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const language = useAuthStore((s) => s.language);
  const locale = resolveLocale(language);

  useSpeechRecognitionEvent('result', async (event: any) => {
    const text = event.results[0]?.transcript;
    if (!text || status === 'processing') return;

    setStatus('processing');
    try {
      const res = await api.post('/voice/transcribe-translate', {
        text,
        sourceLanguage: language ?? 'en',
      });
      if (res.data.success) {
        onResult(res.data.data);
      }
    } catch {
      setError('Could not process speech');
    } finally {
      setStatus('idle');
    }
  });

  useSpeechRecognitionEvent('error', (event: any) => {
    console.error('Speech error:', event.error, event.message);
    setError('Could not recognise speech');
    setStatus('idle');
  });

  const startListening = useCallback(async () => {
    if (status !== 'idle') return;
    if (!isVoiceSupported) {
      setError('Voice input is not available in this environment');
      return;
    }
    setError(null);
    const { granted } = await SpeechRecognition.requestPermissionsAsync();
    if (!granted) {
      setError('Microphone permission required');
      return;
    }
    try {
      setStatus('listening');
      await SpeechRecognition.start({ lang: locale, interimResults: false });
    } catch {
      setStatus('idle');
      setError('Failed to start speech recognition');
    }
  }, [status, locale]);

  const stopListening = useCallback(async () => {
    if (isVoiceSupported && SpeechRecognition) {
      await SpeechRecognition.stop();
    }
  }, []);

  return { status, startListening, stopListening, error };
}
