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

// ─── LESSON SELECT (난이도 선택) ────────────────────────────────────────────────

export function LessonSelectPage({ selectedLang, setSelectedLang, selectedTopic, setSelectedTopic, onStart, onBack }: {
  selectedLang: Language;
  setSelectedLang: (l: Language) => void;
  selectedTopic: string | null;
  setSelectedTopic: (topic: string | null) => void;
  onStart: (d: Difficulty, topic?: string | null) => void; onBack: () => void;
}) {
  const [counts, setCounts] = useState<Record<Difficulty, number>>({ beginner: 0, intermediate: 0, advanced: 0 });
  const [topicCounts, setTopicCounts] = useState<Record<string, Record<Difficulty, number>>>({});
  useEffect(() => {
    let cancelled = false;
    getProblems(selectedLang).then((list) => {
      if (cancelled) return;
      const c: Record<Difficulty, number> = { beginner: 0, intermediate: 0, advanced: 0 };
      const byTopic: Record<string, Record<Difficulty, number>> = {};
      const parseTags = (tagsJson?: string) => {
        try { return tagsJson ? JSON.parse(tagsJson) as string[] : []; } catch { return []; }
      };
      for (const p of list) {
        const d = NUM_DIFF[p.difficulty];
        if (!d) continue;
        c[d]++;
        const topic = parseTags(p.tagsJson)[0] ?? "기타";
        byTopic[topic] ??= { beginner: 0, intermediate: 0, advanced: 0 };
        byTopic[topic][d]++;
      }
      setCounts(c);
      setTopicCounts(byTopic);
    }).catch(() => {
      if (!cancelled) {
        setCounts({ beginner: 0, intermediate: 0, advanced: 0 });
        setTopicCounts({});
      }
    });
    return () => { cancelled = true; };
  }, [selectedLang]);
  const langMeta = LANG_META[selectedLang];
  const topics = TOPICS_BY_LANGUAGE[selectedLang];
  const activeTopic = selectedTopic && topics.includes(selectedTopic) ? selectedTopic : topics[0];
  const activeCounts = topicCounts[activeTopic] ?? { beginner: 0, intermediate: 0, advanced: 0 };
  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold mb-5" style={{ color: "var(--muted-foreground)" }}>
        <ArrowLeft size={16} />홈으로
      </button>

      <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--foreground)" }}>레슨 선택</h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>언어, 목차, 난이도를 골라 학습을 시작하세요.</p>

      {/* Language picker */}
      <div className="flex gap-2 mb-7 flex-wrap">
        {(Object.entries(LANG_META) as [Language, typeof LANG_META[Language]][]).map(([lang, meta]) => {
          const sel = selectedLang === lang;
          return (
            <button key={lang} onClick={() => { setSelectedLang(lang); setSelectedTopic(null); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all"
              style={{ borderColor: sel ? meta.color : "var(--border)", background: sel ? meta.light : "#fff", color: sel ? meta.color : "var(--muted-foreground)" }}>
              <LanguageIcon language={lang} size={20} />{meta.label}
            </button>
          );
        })}
      </div>

      {/* Topic picker */}
      <div className="mb-7">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="font-extrabold text-base" style={{ color: "var(--foreground)" }}>목차</h2>
          <span className="text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>목차별 3문제 구성</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topics.map((topic, idx) => {
            const selected = activeTopic === topic;
            const total = Object.values(topicCounts[topic] ?? {}).reduce((sum, value) => sum + value, 0);
            return (
              <button key={topic} onClick={() => setSelectedTopic(topic)}
                className="text-left rounded-2xl border-2 p-4 transition-all hover:scale-[1.01]"
                style={{ borderColor: selected ? langMeta.color : "var(--border)", background: selected ? langMeta.light : "#fff" }}>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold" style={{ background: selected ? "#fff" : "var(--secondary)", color: selected ? langMeta.color : "var(--muted-foreground)" }}>{idx + 1}</span>
                  <span className="font-extrabold text-sm" style={{ color: selected ? langMeta.color : "var(--foreground)" }}>{topic}</span>
                </div>
                <div className="text-xs font-bold mt-3" style={{ color: "var(--muted-foreground)" }}>{total}문제</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty cards */}
      <div className="space-y-3">
        {(Object.entries(DIFFICULTY_META) as [Difficulty, typeof DIFFICULTY_META[Difficulty]][]).map(([diff, meta]) => {
          const count = activeCounts[diff];
          return (
            <button key={diff} onClick={() => count > 0 && onStart(diff, activeTopic)} disabled={count === 0}
              className="w-full text-left rounded-2xl border-2 p-5 flex items-center gap-4 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "var(--border)", background: "#fff" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: meta.light }}>
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base" style={{ color: "var(--foreground)" }}>{meta.label}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: meta.light, color: meta.color }}><LanguageIcon language={selectedLang} size={14} />{langMeta.label}</span>
                </div>
                <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>{activeTopic} · {meta.desc}</p>
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
