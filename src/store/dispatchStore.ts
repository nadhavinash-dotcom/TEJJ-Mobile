import { create } from 'zustand';

interface FlashJob {
  job_id: string;
  job_title: string;
  pay_rate: number;
  skill: string;
  employer_area: string;
  distance_km: number;
  expires_at: string;
}

interface DispatchState {
  activeFlashJob: FlashJob | null;
  setFlashJob: (job: FlashJob | null) => void;

  activeMatchId: string | null;
  setActiveMatchId: (id: string | null) => void;
}

export const useDispatchStore = create<DispatchState>((set) => ({
  activeFlashJob: null,
  setFlashJob: (activeFlashJob) => set({ activeFlashJob }),

  activeMatchId: null,
  setActiveMatchId: (activeMatchId) => set({ activeMatchId }),
}));
