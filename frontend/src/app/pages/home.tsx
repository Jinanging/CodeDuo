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

// ─── HOME ─────────────────────────────────────────────────────────────────────

export function HomePage({ user, onStartLesson, selectedLang, setSelectedLang, onNav }: {
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
  const selectedQuestions = langProblems.filter(hasKnownTopic);
  const recommended = selectedQuestions.slice(0, 3);
  const todayLabel = ["일", "월", "화", "수", "목", "금", "토"][new Date().getDay()];
  const todaySolved = user.weeklyActivity.find(item => item.day === todayLabel)?.solved ?? 0;
  const weeklySolved = user.weeklyActivity.reduce((sum, item) => sum + item.solved, 0);
  const maxDailySolved = Math.max(1, ...user.weeklyActivity.map(item => item.solved));
  const todayMissions = [
    { label: "오늘 문제 3개 풀기", done: Math.min(todaySolved, 3), total: 3, icon: <BookOpen size={16} />, color: langMeta.color },
    { label: "이번 주 문제 5개 풀기", done: Math.min(weeklySolved, 5), total: 5, icon: <Terminal size={16} />, color: "#10B981" },
    { label: "연속 학습 유지", done: user.streak > 0 ? 1 : 0, total: 1, icon: <Flame size={16} />, color: "#EF4444" },
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
          const progress = languageLevelProgress(user.langXp[lang], meta.maxXp);
          return (
            <button key={lang} onClick={() => setSelectedLang(lang)} className="rounded-2xl p-4 text-left border-2 transition-all" style={{ background: sel ? meta.light : "#fff", borderColor: sel ? meta.color : "var(--border)", transform: sel ? "translateY(-2px)" : "none", boxShadow: sel ? `0 4px 16px ${meta.color}25` : "none" }}>
              <LanguageIcon language={lang} size={32} className="mb-2" />
              <div className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{meta.label}</div>
              <div className="text-xs font-semibold mb-2" style={{ color: meta.color }}>Lv.{progress.level}</div>
              <XpBar current={progress.currentXp} max={meta.maxXp} color={meta.color} />
              <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>{user.langXp[lang]} XP</div>
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
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-white mb-1"><LanguageIcon language={selectedLang} size={28} />{langMeta.label} 기초 다지기</h2>
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
              { label: "총 풀이", value: `${user.totalSolved}`, icon: <Trophy size={18} />, color: "#F59E0B" },
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
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>이번 주 풀이 수</p>
              </div>
              <TrendingUp size={18} style={{ color: "var(--accent)" }} />
            </div>
            <div className="grid grid-cols-7 gap-2 items-end h-28">
              {user.weeklyActivity.map(item => (
                <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-semibold" style={{ color: item.solved > 0 ? "var(--foreground)" : "var(--muted-foreground)" }}>{item.solved}</span>
                  <div className="w-full rounded-t-lg min-h-[10px]" style={{ height: `${Math.max(10, (item.solved / maxDailySolved) * 72)}px`, background: item.solved > 0 ? langMeta.color : "var(--muted)" }} />
                  <span className="text-xs font-semibold" style={{ color: item.solved > 0 ? "var(--foreground)" : "var(--muted-foreground)" }}>{item.day}</span>
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
