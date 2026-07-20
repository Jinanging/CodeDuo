import { useEffect, useState, useRef } from "react";
import {
  Flame, Heart, Zap, Trophy, Code2, BookOpen, CheckCircle2, XCircle,
  ChevronRight, ChevronLeft, RotateCcw, Terminal, Lightbulb, Play, Star, ArrowLeft,
  Users, BarChart2, Lock, Crown, LogOut, UserPlus, Search, X, Check,
  AlertTriangle, Sparkles, MessageSquare, User, Home, NotebookPen,
  TrendingUp, Eye, EyeOff, Bell, ChevronDown,
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from "recharts";
import {
  login as apiLogin, signup as apiSignup, submitAnswer, updateProfile as apiUpdateProfile,
  getMe, hasToken, clearToken, fetchAnalytics, getProblems, getLanguageXp, getWrongAnswers,
  getAdminLessons, getAdminProblems, createAdminProblem, updateAdminProblem, deleteAdminProblem,
  type BackendProblem, type BackendWrongAnswer, type BackendAnalytics, type BackendUser,
  type AdminLesson, type AdminProblem, type AdminProblemPayload,
} from "./api";
import interviewerMascot from "../assets/interviewer-mascot.png";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type QuestionType = "mcq" | "fill-blank" | "short-answer" | "code";
type Language = "python" | "java" | "c" | "cpp";
type Difficulty = "beginner" | "intermediate" | "advanced";
type Screen = "login" | "register" | "home" | "lessonSelect" | "lesson" | "result" | "analytics" | "errors" | "wrongReview" | "friends" | "profile" | "admin" | "upgrade";
type Tier = "free" | "premium";

const SCREEN_PATHS: Record<Screen, string> = {
  login: "/login",
  register: "/register",
  home: "/home",
  lessonSelect: "/lessons",
  lesson: "/lesson",
  result: "/result",
  analytics: "/analytics",
  errors: "/wrong-answers",
  wrongReview: "/wrong-answers/review",
  friends: "/friends",
  profile: "/profile",
  admin: "/admin",
  upgrade: "/upgrade",
};

const PATH_SCREENS: Record<string, Screen> = Object.fromEntries(
  Object.entries(SCREEN_PATHS).map(([screen, path]) => [path, screen])
) as Record<string, Screen>;

const isLanguage = (value: string | null): value is Language =>
  value === "python" || value === "java" || value === "c" || value === "cpp";

const isDifficulty = (value: string | null): value is Difficulty =>
  value === "beginner" || value === "intermediate" || value === "advanced";

const ADMIN_EMAILS = new Set(
  ((import.meta.env.VITE_ADMIN_EMAILS as string | undefined) ?? "admin@codeduo.dev")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean)
);

const isAdminUser = (user: UserProfile) => ADMIN_EMAILS.has(user.email.toLowerCase());

const languageFromSubject = (subject: string): Language => {
  const normalized = subject.toLowerCase();
  if (normalized.includes("c++") || normalized.includes("cpp")) return "cpp";
  if (normalized === "c" || normalized.includes("c ")) return "c";
  if (normalized.includes("java")) return "java";
  return "python";
};

const parseRouteQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    lang: isLanguage(params.get("lang")) ? params.get("lang") as Language : null,
    difficulty: isDifficulty(params.get("difficulty")) ? params.get("difficulty") as Difficulty : null,
  };
};

interface UserProfile {
  id: string;
  username: string;
  email: string;
  tier: Tier;
  xp: number;
  streak: number;
  hearts: number;
  completedLessons: number;
  langXp: Record<Language, number>;
  friendIds: string[];
  groupIds: string[];
  avatar: string;
}

interface EssayRubricItem { label: string; got: number; max: number; }

interface TestCase {
  input: string;
  expected: string;
}

interface MockResult {
  caseNumber: number;
  pass: boolean;
  status?: string;
  error?: string;
  runtimeMs?: number;
  memoryKb?: number;
}

interface Question {
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

interface WrongAnswer {
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

interface MockUser { id: string; username: string; avatar: string; xp: number; level: number; isFriend: boolean; }
interface MockGroup { id: string; name: string; memberCount: number; language: Language; avatar: string; joined: boolean; }
interface MockGroupMember { id: string; username: string; avatar: string; xp: number; streak: number; weeklySolved: number; progress: number; online: boolean; }

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const LANG_META: Record<Language, { label: string; color: string; light: string; icon: string; xp: number; level: number; maxXp: number }> = {
  python: { label: "Python", color: "#3B82F6", light: "#DBEAFE", icon: "🐍", xp: 240, level: 12, maxXp: 300 },
  java:   { label: "Java",   color: "#F97316", light: "#FFEDD5", icon: "☕", xp: 120, level: 5,  maxXp: 200 },
  c:      { label: "C",      color: "#6366F1", light: "#E0E7FF", icon: "⚙️", xp: 180, level: 8,  maxXp: 250 },
  cpp:    { label: "C++",    color: "#EC4899", light: "#FCE7F3", icon: "🔧", xp: 60,  level: 3,  maxXp: 150 },
};

const TYPE_META: Record<QuestionType, { label: string; color: string }> = {
  mcq:            { label: "객관식",    color: "#7C3AED" },
  "fill-blank":   { label: "빈칸 넣기", color: "#3B82F6" },
  "short-answer": { label: "주관식",    color: "#F59E0B" },
  code:           { label: "코딩",      color: "#10B981" },
};

// XP awarded per correct answer, by type
const TYPE_XP: Record<QuestionType, number> = {
  mcq: 10, "fill-blank": 10, "short-answer": 10, code: 20,
};

const DIFFICULTY_META: Record<Difficulty, { label: string; color: string; light: string; icon: string; desc: string }> = {
  beginner:     { label: "초급", color: "#10B981", light: "#ECFDF5", icon: "🌱", desc: "기초 문법과 개념 익히기" },
  intermediate: { label: "중급", color: "#F59E0B", light: "#FFFBEB", icon: "🔥", desc: "코드 작성과 응용 연습" },
  advanced:     { label: "고급", color: "#EF4444", light: "#FEF2F2", icon: "🚀", desc: "심화 개념 도전" },
};

const MOCK_USERS: MockUser[] = [
  { id: "u1", username: "algo_master", avatar: "AM", xp: 4200, level: 21, isFriend: true },
  { id: "u2", username: "java_wizard", avatar: "JW", xp: 3100, level: 16, isFriend: true },
  { id: "u3", username: "c_pointer", avatar: "CP", xp: 1800, level: 9, isFriend: false },
  { id: "u4", username: "py_snake", avatar: "PS", xp: 2900, level: 14, isFriend: false },
  { id: "u5", username: "bit_flip", avatar: "BF", xp: 5500, level: 27, isFriend: true },
];

const MOCK_GROUPS: MockGroup[] = [
  { id: "g1", name: "Python 스터디 🐍", memberCount: 12, language: "python", avatar: "PS", joined: true },
  { id: "g2", name: "알고리즘 크루 ⚡", memberCount: 8, language: "cpp", avatar: "AC", joined: false },
  { id: "g3", name: "Java 백엔드 팀 ☕", memberCount: 5, language: "java", avatar: "JB", joined: false },
  { id: "g4", name: "C 시스템 마스터 ⚙️", memberCount: 7, language: "c", avatar: "CS", joined: true },
];

const MOCK_GROUP_DETAILS: Record<string, { weeklyGoal: number; solved: number; members: MockGroupMember[] }> = {
  g1: {
    weeklyGoal: 90, solved: 64,
    members: [
      { id: "u1", username: "algo_master", avatar: "AM", xp: 4200, streak: 14, weeklySolved: 18, progress: 82, online: true },
      { id: "u4", username: "py_snake", avatar: "PS", xp: 2900, streak: 6, weeklySolved: 12, progress: 64, online: true },
      { id: "u5", username: "bit_flip", avatar: "BF", xp: 5500, streak: 21, weeklySolved: 22, progress: 91, online: false },
    ],
  },
  g2: {
    weeklyGoal: 72, solved: 38,
    members: [
      { id: "u5", username: "bit_flip", avatar: "BF", xp: 5500, streak: 21, weeklySolved: 15, progress: 78, online: false },
      { id: "u1", username: "algo_master", avatar: "AM", xp: 4200, streak: 14, weeklySolved: 11, progress: 56, online: true },
      { id: "u3", username: "c_pointer", avatar: "CP", xp: 1800, streak: 3, weeklySolved: 7, progress: 35, online: false },
    ],
  },
  g3: {
    weeklyGoal: 45, solved: 29,
    members: [
      { id: "u2", username: "java_wizard", avatar: "JW", xp: 3100, streak: 9, weeklySolved: 13, progress: 69, online: true },
      { id: "u1", username: "algo_master", avatar: "AM", xp: 4200, streak: 14, weeklySolved: 9, progress: 52, online: false },
      { id: "u5", username: "bit_flip", avatar: "BF", xp: 5500, streak: 21, weeklySolved: 7, progress: 44, online: true },
    ],
  },
  g4: {
    weeklyGoal: 56, solved: 41,
    members: [
      { id: "u3", username: "c_pointer", avatar: "CP", xp: 1800, streak: 3, weeklySolved: 10, progress: 58, online: false },
      { id: "u5", username: "bit_flip", avatar: "BF", xp: 5500, streak: 21, weeklySolved: 16, progress: 86, online: true },
      { id: "u2", username: "java_wizard", avatar: "JW", xp: 3100, streak: 9, weeklySolved: 8, progress: 49, online: true },
    ],
  },
};


const WEAKNESS_DATA = [
  { subject: "Python 기초", score: 82 },
  { subject: "Java OOP", score: 48 },
  { subject: "C 포인터", score: 35 },
  { subject: "C++ STL", score: 62 },
  { subject: "알고리즘", score: 55 },
  { subject: "자료구조", score: 70 },
];

const ACTIVITY_DATA = [
  { day: "월", solved: 4 }, { day: "화", solved: 7 }, { day: "수", solved: 2 },
  { day: "목", solved: 9 }, { day: "금", solved: 5 }, { day: "토", solved: 11 }, { day: "일", solved: 6 },
];

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────

// ─── CODE EDITOR ─────────────────────────────────────────────────────────────

function CodeEditor({
  value,
  onChange,
  language,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  language: Language;
  disabled: boolean;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const lineCount = value.split("\n").length;
  const langMeta = LANG_META[language];

  const syncScroll = () => {
    if (taRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop;
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: "var(--border)" }}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ background: "#1E1B2E", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
        </div>
        <span className="text-xs font-semibold" style={{ fontFamily: "JetBrains Mono, monospace", color: "#A78BFA" }}>
          {langMeta.icon} {langMeta.label}
        </span>
        <Terminal size={13} style={{ color: "#4B5563" }} />
      </div>

      {/* Editor body */}
      <div className="relative flex overflow-hidden" style={{ background: "#12101E", minHeight: 180 }}>
        {/* Line numbers */}
        <div
          ref={gutterRef}
          className="select-none overflow-hidden shrink-0 py-4 pr-3 pl-3 text-right leading-relaxed"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.8125rem",
            color: "#4B5678",
            background: "#0E0C1A",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            minWidth: 44,
            userSelect: "none",
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={taRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onScroll={syncScroll}
          disabled={disabled}
          spellCheck={false}
          rows={Math.max(8, lineCount + 1)}
          className="flex-1 px-4 py-4 focus:outline-none resize-none leading-relaxed w-full"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.8125rem",
            background: "transparent",
            color: "#E2D9F3",
            caretColor: "#A78BFA",
          }}
        />
      </div>
    </div>
  );
}

// ─── TEST RESULT PANEL ────────────────────────────────────────────────────────

function TestResultPanel({
  results,
  isPremium,
  codeReview,
  resultMessage,
}: {
  results: MockResult[];
  isPremium: boolean;
  codeReview?: string;
  resultMessage?: string;
}) {
  const passCount = results.filter(r => r.pass).length;
  const allPassed = results.length > 0 && passCount === results.length;

  return (
    <div className="mt-4 space-y-3">
      {/* Summary chip */}
      <div
        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-sm"
        style={{
          background: allPassed ? "#ECFDF5" : passCount > 0 ? "#FFF7ED" : "#FEF2F2",
          color: allPassed ? "#065F46" : passCount > 0 ? "#92400E" : "#991B1B",
          borderLeft: `4px solid ${allPassed ? "#10B981" : passCount > 0 ? "#F59E0B" : "#EF4444"}`,
        }}
      >
        {allPassed
          ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
          : <XCircle size={18} className="text-red-500 shrink-0" />}
        <span>
          {passCount} / {results.length} 테스트케이스 통과
        </span>
        {allPassed && (
          <span className="ml-auto text-emerald-600 font-extrabold">+20 XP 🎉</span>
        )}
      </div>

      {/* Test case rows */}
      <div className="rounded-2xl overflow-hidden border border-border bg-white">
        {results.map((r, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-4 py-3"
            style={{
              background: r.pass ? "transparent" : "#FEF2F2",
              borderTop: i > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            {r.pass
              ? <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-500" />
              : <XCircle size={16} className="shrink-0 mt-0.5 text-red-500" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: r.pass ? "#065F46" : "#991B1B" }}>
                <span>숨김 테스트 #{r.caseNumber}</span>
                <span>·</span>
                <span>{r.pass ? "통과" : "실패"}</span>
              </div>
              {(r.error || (!r.pass && r.status && r.status !== "Accepted")) && (
                <div className="mt-2 rounded-lg px-3 py-2 text-xs whitespace-pre-wrap break-words" style={{ background: "#FEE2E2", color: "#991B1B" }}>
                  <span className="font-bold">{r.status || "실행 오류"}</span>
                  {r.error && <span>: {r.error}</span>}
                </div>
              )}
              {(r.runtimeMs != null || r.memoryKb != null) && (
                <div className="mt-1.5 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                  {r.runtimeMs != null && <span>실행 {r.runtimeMs}ms</span>}
                  {r.runtimeMs != null && r.memoryKb != null && <span> · </span>}
                  {r.memoryKb != null && <span>메모리 {r.memoryKb}KB</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pass: explanation + optional AI review */}
      {allPassed && (
        <div className="rounded-2xl px-5 py-4 flex items-start gap-3" style={{ background: "#ECFDF5", borderLeft: "4px solid #10B981" }}>
          <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm mb-0.5" style={{ color: "#065F46" }}>정답! 모든 테스트케이스를 통과했어요 🎉</p>
            {isPremium && codeReview && (
              <div className="mt-2 flex items-start gap-2 text-sm" style={{ color: "#047857" }}>
                <Sparkles size={14} className="shrink-0 mt-0.5 text-emerald-600" />
                <span>{codeReview}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fail: retry prompt */}
      {!allPassed && (
        <div className="rounded-2xl px-5 py-4 flex items-start gap-3" style={{ background: "#FEF2F2", borderLeft: "4px solid #EF4444" }}>
          <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm mb-0.5" style={{ color: "#991B1B" }}>{resultMessage || "일부 테스트케이스를 통과하지 못했어요."}</p>
            <p className="text-sm" style={{ color: "#B91C1C" }}>공개 예시와 오류 유형을 참고해 코드를 수정해보세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function Badge({ type }: { type: QuestionType }) {
  const m = TYPE_META[type];
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: m.color }}>
      {m.label}
    </span>
  );
}

function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)" }}>
      <Crown size={10} /> PREMIUM
    </span>
  );
}

function LockOverlay({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-10 backdrop-blur-sm" style={{ background: "rgba(240,238,255,0.85)" }}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "var(--primary)" }}>
        <Lock size={22} className="text-white" />
      </div>
      <p className="font-bold mb-1" style={{ color: "var(--foreground)" }}>프리미엄 전용 기능</p>
      <p className="text-sm mb-4 text-center px-6" style={{ color: "var(--muted-foreground)" }}>이 기능은 프리미엄 구독자에게만 제공됩니다.</p>
      <button onClick={onUpgrade} className="px-5 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "var(--primary)" }}>
        업그레이드 →
      </button>
    </div>
  );
}

function XpBar({ current, max, color }: { current: number; max: number; color: string }) {
  return (
    <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(current / max) * 100}%`, background: color }} />
    </div>
  );
}

function Avatar({ initials, color, size = "md" }: { initials: string; color?: string; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-bold text-white shrink-0`} style={{ background: color ?? "var(--primary)" }}>
      {initials}
    </div>
  );
}

// ─── LOGIN / REGISTER ─────────────────────────────────────────────────────────

function AuthScreen({
  mode,
  onSwitch,
  onLogin,
}: {
  mode: "login" | "register";
  onSwitch: () => void;
  onLogin: (email: string, password: string, mode: "login" | "register", username: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [username, setUsername] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !pw || (mode === "register" && !username)) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    const name = mode === "register" ? username : email.split("@")[0];
    try {
      await onLogin(email, pw, mode, name);
    } catch (err: any) {
      setError(err?.message ?? "로그인에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Outfit, sans-serif", background: "var(--background)" }}>
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between w-5/12 p-12 text-white" style={{ background: "var(--primary)" }}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"><Code2 size={18} /></div>
          <span className="font-extrabold text-xl">CodeDuo</span>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">코딩 실력을<br />게임처럼 키워보세요</h1>
          <p className="text-white/70 text-lg mb-8">Python, Java, C, C++를 듀오링고 방식으로 학습합니다.</p>
          <div className="space-y-3">
            {["객관식 · 주관식 · 빈칸 · 코딩 문제", "친구와 함께 경쟁하고 성장", "프리미엄: AI 코드 리뷰 + 취약점 분석"].map(t => (
              <div key={t} className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle2 size={16} className="text-green-300 shrink-0" />{t}
              </div>
            ))}
          </div>
        </div>
        <div className="text-white/40 text-sm">© 2026 CodeDuo</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: "var(--primary)" }}><Code2 size={18} /></div>
            <span className="font-extrabold text-xl" style={{ color: "var(--foreground)" }}>CodeDuo</span>
          </div>

          <h2 className="text-2xl font-extrabold mb-1" style={{ color: "var(--foreground)" }}>
            {mode === "login" ? "로그인" : "계정 만들기"}
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--muted-foreground)" }}>
            {mode === "login" ? "계정이 없으신가요? " : "이미 계정이 있으신가요? "}
            <button onClick={onSwitch} className="font-bold" style={{ color: "var(--primary)" }}>
              {mode === "login" ? "회원가입" : "로그인"}
            </button>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>닉네임</label>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="코딩닥터" className="w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors" style={{ borderColor: "var(--border)", background: "var(--input-background)" }} />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>이메일</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none" style={{ borderColor: "var(--border)", background: "var(--input-background)" }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>비밀번호</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 pr-10 rounded-xl border-2 text-sm focus:outline-none" style={{ borderColor: "var(--border)", background: "var(--input-background)" }} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5" style={{ color: "var(--muted-foreground)" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {mode === "register" && <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>비밀번호는 6자 이상이어야 합니다.</p>}
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>
              {mode === "login" ? "로그인" : "가입하기"}
            </button>

            {mode === "login" && (
              <p className="text-xs text-center" style={{ color: "var(--muted-foreground)" }}>
                💡 테스트: <strong>premium@test.com</strong> 입력 시 프리미엄 계정
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "home",      label: "홈",       icon: Home,        premium: false },
  { id: "lessonSelect", label: "레슨",  icon: BookOpen,    premium: false },
  { id: "errors",    label: "오답노트", icon: NotebookPen, premium: true  },
  { id: "analytics", label: "성적 분석", icon: BarChart2,  premium: true  },
  { id: "friends",   label: "친구/그룹", icon: Users,      premium: false },
  { id: "profile",   label: "프로필",   icon: User,        premium: false },
  { id: "admin",     label: "문제 관리", icon: NotebookPen, premium: false, adminOnly: true },
];

function Sidebar({ screen, onNav, user, onLogout }: { screen: Screen; onNav: (s: Screen) => void; user: UserProfile; onLogout: () => void; }) {
  const visibleNavItems = NAV_ITEMS.filter(item => !("adminOnly" in item) || isAdminUser(user));

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border bg-white" style={{ minHeight: "100vh" }}>
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: "var(--primary)" }}><Code2 size={16} /></div>
        <span className="font-extrabold text-lg" style={{ color: "var(--foreground)" }}>CodeDuo</span>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar initials={user.username.slice(0, 2).toUpperCase()} />
          <div className="min-w-0">
            <div className="font-bold text-sm truncate" style={{ color: "var(--foreground)" }}>{user.username}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {user.tier === "premium" ? <PremiumBadge /> : <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted" style={{ color: "var(--muted-foreground)" }}>FREE</span>}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1" style={{ color: "#F59E0B" }}><Flame size={13} />{user.streak}일</span>
          <span className="flex items-center gap-1" style={{ color: "#EF4444" }}><Heart size={13} />{user.hearts}</span>
          <span className="flex items-center gap-1" style={{ color: "var(--primary)" }}><Zap size={13} />{user.xp} XP</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {visibleNavItems.map(({ id, label, icon: Icon, premium }) => {
          const active = screen === id;
          const locked = premium && user.tier === "free";
          return (
            <button
              key={id}
              onClick={() => onNav(id as Screen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: active ? "var(--secondary)" : "transparent",
                color: active ? "var(--primary)" : locked ? "var(--muted-foreground)" : "var(--foreground)",
              }}
            >
              <Icon size={18} />
              <span className="flex-1 text-left">{label}</span>
              {locked && <Lock size={13} style={{ color: "var(--muted-foreground)" }} />}
            </button>
          );
        })}
      </nav>

      {/* Upgrade CTA for free users */}
      {user.tier === "free" && (
        <div className="mx-3 mb-3 rounded-2xl p-4" style={{ background: "var(--secondary)" }}>
          <Crown size={18} className="mb-1.5" style={{ color: "var(--primary)" }} />
          <p className="text-xs font-bold mb-0.5" style={{ color: "var(--foreground)" }}>프리미엄으로 업그레이드</p>
          <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>AI 코드리뷰 + 오답노트 + 분석</p>
          <button onClick={() => onNav("upgrade")} className="w-full py-2 rounded-xl text-xs font-bold text-white" style={{ background: "var(--primary)" }}>
            업그레이드 →
          </button>
        </div>
      )}

      <button onClick={onLogout} className="flex items-center gap-2 mx-3 mb-4 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors" style={{ color: "var(--muted-foreground)" }}>
        <LogOut size={16} />로그아웃
      </button>
    </aside>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────

function HomePage({ user, onStartLesson, selectedLang, setSelectedLang, onNav }: {
  user: UserProfile; onStartLesson: () => void;
  selectedLang: Language; setSelectedLang: (l: Language) => void; onNav: (s: Screen) => void;
}) {
  const [langProblems, setLangProblems] = useState<Question[]>([]);
  useEffect(() => {
    let cancelled = false;
    getProblems(selectedLang).then((l) => { if (!cancelled) setLangProblems(l.map(mapProblem)); }).catch(() => { if (!cancelled) setLangProblems([]); });
    return () => { cancelled = true; };
  }, [selectedLang]);
  const langMeta = LANG_META[selectedLang];
  const selectedQuestions = langProblems;
  const recommended = selectedQuestions.slice(0, 3);
  const codeCount = selectedQuestions.filter(q => q.type === "code").length;
  const todayMissions = [
    { label: `${langMeta.label} 문제 3개 풀기`, done: Math.min(user.completedLessons, 3), total: 3, icon: <BookOpen size={16} />, color: langMeta.color },
    { label: "코딩 문제 1개 통과", done: codeCount > 0 && user.completedLessons > 0 ? 1 : 0, total: 1, icon: <Terminal size={16} />, color: "#10B981" },
    { label: "연속 학습 유지", done: user.streak > 0 ? 1 : 0, total: 1, icon: <Flame size={16} />, color: "#EF4444" },
  ];
  const weekActivity = [
    { day: "월", xp: 20, active: true },
    { day: "화", xp: 35, active: true },
    { day: "수", xp: 0, active: false },
    { day: "목", xp: 45, active: true },
    { day: "금", xp: 30, active: true },
    { day: "토", xp: 0, active: false },
    { day: "일", xp: 15, active: user.streak > 0 },
  ];
  const weakest = selectedQuestions.find(q => q.difficulty === "intermediate") ?? selectedQuestions[0];

  return (
    <div className="px-5 py-6 md:px-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--foreground)" }}>안녕하세요, {user.username}님! 👋</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>오늘 할 학습과 복습할 내용을 한 번에 확인하세요.</p>
        </div>
        <button onClick={() => onNav("lessonSelect")} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white self-start md:self-auto" style={{ background: "var(--foreground)" }}>
          <BookOpen size={16} />레슨 고르기
        </button>
      </div>

      {/* Language grid */}
      <div className="grid grid-cols-2 gap-3 mb-5 md:grid-cols-4">
        {(Object.entries(LANG_META) as [Language, typeof LANG_META[Language]][]).map(([lang, meta]) => {
          const sel = selectedLang === lang;
          return (
            <button key={lang} onClick={() => setSelectedLang(lang)} className="rounded-2xl p-4 text-left border-2 transition-all" style={{ background: sel ? meta.light : "#fff", borderColor: sel ? meta.color : "var(--border)", transform: sel ? "translateY(-2px)" : "none", boxShadow: sel ? `0 4px 16px ${meta.color}25` : "none" }}>
              <div className="text-2xl mb-2">{meta.icon}</div>
              <div className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{meta.label}</div>
              <div className="text-xs font-semibold mb-2" style={{ color: meta.color }}>Lv.{meta.level}</div>
              <XpBar current={user.langXp[lang]} max={meta.maxXp} color={meta.color} />
              <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>{user.langXp[lang]}/{meta.maxXp} XP</div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          {/* Start lesson */}
          <div className="rounded-3xl p-7 relative overflow-hidden" style={{ background: "var(--primary)" }}>
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
            <div className="relative">
              <p className="text-xs font-semibold text-white/60 mb-1">오늘의 레슨</p>
              <h2 className="text-xl font-extrabold text-white mb-1">{langMeta.icon} {langMeta.label} 기초 다지기</h2>
              <p className="text-sm text-white/60 mb-5">초급·중급·고급 · 객관식 · 주관식 · 코딩</p>
              <button onClick={onStartLesson} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105" style={{ background: "#fff", color: "var(--primary)" }}>
                <Play size={16} />레슨 시작
              </button>
            </div>
          </div>

          {/* Today's missions */}
          <section className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-extrabold text-base" style={{ color: "var(--foreground)" }}>오늘의 미션</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>짧게 끝낼 수 있는 학습 목표</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: langMeta.light, color: langMeta.color }}>
                {todayMissions.filter(m => m.done >= m.total).length}/{todayMissions.length} 완료
              </span>
            </div>
            <div className="space-y-3">
              {todayMissions.map(mission => {
                const complete = mission.done >= mission.total;
                const progress = Math.min(100, (mission.done / mission.total) * 100);
                return (
                  <div key={mission.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${mission.color}15`, color: mission.color }}>
                      {complete ? <CheckCircle2 size={17} /> : mission.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-sm font-bold truncate" style={{ color: "var(--foreground)" }}>{mission.label}</span>
                        <span className="text-xs font-semibold shrink-0" style={{ color: "var(--muted-foreground)" }}>{mission.done}/{mission.total}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                        <div className="h-full rounded-full" style={{ width: `${progress}%`, background: mission.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recommended problems */}
          <section className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-extrabold text-base" style={{ color: "var(--foreground)" }}>추천 문제</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{langMeta.label} 실력을 올리기 좋은 문제</p>
              </div>
              <button onClick={() => onNav("lessonSelect")} className="text-xs font-bold flex items-center gap-1" style={{ color: "var(--primary)" }}>
                전체 보기 <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-2.5">
              {recommended.map(question => {
                const typeMeta = TYPE_META[question.type];
                const diffMeta = DIFFICULTY_META[question.difficulty];
                return (
                  <button key={question.id} onClick={onStartLesson} className="w-full text-left p-3 rounded-xl border border-border flex items-center gap-3 hover:bg-muted/40 transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: diffMeta.light }}>
                      {question.type === "code" ? <Code2 size={18} style={{ color: typeMeta.color }} /> : <BookOpen size={18} style={{ color: typeMeta.color }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate" style={{ color: "var(--foreground)" }}>{question.title}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${typeMeta.color}14`, color: typeMeta.color }}>{typeMeta.label}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: diffMeta.light, color: diffMeta.color }}>{diffMeta.label}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: "var(--muted-foreground)" }} />
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            {[
              { label: "완료 레슨", value: `${user.completedLessons}`, icon: <Trophy size={18} />, color: "#F59E0B" },
              { label: "연속 학습", value: `${user.streak}일`, icon: <Flame size={18} />, color: "#EF4444" },
              { label: "총 XP", value: `${user.xp}`, icon: <Zap size={18} />, color: "var(--primary)" },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-border">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15`, color }}>{icon}</div>
                <div className="min-w-0">
                  <div className="font-extrabold text-base leading-none" style={{ color: "var(--foreground)" }}>{value}</div>
                  <div className="text-xs mt-0.5 whitespace-nowrap" style={{ color: "var(--muted-foreground)" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly activity */}
          <section className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-extrabold text-base" style={{ color: "var(--foreground)" }}>주간 학습</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>이번 주 XP 흐름</p>
              </div>
              <TrendingUp size={18} style={{ color: "var(--accent)" }} />
            </div>
            <div className="grid grid-cols-7 gap-2 items-end h-28">
              {weekActivity.map(item => (
                <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full rounded-t-lg min-h-[10px]" style={{ height: `${Math.max(12, item.xp * 1.7)}px`, background: item.active ? langMeta.color : "var(--muted)" }} />
                  <span className="text-xs font-semibold" style={{ color: item.active ? "var(--foreground)" : "var(--muted-foreground)" }}>{item.day}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Review card */}
          <section className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
                <NotebookPen size={18} />
              </div>
              <div className="min-w-0">
                <h2 className="font-extrabold text-base" style={{ color: "var(--foreground)" }}>복습 추천</h2>
                <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                  {weakest ? `${weakest.title} 문제로 ${langMeta.label} 약한 개념을 다시 확인해보세요.` : `${langMeta.label} 문제를 먼저 풀어보세요.`}
                </p>
                <button onClick={() => user.tier === "premium" ? onNav("errors") : onNav("upgrade")} className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: user.tier === "premium" ? "var(--primary)" : "var(--foreground)" }}>
                  {user.tier === "premium" ? "오답노트 열기" : "오답노트 잠금 해제"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── LESSON SELECT (난이도 선택) ────────────────────────────────────────────────

function LessonSelectPage({ user, selectedLang, setSelectedLang, onStart, onBack }: {
  user: UserProfile; selectedLang: Language;
  setSelectedLang: (l: Language) => void;
  onStart: (d: Difficulty) => void; onBack: () => void;
}) {
  const [counts, setCounts] = useState<Record<Difficulty, number>>({ beginner: 0, intermediate: 0, advanced: 0 });
  useEffect(() => {
    let cancelled = false;
    getProblems(selectedLang).then((list) => {
      if (cancelled) return;
      const c: Record<Difficulty, number> = { beginner: 0, intermediate: 0, advanced: 0 };
      for (const p of list) { const d = NUM_DIFF[p.difficulty]; if (d) c[d]++; }
      setCounts(c);
    }).catch(() => { if (!cancelled) setCounts({ beginner: 0, intermediate: 0, advanced: 0 }); });
    return () => { cancelled = true; };
  }, [selectedLang]);
  const langMeta = LANG_META[selectedLang];
  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold mb-5" style={{ color: "var(--muted-foreground)" }}>
        <ArrowLeft size={16} />홈으로
      </button>

      <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--foreground)" }}>레슨 선택</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>언어와 난이도를 골라 학습을 시작하세요.</p>

      {/* Language picker */}
      <div className="flex gap-2 mb-7 flex-wrap">
        {(Object.entries(LANG_META) as [Language, typeof LANG_META[Language]][]).map(([lang, meta]) => {
          const sel = selectedLang === lang;
          return (
            <button key={lang} onClick={() => setSelectedLang(lang)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all"
              style={{ borderColor: sel ? meta.color : "var(--border)", background: sel ? meta.light : "#fff", color: sel ? meta.color : "var(--muted-foreground)" }}>
              <span>{meta.icon}</span>{meta.label}
            </button>
          );
        })}
      </div>

      {/* Difficulty cards */}
      <div className="space-y-3">
        {(Object.entries(DIFFICULTY_META) as [Difficulty, typeof DIFFICULTY_META[Difficulty]][]).map(([diff, meta]) => {
          const count = counts[diff];
          return (
            <button key={diff} onClick={() => count > 0 && onStart(diff)} disabled={count === 0}
              className="w-full text-left rounded-2xl border-2 p-5 flex items-center gap-4 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "var(--border)", background: "#fff" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: meta.light }}>
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base" style={{ color: "var(--foreground)" }}>{meta.label}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: meta.light, color: meta.color }}>{langMeta.icon} {langMeta.label}</span>
                </div>
                <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>{meta.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-extrabold text-base" style={{ color: meta.color }}>{count}문제</div>
                <div className="flex items-center justify-end gap-1 text-xs font-bold mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  시작 <ChevronRight size={14} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── LESSON ───────────────────────────────────────────────────────────────────

// ── 백엔드 오답(BackendWrongAnswer) → 프론트 WrongAnswer 매핑 ──
function mapWrongAnswer(w: BackendWrongAnswer): WrongAnswer {
  const parseOptions = () => {
    try { return w.optionsJson ? JSON.parse(w.optionsJson) as string[] : undefined; } catch { return undefined; }
  };
  return {
    qId: w.problemId,
    question: w.question,
    type: PROBLEM_TYPE_MAP[w.type] ?? "short-answer",
    language: w.language as Language,
    userAnswer: w.lastAnswer ?? "",
    explanation: w.explanation,
    options: parseOptions(),
    codeTemplate: w.codeTemplate,
    solvedAt: (w.updatedAt ?? "").slice(0, 10),
  };
}
function dedupWrongs(list: WrongAnswer[]): WrongAnswer[] {
  const map = new Map<number, WrongAnswer>();
  for (const w of list) if (!map.has(w.qId)) map.set(w.qId, w);
  return [...map.values()];
}

// ── 백엔드 문제(BackendProblem) → 프론트 Question 매핑 ──
const PROBLEM_TYPE_MAP: Record<string, QuestionType> = {
  MULTIPLE_CHOICE: "mcq", SHORT_ANSWER: "short-answer", FILL_BLANK: "fill-blank", CODE: "code", ESSAY: "short-answer",
};
const DIFF_NUM: Record<Difficulty, number> = { beginner: 1, intermediate: 2, advanced: 3 };
const NUM_DIFF: Record<number, Difficulty> = { 1: "beginner", 2: "intermediate", 3: "advanced" };
function mapProblem(p: BackendProblem): Question {
  const parse = <T,>(str: string | undefined, fb: T): T => { try { return str ? (JSON.parse(str) as T) : fb; } catch { return fb; } };
  return {
    id: p.id,
    type: PROBLEM_TYPE_MAP[p.type] ?? "short-answer",
    language: p.language as Language,
    difficulty: NUM_DIFF[p.difficulty] ?? "beginner",
    title: p.title,
    question: p.description,
    options: parse<string[] | undefined>(p.optionsJson, undefined),
    hint: p.hint,
    template: p.codeTemplate,
    tags: parse<string[]>(p.tagsJson, []),
    testcases: p.sampleInput != null || p.sampleOutput != null
      ? [{ input: p.sampleInput ?? "", expected: p.sampleOutput ?? "" }]
      : undefined,
  };
}

function LessonPage({ user, selectedLang, difficulty, onComplete, onBack }: {
  user: UserProfile; selectedLang: Language; difficulty: Difficulty;
  onComplete: (correct: number, total: number, wrongs: WrongAnswer[], earned: number) => void;
  onBack: () => void;
}) {
  // 백엔드에서 언어+난이도로 문제 로딩 (하드코딩 QUESTIONS 대신)
  const [lessonQuestions, setLessonQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [codeValue, setCodeValue] = useState("");
  const [wrongs, setWrongs] = useState<WrongAnswer[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<MockResult[] | null>(null);
  const [codeResultMessage, setCodeResultMessage] = useState("");
  const [backendCodeReview, setBackendCodeReview] = useState<string | undefined>();
  const [feedbackExplanation, setFeedbackExplanation] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const [earnedXp, setEarnedXp] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setLoadError(false);
    getProblems(selectedLang, DIFF_NUM[difficulty])
      .then((list) => {
        if (cancelled) return;
        const mapped = list.map(mapProblem);
        setLessonQuestions(mapped);
        setCurrentQ(0);
        setCodeValue(mapped[0]?.template ?? "");
        setLoading(false);
      })
      .catch(() => { if (!cancelled) { setLoadError(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [selectedLang, difficulty]);

  const question = lessonQuestions[currentQ];

  if (loading) return (
    <div className="flex items-center justify-center" style={{ minHeight: "100dvh", color: "var(--muted-foreground)" }}>문제 불러오는 중…</div>
  );
  if (loadError || !question) return (
    <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight: "100dvh" }}>
      <p style={{ color: "var(--muted-foreground)" }}>{loadError ? "문제를 불러오지 못했습니다. 백엔드 연결을 확인하세요." : "이 난이도에 등록된 문제가 없습니다."}</p>
      <button onClick={onBack} className="px-4 py-2 rounded-xl font-bold text-white" style={{ background: "var(--primary)" }}>돌아가기</button>
    </div>
  );

  const progress = (currentQ / lessonQuestions.length) * 100;
  const langMeta = LANG_META[question.language];

  const resetQ = (idx: number) => {
    setUserAnswer(""); setSelectedOption(null); setFeedback(null); setShowHint(false);
    setCodeValue(lessonQuestions[idx]?.template ?? "");
    setTestResults(null); setCodeResultMessage(""); setBackendCodeReview(undefined); setFeedbackExplanation(""); setSubmissionError(""); setIsRunning(false);
  };

  const runCode = async () => {
    setIsRunning(true);
    setTestResults(null);
    let backend: Awaited<ReturnType<typeof submitAnswer>>;
    try {
      backend = await submitAnswer(question.id, codeValue);
    } catch (error) {
      const message = error instanceof Error ? error.message : "코드 실행 요청에 실패했습니다.";
      setTestResults([{
        caseNumber: 1,
        pass: false,
        status: "요청 실패",
        error: message,
      }]);
      setCodeResultMessage(message);
      setBackendCodeReview(undefined);
      setFeedback("wrong");
      setIsRunning(false);
      return;
    }
    let parsed: MockResult[] | null = null;
    if (backend?.testResultsJson) { try { parsed = JSON.parse(backend.testResultsJson); } catch { parsed = null; } }
    const results = parsed?.length ? parsed : [{
      caseNumber: 1,
      pass: false,
      status: "결과 오류",
      error: "백엔드가 테스트 결과를 반환하지 않았습니다.",
    }];
    setTestResults(results);
    setCodeResultMessage(backend.resultMessage ?? "");
    setBackendCodeReview(backend.aiReview);
    setFeedbackExplanation(backend.explanation ?? "");
    setIsRunning(false);
    const allPassed = backend.correct;
    setFeedback(allPassed ? "correct" : "wrong");
    if (allPassed) {
      setCorrectCount(p => p + 1);
      setEarnedXp(p => p + TYPE_XP.code);
    } else {
      setWrongs(prev => [...prev, {
        qId: question.id, question: question.question, type: question.type,
        language: question.language,
        userAnswer: codeValue.slice(0, 60),
        solvedAt: new Date().toISOString().slice(0, 10),
      }]);
    }
  };

  const checkAnswer = async () => {
    if (question.type === "code") { runCode(); return; }

    // 정답은 브라우저에 두지 않고 백엔드에서만 채점합니다.
    const submitted = question.type === "mcq" ? String(selectedOption ?? "") : userAnswer;
    setSubmissionError("");
    let backend: Awaited<ReturnType<typeof submitAnswer>>;
    try {
      backend = await submitAnswer(question.id, submitted);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "채점 요청에 실패했습니다.");
      return;
    }
    const correct = backend.correct;
    setFeedbackExplanation(backend.explanation ?? "");

    setFeedback(correct ? "correct" : "wrong");
    if (correct) { setCorrectCount(p => p + 1); setEarnedXp(p => p + TYPE_XP[question.type]); }
    else {
      setWrongs(prev => [...prev, {
        qId: question.id, question: question.question, type: question.type,
        language: question.language,
        userAnswer: question.type === "mcq" ? (question.options?.[selectedOption ?? 0] ?? "") : userAnswer,
        solvedAt: new Date().toISOString().slice(0, 10),
      }]);
    }
  };

  const next = () => {
    if (currentQ < lessonQuestions.length - 1) { resetQ(currentQ + 1); setCurrentQ(p => p + 1); }
    else onComplete(correctCount, lessonQuestions.length, wrongs, earnedXp);
  };

  const canCheck =
    question.type === "code"
      ? codeValue.trim().length > 0 && !isRunning
      : question.type === "mcq"
        ? selectedOption !== null
        : userAnswer.trim().length > 0;

  const parts = question.question.split("___");

  return (
    <div className="flex flex-col" style={{ minHeight: "100dvh" }}>

      {/* ── Progress header ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-5">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors shrink-0"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1 h-3.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: langMeta.color }}
            />
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <span className="flex items-center gap-1.5 text-base font-extrabold" style={{ color: "#EF4444" }}>
              <Heart size={18} className="fill-red-400 text-red-400" />{user.hearts}
            </span>
            <span className="flex items-center gap-1.5 text-base font-extrabold" style={{ color: "var(--primary)" }}>
              <Zap size={18} className="fill-violet-400 text-violet-400" />{user.xp}
            </span>
          </div>
        </div>
      </div>

      {/* ── Content column ── */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-6 pt-[8vh] pb-10">
        <div className="max-w-2xl mx-auto">

          {/* Meta row: type badge + counter + hint */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-bold text-white"
                style={{ background: TYPE_META[question.type].color }}
              >
                {TYPE_META[question.type].label}
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--muted-foreground)" }}>
                {currentQ + 1} / {lessonQuestions.length}
              </span>
            </div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors"
              style={{ color: "#F59E0B" }}
            >
              <Lightbulb size={14} />힌트
            </button>
          </div>

          {/* Hint banner */}
          {showHint && question.hint && (
            <div className="mb-4 rounded-2xl px-5 py-3.5 text-sm font-medium border-l-4 flex items-start gap-2" style={{ background: "#FFFBEB", color: "#92400E", borderColor: "#F59E0B" }}>
              <Lightbulb size={15} className="shrink-0 mt-0.5 text-amber-500" />
              {question.hint}
            </div>
          )}

          {/* ── Question card ── */}
          <div className="bg-white rounded-3xl p-8 border border-border mb-5 shadow-sm">
            <div className="text-sm font-bold mb-3" style={{ color: langMeta.color }}>
              {langMeta.icon} {langMeta.label} · {question.title}
            </div>
            <p className="font-semibold text-xl leading-relaxed whitespace-pre-line" style={{ color: "var(--foreground)" }}>
              {question.type === "fill-blank" ? (
                <>
                  {parts[0]}
                  <span
                    className="inline-block mx-1.5 px-4 rounded-xl border-b-2 font-mono font-bold text-base"
                    style={{ minWidth: 80, background: "var(--secondary)", borderColor: "var(--primary)", color: "var(--primary)" }}
                  >
                    {userAnswer || "___"}
                  </span>
                  {parts[1]}
                </>
              ) : question.question}
            </p>
          </div>

          {/* ── MCQ options ── */}
          {question.type === "mcq" && question.options && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {question.options.map((opt, i) => {
                const sel = selectedOption === i;
                const wrongOpt = feedback === "wrong" && sel;
                return (
                  <button
                    key={i}
                    disabled={!!feedback}
                    onClick={() => setSelectedOption(i)}
                    className="text-left px-5 py-5 rounded-2xl border-2 font-medium transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-default flex items-center gap-3"
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "1rem",
                      minHeight: 64,
                      borderColor: wrongOpt ? "#EF4444" : feedback === "correct" && sel ? "#10B981" : sel ? "var(--primary)" : "var(--border)",
                      background: wrongOpt ? "#FEF2F2" : feedback === "correct" && sel ? "#ECFDF5" : sel ? "var(--secondary)" : "#fff",
                      color: wrongOpt ? "#991B1B" : feedback === "correct" && sel ? "#065F46" : "var(--foreground)",
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0 text-sm font-extrabold"
                      style={{
                        background: feedback === "correct" && sel ? "#10B981" : wrongOpt ? "#EF4444" : sel ? "var(--primary)" : "var(--muted)",
                        color: sel || wrongOpt ? "#fff" : "var(--muted-foreground)",
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Text input (fill-blank / short-answer) ── */}
          {(question.type === "fill-blank" || question.type === "short-answer") && (
            <input
              type="text"
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !feedback && canCheck && checkAnswer()}
              disabled={!!feedback}
              placeholder="정답을 입력하세요..."
              className="w-full px-5 py-4 rounded-2xl border-2 font-mono font-bold text-base focus:outline-none transition-colors"
              style={{
                borderColor: feedback === "correct" ? "#10B981" : feedback === "wrong" ? "#EF4444" : "var(--border)",
                background: feedback === "correct" ? "#ECFDF5" : feedback === "wrong" ? "#FEF2F2" : "var(--input-background)",
                color: feedback === "correct" ? "#065F46" : feedback === "wrong" ? "#991B1B" : "var(--foreground)",
              }}
            />
          )}

          {submissionError && (
            <div className="mt-3 px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: "#FEF2F2", color: "#991B1B" }}>
              {submissionError}
            </div>
          )}

          {/* ── Code editor ── */}
          {question.type === "code" && (
            <div>
              {question.testcases?.[0] && (
                <div
                  className="mb-3 flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold"
                  style={{ background: "#1E1B2E", color: "#A78BFA" }}
                >
                  <span style={{ color: "#4B5678" }}>예시</span>
                  <span>입력: <span className="text-white">{question.testcases[0].input}</span></span>
                  <span style={{ color: "#4B5678" }}>→</span>
                  <span>출력: <span className="text-emerald-400">{question.testcases[0].expected}</span></span>
                </div>
              )}
              <CodeEditor
                value={codeValue}
                onChange={setCodeValue}
                language={question.language}
                disabled={isRunning}
              />
              {testResults && (
                <TestResultPanel
                  results={testResults}
                  isPremium={user.tier === "premium"}
                  codeReview={backendCodeReview}
                  resultMessage={codeResultMessage}
                />
              )}
            </div>
          )}

          {/* ── Feedback banner (non-code, non-essay) ── */}
          {feedback && question.type !== "code" && (
            <div
              className="mt-5 rounded-2xl px-6 py-5 flex items-start gap-3"
              style={{
                background: feedback === "correct" ? "#ECFDF5" : "#FEF2F2",
                borderLeft: `4px solid ${feedback === "correct" ? "#10B981" : "#EF4444"}`,
              }}
            >
              {feedback === "correct"
                ? <CheckCircle2 size={22} className="text-emerald-500 shrink-0 mt-0.5" />
                : <XCircle size={22} className="text-red-500 shrink-0 mt-0.5" />}
              <div>
                <div className="font-bold mb-1" style={{ color: feedback === "correct" ? "#065F46" : "#991B1B" }}>
                  {feedback === "correct" ? `정답! +${TYPE_XP[question.type]} XP 🎉` : "틀렸어요. 해설을 확인하세요."}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: feedback === "correct" ? "#047857" : "#B91C1C" }}>
                  {feedbackExplanation || "채점이 완료되었습니다."}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Bottom CTA bar ── */}
      <div
        className="sticky bottom-0 w-full"
        style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="max-w-2xl mx-auto">
            {question.type === "code" ? (
              feedback === "correct" ? (
                <button
                  onClick={next}
                  className="w-full py-4 rounded-2xl font-extrabold text-base text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: "#10B981" }}
                >
                  {currentQ < lessonQuestions.length - 1 ? <>다음 문제 <ChevronRight size={20} /></> : <>결과 보기 <Trophy size={20} /></>}
                </button>
              ) : (
                <button
                  onClick={checkAnswer}
                  disabled={!canCheck || isRunning}
                  className="w-full py-4 rounded-2xl font-extrabold text-base text-white flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
                  style={{
                    background: isRunning ? "#6D28D9" : canCheck ? "var(--primary)" : "#D1C9F0",
                    color: canCheck || isRunning ? "#fff" : "#6B5B95",
                  }}
                >
                  {isRunning ? (
                    <>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      실행 중…
                    </>
                  ) : testResults && feedback === "wrong" ? (
                    <><RotateCcw size={18} />다시 실행</>
                  ) : (
                    <><Play size={18} />실행하고 채점</>
                  )}
                </button>
              )
            ) : feedback ? (
              <button
                onClick={next}
                className="w-full py-4 rounded-2xl font-extrabold text-base text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ background: "var(--primary)" }}
              >
                {currentQ < lessonQuestions.length - 1 ? <>다음 문제 <ChevronRight size={20} /></> : <>결과 보기 <Trophy size={20} /></>}
              </button>
            ) : (
              <button
                onClick={checkAnswer}
                disabled={!canCheck}
                className="w-full py-4 rounded-2xl font-extrabold text-base transition-all disabled:cursor-not-allowed"
                style={{
                  background: canCheck ? "var(--primary)" : "#D1C9F0",
                  color: canCheck ? "#fff" : "#6B5B95",
                }}
              >
                정답 확인
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RESULT ───────────────────────────────────────────────────────────────────

function ResultPage({ user, correct, total, xpEarned, wrongs, selectedLang, onHome, onRetry, onUpgrade }: {
  user: UserProfile; correct: number; total: number; xpEarned: number;
  wrongs: WrongAnswer[]; selectedLang: Language;
  onHome: () => void; onRetry: () => void; onUpgrade: () => void;
}) {
  const pct = Math.round((correct / total) * 100);
  const langMeta = LANG_META[selectedLang];
  const isPremium = user.tier === "premium";

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center text-4xl" style={{ background: pct === 100 ? "#DCFCE7" : pct >= 80 ? "#FEF3C7" : pct >= 60 ? "#FEF9C3" : "#FEE2E2" }}>
          {pct === 100 ? "🏆" : pct >= 80 ? "⭐" : pct >= 60 ? "👍" : "📚"}
        </div>
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--foreground)" }}>
          {pct === 100 ? "완벽해요! 만점이에요 🎉" : pct >= 80 ? "잘했어요!" : pct >= 60 ? "꽤 잘했어요!" : "다시 도전해봐요!"}
        </h1>
        <p style={{ color: "var(--muted-foreground)" }}>{langMeta.icon} {langMeta.label} 레슨 완료</p>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[{ label: "정답", value: `${correct}/${total}`, color: "#10B981" }, { label: "정확도", value: `${pct}%`, color: langMeta.color }, { label: "획득 XP", value: `+${xpEarned}`, color: "var(--primary)" }].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 text-center border border-border">
            <div className="font-extrabold text-xl mb-0.5" style={{ color }}>{value}</div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* FREE: only basic explanation done above during lesson */}
      {!isPremium && (
        <div className="relative bg-white rounded-2xl border border-border p-5 mb-4 overflow-hidden">
          <LockOverlay onUpgrade={onUpgrade} />
          <div className="opacity-30 pointer-events-none">
            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}><Sparkles size={16} />AI 코드 리뷰</h3>
            <div className="space-y-2">
              <div className="h-4 rounded bg-muted w-3/4" /><div className="h-4 rounded bg-muted w-full" /><div className="h-4 rounded bg-muted w-2/3" />
            </div>
          </div>
        </div>
      )}

      {/* PREMIUM: Code review */}
      {isPremium && (
        <div className="bg-white rounded-2xl border border-border p-5 mb-4">
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Sparkles size={16} style={{ color: "var(--primary)" }} />AI 코드 리뷰
            <PremiumBadge />
          </h3>
          <div className="rounded-xl p-4 text-sm" style={{ background: "var(--secondary)", color: "var(--foreground)" }}>
            AI 코드 리뷰는 각 코드 채점 결과에서 확인할 수 있습니다.
          </div>
        </div>
      )}

      {/* PREMIUM: Wrong answers summary */}
      {isPremium && wrongs.length > 0 && (
        <div className="bg-white rounded-2xl border border-border p-5 mb-4">
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <AlertTriangle size={16} style={{ color: "#F59E0B" }} />틀린 문제 ({wrongs.length}개)
          </h3>
          <div className="space-y-2">
            {wrongs.map((w, i) => (
              <div key={i} className="rounded-xl px-4 py-3 text-sm" style={{ background: "#FEF2F2" }}>
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge type={w.type} />
                  <span className="font-mono text-xs font-semibold" style={{ color: LANG_META[w.language].color }}>{LANG_META[w.language].label}</span>
                </div>
                <p className="font-medium mb-1 text-xs" style={{ color: "#991B1B" }}>{w.question.slice(0, 60)}...</p>
                <div className="flex gap-4 text-xs">
                  <span style={{ color: "#EF4444" }}>내 답: <strong>{w.userAnswer}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onHome} className="flex-1 py-3.5 rounded-xl font-bold text-white text-sm" style={{ background: "var(--primary)" }}>홈으로</button>
        <button onClick={onRetry} className="flex-1 py-3.5 rounded-xl font-bold text-sm border-2" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
          <RotateCcw size={14} className="inline mr-1" />다시 도전
        </button>
      </div>
    </div>
  );
}

// ─── ANALYTICS (PREMIUM) ─────────────────────────────────────────────────────

function AnalyticsPage({ user, onUpgrade }: { user: UserProfile; onUpgrade: () => void }) {
  const isPremium = user.tier === "premium";
  const fallbackAnalytics: BackendAnalytics = {
    weakness: WEAKNESS_DATA,
    activity: ACTIVITY_DATA,
    summary: { totalSolved: user.completedLessons, weeklySolved: 0, streak: user.streak, accuracy: 0 },
  };
  const [analytics, setAnalytics] = useState<BackendAnalytics>(fallbackAnalytics);
  const [analyticsStatus, setAnalyticsStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    if (!isPremium) return;

    let alive = true;
    setAnalyticsStatus("loading");
    fetchAnalytics()
      .then(data => {
        if (!alive) return;
        setAnalytics({
          weakness: data.weakness.length > 0 ? data.weakness : fallbackAnalytics.weakness,
          activity: data.activity.length > 0 ? data.activity : fallbackAnalytics.activity,
          summary: data.summary,
        });
        setAnalyticsStatus("idle");
      })
      .catch(() => {
        if (!alive) return;
        setAnalytics(fallbackAnalytics);
        setAnalyticsStatus("error");
      });

    return () => { alive = false; };
  }, [isPremium, user.completedLessons, user.streak]);

  const recommendedAreas = [...analytics.weakness]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: "var(--foreground)" }}>성적 분석</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>나의 취약점과 강점을 확인하세요</p>
        </div>
        <PremiumBadge />
      </div>

      <div className="relative">
        {!isPremium && <LockOverlay onUpgrade={onUpgrade} />}

        <div className={isPremium ? "" : "opacity-30 pointer-events-none"}>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "총 풀이", value: analytics.summary.totalSolved },
              { label: "이번 주", value: analytics.summary.weeklySolved },
              { label: "정확도", value: `${analytics.summary.accuracy}%` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-2xl border border-border p-4">
                <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{label}</p>
                <p className="font-extrabold text-lg" style={{ color: "var(--foreground)" }}>{value}</p>
              </div>
            ))}
          </div>

          {analyticsStatus === "error" && (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm" style={{ color: "#92400E" }}>
              분석 데이터를 불러오지 못해 예시 데이터를 표시합니다.
            </div>
          )}

          {/* Radar chart */}
          <div className="bg-white rounded-2xl border border-border p-5 mb-4">
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <TrendingUp size={16} style={{ color: "var(--primary)" }} />취약 영역 분석
              {analyticsStatus === "loading" && <span className="text-xs font-normal" style={{ color: "var(--muted-foreground)" }}>불러오는 중</span>}
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={analytics.weakness}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "Outfit" }} />
                <Radar name="점수" dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart */}
          <div className="bg-white rounded-2xl border border-border p-5 mb-4">
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <BarChart2 size={16} style={{ color: "#10B981" }} />이번 주 학습량
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={analytics.activity}>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--muted-foreground)", fontFamily: "Outfit" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ fontFamily: "Outfit", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="solved" radius={[6, 6, 0, 0]}>
                  {analytics.activity.map((_, i) => <Cell key={i} fill={i === 5 ? "var(--primary)" : "#C4B5FD"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recommended problems */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <Sparkles size={16} style={{ color: "#F59E0B" }} />추천 문제
            </h3>
            <div className="space-y-2.5">
              {(recommendedAreas.length > 0 ? recommendedAreas : fallbackAnalytics.weakness.slice(0, 3)).map((area, index) => {
                const lang = languageFromSubject(area.subject);
                const type = (index === 0 ? "mcq" : index === 1 ? "code" : "fill-blank") as QuestionType;
                const title = `${area.subject} 복습`;
                const reason = `${area.subject} 영역 정확도 ${area.score}%`;
                return (
                <div key={title} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/40 transition-colors cursor-pointer">
                  <div className="text-xl">{LANG_META[lang as Language].icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--foreground)" }}>{title}</p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{reason}</p>
                  </div>
                  <Badge type={type} />
                </div>
              )})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ERROR NOTEBOOK (PREMIUM) ────────────────────────────────────────────────

function ErrorNotebookPage({ user, sessionWrongs, resolvedIds, onReview, onUpgrade }: {
  user: UserProfile;
  sessionWrongs: WrongAnswer[];
  resolvedIds: number[];
  onReview: () => void;
  onUpgrade: () => void;
}) {
  const isPremium = user.tier === "premium";
  const [backendWrongs, setBackendWrongs] = useState<WrongAnswer[]>([]);
  useEffect(() => { getWrongAnswers().then((list) => setBackendWrongs(list.map(mapWrongAnswer))).catch(() => {}); }, []);
  const allWrongs = dedupWrongs([...backendWrongs, ...sessionWrongs]);
  const [filterLang, setFilterLang] = useState<Language | "all">("all");
  const filtered = filterLang === "all" ? allWrongs : allWrongs.filter(w => w.language === filterLang);
  const reviewWrongs = filtered.filter(w => !resolvedIds.includes(w.qId));
  const solvedWrongs = filtered.filter(w => resolvedIds.includes(w.qId));

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: "var(--foreground)" }}>오답노트</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>틀린 문제를 복습하고 실력을 높여요</p>
        </div>
        <PremiumBadge />
      </div>

      <div className="relative">
        {!isPremium && <LockOverlay onUpgrade={onUpgrade} />}
        <div className={isPremium ? "" : "opacity-30 pointer-events-none"}>
          {/* Filter */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {["all", "python", "java", "c", "cpp"].map(l => (
              <button key={l} onClick={() => setFilterLang(l as Language | "all")}
                className="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
                style={{ borderColor: filterLang === l ? "var(--primary)" : "var(--border)", background: filterLang === l ? "var(--secondary)" : "#fff", color: filterLang === l ? "var(--primary)" : "var(--muted-foreground)" }}>
                {l === "all" ? "전체" : `${LANG_META[l as Language].icon} ${LANG_META[l as Language].label}`}
              </button>
            ))}
          </div>

          {filtered.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-5 mb-4 flex flex-col gap-4 md:flex-row md:items-center">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border shrink-0" style={{ background: "var(--input-background)" }}>
                <img src={interviewerMascot} alt="복습 면접관" className="w-full h-full object-cover object-top" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-extrabold text-base" style={{ color: "var(--foreground)" }}>틀린 문제 복습하기</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--secondary)", color: "var(--primary)" }}>{reviewWrongs.length}개 남음</span>
                </div>
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  면접관 캐릭터가 틀린 문제를 다시 질문합니다. 맞춘 문제는 아래 목록으로 이동합니다.
                </p>
              </div>
              <button onClick={onReview} disabled={reviewWrongs.length === 0} className="px-5 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 shrink-0" style={{ background: "var(--primary)" }}>
                복습 시작
              </button>
            </div>
          )}

          {solvedWrongs.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-5 mb-4">
              <h3 className="font-extrabold text-base mb-3" style={{ color: "var(--foreground)" }}>다시 풀어서 맞은 문제</h3>
              <div className="space-y-2">
                {solvedWrongs.map(w => (
                  <div key={w.qId} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#ECFDF5" }}>
                    <CheckCircle2 size={16} className="shrink-0" style={{ color: "#10B981" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "#065F46" }}>{w.question}</p>
                    </div>
                    <Badge type={w.type} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "#FEF3C7" }}>
                <Trophy size={30} style={{ color: "#F59E0B" }} />
              </div>
              <p className="font-bold mb-1" style={{ color: "var(--foreground)" }}>
                {filterLang === "all" ? "틀린 문제가 없어요! 🎉" : `${LANG_META[filterLang].label} 오답이 없어요!`}
              </p>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {filterLang === "all" ? "레슨을 완료하면 오답이 여기에 기록됩니다." : "다른 언어를 확인하거나 레슨을 더 풀어보세요."}
              </p>
            </div>
          ) : reviewWrongs.length > 0 ? (
            <div>
              <h3 className="font-extrabold text-base mb-3" style={{ color: "var(--foreground)" }}>아직 틀린 문제</h3>
              <div className="space-y-3">
              {reviewWrongs.map((w, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-border p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge type={w.type} />
                      <span className="text-xs font-bold" style={{ color: LANG_META[w.language].color }}>{LANG_META[w.language].icon} {LANG_META[w.language].label}</span>
                      <span className="ml-auto text-xs" style={{ color: "var(--muted-foreground)" }}>{w.solvedAt}</span>
                    </div>
                    <p className="font-semibold text-sm mb-3 leading-relaxed" style={{ color: "var(--foreground)" }}>{w.question}</p>
                    <div className="flex flex-col gap-1.5 text-sm mb-3">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#FEF2F2" }}>
                        <XCircle size={14} className="text-red-400 shrink-0" />
                        <span style={{ color: "#991B1B" }}>내 답: <strong className="font-mono">{w.userAnswer}</strong></span>
                      </div>
                    </div>
                    {w.explanation && <div className="px-3 py-2.5 rounded-xl text-sm" style={{ background: "var(--secondary)", color: "var(--foreground)" }}>📖 {w.explanation}</div>}
                  </div>
              ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 px-4 rounded-2xl" style={{ background: "#ECFDF5" }}>
              <CheckCircle2 size={28} className="mx-auto mb-2" style={{ color: "#10B981" }} />
              <p className="font-bold" style={{ color: "#065F46" }}>선택한 범위의 오답을 모두 다시 맞혔어요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WrongAnswerReviewPage({ user, sessionWrongs, resolvedIds, onResolve, onBack }: {
  user: UserProfile;
  sessionWrongs: WrongAnswer[];
  resolvedIds: number[];
  onResolve: (qId: number) => void;
  onBack: () => void;
}) {
  const [backendWrongs, setBackendWrongs] = useState<WrongAnswer[]>([]);
  useEffect(() => { getWrongAnswers().then((list) => setBackendWrongs(list.map(mapWrongAnswer))).catch(() => {}); }, []);
  const allWrongs = dedupWrongs([...backendWrongs, ...sessionWrongs]);
  const reviewWrongs = allWrongs.filter(w => !resolvedIds.includes(w.qId));
  const [activeId, setActiveId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const active = reviewWrongs.find(w => w.qId === activeId) ?? reviewWrongs[0] ?? null;
  const answer = active ? answers[active.qId] ?? "" : "";

  const setAnswer = (value: string) => {
    if (!active) return;
    setAnswers(prev => ({ ...prev, [active.qId]: value }));
    setFeedback(null);
  };

  const submit = async () => {
    if (!active) return;
    setSubmitting(true);
    let correct = false;
    try {
      correct = (await submitAnswer(active.qId, answer)).correct;
    } catch {
      setFeedback("wrong");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    if (!correct) { setFeedback("wrong"); return; }
    onResolve(active.qId);
    setFeedback("correct");
    const next = reviewWrongs.find(w => w.qId !== active.qId);
    setActiveId(next?.qId ?? null);
  };

  const renderInput = () => {
    if (!active) return null;
    if (active.type === "mcq" && active.options) {
      return (
        <div className="grid gap-2">
          {active.options.map((option, index) => {
            const selected = answer === String(index);
            return (
              <button key={option} onClick={() => setAnswer(String(index))} className="text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all"
                style={{ borderColor: selected ? "var(--primary)" : "var(--border)", background: selected ? "var(--secondary)" : "#fff", color: selected ? "var(--primary)" : "var(--foreground)" }}>
                {option}
              </button>
            );
          })}
        </div>
      );
    }
    if (active.type === "code") {
      return (
        <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={8} spellCheck={false}
          className="w-full px-4 py-3 rounded-xl border-2 text-sm font-mono focus:outline-none resize-none"
          style={{ borderColor: "var(--border)", background: "#fff", color: "var(--foreground)" }}
          placeholder="정답 코드를 다시 작성해보세요." />
      );
    }
    return (
      <input value={answer} onChange={e => setAnswer(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none"
        style={{ borderColor: "var(--border)", background: "#fff", color: "var(--foreground)" }}
        placeholder="답을 입력하세요." />
    );
  };

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold mb-5" style={{ color: "var(--muted-foreground)" }}>
        <ArrowLeft size={16} />오답노트로
      </button>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: "var(--foreground)" }}>틀린 문제 복습하기</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>면접관 질문에 답하고 복습 목록을 줄여보세요.</p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "var(--secondary)", color: "var(--primary)" }}>{reviewWrongs.length}개 남음</span>
      </div>

      {active ? (
        <div className="grid gap-5 md:grid-cols-[230px_1fr]">
          <div className="bg-white rounded-2xl border border-border p-4 self-start">
            <img src={interviewerMascot} alt="복습 면접관" className="w-full rounded-xl aspect-square object-cover object-top" />
          </div>
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="relative rounded-2xl p-4 mb-5" style={{ background: "var(--secondary)" }}>
              <div className="hidden md:block absolute left-[-8px] top-8 w-4 h-4 rotate-45" style={{ background: "var(--secondary)" }} />
              <p className="text-sm font-bold mb-1" style={{ color: "var(--primary)" }}>면접관</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                {user.username}님, 이 문제를 다시 물어볼게요. 왜 이 답이 맞는지 생각하면서 풀어보세요.
              </p>
              <p className="text-base font-extrabold mt-3 leading-relaxed" style={{ color: "var(--foreground)" }}>{active.question}</p>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Badge type={active.type} />
              <span className="text-xs font-bold" style={{ color: LANG_META[active.language].color }}>{LANG_META[active.language].icon} {LANG_META[active.language].label}</span>
            </div>
            {renderInput()}
            {feedback === "wrong" && <div className="mt-3 px-3 py-2 rounded-xl text-sm font-semibold" style={{ background: "#FEF2F2", color: "#991B1B" }}>아직 아니에요. 정답 방향을 다시 떠올려보세요.</div>}
            {feedback === "correct" && <div className="mt-3 px-3 py-2 rounded-xl text-sm font-semibold" style={{ background: "#ECFDF5", color: "#065F46" }}>좋아요. 해결한 문제로 이동했습니다.</div>}
            <div className="flex flex-wrap gap-2 mt-5">
              <button onClick={submit} disabled={!answer.trim() || submitting} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50" style={{ background: "var(--primary)" }}>{submitting ? "채점 중..." : "답변 제출"}</button>
              {reviewWrongs.map(w => (
                <button key={w.qId} onClick={() => { setActiveId(w.qId); setFeedback(null); }} className="px-3 py-2 rounded-xl text-xs font-bold border-2"
                  style={{ borderColor: active.qId === w.qId ? "var(--primary)" : "var(--border)", color: active.qId === w.qId ? "var(--primary)" : "var(--muted-foreground)", background: active.qId === w.qId ? "var(--secondary)" : "#fff" }}>
                  #{w.qId}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <CheckCircle2 size={38} className="mx-auto mb-3" style={{ color: "#10B981" }} />
          <p className="font-extrabold text-lg" style={{ color: "var(--foreground)" }}>복습할 문제를 모두 해결했어요.</p>
          <button onClick={onBack} className="mt-5 px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "var(--primary)" }}>오답노트로 돌아가기</button>
        </div>
      )}
    </div>
  );
}

// ─── FRIENDS & GROUPS ────────────────────────────────────────────────────────

function FriendsPage({ user }: { user: UserProfile }) {
  const [tab, setTab] = useState<"friends" | "groups" | "search">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(MOCK_USERS);
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState(MOCK_GROUPS.find(g => g.joined)?.id ?? MOCK_GROUPS[0].id);

  const friends = users.filter(u => u.isFriend);
  const searchResults = users.filter(u => !u.isFriend && u.username.toLowerCase().includes(searchQuery.toLowerCase()));
  const selectedGroup = groups.find(g => g.id === selectedGroupId) ?? groups[0];
  const selectedGroupDetail = MOCK_GROUP_DETAILS[selectedGroup.id];
  const selectedGroupMembers: MockGroupMember[] = [
    { id: user.id, username: user.username, avatar: user.avatar, xp: user.xp, streak: user.streak, weeklySolved: Math.max(6, Math.round(user.completedLessons / 2)), progress: Math.min(100, Math.round((user.langXp[selectedGroup.language] / LANG_META[selectedGroup.language].maxXp) * 100)), online: true },
    ...selectedGroupDetail.members,
  ].sort((a, b) => b.weeklySolved - a.weeklySolved);

  const toggleFriend = (id: string) => setUsers(prev => prev.map(u => u.id === id ? { ...u, isFriend: !u.isFriend } : u));
  const toggleGroup = (id: string) => setGroups(prev => prev.map(g => g.id === id ? { ...g, joined: !g.joined } : g));

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-xl font-extrabold mb-1" style={{ color: "var(--foreground)" }}>친구 & 그룹</h1>
      <p className="text-sm mb-5" style={{ color: "var(--muted-foreground)" }}>함께 공부하고 성장해요</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[{ id: "friends", label: `친구 ${friends.length}` }, { id: "groups", label: "그룹" }, { id: "search", label: "검색" }].map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id as typeof tab)}
            className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all"
            style={{ borderColor: tab === id ? "var(--primary)" : "var(--border)", background: tab === id ? "var(--secondary)" : "#fff", color: tab === id ? "var(--primary)" : "var(--foreground)" }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "friends" && (
        <div className="space-y-2">
          {friends.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--secondary)" }}>
                <Users size={30} style={{ color: "var(--primary)" }} />
              </div>
              <p className="font-bold mb-1" style={{ color: "var(--foreground)" }}>아직 친구가 없어요</p>
              <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>검색 탭에서 닉네임으로 친구를 찾아보세요!</p>
              <button onClick={() => setTab("search")} className="px-5 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "var(--primary)" }}>
                친구 검색하기
              </button>
            </div>
          )}
          {friends.map(u => (
            <div key={u.id} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
              <Avatar initials={u.avatar} color={["#7C3AED", "#3B82F6", "#10B981", "#F59E0B", "#EC4899"][MOCK_USERS.indexOf(u) % 5]} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{u.username}</div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Lv.{u.level} · {u.xp.toLocaleString()} XP</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs font-bold mb-1" style={{ color: "var(--primary)" }}>{u.xp.toLocaleString()} XP</div>
                  <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-violet-400" style={{ width: `${(u.xp / 6000) * 100}%` }} />
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>주간 목표</div>
                </div>
                <button onClick={() => toggleFriend(u.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors" style={{ color: "#EF4444" }}><X size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "groups" && (
        <div className="space-y-4">
          <div className="grid gap-2">
            {groups.map(g => {
              const selected = selectedGroup.id === g.id;
              return (
                <button key={g.id} onClick={() => setSelectedGroupId(g.id)} className="bg-white rounded-2xl border p-4 flex items-center gap-3 text-left transition-all"
                  style={{ borderColor: selected ? LANG_META[g.language].color : "var(--border)", boxShadow: selected ? `0 6px 18px ${LANG_META[g.language].color}18` : "none" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg" style={{ background: LANG_META[g.language].color }}>{LANG_META[g.language].icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-sm truncate" style={{ color: "var(--foreground)" }}>{g.name}</div>
                      {g.joined && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: LANG_META[g.language].light, color: LANG_META[g.language].color }}>참여중</span>}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>멤버 {g.memberCount}명 · {LANG_META[g.language].label}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleGroup(g.id); }} className="px-4 py-1.5 rounded-xl text-xs font-bold border-2 transition-all"
                    style={{ borderColor: g.joined ? "#EF4444" : "var(--primary)", background: g.joined ? "#FEF2F2" : "var(--secondary)", color: g.joined ? "#EF4444" : "var(--primary)" }}>
                    {g.joined ? "탈퇴" : "참여"}
                  </button>
                </button>
              );
            })}
          </div>

          <section className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="font-extrabold text-base" style={{ color: "var(--foreground)" }}>{selectedGroup.name}</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>그룹원 진행 상황과 주간 학습량</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: LANG_META[selectedGroup.language].light, color: LANG_META[selectedGroup.language].color }}>
                {LANG_META[selectedGroup.language].label}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "주간 풀이", value: `${selectedGroupDetail.solved}/${selectedGroupDetail.weeklyGoal}`, icon: <CheckCircle2 size={16} />, color: "#10B981" },
                { label: "평균 연속", value: `${Math.round(selectedGroupMembers.reduce((sum, m) => sum + m.streak, 0) / selectedGroupMembers.length)}일`, icon: <Flame size={16} />, color: "#EF4444" },
                { label: "온라인", value: `${selectedGroupMembers.filter(m => m.online).length}명`, icon: <Users size={16} />, color: "var(--primary)" },
              ].map(item => (
                <div key={item.label} className="rounded-xl p-3" style={{ background: "var(--secondary)" }}>
                  <div className="flex items-center gap-1.5 text-xs font-bold mb-1" style={{ color: item.color }}>{item.icon}{item.label}</div>
                  <div className="font-extrabold text-base" style={{ color: "var(--foreground)" }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div className="h-2.5 rounded-full overflow-hidden mb-5" style={{ background: "var(--muted)" }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, (selectedGroupDetail.solved / selectedGroupDetail.weeklyGoal) * 100)}%`, background: LANG_META[selectedGroup.language].color }} />
            </div>

            <div className="space-y-3">
              {selectedGroupMembers.map((member, index) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-6 text-center text-xs font-extrabold" style={{ color: index === 0 ? "#F59E0B" : "var(--muted-foreground)" }}>{index + 1}</div>
                  <div className="relative">
                    <Avatar initials={member.avatar} size="sm" color={member.id === user.id ? "var(--primary)" : undefined} />
                    {member.online && <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: "#10B981" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold truncate" style={{ color: "var(--foreground)" }}>{member.username}{member.id === user.id ? " (나)" : ""}</span>
                      <span className="text-xs font-bold shrink-0" style={{ color: LANG_META[selectedGroup.language].color }}>{member.weeklySolved}문제</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs flex items-center gap-1" style={{ color: "#EF4444" }}><Flame size={12} />{member.streak}일</span>
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--primary)" }}><Zap size={12} />{member.xp.toLocaleString()} XP</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: "var(--muted)" }}>
                      <div className="h-full rounded-full" style={{ width: `${member.progress}%`, background: LANG_META[selectedGroup.language].color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "search" && (
        <div>
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3.5 top-3.5" style={{ color: "var(--muted-foreground)" }} />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="유저 닉네임 검색..." className="w-full pl-9 pr-4 py-3 rounded-xl border-2 text-sm focus:outline-none" style={{ borderColor: "var(--border)", background: "var(--input-background)" }} />
          </div>
          {searchQuery.length > 0 && (
            <div className="space-y-2">
              {searchResults.length === 0 && <p className="text-center py-8 text-sm" style={{ color: "var(--muted-foreground)" }}>"{searchQuery}" 검색 결과 없음</p>}
              {searchResults.map(u => (
                <div key={u.id} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
                  <Avatar initials={u.avatar} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{u.username}</div>
                    <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Lv.{u.level} · {u.xp.toLocaleString()} XP</div>
                  </div>
                  <button onClick={() => { toggleFriend(u.id); setSearchQuery(""); }} className="flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-bold text-white" style={{ background: "var(--primary)" }}>
                    <UserPlus size={13} />친구 추가
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────

function ProfilePage({ user, onUpgrade, onSave }: {
  user: UserProfile;
  onUpgrade: () => void;
  onSave: (patch: Pick<UserProfile, "username" | "email" | "avatar">) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar || user.username.slice(0, 2).toUpperCase());
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [activityPage, setActivityPage] = useState(0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthWindowEnd = new Date(today.getFullYear(), today.getMonth() - activityPage * 3, 0);
  const monthWindowStart = new Date(monthWindowEnd.getFullYear(), monthWindowEnd.getMonth() - 2, 1);
  const startOffset = (monthWindowStart.getDay() + 6) % 7;
  const activityStart = new Date(today);
  activityStart.setFullYear(monthWindowStart.getFullYear(), monthWindowStart.getMonth(), monthWindowStart.getDate() - startOffset);
  const endOffset = 6 - ((monthWindowEnd.getDay() + 6) % 7);
  const activityEnd = new Date(monthWindowEnd);
  activityEnd.setDate(monthWindowEnd.getDate() + endOffset);
  const activityWeeks = Math.round((activityEnd.getTime() - activityStart.getTime()) / 604800000) + 1;
  const formatActivityDate = (date: Date) => `${date.getMonth() + 1}월 ${date.getDate()}일`;
  const monthLabels = Array.from({ length: 3 }, (_, i) => `${new Date(monthWindowStart.getFullYear(), monthWindowStart.getMonth() + i, 1).getMonth() + 1}월`);
  const activityDays = Array.from({ length: activityWeeks * 7 }, (_, i) => {
    const date = new Date(activityStart);
    date.setDate(activityStart.getDate() + i);
    const daysAgo = Math.floor((today.getTime() - date.getTime()) / 86400000);
    const outOfRange = date < monthWindowStart || date > monthWindowEnd;
    const inStreak = !outOfRange && daysAgo >= 0 && daysAgo < user.streak;
    const count = outOfRange ? 0 : inStreak ? 1 + ((i + user.completedLessons) % 4) : ((i * 7 + user.xp) % 11 === 0 ? 1 : (i * 5 + user.completedLessons) % 17 === 0 ? 2 : 0);
    return { index: i, count, dateLabel: formatActivityDate(date), outOfRange };
  });
  const activityColors = ["#E5E1F8", "#C4B5FD", "#A78BFA", "#7C3AED", "#4C1D95"];
  const dayLabels = ["월", "화", "수", "목", "금", "토", "일"];

  const resetForm = () => {
    setUsername(user.username);
    setEmail(user.email);
    setAvatar(user.avatar || user.username.slice(0, 2).toUpperCase());
    setEditing(false);
    setSaved(false);
  };

  const saveProfile = async () => {
    const cleanUsername = username.trim() || user.username;
    const cleanEmail = email.trim() || user.email;
    const cleanAvatar = (avatar.trim() || cleanUsername.slice(0, 2)).slice(0, 2).toUpperCase();
    setSaving(true);
    setError("");
    try {
      await onSave({ username: cleanUsername, email: cleanEmail, avatar: cleanAvatar });
      setUsername(cleanUsername);
      setEmail(cleanEmail);
      setAvatar(cleanAvatar);
      setEditing(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch (e) {
      setError(e instanceof Error ? e.message : "프로필 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl border border-border p-6 mb-5">
        <div className="flex items-start gap-4 mb-5">
          <Avatar initials={user.avatar || user.username.slice(0, 2).toUpperCase()} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-extrabold text-lg truncate" style={{ color: "var(--foreground)" }}>{user.username}</div>
                <div className="text-sm truncate" style={{ color: "var(--muted-foreground)" }}>{user.email}</div>
                <div className="flex items-center gap-2 mt-2">
                  {user.tier === "premium" ? <PremiumBadge /> : <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium" style={{ color: "var(--muted-foreground)" }}>FREE 플랜</span>}
                  {saved && <span className="text-xs font-bold" style={{ color: "#10B981" }}>저장됨</span>}
                </div>
              </div>
              {!editing && (
                <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-xl text-xs font-bold border-2 shrink-0" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
                  프로필 수정
                </button>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <div className="rounded-2xl border border-border p-4 mb-5" style={{ background: "var(--input-background)" }}>
            <div className="grid gap-3 md:grid-cols-[0.7fr_1.3fr]">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted-foreground)" }}>아바타 이니셜</label>
                <input value={avatar} onChange={e => setAvatar(e.target.value.slice(0, 2).toUpperCase())} maxLength={2} className="w-full px-3 py-2.5 rounded-xl border-2 text-sm font-bold uppercase focus:outline-none" style={{ borderColor: "var(--border)", background: "#fff", color: "var(--foreground)" }} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted-foreground)" }}>닉네임</label>
                <input value={username} onChange={e => setUsername(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border-2 text-sm focus:outline-none" style={{ borderColor: "var(--border)", background: "#fff", color: "var(--foreground)" }} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted-foreground)" }}>이메일</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border-2 text-sm focus:outline-none" style={{ borderColor: "var(--border)", background: "#fff", color: "var(--foreground)" }} />
              </div>
            </div>
            {error && <p className="text-sm font-semibold mt-3" style={{ color: "#EF4444" }}>{error}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={saveProfile} disabled={saving} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60" style={{ background: "var(--primary)" }}>
                <Check size={15} />{saving ? "저장 중" : "저장"}
              </button>
              <button onClick={resetForm} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold border-2" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                <X size={15} />취소
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {[{ label: "총 XP", value: user.xp.toLocaleString(), color: "var(--primary)" }, { label: "연속 학습", value: `${user.streak}일`, color: "#F59E0B" }, { label: "완료 레슨", value: `${user.completedLessons}`, color: "#10B981" }].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl p-3 text-center" style={{ background: "var(--secondary)" }}>
              <div className="font-extrabold" style={{ color }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Language progress */}
      <div className="bg-white rounded-2xl border border-border p-5 mb-5">
        <h3 className="font-bold mb-4" style={{ color: "var(--foreground)" }}>언어별 진행도</h3>
        <div className="space-y-3">
          {(Object.entries(LANG_META) as [Language, typeof LANG_META[Language]][]).map(([lang, meta]) => (
            <div key={lang}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold">{meta.icon} {meta.label}</span>
                <span className="text-xs font-bold" style={{ color: meta.color }}>Lv.{meta.level} · {user.langXp[lang]} XP</span>
              </div>
              <XpBar current={user.langXp[lang]} max={meta.maxXp} color={meta.color} />
            </div>
          ))}
        </div>
      </div>

      {/* Learning activity */}
      <div className="bg-white rounded-2xl border border-border p-5 mb-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold" style={{ color: "var(--foreground)" }}>학습 잔디</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>완료된 최근 3개월 학습 기록</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setActivityPage(p => p + 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center" style={{ color: "var(--muted-foreground)", background: "#fff" }} aria-label="이전 3개월">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setActivityPage(p => Math.max(0, p - 1))} disabled={activityPage === 0} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center disabled:opacity-35" style={{ color: "var(--muted-foreground)", background: "#fff" }} aria-label="다음 3개월">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="rounded-2xl p-4 overflow-visible" style={{ background: "var(--input-background)" }}>
          <div className="ml-8 grid grid-cols-3 text-xs font-bold mb-2" style={{ color: "var(--muted-foreground)" }}>
            {monthLabels.map(label => <span key={label}>{label}</span>)}
          </div>
          <div className="grid grid-cols-[24px_1fr] gap-2 items-start">
            <div className="grid gap-1.5 h-full" style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}>
              {dayLabels.map((label, i) => (
                <span key={`${label}-${i}`} className="flex items-center justify-end text-[10px] leading-none" style={{ color: "var(--muted-foreground)" }}>{label}</span>
              ))}
            </div>
            <div className="grid grid-flow-col gap-1.5 w-full" style={{ gridTemplateColumns: `repeat(${activityWeeks}, minmax(0, 1fr))`, gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}>
              {activityDays.map(day => (
                <div
                  key={day.index}
                  className="group relative aspect-square min-w-0 rounded-[4px] border border-white/70 cursor-default"
                  style={{ background: activityColors[Math.min(day.count, activityColors.length - 1)], opacity: day.outOfRange ? 0.55 : 1 }}
                >
                  <div className="pointer-events-none absolute left-1/2 bottom-full z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-bold text-white shadow-lg group-hover:block" style={{ background: "var(--foreground)" }}>
                    {day.dateLabel} · {day.count}개 풀이
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 mt-4">
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>총 {activityDays.reduce((sum, day) => sum + (day.outOfRange ? 0 : day.count), 0)}개 학습 · {user.streak}일 연속</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>적음</span>
              {activityColors.map(color => <span key={color} className="w-3 h-3 rounded-[3px]" style={{ background: color }} />)}
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>많음</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade CTA for free users */}
      {user.tier === "free" && (
        <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "var(--primary)" }}>
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
          <Crown size={28} className="mb-3" />
          <h3 className="text-lg font-extrabold mb-1">프리미엄으로 업그레이드</h3>
          <p className="text-white/70 text-sm mb-4">AI 코드리뷰 · 오답노트 · 취약점 분석 · 문제 추천</p>
          <button onClick={onUpgrade} className="px-6 py-2.5 rounded-xl font-bold text-sm" style={{ background: "#fff", color: "var(--primary)" }}>
            업그레이드 →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN PAGE ──────────────────────────────────────────────────────────────

type AdminForm = {
  lessonId: number;
  type: "MULTIPLE_CHOICE" | "FILL_BLANK" | "SHORT_ANSWER" | "CODE" | "ESSAY";
  language: "PYTHON" | "JAVA" | "C" | "CPP";
  difficulty: number;
  title: string;
  description: string;
  answer: string;
  codeTemplate: string;
  testInput: string;
  expectedOutput: string;
  rubric: string;
  optionsJson: string;
  hint: string;
  explanation: string;
  tagsJson: string;
  testCasesJson: string;
  orderIndex: string;
};

const emptyAdminForm = (lessonId = 1): AdminForm => ({
  lessonId,
  type: "MULTIPLE_CHOICE",
  language: "PYTHON",
  difficulty: 1,
  title: "",
  description: "",
  answer: "",
  codeTemplate: "",
  testInput: "",
  expectedOutput: "",
  rubric: "",
  optionsJson: "[\"\", \"\", \"\", \"\"]",
  hint: "",
  explanation: "",
  tagsJson: "[]",
  testCasesJson: "[{\"input\":\"\", \"expected\":\"\"}]",
  orderIndex: "",
});

function AdminPage({ user }: { user: UserProfile }) {
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [problems, setProblems] = useState<AdminProblem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminForm>(emptyAdminForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedProblem = problems.find(problem => problem.id === selectedId) ?? null;

  const fillForm = (problem: AdminProblem) => {
    setSelectedId(problem.id);
    setForm({
      lessonId: problem.lessonId,
      type: problem.type as AdminForm["type"],
      language: problem.language as AdminForm["language"],
      difficulty: problem.difficulty,
      title: problem.title ?? "",
      description: problem.description ?? "",
      answer: problem.answer ?? "",
      codeTemplate: problem.codeTemplate ?? "",
      testInput: problem.testInput ?? "",
      expectedOutput: problem.expectedOutput ?? "",
      rubric: problem.rubric ?? "",
      optionsJson: problem.optionsJson ?? "[\"\", \"\", \"\", \"\"]",
      hint: problem.hint ?? "",
      explanation: problem.explanation ?? "",
      tagsJson: problem.tagsJson ?? "[]",
      testCasesJson: problem.testCasesJson ?? "[{\"input\":\"\", \"expected\":\"\"}]",
      orderIndex: String(problem.orderIndex),
    });
  };

  const loadAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      const [lessonList, problemList] = await Promise.all([getAdminLessons(), getAdminProblems()]);
      setLessons(lessonList);
      setProblems(problemList);
      if (!selectedId) setForm(emptyAdminForm(lessonList[0]?.id ?? 1));
    } catch (e) {
      setError(e instanceof Error ? e.message : "관리자 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const updateField = <K extends keyof AdminForm>(key: K, value: AdminForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validateJson = (label: string, value: string) => {
    if (!value.trim()) return;
    try {
      JSON.parse(value);
    } catch {
      throw new Error(`${label} JSON 형식이 올바르지 않습니다.`);
    }
  };

  const toPayload = (): AdminProblemPayload => {
    validateJson("선택지", form.optionsJson);
    validateJson("태그", form.tagsJson);
    validateJson("테스트케이스", form.testCasesJson);
    return {
      lessonId: form.lessonId,
      type: form.type,
      language: form.language,
      difficulty: form.difficulty,
      title: form.title.trim(),
      description: form.description.trim(),
      answer: form.answer.trim(),
      codeTemplate: form.codeTemplate,
      testInput: form.testInput,
      expectedOutput: form.expectedOutput,
      rubric: form.rubric,
      optionsJson: form.optionsJson,
      hint: form.hint,
      explanation: form.explanation,
      tagsJson: form.tagsJson,
      testCasesJson: form.testCasesJson,
      orderIndex: form.orderIndex.trim() ? Number(form.orderIndex) : undefined,
    };
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = toPayload();
      if (!payload.title || !payload.description) throw new Error("제목과 문제 설명은 필수입니다.");
      const saved = selectedId ? await updateAdminProblem(selectedId, payload) : await createAdminProblem(payload);
      setMessage(selectedId ? "문제를 수정했습니다." : "문제를 추가했습니다.");
      setProblems(await getAdminProblems());
      fillForm(saved);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId || !window.confirm("이 문제를 삭제할까요?")) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await deleteAdminProblem(selectedId);
      setSelectedId(null);
      setForm(emptyAdminForm(lessons[0]?.id ?? 1));
      setProblems(await getAdminProblems());
      setMessage("문제를 삭제했습니다.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-purple-400";
  const labelClass = "text-xs font-bold uppercase";

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: "var(--foreground)" }}>문제 관리</h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{user.email} 계정으로 DB 문제를 추가하고 수정합니다.</p>
          </div>
          <button onClick={() => { setSelectedId(null); setForm(emptyAdminForm(lessons[0]?.id ?? 1)); }} className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: "var(--primary)" }}>새 문제</button>
        </div>

        {loading ? (
          <div className="rounded-lg border border-border bg-white p-6 text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>불러오는 중...</div>
        ) : (
          <div className="grid lg:grid-cols-[360px_1fr] gap-5">
            <aside className="rounded-lg border border-border bg-white overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="font-bold" style={{ color: "var(--foreground)" }}>문제 목록</span>
                <button onClick={loadAdminData} className="text-xs font-bold" style={{ color: "var(--primary)" }}>새로고침</button>
              </div>
              <div className="max-h-[720px] overflow-auto">
                {problems.map(problem => (
                  <button key={problem.id} onClick={() => fillForm(problem)} className="w-full text-left p-4 border-b border-border transition-colors" style={{ background: selectedId === problem.id ? "var(--secondary)" : "#fff" }}>
                    <div className="flex items-center gap-2 text-xs font-bold mb-1" style={{ color: "var(--primary)" }}>
                      <span>{problem.language}</span><span>{problem.difficulty}</span><span>#{problem.orderIndex}</span><span>{problem.type}</span>
                    </div>
                    <div className="font-bold text-sm line-clamp-1" style={{ color: "var(--foreground)" }}>{problem.title}</div>
                    <div className="text-xs mt-1 line-clamp-2" style={{ color: "var(--muted-foreground)" }}>{problem.description}</div>
                  </button>
                ))}
              </div>
            </aside>

            <section className="rounded-lg border border-border bg-white p-5">
              <div className="grid md:grid-cols-4 gap-3 mb-4">
                <div>
                  <label className={labelClass}>레슨</label>
                  <select className={inputClass} value={form.lessonId} onChange={e => updateField("lessonId", Number(e.target.value))}>
                    {lessons.map(lesson => <option key={lesson.id} value={lesson.id}>{lesson.language} · {lesson.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>언어</label>
                  <select className={inputClass} value={form.language} onChange={e => updateField("language", e.target.value as AdminForm["language"])}>
                    {["PYTHON", "JAVA", "C", "CPP"].map(lang => <option key={lang}>{lang}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>난이도</label>
                  <input className={inputClass} type="number" min={1} max={9} value={form.difficulty} onChange={e => updateField("difficulty", Number(e.target.value))} />
                </div>
                <div>
                  <label className={labelClass}>순서</label>
                  <input className={inputClass} type="number" placeholder="자동" value={form.orderIndex} onChange={e => updateField("orderIndex", e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className={labelClass}>타입</label>
                  <select className={inputClass} value={form.type} onChange={e => updateField("type", e.target.value as AdminForm["type"])}>
                    {["MULTIPLE_CHOICE", "FILL_BLANK", "SHORT_ANSWER", "CODE", "ESSAY"].map(type => <option key={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>정답</label>
                  <input className={inputClass} value={form.answer} onChange={e => updateField("answer", e.target.value)} placeholder="객관식은 0~3 인덱스, 단답형은 정답 문자열" />
                </div>
              </div>

              <div className="mb-4">
                <label className={labelClass}>제목</label>
                <input className={inputClass} value={form.title} onChange={e => updateField("title", e.target.value)} />
              </div>
              <div className="mb-4">
                <label className={labelClass}>문제 설명</label>
                <textarea className={`${inputClass} min-h-24`} value={form.description} onChange={e => updateField("description", e.target.value)} />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div><label className={labelClass}>선택지 JSON</label><textarea className={`${inputClass} min-h-24 font-mono`} value={form.optionsJson} onChange={e => updateField("optionsJson", e.target.value)} /></div>
                <div><label className={labelClass}>태그 JSON</label><textarea className={`${inputClass} min-h-24 font-mono`} value={form.tagsJson} onChange={e => updateField("tagsJson", e.target.value)} /></div>
                <div><label className={labelClass}>힌트</label><textarea className={`${inputClass} min-h-24`} value={form.hint} onChange={e => updateField("hint", e.target.value)} /></div>
                <div><label className={labelClass}>해설</label><textarea className={`${inputClass} min-h-24`} value={form.explanation} onChange={e => updateField("explanation", e.target.value)} /></div>
                <div className="md:col-span-2"><label className={labelClass}>코드 템플릿</label><textarea className={`${inputClass} min-h-36 font-mono`} value={form.codeTemplate} onChange={e => updateField("codeTemplate", e.target.value)} /></div>
                <div><label className={labelClass}>공개 예시 입력</label><textarea className={`${inputClass} min-h-20 font-mono`} value={form.testInput} onChange={e => updateField("testInput", e.target.value)} /></div>
                <div><label className={labelClass}>공개 예시 출력</label><textarea className={`${inputClass} min-h-20 font-mono`} value={form.expectedOutput} onChange={e => updateField("expectedOutput", e.target.value)} /></div>
                <div className="md:col-span-2"><label className={labelClass}>숨김 테스트케이스 JSON</label><textarea className={`${inputClass} min-h-32 font-mono`} value={form.testCasesJson} onChange={e => updateField("testCasesJson", e.target.value)} placeholder='[{"input":"2 3","expected":"5"}]' /></div>
                <div className="md:col-span-2"><label className={labelClass}>서술형 루브릭</label><textarea className={`${inputClass} min-h-24`} value={form.rubric} onChange={e => updateField("rubric", e.target.value)} /></div>
              </div>

              {(message || error) && <div className="mt-4 rounded-lg p-3 text-sm font-bold" style={{ background: error ? "#FEF2F2" : "#ECFDF5", color: error ? "#DC2626" : "#047857" }}>{error || message}</div>}

              <div className="flex items-center justify-between mt-5">
                <button onClick={handleDelete} disabled={!selectedProblem || saving} className="px-4 py-2 rounded-lg text-sm font-bold border border-red-200 disabled:opacity-40" style={{ color: "#DC2626" }}>삭제</button>
                <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-60" style={{ background: "var(--primary)" }}>{saving ? "저장 중..." : selectedProblem ? "수정 저장" : "문제 추가"}</button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── UPGRADE PAGE ─────────────────────────────────────────────────────────────

function UpgradePage({ onBack, onUpgrade }: { onBack: () => void; onUpgrade: () => void }) {
  const [selected, setSelected] = useState<"monthly" | "yearly">("yearly");
  return (
    <div className="px-6 py-8 max-w-xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold mb-6" style={{ color: "var(--muted-foreground)" }}><ArrowLeft size={16} />돌아가기</button>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)" }}>
          <Crown size={30} className="text-white" />
        </div>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: "var(--foreground)" }}>CodeDuo 프리미엄</h1>
        <p style={{ color: "var(--muted-foreground)" }}>더 빠르게 성장하세요</p>
      </div>

      {/* Features comparison */}
      <div className="bg-white rounded-2xl border border-border p-5 mb-5">
        {[
          { label: "기본 채점 및 해설", free: true, premium: true },
          { label: "오답노트 (전체 이력)", free: false, premium: true },
          { label: "AI 코드 리뷰", free: false, premium: true },
          { label: "취약점 분석 레이더 차트", free: false, premium: true },
          { label: "문제 추천 알고리즘", free: false, premium: true },
          { label: "친구 & 그룹 기능", free: true, premium: true },
        ].map(({ label, free, premium }) => (
          <div key={label} className="flex items-center py-2.5 border-b border-border last:border-0">
            <span className="flex-1 text-sm font-medium" style={{ color: "var(--foreground)" }}>{label}</span>
            <div className="flex gap-10">
              <div className="w-14 text-center">{free ? <Check size={16} className="mx-auto text-emerald-500" /> : <X size={16} className="mx-auto text-muted-foreground opacity-30" />}</div>
              <div className="w-14 text-center">{premium ? <Check size={16} className="mx-auto text-emerald-500" /> : null}</div>
            </div>
          </div>
        ))}
        <div className="flex justify-end mt-1 gap-10 text-xs font-bold pt-1">
          <div className="w-14 text-center" style={{ color: "var(--muted-foreground)" }}>FREE</div>
          <div className="w-14 text-center" style={{ color: "var(--primary)" }}>PREMIUM</div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { id: "monthly" as const, label: "월간", price: "₩9,900", sub: "/월" },
          { id: "yearly" as const, label: "연간", price: "₩79,900", sub: "/년 (33% 할인)", badge: "BEST" },
        ].map(({ id, label, price, sub, badge }) => (
          <button key={id} onClick={() => setSelected(id)}
            className="rounded-2xl p-4 text-left border-2 transition-all relative"
            style={{ borderColor: selected === id ? "var(--primary)" : "var(--border)", background: selected === id ? "var(--secondary)" : "#fff" }}>
            {badge && <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "var(--primary)" }}>{badge}</span>}
            <div className="font-bold mb-1" style={{ color: "var(--foreground)" }}>{label}</div>
            <div className="font-extrabold text-lg" style={{ color: "var(--primary)" }}>{price}</div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{sub}</div>
          </button>
        ))}
      </div>

      <button onClick={onUpgrade} className="w-full py-4 rounded-2xl font-bold text-white text-base" style={{ background: "linear-gradient(135deg, var(--primary), #A855F7)" }}>
        지금 시작하기 →
      </button>
      <p className="text-xs text-center mt-3" style={{ color: "var(--muted-foreground)" }}>언제든 취소 가능 · 첫 7일 무료 체험</p>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const initialQuery = parseRouteQuery();
  const initialScreen = PATH_SCREENS[window.location.pathname] ?? "login";
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedLang, setSelectedLang] = useState<Language>(initialQuery.lang ?? "python");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(initialQuery.difficulty ?? "beginner");
  const [lessonResult, setLessonResult] = useState<{ correct: number; total: number; wrongs: WrongAnswer[] } | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [sessionWrongs, setSessionWrongs] = useState<WrongAnswer[]>([]);
  const [resolvedWrongIds, setResolvedWrongIds] = useState<number[]>([]);

  const makeLangXp = () => Object.fromEntries((Object.keys(LANG_META) as Language[]).map(l => [l, 0])) as Record<Language, number>;

  const profileFromBackend = (u: BackendUser): UserProfile => {
    const tier: Tier = String(u.tier).toLowerCase().includes("premium") ? "premium" : "free";
    return {
      id: String(u.id),
      username: u.nickname,
      email: u.email,
      tier,
      xp: u.xp,
      streak: u.streak,
      hearts: u.hearts,
      completedLessons: 24,
      langXp: makeLangXp(),
      friendIds: [],
      groupIds: [],
      avatar: u.avatar || u.nickname.slice(0, 2).toUpperCase(),
    };
  };

  // 백엔드가 계산한 언어별 XP로 갱신 (정답 제출 기반)
  const refreshLangXp = async () => {
    try {
      const langXp = await getLanguageXp();
      setUser((p) => (p ? { ...p, langXp: { ...p.langXp, ...(langXp as Record<Language, number>) } } : p));
    } catch { /* 백엔드 미연결 시 무시 */ }
  };

  const [upgradeReturnScreen, setUpgradeReturnScreen] = useState<Screen>("profile");

  const buildRoute = (next: Screen, query: { lang?: Language; difficulty?: Difficulty } = {}) => {
    const params = new URLSearchParams();
    const learningScreen = ["home", "lessonSelect", "lesson", "result"].includes(next);
    if (learningScreen) params.set("lang", query.lang ?? selectedLang);
    if (next === "lesson") params.set("difficulty", query.difficulty ?? selectedDifficulty);
    const queryString = params.toString();
    return `${SCREEN_PATHS[next]}${queryString ? `?${queryString}` : ""}`;
  };

  const navigate = (next: Screen, replace = false, query: { lang?: Language; difficulty?: Difficulty } = {}) => {
    setScreen(next);
    const path = buildRoute(next, query);
    const current = `${window.location.pathname}${window.location.search}`;
    if (current !== path) {
      const state = { screen: next };
      if (replace) window.history.replaceState(state, "", path);
      else window.history.pushState(state, "", path);
    }
  };

  const handleLangChange = (lang: Language) => {
    setSelectedLang(lang);
    navigate(screen, true, { lang });
  };

  const openUpgrade = (from: Screen) => {
    setUpgradeReturnScreen(from);
    navigate("upgrade");
  };

  useEffect(() => {
    const onPopState = () => {
      const query = parseRouteQuery();
      setScreen(PATH_SCREENS[window.location.pathname] ?? "login");
      if (query.lang) setSelectedLang(query.lang);
      if (query.difficulty) setSelectedDifficulty(query.difficulty);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/") navigate("login", true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const restoreSession = async () => {
      let restored: UserProfile | null = null;
      if (hasToken()) {
        try {
          restored = profileFromBackend(await getMe());
        } catch {
          clearToken();
        }
      }
      if (cancelled) return;

      if (restored) {
        setUser(restored);
        refreshLangXp();
        if (screen === "login" || screen === "register") navigate("home", true);
      } else if (screen !== "login" && screen !== "register") {
        navigate("login", true);
      }
      setAuthLoading(false);
    };

    restoreSession();
    return () => { cancelled = true; };
  }, []);

  const handleLogin = async (email: string, password: string, mode: "login" | "register", username: string) => {
    // 실제 백엔드 로그인/회원가입만 허용(DB에 있는 계정만). 에러는 AuthScreen이 표시.
    const u = mode === "register" ? await apiSignup(email, password, username) : await apiLogin(email, password);
    const profile = profileFromBackend(u);
    setUser(profile);
    navigate("home");
    refreshLangXp();
  };

  const handleComplete = (correct: number, total: number, wrongs: WrongAnswer[], earned: number) => {
    setXpEarned(earned);
    setSessionWrongs(prev => [...prev, ...wrongs]);
    if (user) setUser(u => u ? {
      ...u,
      xp: u.xp + earned,
      completedLessons: u.completedLessons + 1,
      langXp: { ...u.langXp, [selectedLang]: u.langXp[selectedLang] + earned },
    } : u);
    setLessonResult({ correct, total, wrongs });
    navigate("result");
    // 백엔드에 저장된 최신 XP/스트릭으로 동기화
    getMe().then((u) => setUser((p) => (p ? { ...p, xp: u.xp, streak: u.streak, hearts: u.hearts } : p))).catch(() => {});
    refreshLangXp();
  };

  const handleLogout = () => {
    setUser(null);
    clearToken();
    navigate("login");
  };
  const handleUpgrade = () => {
    if (user) setUser(u => u ? { ...u, tier: "premium" } : u);
    navigate(upgradeReturnScreen);
  };
  const handleProfileSave = async (patch: Pick<UserProfile, "username" | "email" | "avatar">) => {
    try {
      const updated = await apiUpdateProfile({ nickname: patch.username, email: patch.email, avatar: patch.avatar });
      setUser(u => {
        if (!u) return u;
        return { ...u, username: updated.nickname, email: updated.email, avatar: updated.avatar };
      });
    } catch (e) {
      if (!user?.id || user.id === "me") {
        setUser(u => {
          if (!u) return u;
          return { ...u, ...patch };
        });
        return;
      }
      throw e;
    }
  };
  const handleResolveWrong = (qId: number) => {
    setResolvedWrongIds(prev => prev.includes(qId) ? prev : [...prev, qId]);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-sm font-semibold" style={{ color: "var(--muted-foreground)", background: "var(--background)" }}>불러오는 중...</div>;
  }

  if (screen === "login" || screen === "register" || !user) {
    return <AuthScreen mode={authMode} onSwitch={() => setAuthMode(m => m === "login" ? "register" : "login")} onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (screen) {
      case "home":     return <HomePage user={user} onStartLesson={() => navigate("lessonSelect")} selectedLang={selectedLang} setSelectedLang={handleLangChange} onNav={navigate} />;
      case "lessonSelect": return <LessonSelectPage user={user} selectedLang={selectedLang} setSelectedLang={handleLangChange} onStart={(d) => { setSelectedDifficulty(d); navigate("lesson", false, { difficulty: d }); }} onBack={() => navigate("home")} />;
      case "lesson":   return <LessonPage user={user} selectedLang={selectedLang} difficulty={selectedDifficulty} onComplete={handleComplete} onBack={() => navigate("lessonSelect")} />;
      case "result":   return <ResultPage user={user} correct={lessonResult?.correct ?? 0} total={lessonResult?.total ?? 0} xpEarned={xpEarned} wrongs={lessonResult?.wrongs ?? []} selectedLang={selectedLang} onHome={() => navigate("home")} onRetry={() => navigate("lesson", false, { difficulty: selectedDifficulty })} onUpgrade={() => openUpgrade("result")} />;
      case "analytics":return <AnalyticsPage user={user} onUpgrade={() => openUpgrade("analytics")} />;
      case "errors":   return <ErrorNotebookPage user={user} sessionWrongs={sessionWrongs} resolvedIds={resolvedWrongIds} onReview={() => navigate("wrongReview")} onUpgrade={() => openUpgrade("errors")} />;
      case "wrongReview": return <WrongAnswerReviewPage user={user} sessionWrongs={sessionWrongs} resolvedIds={resolvedWrongIds} onResolve={handleResolveWrong} onBack={() => navigate("errors")} />;
      case "friends":  return <FriendsPage user={user} />;
      case "profile":  return <ProfilePage user={user} onUpgrade={() => openUpgrade("profile")} onSave={handleProfileSave} />;
      case "admin":    return isAdminUser(user) ? <AdminPage user={user} /> : <HomePage user={user} onStartLesson={() => navigate("lessonSelect")} selectedLang={selectedLang} setSelectedLang={handleLangChange} onNav={navigate} />;
      case "upgrade":  return <UpgradePage onBack={() => navigate(upgradeReturnScreen)} onUpgrade={handleUpgrade} />;
      default:         return null;
    }
  };

  const showNav = !["lesson", "result", "upgrade"].includes(screen);

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "Outfit, sans-serif", background: "var(--background)" }}>
      {/* Desktop sidebar */}
      {showNav && <Sidebar screen={screen} onNav={navigate} user={user} onLogout={handleLogout} />}

      {/* Main content — add bottom padding on mobile so tab bar doesn't overlap */}
      <main className={`flex-1 overflow-y-auto ${showNav ? "pb-20 md:pb-0" : ""}`}>
        {renderContent()}
      </main>

      {/* Mobile bottom tab bar */}
      {showNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border flex items-center" style={{ background: "#ffffff" }}>
          {[
            { id: "home",      label: "홈",    icon: Home,        premium: false },
            { id: "lessonSelect", label: "레슨", icon: BookOpen,  premium: false },
            { id: "errors",    label: "오답",  icon: NotebookPen, premium: true  },
            { id: "analytics", label: "분석",  icon: BarChart2,   premium: true  },
            { id: "friends",   label: "친구",  icon: Users,       premium: false },
            { id: "profile",   label: "나",    icon: User,        premium: false },
          ].map(({ id, label, icon: Icon, premium }) => {
            const active = screen === id;
            const locked = premium && user.tier === "free";
            return (
              <button
                key={id}
                onClick={() => navigate(id as Screen)}
                className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors"
                style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}
              >
                <div className="relative">
                  <Icon size={20} />
                  {locked && <Lock size={9} className="absolute -top-0.5 -right-1" style={{ color: "var(--muted-foreground)" }} />}
                </div>
                <span className="text-[10px] font-semibold">{label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
