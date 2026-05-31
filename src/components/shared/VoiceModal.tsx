import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useSpeechToText, SpeechResult } from '../../hooks/useSpeechToText';
import { LucideIcon } from './LucideIcon';

interface VoiceModalProps {
  visible: boolean;
  onClose: () => void;
  /**
   * true     → applied immediately; show "Applied!" then close.
   * 'pending' → suggestion sheet opens after close; show "Got it!" then close.
   * false/void → no match found; show retry prompt.
   */
  onResult: (result: SpeechResult) => boolean | 'pending' | void;
}

const ERROR_MESSAGES: Record<string, string> = {
  'no-speech': "Didn't catch that or couldn't match your input. Try again.",
  'permission': 'Microphone permission denied. Enable it in Settings.',
  'unsupported': 'Voice input not available on this device.',
  'lang-not-downloaded': 'Language pack not installed — switching to English. Speak now...',
  'error': 'Something went wrong. Please try again.',
};

export function VoiceModal({ visible, onClose, onResult }: VoiceModalProps) {
  const [applied, setApplied] = useState<boolean | 'pending'>(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseRef = useRef<Animated.CompositeAnimation | null>(null);

  // Stable refs so the hook's onResult never causes re-subscription
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const handleResult = useCallback((result: SpeechResult) => {
    console.log('[VoiceModal] handleResult — originalText:', result.originalText, '| englishText:', result.englishText, '| keywords:', result.keywords);
    const wasApplied = onResultRef.current(result);
    console.log('[VoiceModal] onResult returned:', wasApplied);
    if (wasApplied === true) {
      setApplied(true);
      setTimeout(() => {
        setApplied(false);
        onCloseRef.current();
      }, 1200);
    } else if (wasApplied === 'pending') {
      setApplied('pending');
      setTimeout(() => {
        setApplied(false);
        onCloseRef.current();
      }, 800);
    } else {
      console.warn('[VoiceModal] onResult returned false/void — showing retry prompt');
      setError('no-speech');
    }
  }, []);

  const { status, transcript, error, startListening, stopListening, reset } =
    useSpeechToText(handleResult);

  // Auto-start when modal mounts; stop + reset when it unmounts
  useEffect(() => {
    startListening();
    return () => {
      stopListening();
      reset();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pulse animation tied to listening state
  useEffect(() => {
    if (status === 'listening') {
      pulseRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 750,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 750,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseRef.current.start();
    } else {
      pulseRef.current?.stop();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [status, pulseAnim]);

  const handleClose = useCallback(() => {
    stopListening();
    reset();
    setApplied(false);
    onClose();
  }, [stopListening, reset, onClose]);

  const handleRetry = useCallback(() => {
    reset();
    startListening();
  }, [reset, startListening]);

  // ── Derived display values ─────────────────────────────────────────────────
  const isNoSpeech = error === 'no-speech';
  // lang-not-downloaded auto-retries — treat as soft so modal stays open with message
  const isHardError = error && error !== 'no-speech' && error !== 'lang-not-downloaded';

  const micColor = applied
    ? '#22C55E'
    : status === 'listening'
    ? '#EF4444'
    : status === 'processing'
    ? '#F59E0B'
    : error
    ? '#EF4444'
    : '#94A3B8';

  const ringColor = applied
    ? 'border-green-500 bg-green-500/10'
    : status === 'listening'
    ? 'border-red-500 bg-red-500/10'
    : status === 'processing'
    ? 'border-amber-500 bg-amber-500/10'
    : error
    ? 'border-red-500/50 bg-red-500/5'
    : 'border-zinc-600 bg-zinc-800';

  const statusLabel = applied === true
    ? '✓ Applied!'
    : applied === 'pending'
    ? '✓ Got it!'
    : status === 'listening'
    ? 'Listening...'
    : status === 'processing'
    ? 'Processing...'
    : isNoSpeech
    ? 'No speech detected'
    : isHardError
    ? 'Error'
    : 'Ready';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' }}
        activeOpacity={1}
        onPress={handleClose}
      >
        {/* Card — stops press propagation so tapping card doesn't close */}
        <TouchableOpacity
          activeOpacity={1}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#18181B',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: 40,
          }}
        >
          {/* Drag handle */}
          <View style={{
            width: 40,
            height: 4,
            backgroundColor: '#3F3F46',
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 20,
          }} />

          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
              {statusLabel}
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <LucideIcon name="X" size={22} color="#71717A" />
            </TouchableOpacity>
          </View>

          {/* Animated mic ring */}
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <View style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                borderWidth: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
                className={ringColor}
              >
                {status === 'processing' ? (
                  <ActivityIndicator color="#F59E0B" size="large" />
                ) : (
                  <LucideIcon
                    name={applied ? 'Check' : 'Mic'}
                    size={36}
                    color={micColor}
                  />
                )}
              </View>
            </Animated.View>

            {/* Outer glow ring when listening */}
            {status === 'listening' && (
              <Animated.View
                style={{
                  position: 'absolute',
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  borderWidth: 1,
                  borderColor: 'rgba(239,68,68,0.3)',
                  transform: [{ scale: Animated.multiply(pulseAnim, 1.3) as any }],
                  opacity: 0.6,
                }}
              />
            )}
          </View>

          {/* Transcript / feedback area */}
          <View style={{
            minHeight: 72,
            backgroundColor: '#27272A',
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            marginBottom: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {applied === true ? (
              <Text style={{ color: '#22C55E', fontSize: 15, textAlign: 'center', fontWeight: '600' }}>
                Voice input applied successfully!
              </Text>
            ) : applied === 'pending' ? (
              <Text style={{ color: '#22C55E', fontSize: 15, textAlign: 'center', fontWeight: '600' }}>
                Got it! Select from the options below.
              </Text>
            ) : transcript ? (
              <Text style={{ color: '#fff', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
                {transcript}
              </Text>
            ) : error ? (
              <Text style={{ color: '#F87171', fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
                {ERROR_MESSAGES[error] ?? ERROR_MESSAGES.error}
              </Text>
            ) : (
              <Text style={{ color: '#71717A', fontSize: 14, textAlign: 'center' }}>
                {status === 'listening'
                  ? 'Speak clearly in your language...'
                  : 'Waiting to start...'}
              </Text>
            )}
          </View>

          {/* Action buttons */}
          {!applied && (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {(isNoSpeech || isHardError) ? (
                <>
                  <TouchableOpacity
                    onPress={handleClose}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 16,
                      backgroundColor: '#27272A',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#A1A1AA', fontWeight: '600', fontSize: 15 }}>Cancel</Text>
                  </TouchableOpacity>
                  {!isHardError && (
                    <TouchableOpacity
                      onPress={handleRetry}
                      style={{
                        flex: 1,
                        paddingVertical: 14,
                        borderRadius: 16,
                        backgroundColor: '#F59E0B',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Retry</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : status === 'listening' ? (
                <TouchableOpacity
                  onPress={stopListening}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 16,
                    backgroundColor: '#27272A',
                    borderWidth: 1,
                    borderColor: '#EF444450',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <LucideIcon name="Square" size={16} color="#EF4444" />
                  <Text style={{ color: '#EF4444', fontWeight: '600', fontSize: 15 }}>Stop</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
