import { Language } from '@/types';
import { create } from 'zustand';

interface AuthState {
  userId: string | null;
  firebaseUid: string | null;
  language: Language;
  activeRole: 'worker' | 'employer' | null;
  hasWorker: boolean;
  hasEmployer: boolean;
  workerId: string | null;
  employerId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  verificationId: string | null;

  setUser: (params: {
    userId: string;
    firebaseUid: string;
    hasWorker: boolean;
    hasEmployer: boolean;
    workerId?: string;
    employerId?: string;
    activeRole?: 'worker' | 'employer';
  }) => void;
  setLanguage: (lang: Language) => void;
  setActiveRole: (role: 'worker' | 'employer') => void;
  setLoading: (v: boolean) => void;
  setVerificationId: (id: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  firebaseUid: null,
  language: 'hi',
  activeRole: null,
  hasWorker: false,
  hasEmployer: false,
  workerId: null,
  employerId: null,
  isAuthenticated: false,
  isLoading: true,
  verificationId: null,

  setUser: (params) => set({
    userId: params.userId,
    firebaseUid: params.firebaseUid,
    hasWorker: params.hasWorker,
    hasEmployer: params.hasEmployer,
    workerId: params.workerId ?? null,
    employerId: params.employerId ?? null,
    activeRole: params.activeRole ?? (params.hasWorker ? 'worker' : params.hasEmployer ? 'employer' : null),
    isAuthenticated: true,
    isLoading: false,
  }),

  setLanguage: (language) => set({ language }),
  setActiveRole: (activeRole) => set({ activeRole }),
  setLoading: (isLoading) => set({ isLoading }),
  setVerificationId: (verificationId) => set({ verificationId }),

  clear: () => set({
    userId: null,
    firebaseUid: null,
    activeRole: null,
    hasWorker: false,
    hasEmployer: false,
    workerId: null,
    employerId: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}));
