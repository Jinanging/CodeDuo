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

// ─── PROFILE ─────────────────────────────────────────────────────────────────

export function ProfilePage({ user, onUpgrade, onSave }: {
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
  const [activityCounts, setActivityCounts] = useState<Record<string, number>>({});
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthWindowEnd = activityPage === 0
    ? new Date(today)
    : new Date(today.getFullYear(), today.getMonth() - activityPage * 3 + 1, 0);
  const monthWindowStart = new Date(monthWindowEnd.getFullYear(), monthWindowEnd.getMonth() - 2, 1);
  const startOffset = (monthWindowStart.getDay() + 6) % 7;
  const activityStart = new Date(today);
  activityStart.setFullYear(monthWindowStart.getFullYear(), monthWindowStart.getMonth(), monthWindowStart.getDate() - startOffset);
  const endOffset = 6 - ((monthWindowEnd.getDay() + 6) % 7);
  const activityEnd = new Date(monthWindowEnd);
  activityEnd.setDate(monthWindowEnd.getDate() + endOffset);
  const activityWeeks = Math.round((activityEnd.getTime() - activityStart.getTime()) / 604800000) + 1;
  const formatActivityDate = (date: Date) => `${date.getMonth() + 1}월 ${date.getDate()}일`;
  const formatActivityKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const monthLabels = Array.from({ length: 3 }, (_, i) => `${new Date(monthWindowStart.getFullYear(), monthWindowStart.getMonth() + i, 1).getMonth() + 1}월`);
  const queryStartKey = formatActivityKey(monthWindowStart);
  const queryEndKey = formatActivityKey(monthWindowEnd);
  useEffect(() => {
    let cancelled = false;
    getLearningActivity(queryStartKey, queryEndKey)
      .then(days => {
        if (cancelled) return;
        setActivityCounts(Object.fromEntries(days.map(day => [day.date, day.count])));
      })
      .catch(() => {
        if (!cancelled) setActivityCounts({});
      });
    return () => { cancelled = true; };
  }, [queryStartKey, queryEndKey]);
  const activityDays = Array.from({ length: activityWeeks * 7 }, (_, i) => {
    const date = new Date(activityStart);
    date.setDate(activityStart.getDate() + i);
    const outOfRange = date < monthWindowStart || date > monthWindowEnd;
    const count = outOfRange ? 0 : activityCounts[formatActivityKey(date)] ?? 0;
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

  const handleProfileImage = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 첨부할 수 있습니다.");
      return;
    }
    if (file.size > 700_000) {
      setError("프로필 사진은 700KB 이하로 첨부해주세요.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setError("");
      setAvatar(String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    const cleanUsername = username.trim() || user.username;
    const cleanEmail = email.trim() || user.email;
    const avatarValue = avatar.trim();
    const cleanAvatar = avatarValue.startsWith("data:image/") || avatarValue.startsWith("http://") || avatarValue.startsWith("https://")
      ? avatarValue
      : (avatarValue || cleanUsername.slice(0, 2)).slice(0, 2).toUpperCase();
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
                <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted-foreground)" }}>프로필 사진</label>
                <div className="flex items-center gap-3">
                  <Avatar initials={avatar || username.slice(0, 2).toUpperCase()} />
                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={event => handleProfileImage(event.target.files?.[0])}
                      className="w-full text-xs"
                      style={{ color: "var(--muted-foreground)" }}
                    />
                    <button
                      type="button"
                      onClick={() => setAvatar(username.slice(0, 2).toUpperCase())}
                      className="text-xs font-bold mt-1"
                      style={{ color: "var(--primary)" }}
                    >
                      이니셜로 사용
                    </button>
                  </div>
                </div>
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
          {[{ label: "총 XP", value: user.xp.toLocaleString(), color: "var(--primary)" }, { label: "연속 학습", value: `${user.streak}일`, color: "#F59E0B" }, { label: "해결한 문제", value: `${user.totalSolved}`, color: "#10B981" }].map(({ label, value, color }) => (
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
          {(Object.entries(LANG_META) as [Language, typeof LANG_META[Language]][]).map(([lang, meta]) => {
            const progress = languageLevelProgress(user.langXp[lang], meta.maxXp);
            return (
              <div key={lang}>
                <div className="flex justify-between items-center mb-1">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold"><LanguageIcon language={lang} size={18} />{meta.label}</span>
                  <span className="text-xs font-bold" style={{ color: meta.color }}>Lv.{progress.level} · {user.langXp[lang]} XP</span>
                </div>
                <XpBar current={progress.currentXp} max={meta.maxXp} color={meta.color} />
              </div>
            );
          })}
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
