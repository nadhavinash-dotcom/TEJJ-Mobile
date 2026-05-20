// Mock native modules that are not available in the Jest environment
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('../store/authStore', () => ({
  useAuthStore: jest.fn(() => 'en'),
}));

jest.mock('../lib/api', () => ({
  default: {
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}));

jest.mock('expo-speech-recognition', () => ({
  useSpeechRecognitionEvent: jest.fn(),
  ExpoSpeechRecognitionModule: {
    requestPermissionsAsync: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  },
}));

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
