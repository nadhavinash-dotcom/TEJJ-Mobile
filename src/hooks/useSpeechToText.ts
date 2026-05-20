import { useState, useCallback, useRef } from 'react';
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
  const [status, setStatusState] = useState<SpeechStatus>('idle');
  const statusRef = useRef<SpeechStatus>('idle');
  const setStatus = useCallback((s: SpeechStatus) => {
    statusRef.current = s;
    setStatusState(s);
  }, []);
  const [error, setError] = useState<string | null>(null);
  const language = useAuthStore((s) => s.language);
  const locale = resolveLocale(language);

  const handleResult = useCallback(async (event: any) => {
    const text = event.results[0]?.transcript;
    if (!text || statusRef.current === 'processing') return;

    setStatus('processing');
    try {
      const res = await api.post('/voice/transcribe-translate', {
        text,
        sourceLanguage: language ?? 'en',
      });
      if (res.data.success) {
        onResult(res.data.data);
      } else {
        setError('Transcription failed');
      }
    } catch {
      setError('Could not process speech');
    } finally {
      setStatus('idle');
    }
  }, [language, onResult, setStatus]);

  useSpeechRecognitionEvent('result', handleResult);

  const handleError = useCallback((event: any) => {
    console.error('Speech error:', event.error, event.message);
    setError('Could not recognise speech');
    setStatus('idle');
  }, []);

  useSpeechRecognitionEvent('error', handleError);

  const startListening = useCallback(async () => {
    if (statusRef.current !== 'idle') return;
    statusRef.current = 'listening'; // lock ref synchronously before any await
    if (!isVoiceSupported) {
      setStatus('idle');
      setError('Voice input is not available in this environment');
      return;
    }
    setError(null);
    const { granted } = await SpeechRecognition.requestPermissionsAsync();
    if (!granted) {
      setStatus('idle');
      setError('Microphone permission required');
      return;
    }
    try {
      setStatus('listening'); // sync state to match ref for UI update
      await SpeechRecognition.start({ lang: locale, interimResults: false });
    } catch {
      setStatus('idle');
      setError('Failed to start speech recognition');
    }
  }, [locale, setStatus]);

  const stopListening = useCallback(async () => {
    if (isVoiceSupported && SpeechRecognition) {
      await SpeechRecognition.stop();
    }
  }, []);

  return { status, startListening, stopListening, error };
}
