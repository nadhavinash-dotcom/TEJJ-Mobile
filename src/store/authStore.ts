import { Language } from '@/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  _hasHydrated: boolean;

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
  setHasHydrated: (v: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
      _hasHydrated: false,

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
      setHasHydrated: (_hasHydrated) => set({ _hasHydrated }),

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
    }),
    {
      name: 'tejj-auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Don't persist transient state
      partialize: (state) => ({
        userId: state.userId,
        firebaseUid: state.firebaseUid,
        language: state.language,
        activeRole: state.activeRole,
        hasWorker: state.hasWorker,
        hasEmployer: state.hasEmployer,
        workerId: state.workerId,
        employerId: state.employerId,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
