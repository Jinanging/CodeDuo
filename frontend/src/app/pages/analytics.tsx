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
  DIFFICULTY_META, EMPTY_WEAKNESS_DATA, EMPTY_WEEKLY_ACTIVITY, LANG_META, TOPICS_BY_LANGUAGE,
  TYPE_META, TYPE_XP, firstTopicFor, hasKnownTopic, isAdminUser, isLanguage,
  languageFromSubject, languageFromText, topicForQuestion,
} from "../constants";
import { Avatar, Badge, CodeEditor, LanguageIcon, LockOverlay, PremiumBadge, PublicExamples, TestResultPanel, XpBar, languageLevelProgress } from "../components/shared";

import { DIFF_NUM, NUM_DIFF, dedupWrongs, mapProblem, mapWrongAnswer } from "./problemMappers";

// ─── ANALYTICS (PREMIUM) ─────────────────────────────────────────────────────

export function AnalyticsPage({ user, onUpgrade, onStartLearning }: {
  user: UserProfile;
  onUpgrade: () => void;
  onStartLearning: (language: Language, difficulty: Difficulty, topic?: string) => void;
}) {
  const isPremium = user.tier === "premium";
  const fallbackAnalytics: BackendAnalytics = {
    weakness: EMPTY_WEAKNESS_DATA,
    activity: EMPTY_WEEKLY_ACTIVITY(),
    summary: { totalSolved: user.totalSolved, weeklySolved: 0, streak: user.streak, accuracy: 0 },
  };
  const [analytics, setAnalytics] = useState<BackendAnalytics>(fallbackAnalytics);
  const [analyticsStatus, setAnalyticsStatus] = useState<"idle" | "loading" | "error">("idle");
  const [aiReport, setAiReport] = useState<AiLearningReport | null>(null);
  const [aiReportStatus, setAiReportStatus] = useState<"idle" | "loading" | "error">("idle");
  const [nextQuestions, setNextQuestions] = useState<Question[]>([]);
  const [nextQuestionsStatus, setNextQuestionsStatus] = useState<"idle" | "loading" | "error">("idle");

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
  }, [isPremium, user.totalSolved, user.streak]);

  useEffect(() => {
    if (!isPremium) return;

    let alive = true;
    setAiReportStatus("loading");
    fetchAiLearningReport()
      .then(report => {
        if (!alive) return;
        setAiReport(report);
        setAiReportStatus("idle");
      })
      .catch(() => {
        if (!alive) return;
        setAiReport(null);
        setAiReportStatus("error");
      });

    return () => { alive = false; };
  }, [isPremium, user.totalSolved, user.streak]);

  const learningFlow = analytics.weakness
    .filter(area => area.score > 0)
    .sort((a, b) => b.score - a.score);
  const aiReportText = aiReport
    ? [aiReport.summary, ...aiReport.patterns, ...aiReport.focusAreas, ...aiReport.nextActions].join(" ")
    : "";
  const reportLanguage = aiReportText ? languageFromText(aiReportText) : null;
  const nextLanguage = reportLanguage ?? (learningFlow[0] ? languageFromSubject(learningFlow[0].subject) : "python");
  const reportSections = aiReport
    ? [
        { title: "강점", items: aiReport.strengths, color: "#10B981", icon: CheckCircle2 },
        { title: "흐름", items: aiReport.patterns, color: "var(--primary)", icon: TrendingUp },
        { title: "다시 볼 것", items: aiReport.focusAreas, color: "#F59E0B", icon: AlertTriangle },
        { title: "다음 액션", items: aiReport.nextActions, color: "#3B82F6", icon: Lightbulb },
      ]
    : [];
  const headlineCards = aiReport
    ? [
        { label: "최근 흐름", value: aiReport.patterns[0] ?? "풀이 기록을 모으는 중이에요.", color: "var(--primary)" },
        { label: "다시 볼 것", value: aiReport.focusAreas[0] ?? "아직 뚜렷한 복습 지점이 없어요.", color: "#F59E0B" },
        { label: "다음 액션", value: aiReport.nextActions[0] ?? "가벼운 문제부터 이어서 풀어보세요.", color: "#3B82F6" },
      ]
    : [];

  useEffect(() => {
    if (!isPremium) return;

    let alive = true;
    setNextQuestionsStatus("loading");
    getProblems(nextLanguage)
      .then(problems => {
        if (!alive) return;
        const sorted = problems
          .map(mapProblem)
          .filter(hasKnownTopic)
          .sort((a, b) => DIFF_NUM[a.difficulty] - DIFF_NUM[b.difficulty] || a.id - b.id)
          .slice(0, 3);
        setNextQuestions(sorted);
        setNextQuestionsStatus("idle");
      })
      .catch(() => {
        if (!alive) return;
        setNextQuestions([]);
        setNextQuestionsStatus("error");
      });

    return () => { alive = false; };
  }, [isPremium, nextLanguage]);

  const recommendationReason = (question: Question, index: number) => {
    const languageLabel = LANG_META[question.language].label;
    const focusText = aiReport?.focusAreas.join(" ") ?? "";
    const actionText = aiReport?.nextActions.join(" ") ?? "";
    const mentionedInReport = `${focusText} ${actionText}`.toLowerCase().includes(languageLabel.toLowerCase());

    if (mentionedInReport) return `AI 리포트에서 ${languageLabel} 학습 흐름과 연결된 문제예요.`;
    if (learningFlow.length > 0 && question.language === nextLanguage && index === 0) return `최근 풀이 기록을 기준으로 먼저 이어서 볼 문제예요.`;
    if (question.difficulty === "beginner") return "기초 개념을 가볍게 점검하기 좋아요.";
    if (question.difficulty === "intermediate") return "기초 다음 단계로 넘어가기 좋은 연습 문제예요.";
    return "학습 흐름을 이어가기 좋은 문제예요.";
  };

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: "var(--foreground)" }}>AI 학습 리포트</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>최근 풀이 기록을 바탕으로 다음 학습 방향을 정리했어요</p>
        </div>
        <PremiumBadge />
      </div>

      <div className="relative">
        {!isPremium && <LockOverlay onUpgrade={onUpgrade} />}

        <div className={isPremium ? "" : "opacity-30 pointer-events-none"}>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "해결한 문제", value: analytics.summary.totalSolved },
              { label: "이번 주 해결", value: analytics.summary.weeklySolved },
              { label: "연속 학습", value: `${analytics.summary.streak}일` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-2xl border border-border p-4">
                <p className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{label}</p>
                <p className="font-extrabold text-lg" style={{ color: "var(--foreground)" }}>{value}</p>
              </div>
            ))}
          </div>

          {analyticsStatus === "error" && (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm" style={{ color: "#92400E" }}>
              분석 데이터를 불러오지 못해 학습 통계를 0으로 표시합니다.
            </div>
          )}

          <div className="bg-white rounded-2xl border border-border p-5 mb-4">
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <Sparkles size={16} style={{ color: "var(--primary)" }} />AI 학습 요약
              {aiReportStatus === "loading" && <span className="text-xs font-normal" style={{ color: "var(--muted-foreground)" }}>생성 중</span>}
            </h3>
            {aiReportStatus === "error" ? (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold" style={{ color: "#EF4444" }}>
                AI 리포트를 불러오지 못했어요.
              </div>
            ) : aiReport ? (
              <div className="space-y-4">
                <div className="rounded-2xl px-4 py-4" style={{ background: "linear-gradient(135deg, #F5F3FF, #EEF2FF)" }}>
                  <p className="text-[15px] leading-7 font-semibold" style={{ color: "var(--foreground)" }}>{aiReport.summary}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {headlineCards.map(card => (
                    <div key={card.label} className="rounded-2xl border border-border bg-white p-4">
                      <div className="mb-2 h-1.5 w-8 rounded-full" style={{ background: card.color }} />
                      <p className="text-xs font-extrabold mb-1" style={{ color: "var(--muted-foreground)" }}>{card.label}</p>
                      <p className="text-sm leading-6 font-semibold line-clamp-3" style={{ color: "var(--foreground)" }}>{card.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {reportSections.map(section => (
                    <div key={section.title} className="rounded-2xl border border-border bg-muted/20 p-4">
                      <p className="mb-3 flex items-center gap-2 text-sm font-extrabold" style={{ color: "var(--foreground)" }}>
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-white">
                          <section.icon size={15} style={{ color: section.color }} />
                        </span>
                        {section.title}
                      </p>
                      <ul className="space-y-2">
                        {section.items.slice(0, 2).map(item => (
                          <li key={item} className="flex gap-2 text-sm leading-6" style={{ color: "var(--muted-foreground)" }}>
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: section.color }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-muted/20 px-4 py-5 text-sm" style={{ color: "var(--muted-foreground)" }}>
                최근 풀이 기록을 분석하고 있어요.
              </div>
            )}
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

          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <TrendingUp size={16} style={{ color: "var(--primary)" }} />최근 학습 흐름
              {analyticsStatus === "loading" && <span className="text-xs font-normal" style={{ color: "var(--muted-foreground)" }}>불러오는 중</span>}
            </h3>
            {learningFlow.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs leading-5" style={{ color: "var(--muted-foreground)" }}>
                  최근 풀이 기록이 있는 언어만 표시해요. 모든 언어를 비교하기보다 지금 이어서 학습할 흐름을 보여줍니다.
                </p>
                {learningFlow.map(area => {
                  const language = languageFromSubject(area.subject);
                  const meta = LANG_META[language];
                  return (
                    <div key={area.subject} className="rounded-2xl border border-border bg-muted/20 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <LanguageIcon language={language} size={28} />
                          <div>
                            <p className="text-sm font-extrabold" style={{ color: "var(--foreground)" }}>{area.subject}</p>
                            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>최근 제출 기록 기반</p>
                          </div>
                        </div>
                        <button
                          onClick={() => onStartLearning(language, "beginner", firstTopicFor(language))}
                          className="px-3 py-2 rounded-xl text-xs font-bold border border-border bg-white"
                          style={{ color: meta.color }}
                        >
                          이어 풀기
                        </button>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(12, area.score))}%`, background: meta.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-muted/20 px-4 py-5 text-sm" style={{ color: "var(--muted-foreground)" }}>
                문제를 풀면 학습 흐름이 여기에 표시돼요.
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-border p-5 mt-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                  <BookOpen size={16} style={{ color: "#F59E0B" }} />다음 학습 문제
                </h3>
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                  최근 풀이 흐름을 기준으로 이어서 풀 문제를 골랐어요.
                </p>
              </div>
              {nextQuestionsStatus === "loading" && <Loader2 size={16} className="animate-spin shrink-0" style={{ color: "var(--muted-foreground)" }} />}
            </div>
            {nextQuestionsStatus === "error" ? (
              <div className="rounded-xl border border-border bg-muted/20 px-4 py-5 text-sm" style={{ color: "var(--muted-foreground)" }}>
                다음 학습 문제를 불러오지 못했어요.
              </div>
            ) : nextQuestions.length > 0 ? (
              <div className="space-y-2.5">
                {nextQuestions.map((question, index) => {
                  const typeMeta = TYPE_META[question.type];
                  const diffMeta = DIFFICULTY_META[question.difficulty];
                  return (
                    <button
                      key={question.id}
                      onClick={() => onStartLearning(question.language, question.difficulty, topicForQuestion(question))}
                      className="w-full text-left p-3 rounded-xl border border-border flex items-center gap-3 hover:bg-muted/40 transition-colors"
                    >
                      <LanguageIcon language={question.language} size={24} className="shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: "var(--foreground)" }}>{question.title}</p>
                        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--muted-foreground)" }}>{recommendationReason(question, index)}</p>
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
            ) : (
              <div className="rounded-xl border border-border bg-muted/20 px-4 py-5 text-sm" style={{ color: "var(--muted-foreground)" }}>
                아직 추천할 문제가 부족해요. 레슨에서 원하는 언어를 선택해 먼저 풀어보세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
