import { useState, useCallback, useRef, useEffect } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

let useSpeechRecognitionEvent = (_event: string, _handler: any) => {};
let SpeechRecognition: any = null;
let isVoiceSupported = false;

try {
  const m = require('expo-speech-recognition');
  useSpeechRecognitionEvent = m.useSpeechRecognitionEvent;
  SpeechRecognition = m.ExpoSpeechRecognitionModule;
  isVoiceSupported = true;
} catch {
  // web or environment without native speech recognition
}

export type SpeechResult = {
  originalText: string;
  englishText: string;
  keywords: string[];
  structured: Record<string, unknown>;
};

export type SpeechStatus = 'idle' | 'listening' | 'processing';

// 'no-speech'  → user should retry, not a hard failure
// 'permission' → microphone denied
// 'error'      → something else went wrong
export type SpeechError = 'no-speech' | 'permission' | 'unsupported' | 'error' | null;

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

export const resolveLocale = (language: string | null | undefined): string =>
  LOCALE_MAP[language ?? ''] ?? 'en-US';

export function useSpeechToText(onResult: (result: SpeechResult) => void) {
  const [status, setStatusState] = useState<SpeechStatus>('idle');
  const statusRef = useRef<SpeechStatus>('idle');
  const setStatus = useCallback((s: SpeechStatus) => {
    statusRef.current = s;
    setStatusState(s);
  }, []);

  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<SpeechError>(null);

  const language = useAuthStore((s) => s.language);
  const locale = resolveLocale(language);

  // Ref keeps onResult stable so handleResult never needs to re-subscribe
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const handleResult = useCallback(async (event: any) => {
    const resultItem = event.results?.[0];
    const text: string = resultItem?.transcript ?? '';
    if (!text) return;

    // Always show live transcript (interim + final)
    setTranscript(text);

    // isFinal is on the EVENT in expo-speech-recognition, not on results[0]
    const isFinal: boolean = event.isFinal ?? resultItem?.isFinal ?? true;
    if (!isFinal || statusRef.current === 'processing') return;

    setStatus('processing');
    try {
      const res = await api.post('/voice/transcribe-translate', {
        text,
        sourceLanguage: language ?? 'en',
      });
      if (res.data.success) {
        onResultRef.current(res.data.data);
      } else {
        setError('error');
      }
    } catch {
      setError('error');
    } finally {
      setStatus('idle');
    }
  }, [language, setStatus]);

  useSpeechRecognitionEvent('result', handleResult);

  const handleSpeechError = useCallback((event: any) => {
    const code: string = event.error ?? '';
    // 'no-speech' and 'no-match' are soft errors — offer retry, not failure
    if (code === 'no-speech' || code === 'no-match') {
      setError('no-speech');
    } else {
      console.error('Speech error:', code, event.message);
      setError('error');
    }
    setTranscript('');
    setStatus('idle');
  }, [setStatus]);

  useSpeechRecognitionEvent('error', handleSpeechError);

  // Stop recognition on unmount (e.g. screen navigate-away mid-listen)
  useEffect(() => {
    return () => {
      if (isVoiceSupported && SpeechRecognition && statusRef.current !== 'idle') {
        SpeechRecognition.stop().catch(() => {});
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    if (statusRef.current !== 'idle') return;
    statusRef.current = 'listening';
    setError(null);
    setTranscript('');

    if (!isVoiceSupported) {
      setStatus('idle');
      setError('unsupported');
      return;
    }

    try {
      const { granted } = await SpeechRecognition.requestPermissionsAsync();
      if (!granted) {
        setStatus('idle');
        setError('permission');
        return;
      }
      setStatus('listening');
      await SpeechRecognition.start({
        lang: locale,
        interimResults: true,   // enables live transcript display
        continuous: false,
        // Give Android extra time before declaring no-speech
        androidIntentOptions: {
          EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 4000,
          EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 2000,
          EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 2000,
        },
      });
    } catch {
      setStatus('idle');
      setError('error');
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
      // stop() throws when recognition isn't active — safe to ignore
    }
    if (statusRef.current === 'listening') {
      setStatus('idle');
    }
  }, [setStatus]);

  const reset = useCallback(() => {
    setError(null);
    setTranscript('');
    setStatus('idle');
  }, [setStatus]);

  return { status, transcript, error, startListening, stopListening, reset };
}
