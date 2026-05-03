// store/authStore.ts
import { EmployerProfile, Language, WorkerProfile } from '@/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  userId: string | null;
  token: string | null;
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

  // Typed profiles — only one will be non-null per user
  workerProfile: WorkerProfile | null;
  employerProfile: EmployerProfile | null;

  setUser: (params: {
    userId: string;
    token: string;
    hasWorker: boolean;
    hasEmployer: boolean;
    workerId?: string;
    employerId?: string;
    activeRole?: 'worker' | 'employer';
    language: Language;
    workerProfile?: WorkerProfile | null;
    employerProfile?: EmployerProfile | null;
  }) => void;
  setWorkerProfile: (profile: WorkerProfile | null) => void;
  setEmployerProfile: (profile: EmployerProfile | null) => void;
  setLanguage: (lang: Language) => void;
  setActiveRole: (role: 'worker' | 'employer') => void;
  setLoading: (v: boolean) => void;
  setVerificationId: (id: string) => void;
  setHasHydrated: (v: boolean) => void;
  clear: () => void;
}

const DEFAULT_STATE = {
  userId: null,
  token: null,
  language: 'hi' as Language,
  activeRole: null,
  hasWorker: false,
  hasEmployer: false,
  workerId: null,
  employerId: null,
  isAuthenticated: false,
  isLoading: false,
  verificationId: null,
  _hasHydrated: false,
  workerProfile: null,
  employerProfile: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      isLoading: true, // start true until hydration

      setUser: (params) =>
        set({
          userId: params.userId,
          token: params.token,
          hasWorker: params.hasWorker,
          hasEmployer: params.hasEmployer,
          workerId: params.workerId ?? null,
          employerId: params.employerId ?? null,
          activeRole:
            params.activeRole ??
            (params.hasWorker ? 'worker' : params.hasEmployer ? 'employer' : null),
          isAuthenticated: true,
          isLoading: false,
          language: params.language,
          // Only set the profile that belongs to this user
          workerProfile: params.workerProfile ?? null,
          employerProfile: params.employerProfile ?? null,
        }),

      setWorkerProfile: (workerProfile) => set({ workerProfile }),
      setEmployerProfile: (employerProfile) => set({ employerProfile }),
      setLanguage: (language) => set({ language }),
      setActiveRole: (activeRole) => set({ activeRole }),
      setLoading: (isLoading) => set({ isLoading }),
      setVerificationId: (verificationId) => set({ verificationId }),
      setHasHydrated: (_hasHydrated) => set({ _hasHydrated }),

      clear: () => set({ ...DEFAULT_STATE }),
    }),
    {
      name: 'tejj-auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userId: state.userId,
        token: state.token,
        language: state.language,
        activeRole: state.activeRole,
        hasWorker: state.hasWorker,
        hasEmployer: state.hasEmployer,
        workerId: state.workerId,
        employerId: state.employerId,
        isAuthenticated: state.isAuthenticated,
        // Persist profiles so they're available immediately on app resume
        workerProfile: state.workerProfile,
        employerProfile: state.employerProfile,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);