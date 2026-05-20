# Speech-to-Text Centralization — Design Spec
**Date:** 2026-05-20  
**Status:** Approved  
**Scope:** Worker + Employer onboarding screens (tejj-frontend)

---

## Problem

`VoiceMicButton` mixes UI rendering with all business logic (permissions, speech recognition, API calls, locale mapping). Every screen that uses it must manually pull `language` from `useAuthStore` and pass it as a prop. This wiring is inconsistent and requires every future screen to repeat the same boilerplate.

---

## Goal

Extract all logic from `VoiceMicButton` into a `useSpeechToText` hook that:
- reads `language` from `useAuthStore` automatically (English default)
- owns the full state machine and API call
- leaves `VoiceMicButton` as a pure UI wrapper (~30 lines)

No new screens receive speech-to-text. No backend changes. No new dependencies.

---

## Architecture

### New file
```
src/hooks/useSpeechToText.ts
```

### Modified file
```
src/components/shared/VoiceMicButton.tsx   (UI only, calls useSpeechToText)
```

### Unchanged
- All 7 onboarding screens (only the `language` prop + import removed)
- `/voice/transcribe-translate` backend API
- `mapVoiceToExperience`, `mapVoiceToPay` utilities
- `VoiceMicButton` visual appearance

---

## `useSpeechToText` Hook

### Signature

```typescript
type SpeechStatus = 'idle' | 'listening' | 'processing';

type SpeechResult = {
  originalText: string;
  englishText: string;
  keywords: string[];
  structured: Record<string, unknown>;
};

function useSpeechToText(onResult: (result: SpeechResult) => void): {
  status: SpeechStatus;
  startListening: () => Promise<void>;
  error: string | null;
}
```

### Language Resolution

The hook reads `language` from `useAuthStore()` on every call to `startListening`. It maps to a BCP-47 locale for `expo-speech-recognition`:

| Store value | Locale   |
|-------------|----------|
| `'hi'`      | `hi-IN`  |
| `'te'`      | `te-IN`  |
| `'ta'`      | `ta-IN`  |
| `'kn'`      | `kn-IN`  |
| `'mr'`      | `mr-IN`  |
| `'bn'`      | `bn-IN`  |
| `'pa'`      | `pa-IN`  |
| `'en'`      | `en-US`  |
| `null` / `undefined` / unknown | `en-US` |

The locale map is a `const` object defined at module level inside `useSpeechToText.ts`. No prop, no argument — always derived from the store.

### State Machine

```
idle ──[startListening]──► listening ──[speech result]──► processing ──[API OK]──► idle
                                       └──[error/timeout]─────────────────────────► idle
```

- `startListening` is a no-op if `status !== 'idle'` (prevents double-taps).
- On any error (permission denied, recognition error, API failure): `status` resets to `idle`, `error` is set with a human-readable message.
- `error` resets to `null` at the start of each `startListening` call.

### Internal Flow

```
startListening()
  │
  ├─ reset error, check status guard
  ├─ ExpoSpeechRecognition.requestPermissionsAsync()
  │    └─ denied → set error, return
  ├─ set status = 'listening'
  ├─ ExpoSpeechRecognition.start({ lang: locale, interimResults: false })
  ├─ listen for 'result' event
  │    └─ transcript = event.results[0][0].transcript
  ├─ set status = 'processing'
  ├─ POST /voice/transcribe-translate { text: transcript, sourceLanguage: language }
  │    ├─ success → call onResult(data), set status = 'idle'
  │    └─ error   → set error, set status = 'idle'
  └─ listen for 'error' event → set error, set status = 'idle'
```

---

## `VoiceMicButton` Refactor

Becomes a pure UI component. Receives only `onResult`:

```tsx
type Props = {
  onResult: (result: SpeechResult) => void;
};

export function VoiceMicButton({ onResult }: Props) {
  const { status, startListening, error } = useSpeechToText(onResult);

  // Renders:
  // idle       → mic icon, amber border, "Speak now"
  // listening  → red mic icon, red border, "Listening..."
  // processing → spinner, "Processing...", disabled
  // error      → brief error text beneath button (auto-clears on next tap)
}
```

No `language` prop. No logic. No API calls.

---

## Screen Changes (7 screens)

The only mechanical change per screen:

```diff
- const { language } = useAuthStore();
- <VoiceMicButton language={language} onResult={handleVoiceResult} />
+ <VoiceMicButton onResult={handleVoiceResult} />
```

The `handleVoiceResult` function inside each screen is **not touched**.

### Screens affected
| File | Change |
|------|--------|
| `app/(worker)/onboarding/role.tsx` | Remove `language` prop + import |
| `app/(worker)/onboarding/sub-skill.tsx` | Remove `language` prop + import |
| `app/(worker)/onboarding/experience.tsx` | Remove `language` prop + import |
| `app/(worker)/onboarding/location.tsx` | Remove `language` prop + import |
| `app/(worker)/onboarding/availability.tsx` | Remove `language` prop + import |
| `app/(worker)/onboarding/pay.tsx` | Remove `language` prop + import |
| `app/(employer)/onboarding/property.tsx` | Remove `language` prop + import |

---

## Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Microphone permission denied | `error = "Microphone permission required"`, status → idle |
| No speech detected / timeout | `error = "No speech detected, try again"`, status → idle |
| Speech recognition engine error | `error = "Could not recognise speech"`, status → idle |
| API call fails (network/server) | `error = "Could not process speech"`, status → idle |
| Language not set in store | Silently falls back to `en-US`, no error |

Errors are surfaced in `VoiceMicButton` as a small text label below the button. They reset on the next `startListening` call.

---

## What Is Explicitly Out of Scope

- Adding speech to employer contact, compliance, or location screens
- Any new backend endpoints
- New dependencies
- Changes to `mapVoiceToExperience`, `mapVoiceToPay`, or any other util
- Changes to the onboarding store
- UI redesign of `VoiceMicButton`
