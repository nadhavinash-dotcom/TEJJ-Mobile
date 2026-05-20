# Speech-to-Text Centralization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract all speech-to-text logic from `VoiceMicButton` into a `useSpeechToText` hook, fix the default locale to English, and leave `VoiceMicButton` as a pure UI wrapper.

**Architecture:** A new `src/hooks/useSpeechToText.ts` owns the state machine, permissions, expo-speech-recognition events, and API call. It exports a `resolveLocale` pure function (testable without mocks) and a `SpeechResult` type re-used by the component. `VoiceMicButton` calls the hook and renders based on its returned `status`.

**Tech Stack:** expo-speech-recognition ^3.1.2, axios (via `src/lib/api`), zustand (`useAuthStore`), jest-expo for tests.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| **Create** | `src/hooks/useSpeechToText.ts` | All STT logic: locale mapping, permissions, recognition events, API call |
| **Create** | `src/__tests__/useSpeechToText.test.ts` | Unit tests for `resolveLocale` and hook state transitions |
| **Modify** | `src/components/shared/VoiceMicButton.tsx` | UI only — replace body with hook call, add inline error display |

No onboarding screens change. They already call `<VoiceMicButton onResult={...} />` without a language prop.

---

## Task 1: Install test dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install jest-expo and testing library**

```bash
npx expo install jest-expo @testing-library/react-native @types/jest --dev
```

- [ ] **Step 2: Add jest config and test script to `package.json`**

Open `package.json` and add the following. Place `"test"` in the `"scripts"` block and add the top-level `"jest"` key:

```json
"scripts": {
  "dev": "expo start",
  "android": "expo run:android",
  "ios": "expo run:ios",
  "build": "expo export",
  "type-check": "tsc --noEmit",
  "clean": "rm -rf .expo dist",
  "postinstall": "patch-package",
  "test": "jest"
},
```

```json
"jest": {
  "preset": "jest-expo",
  "transformIgnorePatterns": [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
  ]
}
```

- [ ] **Step 3: Verify jest runs (will find no tests yet — that is expected)**

```bash
npx jest --passWithNoTests
```

Expected output:
```
No tests found, exiting with code 0
```

---

## Task 2: Create `useSpeechToText` hook — test first

**Files:**
- Create: `src/__tests__/useSpeechToText.test.ts`
- Create: `src/hooks/useSpeechToText.ts`

- [ ] **Step 1: Write the failing test file**

Create `src/__tests__/useSpeechToText.test.ts`:

```typescript
import { resolveLocale } from '../hooks/useSpeechToText';

describe('resolveLocale', () => {
  it('maps hi to hi-IN', () => {
    expect(resolveLocale('hi')).toBe('hi-IN');
  });

  it('maps te to te-IN', () => {
    expect(resolveLocale('te')).toBe('te-IN');
  });

  it('maps ta to ta-IN', () => {
    expect(resolveLocale('ta')).toBe('ta-IN');
  });

  it('maps kn to kn-IN', () => {
    expect(resolveLocale('kn')).toBe('kn-IN');
  });

  it('maps mr to mr-IN', () => {
    expect(resolveLocale('mr')).toBe('mr-IN');
  });

  it('maps bn to bn-IN', () => {
    expect(resolveLocale('bn')).toBe('bn-IN');
  });

  it('maps pa to pa-IN', () => {
    expect(resolveLocale('pa')).toBe('pa-IN');
  });

  it('maps en to en-US', () => {
    expect(resolveLocale('en')).toBe('en-US');
  });

  it('returns en-US for null', () => {
    expect(resolveLocale(null)).toBe('en-US');
  });

  it('returns en-US for undefined', () => {
    expect(resolveLocale(undefined)).toBe('en-US');
  });

  it('returns en-US for unknown language code', () => {
    expect(resolveLocale('zz')).toBe('en-US');
  });

  it('returns en-US for empty string', () => {
    expect(resolveLocale('')).toBe('en-US');
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail with "Cannot find module"**

```bash
npx jest src/__tests__/useSpeechToText.test.ts
```

Expected output:
```
FAIL  src/__tests__/useSpeechToText.test.ts
  ● Test suite failed to run
    Cannot find module '../hooks/useSpeechToText'
```

- [ ] **Step 3: Create `src/hooks/useSpeechToText.ts` with the full implementation**

```typescript
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
```

- [ ] **Step 4: Run tests — confirm all 12 pass**

```bash
npx jest src/__tests__/useSpeechToText.test.ts
```

Expected output:
```
PASS  src/__tests__/useSpeechToText.test.ts
  resolveLocale
    ✓ maps hi to hi-IN
    ✓ maps te to te-IN
    ✓ maps ta to ta-IN
    ✓ maps kn to kn-IN
    ✓ maps mr to mr-IN
    ✓ maps bn to bn-IN
    ✓ maps pa to pa-IN
    ✓ maps en to en-US
    ✓ returns en-US for null
    ✓ returns en-US for undefined
    ✓ returns en-US for unknown language code
    ✓ returns en-US for empty string

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useSpeechToText.ts src/__tests__/useSpeechToText.test.ts package.json
git commit -m "feat: add useSpeechToText hook with en-US default locale"
```

---

## Task 3: Refactor `VoiceMicButton` to use the hook

**Files:**
- Modify: `src/components/shared/VoiceMicButton.tsx`

- [ ] **Step 1: Replace the entire file content**

The current file has ~90 lines mixing state, permissions, events, API calls, and UI. Replace it entirely with:

```typescript
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
```

Key changes from the original:
- All logic delegated to `useSpeechToText`
- `Alert.alert` for errors replaced with inline red text beneath the button (errors auto-clear on next tap via the hook's `setError(null)` in `startListening`)
- Outer `View` added to contain the optional error text

- [ ] **Step 2: Run type-check to confirm no type errors**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run the tests to confirm nothing broke**

```bash
npx jest
```

Expected:
```
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/VoiceMicButton.tsx
git commit -m "refactor: VoiceMicButton delegates all logic to useSpeechToText hook"
```

---

## Task 4: Manual smoke test

No code changes in this task — this is the acceptance test.

- [ ] **Step 1: Start the app**

```bash
npx expo start
```

Scan the QR code with your device.

- [ ] **Step 2: Complete the language selection screen**

Select any non-English language (e.g. Hindi). This writes to `useAuthStore`.

- [ ] **Step 3: Open the Role screen (Step 1 of worker onboarding)**

Tap the microphone button. Confirm:
- Button border turns red and label changes to "Listening..."
- Speaking a skill name (e.g. "cook", "waiter", "driver") selects the matching skill
- Button returns to amber idle state

- [ ] **Step 4: Verify English fallback**

Go back to language selection, pick **English**. Open the Role screen again and tap the mic. Confirm recognition still works. The locale used is now `en-US`.

- [ ] **Step 5: Verify error display**

Deny microphone permission in device settings (Settings → Apps → TEJJ → Permissions → Microphone → Deny). Tap the mic button. Confirm the inline red text "Microphone permission required" appears beneath the button (no Alert dialog).

- [ ] **Step 6: Verify the Pay screen**

Navigate to Pay (Step 7). Tap mic and say an amount ("five hundred", "paanch sau"). Confirm the slider moves to ₹500.

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "test: manual smoke test passed for useSpeechToText refactor"
```
