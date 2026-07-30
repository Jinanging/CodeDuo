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

// ─── UPGRADE PAGE ─────────────────────────────────────────────────────────────

export function UpgradePage({ onBack, onUpgrade }: { onBack: () => void; onUpgrade: () => void }) {
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
