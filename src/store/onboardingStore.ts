import { create } from 'zustand';

interface WorkerOnboarding {
  primary_skill?: string;
  sub_skills?: string[];
  years_experience?: number;
  profile_photo_url?: string;
  home_lat?: number;
  home_lng?: number;
  home_city?: string;
  home_area?: string;
  available_days?: string[];
  preferred_shifts?: string[];
  min_pay_per_shift?: number;
  skill_video_url?: string;
  ai_score?: { technique: number; speed: number; hygiene: number; warmth: number };
  fcm_token?: string;
}

interface EmployerOnboarding {
  property_name?: string;
  property_type?: string;
  lat?: number;
  lng?: number;
  city?: string;
  area_locality?: string;
  address?: string;
  contact_name?: string;
  contact_phone?: string;
  email?: string;
  gstin?: string;
}

interface JobDraft {
  lane?: number;
  job_title?: string;
  primary_skill?: string;
  description?: string;
  pay_rate?: number;
  shift_duration_hours?: number;
  number_of_openings?: number;
  keywords_extracted?: string[];
}

interface OnboardingState {
  worker: WorkerOnboarding;
  employer: EmployerOnboarding;
  jobDraft: JobDraft;
  updateWorker: (data: Partial<WorkerOnboarding>) => void;
  updateEmployer: (data: Partial<EmployerOnboarding>) => void;
  updateJobDraft: (data: Partial<JobDraft>) => void;
  clearJobDraft: () => void;
  resetWorker: () => void;
  resetEmployer: () => void;
}

const defaultWorker: WorkerOnboarding = {
  sub_skills: [],
  available_days: [],
  preferred_shifts: [],
  min_pay_per_shift: 500,
  years_experience: 1,
};

const defaultEmployer: EmployerOnboarding = {};
const defaultJobDraft: JobDraft = { number_of_openings: 1, shift_duration_hours: 8 };

export const useOnboardingStore = create<OnboardingState>((set) => ({
  worker: defaultWorker,
  employer: defaultEmployer,
  jobDraft: defaultJobDraft,

  updateWorker: (data) => set((state) => ({ worker: { ...state.worker, ...data } })),
  updateEmployer: (data) => set((state) => ({ employer: { ...state.employer, ...data } })),
  updateJobDraft: (data) => set((state) => ({ jobDraft: { ...state.jobDraft, ...data } })),
  clearJobDraft: () => set({ jobDraft: defaultJobDraft }),
  resetWorker: () => set({ worker: defaultWorker }),
  resetEmployer: () => set({ employer: defaultEmployer }),
}));
