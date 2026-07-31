import type { BackendActivity } from "./api";
import type { Difficulty, Language, Question, QuestionType, Screen, UserProfile } from "./types";
import pythonIcon from "../assets/languages/python.png";
import javaIcon from "../assets/languages/java.png";
import cIcon from "../assets/languages/c.png";
import cppIcon from "../assets/languages/cpp.png";

export const SCREEN_PATHS: Record<Screen, string> = {
  login: "/login",
  register: "/register",
  home: "/home",
  lessonSelect: "/lessons",
  lesson: "/lesson",
  result: "/result",
  analytics: "/analytics",
  errors: "/wrong-answers",
  wrongReview: "/wrong-answers/review",
  interview: "/wrong-answers/interview",
  friends: "/friends",
  profile: "/profile",
  admin: "/admin",
  upgrade: "/upgrade",
};

export const PATH_SCREENS: Record<string, Screen> = Object.fromEntries(
  Object.entries(SCREEN_PATHS).map(([screen, path]) => [path, screen])
) as Record<string, Screen>;

export const isLanguage = (value: string | null): value is Language =>
  value === "python" || value === "java" || value === "c" || value === "cpp";

export const isDifficulty = (value: string | null): value is Difficulty =>
  value === "beginner" || value === "intermediate" || value === "advanced";

export const TOPICS_BY_LANGUAGE: Record<Language, string[]> = {
  python: ["변수와 자료형", "조건문", "반복문", "리스트와 딕셔너리", "함수", "문자열 처리", "알고리즘 기초"],
  java: ["기본 문법", "조건문과 반복문", "배열", "메서드", "클래스와 객체", "컬렉션", "예외 처리"],
  c: ["기본 문법", "조건문과 반복문", "배열", "함수", "포인터", "문자열 처리", "구조체와 알고리즘 기초"],
  cpp: ["기본 문법", "조건문과 반복문", "배열과 문자열", "함수", "클래스와 객체", "STL", "알고리즘 기초"],
};

export const firstTopicFor = (language: Language) => TOPICS_BY_LANGUAGE[language][0];

export const topicForQuestion = (question: Question) => {
  const knownTopics = TOPICS_BY_LANGUAGE[question.language];
  return question.tags.find(tag => knownTopics.includes(tag)) ?? firstTopicFor(question.language);
};

export const hasKnownTopic = (question: Question) =>
  question.tags.some(tag => TOPICS_BY_LANGUAGE[question.language].includes(tag));

export const ADMIN_EMAILS = new Set(
  ((import.meta.env.VITE_ADMIN_EMAILS as string | undefined) ?? "admin@codeduo.dev")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean)
);

export const isAdminUser = (user: UserProfile) => ADMIN_EMAILS.has(user.email.toLowerCase());

export const languageFromSubject = (subject: string): Language => {
  const normalized = subject.toLowerCase();
  if (normalized.includes("c++") || normalized.includes("cpp")) return "cpp";
  if (normalized === "c" || normalized.includes("c ")) return "c";
  if (normalized.includes("java")) return "java";
  return "python";
};

export const languageFromText = (text: string): Language | null => {
  const normalized = text.toLowerCase();
  if (normalized.includes("c++") || normalized.includes("cpp")) return "cpp";
  if (normalized.includes("java")) return "java";
  if (normalized.includes("python") || normalized.includes("파이썬")) return "python";
  if (/(^|[^a-z])c([^a-z]|$)/i.test(text)) return "c";
  return null;
};

export const parseRouteQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    lang: isLanguage(params.get("lang")) ? params.get("lang") as Language : null,
    difficulty: isDifficulty(params.get("difficulty")) ? params.get("difficulty") as Difficulty : null,
    topic: params.get("topic")?.trim() || null,
  };
};

export const LANG_META: Record<Language, { label: string; color: string; light: string; icon: string; maxXp: number }> = {
  python: { label: "Python", color: "#3B82F6", light: "#DBEAFE", icon: pythonIcon, maxXp: 300 },
  java:   { label: "Java",   color: "#F97316", light: "#FFEDD5", icon: javaIcon, maxXp: 200 },
  c:      { label: "C",      color: "#6366F1", light: "#E0E7FF", icon: cIcon, maxXp: 250 },
  cpp:    { label: "C++",    color: "#EC4899", light: "#FCE7F3", icon: cppIcon, maxXp: 150 },
};

export const TYPE_META: Record<QuestionType, { label: string; color: string }> = {
  mcq:            { label: "객관식",    color: "#7C3AED" },
  "fill-blank":   { label: "빈칸 넣기", color: "#3B82F6" },
  "short-answer": { label: "주관식",    color: "#F59E0B" },
  essay:          { label: "AI 주관식", color: "#F59E0B" },
  code:           { label: "코딩",      color: "#10B981" },
};

// XP awarded per correct answer, by type
export const TYPE_XP: Record<QuestionType, number> = {
  mcq: 10, "fill-blank": 10, "short-answer": 10, essay: 10, code: 10,
};
export const MAX_CODE_ATTEMPTS = 3;

export const DIFFICULTY_META: Record<Difficulty, { label: string; color: string; light: string; icon: string; desc: string }> = {
  beginner:     { label: "초급", color: "#10B981", light: "#ECFDF5", icon: "🌱", desc: "기초 문법과 개념 익히기" },
  intermediate: { label: "중급", color: "#F59E0B", light: "#FFFBEB", icon: "🔥", desc: "코드 작성과 응용 연습" },
  advanced:     { label: "고급", color: "#EF4444", light: "#FEF2F2", icon: "🚀", desc: "심화 개념 도전" },
};
export const nextDifficulty = (difficulty: Difficulty): Difficulty | null => {
  if (difficulty === "beginner") return "intermediate";
  if (difficulty === "intermediate") return "advanced";
  return null;
};

export const WEEK_DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;
export const EMPTY_WEEKLY_ACTIVITY = (): BackendActivity[] => WEEK_DAYS.map(day => ({ day, solved: 0 }));
export const EMPTY_WEAKNESS_DATA = ["Python", "Java", "C", "C++"].map(subject => ({ subject, score: 0 }));

export const normalizeWeeklyActivity = (activity: BackendActivity[]): BackendActivity[] => WEEK_DAYS.map(day => {
  const solved = activity.find(item => item.day === day)?.solved ?? 0;
  return { day, solved: Math.max(0, solved) };
});
