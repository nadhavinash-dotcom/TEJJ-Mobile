// utils/refreshUser.ts
import { useAuthStore } from "../src/store/authStore";
import api from "../src/lib/api";
import { EmployerProfile, WorkerProfile, Language } from "@/types";

// ── Types ────────────────────────────────────────────────────────────────────

interface ApiUser {
  _id: string;
  has_worker: boolean;
  has_employer: boolean;
  active_role: "worker" | "employer" | undefined;
  language: Language;
  worker: WorkerProfile | null;
  employer: EmployerProfile | null;
}

type RefreshResult =
  | { ok: true;  user: ApiUser }
  | { ok: false; reason: "no_token" | "fetch_failed" };

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildAuthHeaders(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

function mapUserToStore(user: ApiUser, token: string) {
  return {
    userId:          user._id,
    token,
    hasWorker:       user.has_worker,
    hasEmployer:     user.has_employer,
    activeRole:      user.active_role,
    language:        user.language,
    workerProfile:   user.worker   ?? null,
    employerProfile: user.employer ?? null,
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

export async function refreshUser(
  setLoading: (loading: boolean) => void,
  token?: string | null,
): Promise<RefreshResult> {
  const { setUser, clear } = useAuthStore.getState();

  if (!token) {
    return { ok: false, reason: "no_token" };
  }

  setLoading(true);

  try {
    console.log("token", token)
    const res  = await api.get<{ data: ApiUser }>("/auth/me", buildAuthHeaders(token));
    const user = res.data.data;

    setUser(mapUserToStore(user, token));

    return { ok: true, user };
  } catch (err) {
    console.error("[refreshUser] Session verification failed:", err);
    clear();
    return { ok: false, reason: "fetch_failed" };
  } finally {
    setLoading(false);
  }
}