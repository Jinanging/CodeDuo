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

// ─── AI TECH INTERVIEW ───────────────────────────────────────────────────────

const INTERVIEW_VERDICT: Record<InterviewTurn["verdict"], { label: string; color: string; background: string }> = {
  STRONG_PASS: { label: "강력 추천", color: "#047857", background: "#ECFDF5" },
  PASS: { label: "합격권", color: "#0F766E", background: "#F0FDFA" },
  BORDERLINE: { label: "보완 필요", color: "#B45309", background: "#FFFBEB" },
  NEEDS_IMPROVEMENT: { label: "집중 학습 필요", color: "#B91C1C", background: "#FEF2F2" },
};

export function AIInterviewPage({ user, onBack }: { user: UserProfile; onBack: () => void }) {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [answer, setAnswer] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const activeSession = history.find(item => item.status === "ACTIVE");

  useEffect(() => {
    getInterviewHistory().then(setHistory).catch(() => {});
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
    setInterimTranscript("");
  };

  const openSession = (item: InterviewSession) => {
    setSession(item);
    setAnswer("");
    setInterimTranscript("");
    setShowFeedback(false);
    setError("");
  };

  const startSession = async () => {
    setStarting(true);
    setError("");
    try {
      const next = await startInterview();
      setSession(next);
      setAnswer("");
      setShowFeedback(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI 면접을 시작하지 못했습니다.");
    } finally {
      setStarting(false);
    }
  };

  const toggleListening = () => {
    if (listening) {
      stopListening();
      return;
    }
    setError("");
    if (!window.isSecureContext) {
      setError("마이크 사용을 위해 HTTPS 보안 연결로 접속해주세요.");
      return;
    }
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setError("이 브라우저는 실시간 음성 인식을 지원하지 않습니다. Chrome 또는 Edge를 사용해주세요.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "ko-KR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0]?.transcript ?? "";
        if (event.results[index].isFinal) finalText += transcript;
        else interimText += transcript;
      }
      if (finalText.trim()) {
        setAnswer(current => [current.trim(), finalText.trim()].filter(Boolean).join(" "));
      }
      setInterimTranscript(interimText.trim());
    };
    recognition.onerror = (event) => {
      const message = event.error === "not-allowed"
        ? "마이크 권한이 거부되었습니다. 브라우저 주소창의 권한 설정에서 마이크를 허용해주세요."
        : event.error === "no-speech"
          ? "음성이 감지되지 않았습니다. 마이크 가까이에서 다시 말해주세요."
          : "음성 인식 중 오류가 발생했습니다. 다시 시도해주세요.";
      setError(message);
      setListening(false);
      setInterimTranscript("");
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
      setInterimTranscript("");
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setListening(true);
    } catch {
      setError("마이크를 시작하지 못했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const speakQuestion = () => {
    const text = session?.currentQuestion?.question;
    if (!text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.96;
    window.speechSynthesis.speak(utterance);
  };

  const submit = async () => {
    if (!session || !answer.trim()) return;
    stopListening();
    setSubmitting(true);
    setError("");
    try {
      const updated = await submitInterviewAnswer(session.id, answer.trim());
      setSession(updated);
      setAnswer("");
      setShowFeedback(updated.status !== "COMPLETED");
      if (updated.status === "COMPLETED") {
        setHistory(current => [updated, ...current.filter(item => item.id !== updated.id)].slice(0, 10));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "답변을 평가하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const lastEvaluation = session?.turns?.[session.turns.length - 1];

  if (!session) {
    return (
      <div className="px-5 py-8 max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-bold mb-6" style={{ color: "var(--muted-foreground)" }}>
          <ArrowLeft size={17} />오답노트로 돌아가기
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-3xl p-7 md:p-9 text-white" style={{ background: "linear-gradient(145deg, #4C1D95, #7C3AED 58%, #C084FC)" }}>
            <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/10" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-white/15 mb-6">
                <BriefcaseBusiness size={14} />대기업 시니어 개발자 AI 면접관
              </span>
              <h1 className="text-3xl font-extrabold leading-tight mb-4">공부한 내용으로<br />진짜 기술 면접을 연습하세요</h1>
              <p className="text-white/80 leading-relaxed mb-7 max-w-xl">
                최근 풀이와 오답을 분석해 3개의 맞춤 질문을 만들고, 음성 답변을 실시간으로 받아 채용 기준으로 평가합니다.
              </p>
              <div className="grid gap-3 sm:grid-cols-3 mb-8">
                {[
                  ["01", "학습 이력 분석"],
                  ["02", "마이크 실시간 답변"],
                  ["03", "100점 채점·피드백"],
                ].map(([number, label]) => (
                  <div key={number} className="rounded-2xl bg-white/10 border border-white/10 p-3">
                    <div className="text-xs font-extrabold text-white/60 mb-1">{number}</div>
                    <div className="text-sm font-bold">{label}</div>
                  </div>
                ))}
              </div>
              {activeSession && (
                <div className="flex w-fit items-center gap-2 px-3 py-2 rounded-xl bg-white/15 border border-white/15 text-sm font-bold mb-4">
                  <Play size={15} />{activeSession.completedQuestions}/{activeSession.totalQuestions}문항까지 진행한 면접이 있습니다
                </div>
              )}
              <button
                onClick={() => activeSession ? openSession(activeSession) : void startSession()}
                disabled={starting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-extrabold bg-white disabled:opacity-60"
                style={{ color: "#6D28D9" }}
              >
                {starting ? <Loader2 size={18} className="animate-spin" /> : activeSession ? <Play size={18} /> : <Mic size={18} />}
                {starting ? "학습 이력 분석 중..." : activeSession ? "진행 중인 면접 이어서 하기" : "새 AI 면접 시작"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-border p-5 md:p-6">
            <div className="flex items-center gap-4 mb-5">
              <img src={interviewerMascot} alt="AI 기술 면접관" className="w-20 h-20 rounded-2xl object-cover object-top border border-border" />
              <div>
                <p className="text-xs font-extrabold mb-1" style={{ color: "var(--primary)" }}>YOUR INTERVIEWER</p>
                <h2 className="text-lg font-extrabold" style={{ color: "var(--foreground)" }}>시니어 채용 면접관</h2>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>개념 · 논리 · 실무 적용 · 소통 평가</p>
              </div>
            </div>
            <div className="rounded-2xl p-4 mb-5" style={{ background: "var(--input-background)" }}>
              <div className="flex items-center gap-2 text-sm font-bold mb-2" style={{ color: "#047857" }}>
                <ShieldCheck size={17} />마이크 사용 안내
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                면접 시작 후 마이크 버튼을 누르고 자연스럽게 말하면 답변이 글자로 입력됩니다. 전사된 문장은 제출 전에 직접 고칠 수 있습니다.
              </p>
            </div>
            <h3 className="text-sm font-extrabold mb-3" style={{ color: "var(--foreground)" }}>최근 면접</h3>
            {history.length === 0 ? (
              <p className="text-sm py-7 text-center rounded-2xl" style={{ color: "var(--muted-foreground)", background: "var(--input-background)" }}>아직 완료한 면접이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 3).map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openSession(item)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border text-left transition-colors hover:border-purple-300"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
                      {item.averageScore ?? "-"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>기술 면접 #{item.id}</p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{item.completedQuestions}/{item.totalQuestions}문항 완료</p>
                    </div>
                    <span className="text-xs font-bold whitespace-nowrap" style={{ color: item.status === "COMPLETED" ? "#047857" : "#B45309" }}>
                      {item.status === "COMPLETED" ? "결과 보기" : "계속하기"}
                    </span>
                    <ChevronRight size={16} style={{ color: "var(--muted-foreground)" }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {error && <div className="mt-5 px-4 py-3 rounded-xl text-sm font-semibold" style={{ color: "#B91C1C", background: "#FEF2F2" }}>{error}</div>}
      </div>
    );
  }

  if (session.status === "COMPLETED") {
    const score = session.averageScore ?? 0;
    const fallbackVerdict: InterviewTurn["verdict"] = score >= 90 ? "STRONG_PASS" : score >= 75 ? "PASS" : score >= 60 ? "BORDERLINE" : "NEEDS_IMPROVEMENT";
    const overall = INTERVIEW_VERDICT[session.finalReview?.verdict ?? fallbackVerdict];
    return (
      <div className="px-5 py-8 max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-bold mb-6" style={{ color: "var(--muted-foreground)" }}>
          <ArrowLeft size={17} />오답노트로 돌아가기
        </button>
        <div className="bg-white rounded-3xl border border-border overflow-hidden">
          <div className="p-7 text-center text-white" style={{ background: "linear-gradient(135deg, #5B21B6, #8B5CF6)" }}>
            <div className="w-24 h-24 mx-auto rounded-full bg-white/15 border border-white/20 flex items-center justify-center mb-4">
              <span className="text-4xl font-extrabold">{score}</span>
            </div>
            <h1 className="text-2xl font-extrabold mb-1">AI 기술 면접 완료</h1>
            <p className="text-white/75 text-sm">{user.username}님의 평균 점수 · 100점 만점</p>
            <span className="inline-flex mt-4 px-3 py-1.5 rounded-full text-xs font-extrabold bg-white/15">{overall.label}</span>
          </div>
          <div className="p-5 md:p-7 space-y-4">
            {session.finalReview && (
              <div className="rounded-2xl border-2 p-5 md:p-6" style={{ borderColor: overall.color, background: overall.background }}>
                <div className="flex items-center gap-2 mb-3">
                  <BriefcaseBusiness size={19} style={{ color: overall.color }} />
                  <h2 className="text-lg font-extrabold" style={{ color: overall.color }}>시니어 면접관 최종 리뷰</h2>
                </div>
                <p className="text-sm leading-relaxed font-semibold mb-4" style={{ color: "var(--foreground)" }}>{session.finalReview.overallReview}</p>
                <div className="rounded-xl bg-white/70 p-4 mb-4">
                  <p className="text-xs font-extrabold mb-1" style={{ color: overall.color }}>채용 관점 최종 의견</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{session.finalReview.hiringRecommendation}</p>
                </div>
                <p className="text-xs font-extrabold mb-2" style={{ color: overall.color }}>다음 학습 우선순위</p>
                <div className="flex flex-wrap gap-2">
                  {session.finalReview.focusAreas.map((area, index) => (
                    <span key={area} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/75 text-xs font-bold" style={{ color: "var(--foreground)" }}>
                      <span style={{ color: overall.color }}>{index + 1}</span>{area}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {session.turns.map(turn => {
              const verdict = INTERVIEW_VERDICT[turn.verdict] ?? INTERVIEW_VERDICT.NEEDS_IMPROVEMENT;
              return (
                <div key={turn.id} className="rounded-2xl border border-border p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold shrink-0" style={{ background: verdict.background, color: verdict.color }}>
                      {turn.score}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold mb-1" style={{ color: "var(--primary)" }}>{turn.order}번 · {turn.topic}</p>
                      <p className="text-sm font-bold leading-relaxed" style={{ color: "var(--foreground)" }}>{turn.question}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed px-3 py-2.5 rounded-xl mb-3" style={{ background: "var(--input-background)", color: "var(--foreground)" }}>{turn.feedback}</p>
                  <details className="text-sm">
                    <summary className="cursor-pointer font-bold" style={{ color: "var(--primary)" }}>내 답변과 모범 답안 보기</summary>
                    <div className="mt-3 space-y-3">
                      <div><p className="text-xs font-bold mb-1" style={{ color: "var(--muted-foreground)" }}>내 답변</p><p className="leading-relaxed">{turn.answer}</p></div>
                      <div><p className="text-xs font-bold mb-1" style={{ color: "var(--muted-foreground)" }}>면접관 모범 답안</p><p className="leading-relaxed">{turn.modelAnswer}</p></div>
                    </div>
                  </details>
                </div>
              );
            })}
            <button onClick={() => setSession(null)} className="w-full py-3.5 rounded-xl font-extrabold text-white" style={{ background: "var(--primary)" }}>
              새 면접 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showFeedback && lastEvaluation) {
    const verdict = INTERVIEW_VERDICT[lastEvaluation.verdict] ?? INTERVIEW_VERDICT.NEEDS_IMPROVEMENT;
    return (
      <div className="px-5 py-8 max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-bold mb-6" style={{ color: "var(--muted-foreground)" }}>
          <ArrowLeft size={17} />면접 종료하고 돌아가기
        </button>
        <div className="bg-white rounded-3xl border border-border p-5 md:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold" style={{ background: verdict.background, color: verdict.color }}>
              {lastEvaluation.score}
            </div>
            <div>
              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-extrabold mb-2" style={{ background: verdict.background, color: verdict.color }}>{verdict.label}</span>
              <h1 className="text-xl font-extrabold" style={{ color: "var(--foreground)" }}>{lastEvaluation.order}번 답변 평가</h1>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{lastEvaluation.topic}</p>
            </div>
          </div>
          <div className="rounded-2xl p-4 mb-4" style={{ background: "var(--input-background)" }}>
            <p className="text-sm leading-relaxed font-semibold" style={{ color: "var(--foreground)" }}>{lastEvaluation.feedback}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div className="rounded-2xl p-4" style={{ background: "#ECFDF5" }}>
              <h3 className="text-sm font-extrabold mb-2" style={{ color: "#047857" }}>잘한 점</h3>
              {lastEvaluation.strengths.map(item => <p key={item} className="text-sm mb-1.5" style={{ color: "#065F46" }}>• {item}</p>)}
            </div>
            <div className="rounded-2xl p-4" style={{ background: "#FFFBEB" }}>
              <h3 className="text-sm font-extrabold mb-2" style={{ color: "#B45309" }}>보완할 점</h3>
              {lastEvaluation.improvements.map(item => <p key={item} className="text-sm mb-1.5" style={{ color: "#92400E" }}>• {item}</p>)}
            </div>
          </div>
          <details className="rounded-2xl border border-border p-4 mb-5">
            <summary className="cursor-pointer text-sm font-extrabold" style={{ color: "var(--primary)" }}>시니어 면접관의 모범 답안</summary>
            <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--foreground)" }}>{lastEvaluation.modelAnswer}</p>
          </details>
          <button onClick={() => setShowFeedback(false)} className="w-full py-3.5 rounded-xl font-extrabold text-white" style={{ background: "var(--primary)" }}>
            {session.currentQuestion?.order ?? session.completedQuestions + 1}번 질문으로 계속
          </button>
        </div>
      </div>
    );
  }

  const current = session.currentQuestion;
  return (
    <div className="px-5 py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--muted-foreground)" }}>
          <ArrowLeft size={17} />면접 종료
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold" style={{ color: "var(--primary)" }}>{current?.order ?? 1} / {session.totalQuestions}</span>
          <div className="w-28 h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${((current?.order ?? 1) / session.totalQuestions) * 100}%`, background: "var(--primary)" }} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="bg-white rounded-3xl border border-border p-5 self-start">
          <img src={interviewerMascot} alt="AI 기술 면접관" className="w-full aspect-square rounded-2xl object-cover object-top mb-4" />
          <p className="text-xs font-extrabold mb-1" style={{ color: "var(--primary)" }}>INTERVIEWER</p>
          <h2 className="font-extrabold mb-1" style={{ color: "var(--foreground)" }}>시니어 채용 면접관</h2>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>대기업 실무 기준으로 답변의 정확성, 논리, 적용력을 평가합니다.</p>
        </div>

        <div className="bg-white rounded-3xl border border-border p-5 md:p-7">
          {current ? (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full" style={{ background: "var(--secondary)", color: "var(--primary)" }}>{current.language}</span>
                <span className="text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>{current.topic}</span>
                <button onClick={speakQuestion} className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: "var(--input-background)", color: "var(--primary)" }}>
                  <Volume2 size={15} />질문 듣기
                </button>
              </div>
              <div className="relative rounded-2xl p-5 mb-6" style={{ background: "var(--secondary)" }}>
                <div className="hidden lg:block absolute left-[-8px] top-8 w-4 h-4 rotate-45" style={{ background: "var(--secondary)" }} />
                <p className="text-xs font-extrabold mb-2" style={{ color: "var(--primary)" }}>질문 {current.order}</p>
                <p className="text-lg font-extrabold leading-relaxed" style={{ color: "var(--foreground)" }}>{current.question}</p>
              </div>

              <div className="flex items-center justify-between gap-3 mb-3">
                <label htmlFor="interview-answer" className="text-sm font-extrabold" style={{ color: "var(--foreground)" }}>지원자 답변</label>
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{answer.length}자</span>
              </div>
              <textarea
                id="interview-answer"
                value={answer}
                onChange={event => setAnswer(event.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-2xl border-2 text-sm leading-relaxed focus:outline-none resize-none"
                style={{ borderColor: listening ? "#EF4444" : "var(--border)", background: "#fff", color: "var(--foreground)" }}
                placeholder="마이크를 누르고 답변하거나 직접 입력하세요."
              />
              {interimTranscript && (
                <p className="mt-2 px-3 py-2 rounded-xl text-sm italic" style={{ background: "var(--input-background)", color: "var(--muted-foreground)" }}>
                  인식 중: {interimTranscript}
                </p>
              )}
              {error && <div className="mt-3 px-4 py-3 rounded-xl text-sm font-semibold" style={{ color: "#B91C1C", background: "#FEF2F2" }}>{error}</div>}

              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <button
                  onClick={toggleListening}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-extrabold text-white transition-all"
                  style={{ background: listening ? "#DC2626" : "#111827", boxShadow: listening ? "0 0 0 5px rgba(239,68,68,.12)" : "none" }}
                >
                  {listening ? <CircleStop size={19} /> : <Mic size={19} />}
                  {listening ? "음성 인식 중지" : "마이크로 답변"}
                </button>
                <button
                  onClick={submit}
                  disabled={!answer.trim() || submitting}
                  className="inline-flex flex-1 items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-extrabold text-white disabled:opacity-50"
                  style={{ background: "var(--primary)" }}
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                  {submitting ? "시니어 면접관이 채점 중..." : "답변 제출하고 AI 채점"}
                </button>
              </div>
              <p className="text-xs text-center mt-3" style={{ color: "var(--muted-foreground)" }}>
                음성은 브라우저에서 글자로 변환되며, 서버에는 제출한 답변 텍스트만 저장됩니다.
              </p>
            </>
          ) : (
            <div className="py-16 text-center"><Loader2 className="animate-spin mx-auto mb-3" style={{ color: "var(--primary)" }} /><p>다음 질문을 준비하고 있습니다.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
