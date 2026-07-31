// CodeDuo(Spring) 백엔드 API 클라이언트.
// 배포 시 VITE_API_BASE로 백엔드 주소를 지정한다.
// 기본값은 로컬 백엔드 http://localhost:8080이며, 백엔드는 로컬 Vite origin(5173)을 CORS로 허용한다.
type ViteImportMeta = ImportMeta & {
  env?: {
    VITE_API_BASE?: string;
  };
};

const API_BASE = (import.meta as ViteImportMeta).env?.VITE_API_BASE ?? "http://localhost:8080";
const TOKEN_STORAGE_KEY = "codeduo.accessToken";

const readStoredToken = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? "";
};

const persistToken = (nextToken: string) => {
  token = nextToken;
  if (typeof window === "undefined") return;
  if (nextToken) window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
  else window.localStorage.removeItem(TOKEN_STORAGE_KEY);
};

let token = readStoredToken();

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
export interface AiLearningReport {
  summary: string;
  strengths: string[];
  patterns: string[];
  focusAreas: string[];
  nextActions: string[];
}
export interface BackendActivityDay { date: string; count: number; }
export interface BackendFriend {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  friend: boolean;
  relationStatus: "none" | "sent" | "received" | "friends";
}
export interface BackendFriendRequest {
  id: string;
  user: BackendFriend;
  direction: "received" | "sent";
}
export interface BackendFriendRequestsResponse {
  received: BackendFriendRequest[];
  sent: BackendFriendRequest[];
}
export interface BackendStudyGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  language: string;
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  joined: boolean;
  pendingRequest: boolean;
  ownedByMe: boolean;
}
export interface BackendFriendsResponse {
  users: BackendFriend[];
  groups: BackendStudyGroup[];
}
export interface BackendGroupMember {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  streak: number;
  weeklySolved: number;
  progress: number;
  online: boolean;
}
export interface BackendGroupDetail {
  id: string;
  name: string;
  description: string;
  language: string;
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  memberCount: number;
  maxMembers: number;
  weeklyGoal: number;
  weeklySolved: number;
  averageStreak: number;
  onlineCount: number;
  joined: boolean;
  pendingRequest: boolean;
  ownedByMe: boolean;
  members: BackendGroupMember[];
  pendingRequests: BackendGroupJoinRequest[];
}
export interface BackendGroupJoinRequest {
  id: string;
  user: BackendFriend;
  requestedAt: string;
}
export interface CreateGroupPayload {
  name: string;
  description: string;
  maxMembers: number;
  language: string;
  imageUrl: string;
}
export interface AdminLesson {
  id: number; courseId: number; courseTitle: string; language: string; title: string; description: string; orderIndex: number;
}
export interface AdminProblem {
  id: number; lessonId: number; type: string; language: string; title: string; description: string;
  difficulty: number; answer?: string; codeTemplate?: string; testInput?: string; expectedOutput?: string;
  correctOptionIndex?: number; rubric?: string; optionsJson?: string; hint?: string; explanation?: string; tagsJson?: string;
  testCasesJson?: string; orderIndex: number; createdAt?: string; updatedAt?: string;
}
export interface AdminProblemPayload {
  lessonId: number; type: string; language: string; title: string; description: string; difficulty: number;
  answer?: string; correctOptionIndex?: number; codeTemplate?: string; testInput?: string; expectedOutput?: string; rubric?: string;
  optionsJson?: string; hint?: string; explanation?: string; tagsJson?: string; testCasesJson?: string; orderIndex?: number;
}

export async function login(email: string, password: string): Promise<BackendUser> {
  const d = await req<{ accessToken: string; user: BackendUser }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  persistToken(d.accessToken);
  return d.user;
}
export async function signup(email: string, password: string, nickname: string): Promise<BackendUser> {
  const d = await req<{ accessToken: string; user: BackendUser }>("/api/auth/signup", { method: "POST", body: JSON.stringify({ email, password, nickname }) });
  persistToken(d.accessToken);
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

/** 정적 힌트가 없는 문제에 대한 프리미엄 AI 힌트 생성. */
export async function getProblemAiHint(problemId: number): Promise<AiHintResponse> {
  return req<AiHintResponse>(`/api/problems/${problemId}/ai-hint`, { method: "POST" });
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

/** 프로필 학습 잔디용 날짜별 제출 수. date는 YYYY-MM-DD. */
export async function getLearningActivity(from: string, to: string): Promise<BackendActivityDay[]> {
  return req<BackendActivityDay[]>(`/api/users/me/activity?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
}

/** 친구/그룹 목록 조회. */
export async function getFriends(): Promise<BackendFriendsResponse> {
  return req<BackendFriendsResponse>("/api/friends");
}

export async function searchFriends(query: string): Promise<BackendFriend[]> {
  return req<BackendFriend[]>(`/api/friends/search?query=${encodeURIComponent(query)}`);
}

export async function searchGroups(query: string): Promise<BackendStudyGroup[]> {
  return req<BackendStudyGroup[]>(`/api/friends/groups/search?query=${encodeURIComponent(query)}`);
}

export async function getFriendRequests(): Promise<BackendFriendRequestsResponse> {
  return req<BackendFriendRequestsResponse>("/api/friends/requests");
}

export async function addFriend(userId: string): Promise<BackendFriendsResponse> {
  return req<BackendFriendsResponse>(`/api/friends/${encodeURIComponent(userId)}`, { method: "POST" });
}

export async function acceptFriend(userId: string): Promise<BackendFriendsResponse> {
  return req<BackendFriendsResponse>(`/api/friends/${encodeURIComponent(userId)}/accept`, { method: "POST" });
}

export async function rejectFriendRequest(userId: string): Promise<BackendFriendsResponse> {
  return req<BackendFriendsResponse>(`/api/friends/${encodeURIComponent(userId)}/request`, { method: "DELETE" });
}

export async function removeFriend(userId: string): Promise<BackendFriendsResponse> {
  return req<BackendFriendsResponse>(`/api/friends/${encodeURIComponent(userId)}`, { method: "DELETE" });
}

export async function joinGroup(groupId: string): Promise<BackendFriendsResponse> {
  return req<BackendFriendsResponse>(`/api/friends/groups/${encodeURIComponent(groupId)}/join`, { method: "POST" });
}

export async function createGroup(payload: CreateGroupPayload): Promise<BackendFriendsResponse> {
  return req<BackendFriendsResponse>("/api/friends/groups", { method: "POST", body: JSON.stringify(payload) });
}

export async function leaveGroup(groupId: string): Promise<BackendFriendsResponse> {
  return req<BackendFriendsResponse>(`/api/friends/groups/${encodeURIComponent(groupId)}/join`, { method: "DELETE" });
}

export async function getGroupDetail(groupId: string): Promise<BackendGroupDetail> {
  return req<BackendGroupDetail>(`/api/friends/groups/${encodeURIComponent(groupId)}`);
}

export async function acceptGroupRequest(groupId: string, userId: string): Promise<BackendGroupDetail> {
  return req<BackendGroupDetail>(`/api/friends/groups/${encodeURIComponent(groupId)}/requests/${encodeURIComponent(userId)}/accept`, { method: "POST" });
}

export async function rejectGroupRequest(groupId: string, userId: string): Promise<BackendGroupDetail> {
  return req<BackendGroupDetail>(`/api/friends/groups/${encodeURIComponent(groupId)}/requests/${encodeURIComponent(userId)}`, { method: "DELETE" });
}

/** 오답노트: 백엔드에 저장된 내 오답 목록 (정답/해설 포함). */
export interface BackendWrongAnswer {
  id: number; problemId: number; question: string; type: string; language: string;
  optionsJson?: string; codeTemplate?: string; sampleInput?: string; sampleOutput?: string; lastAnswer?: string;
  reasonSummary?: string; explanation?: string; updatedAt?: string;
}
export async function getWrongAnswers(): Promise<BackendWrongAnswer[]> {
  return req<BackendWrongAnswer[]>("/api/wrong-answers");
}

export interface InterviewQuestion {
  id: number;
  order: number;
  language: string;
  topic: string;
  question: string;
}

export interface InterviewTurn {
  id: number;
  order: number;
  language: string;
  topic: string;
  question: string;
  answer: string;
  score: number;
  verdict: "STRONG_PASS" | "PASS" | "BORDERLINE" | "NEEDS_IMPROVEMENT";
  feedback: string;
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
  answeredAt?: string;
}

export interface InterviewSession {
  id: number;
  status: "ACTIVE" | "COMPLETED";
  totalQuestions: number;
  completedQuestions: number;
  averageScore?: number;
  currentQuestion?: InterviewQuestion;
  turns: InterviewTurn[];
  finalReview?: {
    verdict: InterviewTurn["verdict"];
    overallReview: string;
    hiringRecommendation: string;
    focusAreas: string[];
  };
  createdAt?: string;
  completedAt?: string;
}

export async function startInterview(): Promise<InterviewSession> {
  return req<InterviewSession>("/api/interviews", { method: "POST" });
}

export async function submitInterviewAnswer(sessionId: number, answer: string): Promise<InterviewSession> {
  return req<InterviewSession>(`/api/interviews/${sessionId}/answers`, {
    method: "POST",
    body: JSON.stringify({ answer }),
  });
}

export async function getInterviewHistory(): Promise<InterviewSession[]> {
  return req<InterviewSession[]>("/api/interviews");
}

export async function updateProfile(profile: { nickname: string; email: string; avatar: string }): Promise<BackendUser> {
  return req<BackendUser>("/api/users/me", { method: "PATCH", body: JSON.stringify(profile) });
}

export async function upgradeToPremium(): Promise<BackendUser> {
  return req<BackendUser>("/api/users/me/upgrade", { method: "POST" });
}

export async function heartbeat(): Promise<void> {
  return req<void>("/api/users/me/heartbeat", { method: "POST" });
}

export async function fetchAnalytics(): Promise<BackendAnalytics> {
  return req<BackendAnalytics>("/api/analytics");
}

export async function fetchAiLearningReport(): Promise<AiLearningReport> {
  return req<AiLearningReport>("/api/analytics/ai-report");
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
  persistToken("");
}
