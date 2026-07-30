import { useEffect, useRef, useState } from "react";
import {
  Flame, Heart, Zap, Trophy, Code2, BookOpen, CheckCircle2, XCircle,
  ChevronRight, ChevronLeft, RotateCcw, Terminal, Lightbulb, Play, ArrowLeft,
  Users, BarChart2, Lock, Crown, LogOut, UserPlus, Search, X, Check,
  AlertTriangle, Sparkles, User, Home, NotebookPen,
  TrendingUp, Eye, EyeOff, Mic, Volume2, BriefcaseBusiness,
  Loader2, ShieldCheck, CircleStop,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from "recharts";
import {
  submitAnswer, getAiHint, fetchAnalytics, getProblems, getWrongAnswers,
  fetchAiLearningReport, getLearningActivity,
  getFriends as apiGetFriends, addFriend as apiAddFriend, removeFriend as apiRemoveFriend,
  acceptFriend as apiAcceptFriend, rejectFriendRequest as apiRejectFriendRequest, getFriendRequests as apiGetFriendRequests,
  joinGroup as apiJoinGroup, leaveGroup as apiLeaveGroup, getGroupDetail as apiGetGroupDetail, searchFriends as apiSearchFriends,
  searchGroups as apiSearchGroups, createGroup as apiCreateGroup, acceptGroupRequest as apiAcceptGroupRequest, rejectGroupRequest as apiRejectGroupRequest,
  getAdminLessons, getAdminProblems, createAdminProblem, updateAdminProblem, deleteAdminProblem,
  startInterview, submitInterviewAnswer, getInterviewHistory,
  type BackendProblem, type BackendWrongAnswer, type BackendAnalytics,
  type AiLearningReport,
  type BackendFriend, type BackendFriendsResponse, type BackendGroupDetail, type BackendStudyGroup,
  type InterviewSession, type InterviewTurn,
  type AdminLesson, type AdminProblem, type AdminProblemPayload,
} from "../api";
import codeduoLogo from "../../assets/codeduo-logo.svg";
import interviewerMascot from "../../assets/interviewer-mascot.png";
import type { Difficulty, FriendUser, Language, Question, QuestionType, Screen, StudyGroupView, TestCase, UserProfile, WrongAnswer } from "../types";
import {
  DIFFICULTY_META, EMPTY_WEAKNESS_DATA, LANG_META, TOPICS_BY_LANGUAGE,
  TYPE_META, TYPE_XP, firstTopicFor, hasKnownTopic, isAdminUser, isLanguage,
  languageFromSubject, languageFromText, topicForQuestion,
} from "../constants";
import { Avatar, Badge, CodeEditor, LanguageIcon, LockOverlay, PremiumBadge, PublicExamples, TestResultPanel, XpBar, languageLevelProgress } from "../components/shared";

import { DIFF_NUM, NUM_DIFF, dedupWrongs, mapProblem, mapWrongAnswer } from "./problemMappers";

// ─── LOGIN / REGISTER ─────────────────────────────────────────────────────────

export function AuthScreen({
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
        <div className="flex items-center">
          <img src={codeduoLogo} alt="CodeDuo" className="h-16 w-auto object-contain brightness-0 invert" />
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
            <img src={codeduoLogo} alt="CodeDuo" className="h-11 w-auto object-contain" />
          </div>

          {mode === "register" && (
            <button
              type="button"
              onClick={onSwitch}
              className="inline-flex items-center gap-1.5 mb-5 px-3 py-2 -ml-3 rounded-xl text-sm font-bold transition-colors hover:bg-white"
              style={{ color: "var(--muted-foreground)" }}
            >
              <ArrowLeft size={17} />
              로그인으로 돌아가기
            </button>
          )}

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
