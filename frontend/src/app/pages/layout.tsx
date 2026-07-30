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

export function Sidebar({ screen, onNav, user, onLogout }: { screen: Screen; onNav: (s: Screen) => void; user: UserProfile; onLogout: () => void; }) {
  const visibleNavItems = NAV_ITEMS.filter(item => !("adminOnly" in item) || isAdminUser(user));

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border bg-white" style={{ minHeight: "100vh" }}>
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-5 border-b border-border">
        <img src={codeduoLogo} alt="CodeDuo" className="h-11 w-auto object-contain" />
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
