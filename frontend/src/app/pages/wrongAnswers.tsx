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
import type { Difficulty, FriendUser, Language, MockResult, Question, QuestionType, Screen, StudyGroupView, TestCase, UserProfile, WrongAnswer } from "../types";
import {
  DIFFICULTY_META, EMPTY_WEAKNESS_DATA, LANG_META, TOPICS_BY_LANGUAGE,
  MAX_CODE_ATTEMPTS, TYPE_META, TYPE_XP, firstTopicFor, hasKnownTopic, isAdminUser, isLanguage,
  languageFromSubject, languageFromText, topicForQuestion,
} from "../constants";
import { Avatar, Badge, CodeEditor, LanguageIcon, LockOverlay, PremiumBadge, PublicExamples, TestResultPanel, XpBar, languageLevelProgress } from "../components/shared";

import { DIFF_NUM, NUM_DIFF, dedupWrongs, mapProblem, mapWrongAnswer } from "./problemMappers";

// ─── ERROR NOTEBOOK (PREMIUM) ────────────────────────────────────────────────

export function ErrorNotebookPage({ user, sessionWrongs, resolvedIds, onReview, onInterview, onUpgrade }: {
  user: UserProfile;
  sessionWrongs: WrongAnswer[];
  resolvedIds: number[];
  onReview: () => void;
  onInterview: () => void;
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
          <div
            className="relative overflow-hidden rounded-3xl p-5 mb-5 text-white"
            style={{ background: "linear-gradient(135deg, #5B21B6 0%, #7C3AED 58%, #A855F7 100%)" }}
          >
            <div className="absolute -right-12 -top-16 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute right-24 -bottom-20 w-36 h-36 rounded-full bg-white/5" />
            <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/20 shrink-0 bg-white/10">
                <img src={interviewerMascot} alt="AI 기술 면접관" className="w-full h-full object-cover object-top" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-white/15">
                    <Sparkles size={13} /> NEW
                  </span>
                  <span className="text-xs font-bold text-white/70">학습 이력 맞춤형</span>
                </div>
                <h2 className="text-xl font-extrabold mb-1.5">AI 실전 기술 면접</h2>
                <p className="text-sm leading-relaxed text-white/80">
                  지금까지 푼 문제와 오답을 바탕으로 시니어 개발자가 질문하고, 음성 답변을 실시간으로 채점해요.
                </p>
              </div>
              <button
                onClick={onInterview}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold shrink-0 bg-white"
                style={{ color: "#6D28D9" }}
              >
                <Mic size={17} />
                AI 면접 시작
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {["all", "python", "java", "c", "cpp"].map(l => (
              <button key={l} onClick={() => setFilterLang(l as Language | "all")}
                className="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
                style={{ borderColor: filterLang === l ? "var(--primary)" : "var(--border)", background: filterLang === l ? "var(--secondary)" : "#fff", color: filterLang === l ? "var(--primary)" : "var(--muted-foreground)" }}>
                {l === "all" ? "전체" : <span className="inline-flex items-center gap-1.5"><LanguageIcon language={l as Language} size={15} />{LANG_META[l as Language].label}</span>}
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
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: LANG_META[w.language].color }}><LanguageIcon language={w.language} size={15} />{LANG_META[w.language].label}</span>
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

export function WrongAnswerReviewPage({ user, sessionWrongs, resolvedIds, onResolve, onBack }: {
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
  const [submissionError, setSubmissionError] = useState("");
  const [testResults, setTestResults] = useState<MockResult[] | null>(null);
  const [resultMessage, setResultMessage] = useState("");
  const [attemptCounts, setAttemptCounts] = useState<Record<number, number>>({});
  const active = reviewWrongs.find(w => w.qId === activeId) ?? reviewWrongs[0] ?? null;
  const answer = active
    ? answers[active.qId] ?? (active.type === "code" ? active.codeTemplate ?? "" : "")
    : "";

  const setAnswer = (value: string) => {
    if (!active) return;
    setAnswers(prev => ({ ...prev, [active.qId]: value }));
    setFeedback(null);
    setSubmissionError("");
    setTestResults(null);
    setResultMessage("");
  };

  const selectProblem = (qId: number | null) => {
    setActiveId(qId);
    setFeedback(null);
    setSubmissionError("");
    setTestResults(null);
    setResultMessage("");
  };

  const submit = async () => {
    if (!active) return;
    if (active.type === "code" && (attemptCounts[active.qId] ?? 0) >= MAX_CODE_ATTEMPTS) return;
    setSubmitting(true);
    setSubmissionError("");
    setTestResults(null);
    setResultMessage("");
    let result: Awaited<ReturnType<typeof submitAnswer>>;
    try {
      result = await submitAnswer(active.qId, answer);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "채점 요청에 실패했습니다.");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setResultMessage(result.resultMessage ?? "");
    if (active.type === "code") {
      setAttemptCounts(counts => ({ ...counts, [active.qId]: (counts[active.qId] ?? 0) + 1 }));
      let parsed: MockResult[] | null = null;
      if (result.testResultsJson) {
        try { parsed = JSON.parse(result.testResultsJson) as MockResult[]; } catch { parsed = null; }
      }
      setTestResults(parsed?.length ? parsed : null);
    }
    if (!result.correct) { setFeedback("wrong"); return; }
    onResolve(active.qId);
    setFeedback("correct");
    const next = reviewWrongs.find(w => w.qId !== active.qId);
    setActiveId(next?.qId ?? null);
    setTestResults(null);
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
                <span className="inline-flex w-6 font-extrabold" style={{ color: selected ? "var(--primary)" : "var(--muted-foreground)" }}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      );
    }
    if (active.type === "code") {
      return (
        <div>
          <PublicExamples testcases={active.testcases} />
          <CodeEditor
            value={answer}
            onChange={setAnswer}
            language={active.language}
            disabled={submitting || (attemptCounts[active.qId] ?? 0) >= MAX_CODE_ATTEMPTS}
          />
          <div
            className="mt-2 flex items-center justify-between gap-3 text-xs font-semibold"
            style={{ color: (attemptCounts[active.qId] ?? 0) >= MAX_CODE_ATTEMPTS && feedback === "wrong" ? "#B91C1C" : "var(--muted-foreground)" }}
          >
            <span>시도 {attemptCounts[active.qId] ?? 0}/{MAX_CODE_ATTEMPTS}회</span>
            <span>
              {(attemptCounts[active.qId] ?? 0) >= MAX_CODE_ATTEMPTS && feedback === "wrong"
                ? "기회를 모두 사용했어요"
                : `남은 기회 ${MAX_CODE_ATTEMPTS - (attemptCounts[active.qId] ?? 0)}회`}
            </span>
          </div>
          {testResults && (
            <div className="mt-4 space-y-2">
              <div
                className="px-4 py-3 rounded-xl text-sm font-bold"
                style={{
                  background: testResults.every(result => result.pass) ? "#ECFDF5" : "#FEF2F2",
                  color: testResults.every(result => result.pass) ? "#065F46" : "#991B1B",
                }}
              >
                {!testResults.every(result => result.pass) && "오답 · "}
                {testResults.filter(result => result.pass).length} / {testResults.length} 테스트케이스 통과
                {resultMessage && <span className="block mt-1 font-semibold">{resultMessage}</span>}
              </div>
              {testResults.map(result => (
                <div key={result.caseNumber} className="flex items-start gap-2 px-3 py-2 rounded-xl text-xs" style={{ background: result.pass ? "#F0FDF4" : "#FEF2F2", color: result.pass ? "#166534" : "#991B1B" }}>
                  {result.pass ? <CheckCircle2 size={15} className="shrink-0" /> : <XCircle size={15} className="shrink-0" />}
                  <span className="font-bold">숨김 테스트 #{result.caseNumber} · {result.pass ? "통과" : "실패"}</span>
                  {!result.pass && result.error && <span className="break-words">{result.error}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
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
              <span className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: LANG_META[active.language].color }}><LanguageIcon language={active.language} size={15} />{LANG_META[active.language].label}</span>
            </div>
            {renderInput()}
            {submissionError && <div className="mt-3 px-3 py-2 rounded-xl text-sm font-semibold" style={{ background: "#FEF2F2", color: "#991B1B" }}>{submissionError}</div>}
            {feedback === "wrong" && <div className="mt-3 px-3 py-2 rounded-xl text-sm font-semibold" style={{ background: "#FEF2F2", color: "#991B1B" }}>{resultMessage || "아직 아니에요. 정답 방향을 다시 떠올려보세요."}</div>}
            {active.type === "code" && feedback === "wrong" && (attemptCounts[active.qId] ?? 0) >= MAX_CODE_ATTEMPTS && (
              <div className="mt-3 px-3 py-2 rounded-xl text-sm font-semibold" style={{ background: "#FFF7ED", color: "#9A3412" }}>
                3회 기회를 모두 사용했습니다. 이 문제는 오답으로 유지되며 다른 문제를 선택할 수 있어요.
              </div>
            )}
            {feedback === "correct" && <div className="mt-3 px-3 py-2 rounded-xl text-sm font-semibold" style={{ background: "#ECFDF5", color: "#065F46" }}>좋아요. 해결한 문제로 이동했습니다.</div>}
            <div className="flex flex-wrap gap-2 mt-5">
              <button
                onClick={submit}
                disabled={!answer.trim() || submitting || (active.type === "code" && (attemptCounts[active.qId] ?? 0) >= MAX_CODE_ATTEMPTS)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                style={{ background: "var(--primary)" }}
              >
                {submitting ? "채점 중..." : active.type === "code" && (attemptCounts[active.qId] ?? 0) >= MAX_CODE_ATTEMPTS ? "제출 기회 소진" : "답변 제출"}
              </button>
              {reviewWrongs.map(w => (
                <button key={w.qId} onClick={() => selectProblem(w.qId)} className="px-3 py-2 rounded-xl text-xs font-bold border-2"
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
