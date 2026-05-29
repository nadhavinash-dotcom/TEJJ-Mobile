import { useState, useCallback, useRef, useEffect } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

// Graceful fallback: expo-speech-recognition is unavailable on web
let useSpeechRecognitionEvent = (_event: string, _handler: any) => {};
let SpeechRecognition: any = null;
let isVoiceSupported = false; // false until confirmed — prevents null-crash if require fails

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

  // Ref pattern: keeps onResult always current without making it a dep of handleResult.
  // This prevents handleResult from recreating on every render (which would cause
  // useSpeechRecognitionEvent to re-subscribe mid-recognition and miss results).
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

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
        onResultRef.current(res.data.data);
      } else {
        setError('Transcription failed');
      }
    } catch {
      setError('Could not process speech');
    } finally {
      setStatus('idle');
    }
  }, [language, setStatus]); // onResult intentionally excluded — use ref above

  useSpeechRecognitionEvent('result', handleResult);

  const handleError = useCallback((event: any) => {
    console.error('Speech error:', event.error, event.message);
    setError('Could not recognise speech');
    setStatus('idle');
  }, [setStatus]);

  useSpeechRecognitionEvent('error', handleError);

  // Stop recognition if the screen unmounts while listening
  useEffect(() => {
    return () => {
      if (isVoiceSupported && SpeechRecognition && statusRef.current !== 'idle') {
        SpeechRecognition.stop().catch(() => {});
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    if (statusRef.current !== 'idle') return;
    statusRef.current = 'listening'; // lock ref synchronously before any await
    setError(null); // always clear previous error before a new attempt

    if (!isVoiceSupported) {
      setStatus('idle');
      setError('Voice input is not available in this environment');
      return;
    }

    try {
      const { granted } = await SpeechRecognition.requestPermissionsAsync();
      if (!granted) {
        setStatus('idle');
        setError('Microphone permission required');
        return;
      }
      setStatus('listening'); // sync state to match ref for UI update
      await SpeechRecognition.start({ lang: locale, interimResults: false });
    } catch {
      setStatus('idle');
      setError('Failed to start speech recognition');
    }
  }, [locale, setStatus]);

  const stopListening = useCallback(async () => {
    if (!isVoiceSupported || !SpeechRecognition) {
      setStatus('idle');
      return;
    }
    try {
      await SpeechRecognition.stop();
    } catch {
      // stop() can throw if recognition isn't active — treat as stopped
    }
    // If the result/error event doesn't fire (e.g. no speech detected),
    // reset status so the button doesn't stay stuck in 'listening'.
    if (statusRef.current === 'listening') {
      setStatus('idle');
    }
  }, [setStatus]);

  return { status, startListening, stopListening, error };
}
