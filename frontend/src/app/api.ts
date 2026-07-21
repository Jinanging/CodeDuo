// CodeDuo(Spring) 백엔드 API 클라이언트.
// 배포 시 VITE_API_BASE 로 실제 도메인 지정. 로컬은 8080 직접 호출(백엔드 CORS가 5173 허용).
type ViteImportMeta = ImportMeta & {
  env?: {
    VITE_API_BASE?: string;
  };
};

const API_BASE = (import.meta as ViteImportMeta).env?.VITE_API_BASE ?? "http://localhost:8080";

let token = "";

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opts.headers ?? {}),
      },
    });
  } catch {
    const error = new Error("백엔드 서버에 연결할 수 없습니다.") as Error & { isNetwork?: boolean };
    error.isNetwork = true;
    throw error;
  }

  const text = await res.text();
  let body: { success?: boolean; message?: string; data?: unknown } = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`요청 실패 (${res.status})`);
  }

  if (!res.ok || body.success === false) throw new Error(body.message ?? `요청 실패 (${res.status})`);
  return body.data as T; // ApiResponse { success, message, data } 래퍼 해제
}

export interface BackendUser { id: number; email: string; nickname: string; tier: string; xp: number; streak: number; hearts: number; avatar: string; }
export interface BackendGrade {
  id?: number;
  problemId?: number;
  correct: boolean;
  score: number;
  resultMessage?: string;
  explanation?: string;
  aiReview?: string;
  runtimeMs?: number;
  memoryKb?: number;
  testResultsJson?: string;
}
export interface AiHintResponse { hint: string; }
/** 백엔드 문제(정답 answer 는 보안상 미포함 → 채점은 서버가 담당). */
export interface BackendProblem {
  id: number; lessonId: number; type: string; language: string; title: string; description: string;
  difficulty: number; codeTemplate?: string; sampleInput?: string; sampleOutput?: string;
  optionsJson?: string; hint?: string; tagsJson?: string; orderIndex: number;
}
export interface BackendWeakness { subject: string; score: number; }
export interface BackendActivity { day: string; solved: number; }
export interface BackendAnalyticsSummary { totalSolved: number; weeklySolved: number; streak: number; accuracy: number; }
export interface BackendAnalytics { weakness: BackendWeakness[]; activity: BackendActivity[]; summary: BackendAnalyticsSummary; }
export interface AdminLesson {
  id: number; courseId: number; courseTitle: string; language: string; title: string; description: string; orderIndex: number;
}
export interface AdminProblem {
  id: number; lessonId: number; type: string; language: string; title: string; description: string;
  difficulty: number; answer?: string; codeTemplate?: string; testInput?: string; expectedOutput?: string;
  rubric?: string; optionsJson?: string; hint?: string; explanation?: string; tagsJson?: string;
  testCasesJson?: string; orderIndex: number; createdAt?: string; updatedAt?: string;
}
export interface AdminProblemPayload {
  lessonId: number; type: string; language: string; title: string; description: string; difficulty: number;
  answer?: string; codeTemplate?: string; testInput?: string; expectedOutput?: string; rubric?: string;
  optionsJson?: string; hint?: string; explanation?: string; tagsJson?: string; testCasesJson?: string; orderIndex?: number;
}

export async function login(email: string, password: string): Promise<BackendUser> {
  const d = await req<{ accessToken: string; user: BackendUser }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  token = d.accessToken;
  return d.user;
}
export async function signup(email: string, password: string, nickname: string): Promise<BackendUser> {
  const d = await req<{ accessToken: string; user: BackendUser }>("/api/auth/signup", { method: "POST", body: JSON.stringify({ email, password, nickname }) });
  token = d.accessToken;
  return d.user;
}

/** 답안 채점. problemId 는 백엔드 문제 id (시드 순서상 프론트 question.id 와 1~36 동일). */
export async function submitAnswer(problemId: number, answer: string): Promise<BackendGrade> {
  return req<BackendGrade>("/api/submissions", { method: "POST", body: JSON.stringify({ problemId, answer }) });
}

/** 프리미엄 코드 오답 제출에 대한 AI 힌트 생성. */
export async function getAiHint(submissionId: number): Promise<AiHintResponse> {
  return req<AiHintResponse>(`/api/submissions/${submissionId}/ai-hint`, { method: "POST" });
}

/** 언어(python/java/c/cpp) + 난이도(1=초급,2=중급,3=고급)로 문제 목록 조회. */
export async function getProblems(language: string, difficulty?: number): Promise<BackendProblem[]> {
  const base = `/api/problems?language=${encodeURIComponent(language)}`;
  return req<BackendProblem[]>(difficulty === undefined ? base : `${base}&difficulty=${difficulty}`);
}

/** 언어별 XP 조회 (정답 제출 기반, 백엔드 계산). { python, java, c, cpp } */
export async function getLanguageXp(): Promise<Record<string, number>> {
  return req<Record<string, number>>("/api/users/me/language-xp");
}

/** 오답노트: 백엔드에 저장된 내 오답 목록 (정답/해설 포함). */
export interface BackendWrongAnswer {
  id: number; problemId: number; question: string; type: string; language: string;
  optionsJson?: string; codeTemplate?: string; lastAnswer?: string;
  reasonSummary?: string; explanation?: string; updatedAt?: string;
}
export async function getWrongAnswers(): Promise<BackendWrongAnswer[]> {
  return req<BackendWrongAnswer[]>("/api/wrong-answers");
}

export async function updateProfile(profile: { nickname: string; email: string; avatar: string }): Promise<BackendUser> {
  return req<BackendUser>("/api/users/me", { method: "PATCH", body: JSON.stringify(profile) });
}

export async function fetchAnalytics(): Promise<BackendAnalytics> {
  return req<BackendAnalytics>("/api/analytics");
}

/** 현재 로그인한 유저 정보 조회 (JWT 토큰 기반). 세션 복원/새로고침 시 사용. */
export async function getMe(): Promise<BackendUser> {
  return req<BackendUser>("/api/users/me");
}

export async function getAdminLessons(): Promise<AdminLesson[]> {
  return req<AdminLesson[]>("/api/admin/lessons");
}

export async function getAdminProblems(filters: { language?: string; difficulty?: number; lessonId?: number } = {}): Promise<AdminProblem[]> {
  const params = new URLSearchParams();
  if (filters.language) params.set("language", filters.language.toUpperCase());
  if (filters.difficulty) params.set("difficulty", String(filters.difficulty));
  if (filters.lessonId) params.set("lessonId", String(filters.lessonId));
  const query = params.toString();
  return req<AdminProblem[]>(`/api/admin/problems${query ? `?${query}` : ""}`);
}

export async function createAdminProblem(payload: AdminProblemPayload): Promise<AdminProblem> {
  return req<AdminProblem>("/api/admin/problems", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateAdminProblem(id: number, payload: AdminProblemPayload): Promise<AdminProblem> {
  return req<AdminProblem>(`/api/admin/problems/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export async function deleteAdminProblem(id: number): Promise<void> {
  return req<void>(`/api/admin/problems/${id}`, { method: "DELETE" });
}

/** 저장된 로그인 토큰이 있는지. */
export function hasToken(): boolean {
  return !!token;
}

/** 로그아웃: 토큰 제거. */
export function clearToken(): void {
  token = "";
}
