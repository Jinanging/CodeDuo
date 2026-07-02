// CodeDuo(Spring) 백엔드 API 클라이언트.
// 배포 시 VITE_API_BASE 로 실제 도메인 지정. 로컬은 8080 직접 호출(백엔드 CORS가 5173 허용).
const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? "http://localhost:8080";

let token = "";
try { token = localStorage.getItem("codeduo_token") ?? ""; } catch { /* ignore */ }

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers ?? {}),
    },
  });
  const body = await res.json();
  if (!res.ok || body.success === false) throw new Error(body.message ?? `요청 실패 (${res.status})`);
  return body.data as T; // ApiResponse { success, message, data } 래퍼 해제
}

export interface BackendUser { id: number; email: string; nickname: string; tier: string; xp: number; streak: number; hearts: number; avatar: string; }
export interface BackendGrade { correct: boolean; score: number; resultMessage?: string; aiReview?: string; testResultsJson?: string; }

export async function login(email: string, password: string): Promise<BackendUser> {
  const d = await req<{ accessToken: string; user: BackendUser }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  token = d.accessToken; try { localStorage.setItem("codeduo_token", token); } catch { /* ignore */ }
  return d.user;
}
export async function signup(email: string, password: string, nickname: string): Promise<BackendUser> {
  const d = await req<{ accessToken: string; user: BackendUser }>("/api/auth/signup", { method: "POST", body: JSON.stringify({ email, password, nickname }) });
  token = d.accessToken; try { localStorage.setItem("codeduo_token", token); } catch { /* ignore */ }
  return d.user;
}
/** 답안 채점. problemId 는 백엔드 문제 id (시드 순서상 프론트 question.id 와 1~36 동일). */
export async function submitAnswer(problemId: number, answer: string): Promise<BackendGrade> {
  return req<BackendGrade>("/api/submissions", { method: "POST", body: JSON.stringify({ problemId, answer }) });
}
