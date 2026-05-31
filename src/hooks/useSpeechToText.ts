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

export type SpeechError = 'no-speech' | 'permission' | 'unsupported' | 'lang-not-downloaded' | 'error' | null;

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

  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  // Tracks last interim text so `end` event can process it when isFinal never fires
  const lastTranscriptRef = useRef('');

  const startListeningRef = useRef<(overrideLocale?: string) => Promise<void>>(async () => {});

  // ─── Core translate call — shared by isFinal path and end-event fallback ────

  const processTranscript = useCallback(async (text: string) => {
    console.log('[STT] processTranscript — text:', text, '| lang:', language);
    setStatus('processing');
    try {
      const res = await api.post('/voice/transcribe-translate', {
        text,
        sourceLanguage: language ?? 'en',
      });
      console.log('[STT] /transcribe-translate response:', JSON.stringify(res.data));
      if (res.data.success) {
        onResultRef.current(res.data.data);
      } else {
        console.warn('[STT] /transcribe-translate success:false', res.data);
        setError('error');
      }
    } catch (err: any) {
      console.error('[STT] /transcribe-translate error:', err?.response?.status, err?.message);
      setError('error');
    } finally {
      setStatus('idle');
    }
  }, [language, setStatus]);

  // ─── Result event ────────────────────────────────────────────────────────────

  const handleResult = useCallback(async (event: any) => {
    const resultItem = event.results?.[0];
    const text: string = resultItem?.transcript ?? '';
    console.log('[STT] result event — text:', text, '| isFinal:', event.isFinal, '| resultItem.isFinal:', resultItem?.isFinal, '| statusRef:', statusRef.current);
    if (!text) return;

    setTranscript(text);
    lastTranscriptRef.current = text; // always keep latest for end-event fallback

    const isFinal: boolean = event.isFinal ?? resultItem?.isFinal ?? false;
    if (!isFinal) {
      console.log('[STT] interim — stored in lastTranscriptRef, waiting for final or end event');
      return;
    }
    if (statusRef.current === 'processing') {
      console.log('[STT] already processing — skipping duplicate final event');
      return;
    }

    console.log('[STT] isFinal:true — processing via isFinal path');
    lastTranscriptRef.current = ''; // clear so end-event fallback doesn't double-fire
    await processTranscript(text);
  }, [processTranscript]);

  useSpeechRecognitionEvent('result', handleResult);

  // ─── End event — fires when recognition stops (manual stop or silence timeout) ─

  const handleEnd = useCallback(async () => {
    const text = lastTranscriptRef.current;
    console.log('[STT] end event — lastTranscript:', text, '| statusRef:', statusRef.current);

    if (text && statusRef.current !== 'processing') {
      // isFinal never fired or manual stop — use last interim transcript
      console.log('[STT] end fallback: processing last interim transcript');
      lastTranscriptRef.current = '';
      await processTranscript(text);
    }
  }, [processTranscript]);

  useSpeechRecognitionEvent('end', handleEnd);

  // ─── Error event ─────────────────────────────────────────────────────────────

  const handleSpeechError = useCallback((event: any) => {
    const code: string = event.error ?? '';
    console.log('[STT] speech error — code:', code, '| message:', event.message);

    if (code === 'no-speech' || code === 'no-match') {
      setError('no-speech');
    } else if (code === 'language-not-supported') {
      console.warn('[STT] language pack not downloaded — retrying with en-US');
      setError('lang-not-downloaded');
      setTranscript('');
      lastTranscriptRef.current = '';
      setStatus('idle');
      setTimeout(() => startListeningRef.current('en-US'), 300);
      return;
    } else {
      console.error('[STT] hard error:', code, event.message);
      setError('error');
    }
    setTranscript('');
    lastTranscriptRef.current = '';
    setStatus('idle');
  }, [setStatus]);

  useSpeechRecognitionEvent('error', handleSpeechError);

  useEffect(() => {
    return () => {
      if (isVoiceSupported && SpeechRecognition && statusRef.current !== 'idle') {
        SpeechRecognition.stop().catch(() => {});
      }
    };
  }, []);

  // ─── Start / stop ─────────────────────────────────────────────────────────────

  const startListening = useCallback(async (overrideLocale?: string) => {
    if (statusRef.current !== 'idle') return;
    statusRef.current = 'listening';
    setError(null);
    setTranscript('');
    lastTranscriptRef.current = '';

    if (!isVoiceSupported) {
      setStatus('idle');
      setError('unsupported');
      return;
    }

    const lang = overrideLocale ?? locale;
    console.log('[STT] startListening — lang:', lang);

    try {
      const { granted } = await SpeechRecognition.requestPermissionsAsync();
      if (!granted) {
        setStatus('idle');
        setError('permission');
        return;
      }
      setStatus('listening');
      await SpeechRecognition.start({
        lang,
        interimResults: true,
        continuous: false,
        androidIntentOptions: {
          EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 4000,
          EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 2000,
          EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 2000,
        },
      });
    } catch (err: any) {
      console.error('[STT] startListening error:', err?.message);
      setStatus('idle');
      setError('error');
    }
  }, [locale, setStatus]);

  startListeningRef.current = startListening;

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
    lastTranscriptRef.current = '';
    setStatus('idle');
  }, [setStatus]);

  return { status, transcript, error, startListening, stopListening, reset };
}
