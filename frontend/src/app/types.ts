import type { BackendActivity } from "./api";

export type QuestionType = "mcq" | "fill-blank" | "short-answer" | "code"; // 객관식, 빈칸, 단답형, 코드
export type Language = "python" | "java" | "c" | "cpp";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type Screen = "login" | "register" | "home" | "lessonSelect" | "lesson" | "result" | "analytics" | "errors" | "wrongReview" | "interview" | "friends" | "profile" | "admin" | "upgrade";
export type Tier = "free" | "premium";

// Url 경로와 화면을 매핑한 상수
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  tier: Tier;
  xp: number;
  streak: number;
  hearts: number;
  totalSolved: number;
  langXp: Record<Language, number>;
  weeklyActivity: BackendActivity[];
  friendIds: string[];
  groupIds: string[];
  avatar: string;
}

export interface EssayRubricItem { label: string; got: number; max: number; }

export interface TestCase {
  input: string;
  expected: string;
}

export interface MockResult {
  caseNumber: number;
  pass: boolean;
  status?: string;
  error?: string;
  runtimeMs?: number;
  memoryKb?: number;
}

export interface Question {
  id: number;
  type: QuestionType;
  language: Language;
  difficulty: Difficulty;
  title: string;
  question: string;
  options?: string[];
  hint?: string;
  template?: string;
  codeReview?: string;
  tags: string[];
  testcases?: TestCase[];
  mockResults?: MockResult[];
  // Essay (서술형) — AI rubric grading mock
  minLength?: number;
  essayScore?: number;
  essayMax?: number;
  essayRubric?: EssayRubricItem[];
  essayFeedback?: string;
}

export interface WrongAnswer {
  qId: number;
  question: string;
  type: QuestionType;
  language: Language;
  userAnswer: string;
  explanation?: string;
  options?: string[];
  codeTemplate?: string;
  solvedAt: string;
}

export type RelationStatus = "none" | "sent" | "received" | "friends";
export interface FriendUser { id: string; username: string; avatar: string; xp: number; level: number; isFriend: boolean; relationStatus: RelationStatus; }
export interface StudyGroupView {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  language: Language;
  avatar: string;
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  joined: boolean;
  pendingRequest: boolean;
  ownedByMe: boolean;
}
