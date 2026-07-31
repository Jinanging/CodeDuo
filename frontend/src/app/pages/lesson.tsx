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
  submitAnswer, getAiHint, getProblemAiHint, fetchAnalytics, getProblems, getWrongAnswers,
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
  languageFromSubject, languageFromText, nextDifficulty, topicForQuestion,
} from "../constants";
import { Avatar, Badge, CodeEditor, LanguageIcon, LockOverlay, PremiumBadge, PublicExamples, TestResultPanel, XpBar, languageLevelProgress } from "../components/shared";

import { DIFF_NUM, NUM_DIFF, dedupWrongs, mapProblem, mapWrongAnswer } from "./problemMappers";

// ─── LESSON ───────────────────────────────────────────────────────────────────

const cleanAiText = (value: string) =>
  value
    .replace(/\*\*/g, "")
    .replace(/[🎉📝💡]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const hintLines = (value: string) => {
  const cleaned = cleanAiText(value)
    .replace(/\?\s*(?=\d+\.)/g, "?\n")
    .replace(/\.\s*(?=\d+\.)/g, ".\n")
    .replace(/\s*(\d+\.)\s*/g, "\n$1 ")
    .replace(/\s*[-•]\s*/g, "\n- ");
  return cleaned.split(/\n+/).map(line => line.trim()).filter(Boolean);
};

const essayFeedback = (value: string) => {
  const scoreMatch = value.match(/score:\s*(\d+)/i);
  const feedbackMatch = value.match(/feedback:\s*([\s\S]*)/i);
  const fallback = value
    .replace(/score:\s*\d+/i, "")
    .replace(/correct:\s*(true|false)/i, "")
    .replace(/feedback:\s*/i, "");
  return {
    score: scoreMatch ? Number(scoreMatch[1]) : null,
    message: cleanAiText(feedbackMatch?.[1] ?? fallback),
  };
};

export function LessonPage({ user, selectedLang, difficulty, selectedTopic, onComplete, onBack }: {
  user: UserProfile; selectedLang: Language; difficulty: Difficulty; selectedTopic: string | null;
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
  const [problemHint, setProblemHint] = useState("");
  const [problemHintLoading, setProblemHintLoading] = useState(false);
  const [problemHintError, setProblemHintError] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [codeValue, setCodeValue] = useState("");
  const [wrongs, setWrongs] = useState<WrongAnswer[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<MockResult[] | null>(null);
  const [codeResultMessage, setCodeResultMessage] = useState("");
  const [backendCodeReview, setBackendCodeReview] = useState<string | undefined>();
  const [backendSubmissionId, setBackendSubmissionId] = useState<number | null>(null);
  const [aiHint, setAiHint] = useState("");
  const [aiHintLoading, setAiHintLoading] = useState(false);
  const [aiHintError, setAiHintError] = useState("");
  const [feedbackExplanation, setFeedbackExplanation] = useState("");
  const [feedbackScore, setFeedbackScore] = useState<number | null>(null);
  const [submissionError, setSubmissionError] = useState("");
  const [earnedXp, setEarnedXp] = useState(0);
  const [codeWrongRecorded, setCodeWrongRecorded] = useState(false);
  const [codeAttemptCount, setCodeAttemptCount] = useState(0);
  const submissionLockRef = useRef(false);
  const nextLockRef = useRef(false);
  const activeTopic = selectedTopic && TOPICS_BY_LANGUAGE[selectedLang].includes(selectedTopic)
    ? selectedTopic
    : firstTopicFor(selectedLang);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setLoadError(false);
    getProblems(selectedLang, DIFF_NUM[difficulty])
      .then((list) => {
        if (cancelled) return;
        const mapped = list
          .map(mapProblem)
          .filter(question => question.tags.includes(activeTopic));
        setLessonQuestions(mapped);
        setCurrentQ(0);
        setCodeValue(mapped[0]?.template ?? "");
        setCodeAttemptCount(0);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) { setLoadError(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [selectedLang, difficulty, activeTopic]);

  useEffect(() => {
    nextLockRef.current = false;
  }, [currentQ]);

  const question = lessonQuestions[currentQ];

  if (loading) return (
    <div className="flex items-center justify-center" style={{ minHeight: "100dvh", color: "var(--muted-foreground)" }}>문제 불러오는 중…</div>
  );
  if (loadError || !question) return (
    <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight: "100dvh" }}>
      <p style={{ color: "var(--muted-foreground)" }}>{loadError ? "문제를 불러오지 못했습니다. 백엔드 연결을 확인하세요." : `${activeTopic} 목차의 ${DIFFICULTY_META[difficulty].label} 문제가 없습니다.`}</p>
      <button onClick={onBack} className="px-4 py-2 rounded-xl font-bold text-white" style={{ background: "var(--primary)" }}>돌아가기</button>
    </div>
  );

  const progress = (currentQ / lessonQuestions.length) * 100;
  const langMeta = LANG_META[question.language];

  const resetQ = (idx: number) => {
    setUserAnswer(""); setSelectedOption(null); setFeedback(null); setShowHint(false);
    setCodeValue(lessonQuestions[idx]?.template ?? "");
    setProblemHint(""); setProblemHintLoading(false); setProblemHintError("");
    setTestResults(null); setCodeResultMessage(""); setBackendCodeReview(undefined); setBackendSubmissionId(null); setAiHint(""); setAiHintLoading(false); setAiHintError(""); setFeedbackExplanation(""); setFeedbackScore(null); setSubmissionError(""); setIsRunning(false); setCodeWrongRecorded(false); setCodeAttemptCount(0);
  };

  const runCode = async () => {
    if (submissionLockRef.current || codeAttemptCount >= MAX_CODE_ATTEMPTS) return;
    submissionLockRef.current = true;
    setIsRunning(true);
    setTestResults(null);
    setBackendSubmissionId(null);
    setAiHint("");
    setAiHintError("");
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
      setBackendSubmissionId(null);
      setFeedback("wrong");
      setIsRunning(false);
      submissionLockRef.current = false;
      return;
    }
    setCodeAttemptCount(count => count + 1);
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
    setBackendSubmissionId(backend.id ?? null);
    setFeedbackExplanation(backend.explanation ?? backend.resultMessage ?? "");
    setIsRunning(false);
    submissionLockRef.current = false;
    const allPassed = backend.correct;
    setFeedback(allPassed ? "correct" : "wrong");
    if (allPassed) {
      setCorrectCount(p => p + 1);
      setEarnedXp(p => p + TYPE_XP.code);
      // 재시도 끝에 정답을 맞힌 경우 첫 실패 때 추가한 세션 오답을 제거한다.
      setWrongs(prev => prev.filter(wrong => wrong.qId !== question.id));
    } else if (!codeWrongRecorded) {
      setWrongs(prev => [...prev, {
        qId: question.id, question: question.question, type: question.type,
        language: question.language,
        userAnswer: codeValue.slice(0, 60),
        solvedAt: new Date().toISOString().slice(0, 10),
      }]);
      setCodeWrongRecorded(true);
    }
  };

  const requestAiHint = async () => {
    if (!backendSubmissionId || aiHintLoading) return;
    setAiHintLoading(true);
    setAiHintError("");
    try {
      const result = await getAiHint(backendSubmissionId);
      setAiHint(result.hint);
    } catch (error) {
      setAiHintError(error instanceof Error ? error.message : "AI 힌트를 불러오지 못했습니다.");
    } finally {
      setAiHintLoading(false);
    }
  };

  const requestProblemHint = async () => {
    if (question.hint || problemHint || problemHintLoading) return;
    if (question.type !== "essay" && question.type !== "short-answer") return;
    setProblemHintLoading(true);
    setProblemHintError("");
    try {
      const result = await getProblemAiHint(question.id);
      setProblemHint(result.hint);
    } catch (error) {
      setProblemHintError(error instanceof Error ? error.message : "AI 힌트를 불러오지 못했습니다.");
    } finally {
      setProblemHintLoading(false);
    }
  };

  const toggleHint = () => {
    if (showHint) {
      setShowHint(false);
      return;
    }
    setShowHint(true);
    void requestProblemHint();
  };

  const checkAnswer = async () => {
    if (question.type === "code") { runCode(); return; }
    if (submissionLockRef.current) return;

    // 정답은 브라우저에 두지 않고 백엔드에서만 채점합니다.
    const activeQuestion = question;
    const selectedIndex = selectedOption;
    const textAnswer = userAnswer;
    const submitted = activeQuestion.type === "mcq"
      ? (selectedIndex === null ? "" : String(selectedIndex))
      : textAnswer;
    submissionLockRef.current = true;
    setIsRunning(true);
    setSubmissionError("");
    let backend: Awaited<ReturnType<typeof submitAnswer>>;
    try {
      backend = await submitAnswer(activeQuestion.id, submitted);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "채점 요청에 실패했습니다.");
      return;
    } finally {
      submissionLockRef.current = false;
      setIsRunning(false);
    }
    const correct = backend.correct;
    setFeedbackScore(activeQuestion.type === "essay" ? backend.score : null);
    setFeedbackExplanation(activeQuestion.type === "essay"
      ? (backend.resultMessage ?? backend.explanation ?? "")
      : (backend.explanation ?? backend.resultMessage ?? "")
    );

    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      setCorrectCount(p => p + 1);
      setEarnedXp(p => p + TYPE_XP[activeQuestion.type]);
      setWrongs(prev => prev.filter(wrong => wrong.qId !== activeQuestion.id));
    }
    else {
      const wrongAnswer: WrongAnswer = {
        qId: activeQuestion.id, question: activeQuestion.question, type: activeQuestion.type,
        language: activeQuestion.language,
        userAnswer: activeQuestion.type === "mcq" && selectedIndex !== null
          ? (activeQuestion.options?.[selectedIndex] ?? "")
          : textAnswer,
        solvedAt: new Date().toISOString().slice(0, 10),
      };
      setWrongs(prev => [...prev.filter(wrong => wrong.qId !== activeQuestion.id), wrongAnswer]);
    }
  };

  const next = () => {
    if (nextLockRef.current) return;
    nextLockRef.current = true;
    if (currentQ < lessonQuestions.length - 1) { resetQ(currentQ + 1); setCurrentQ(p => p + 1); }
    else onComplete(correctCount, lessonQuestions.length, wrongs, earnedXp);
  };

  const canCheck =
    question.type === "code"
      ? codeValue.trim().length > 0 && !isRunning && codeAttemptCount < MAX_CODE_ATTEMPTS
      : question.type === "mcq"
        ? selectedOption !== null && !isRunning
        : userAnswer.trim().length > 0 && !isRunning;

  const parts = question.question.split("___");
  const visibleHint = question.hint
    || (problemHintLoading ? "AI 힌트를 불러오는 중..." : "")
    || problemHintError
    || problemHint
    || (question.type === "essay"
      ? "핵심 개념을 먼저 정의하고, 왜 그런지와 간단한 예시를 함께 적어보세요."
      : "문제에서 묻는 핵심 키워드를 먼저 떠올리고 답을 간단히 정리해보세요.");
  const essayResult = essayFeedback(feedbackExplanation);
  const essayScore = feedbackScore ?? essayResult.score;

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
              onClick={toggleHint}
              className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors"
              style={{ color: "#F59E0B" }}
            >
              <Lightbulb size={14} />힌트
            </button>
          </div>

          {/* Hint banner */}
          {showHint && (
            <div className="mb-4 rounded-2xl px-5 py-4 text-sm font-semibold border-l-4 flex items-start gap-3 shadow-sm" style={{ background: "#FFFBEB", color: "#92400E", borderColor: "#F59E0B" }}>
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: "#FEF3C7", color: "#D97706" }}>
                <Lightbulb size={15} />
              </div>
              <div className="min-w-0 space-y-2 leading-relaxed">
                {hintLines(visibleHint).map((line, index) => (
                  <p key={`${line}-${index}`} className="break-keep">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* ── Question card ── */}
          <div className="bg-white rounded-3xl p-8 border border-border mb-5 shadow-sm">
            <div className="flex items-center gap-1.5 text-sm font-bold mb-3" style={{ color: langMeta.color }}>
              <LanguageIcon language={selectedLang} size={16} />{langMeta.label} · {question.title}
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
                    disabled={!!feedback || isRunning}
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
              onKeyDown={e => e.key === "Enter" && !feedback && !isRunning && canCheck && checkAnswer()}
              disabled={!!feedback || isRunning}
              placeholder="정답을 입력하세요..."
              className="w-full px-5 py-4 rounded-2xl border-2 font-mono font-bold text-base focus:outline-none transition-colors"
              style={{
                borderColor: feedback === "correct" ? "#10B981" : feedback === "wrong" ? "#EF4444" : "var(--border)",
                background: feedback === "correct" ? "#ECFDF5" : feedback === "wrong" ? "#FEF2F2" : "var(--input-background)",
                color: feedback === "correct" ? "#065F46" : feedback === "wrong" ? "#991B1B" : "var(--foreground)",
              }}
            />
          )}

          {question.type === "essay" && (
            <textarea
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              disabled={!!feedback || isRunning}
              placeholder="개념, 이유, 예시를 포함해서 답안을 작성하세요..."
              rows={7}
              className="w-full px-5 py-4 rounded-2xl border-2 font-semibold text-base focus:outline-none transition-colors resize-none leading-relaxed"
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
              <PublicExamples testcases={question.testcases} />
              <CodeEditor
                value={codeValue}
                onChange={setCodeValue}
                language={question.language}
                disabled={isRunning || (codeAttemptCount >= MAX_CODE_ATTEMPTS && feedback === "wrong")}
              />
              <div className="mt-2 flex items-center justify-between gap-3 text-xs font-semibold" style={{ color: codeAttemptCount >= MAX_CODE_ATTEMPTS && feedback === "wrong" ? "#B91C1C" : "var(--muted-foreground)" }}>
                <span>시도 {codeAttemptCount}/{MAX_CODE_ATTEMPTS}회</span>
                <span>{codeAttemptCount >= MAX_CODE_ATTEMPTS && feedback === "wrong" ? "기회를 모두 사용했어요" : `남은 기회 ${MAX_CODE_ATTEMPTS - codeAttemptCount}회`}</span>
              </div>
              {testResults && (
                <TestResultPanel
                  results={testResults}
                  isPremium={user.tier === "premium"}
                  codeReview={backendCodeReview}
                  resultMessage={codeResultMessage}
                  aiHint={aiHint}
                  aiHintLoading={aiHintLoading}
                  aiHintError={aiHintError}
                  onRequestAiHint={requestAiHint}
                />
              )}
            </div>
          )}

          {/* ── Feedback banner (non-code, non-essay) ── */}
          {feedback && question.type === "essay" && (
            <div
              className="mt-5 rounded-3xl border-2 p-5 shadow-sm"
              style={{
                background: feedback === "correct" ? "#ECFDF5" : "#FEF2F2",
                borderColor: feedback === "correct" ? "#10B981" : "#EF4444",
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div
                  className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-3xl text-white"
                  style={{ background: feedback === "correct" ? "#10B981" : "#EF4444" }}
                >
                  <span className="text-4xl font-extrabold leading-none">{essayScore ?? 0}</span>
                  <span className="mt-1 text-sm font-bold">점</span>
                </div>
                <div className="min-w-0">
                  <div className="mb-2 text-lg font-extrabold" style={{ color: feedback === "correct" ? "#065F46" : "#991B1B" }}>
                    {feedback === "correct" ? "AI 채점 통과" : "조금 더 보완해보세요"}
                  </div>
                  <p className="text-sm font-semibold leading-relaxed break-keep" style={{ color: feedback === "correct" ? "#047857" : "#B91C1C" }}>
                    {essayResult.message || "채점이 완료되었습니다."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {feedback && question.type !== "code" && question.type !== "essay" && (
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
                  {feedback === "correct"
                    ? (question.type === "essay" ? `AI 채점 통과! +${TYPE_XP[question.type]} XP 🎉` : `정답! +${TYPE_XP[question.type]} XP 🎉`)
                    : (question.type === "essay" ? "AI 채점 기준을 다시 확인하세요." : "틀렸어요. 해설을 확인하세요.")}
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
              ) : testResults && feedback === "wrong" && codeAttemptCount >= MAX_CODE_ATTEMPTS ? (
                <button
                  onClick={next}
                  className="w-full py-4 rounded-2xl font-extrabold text-base text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: "#EF4444" }}
                >
                  {currentQ < lessonQuestions.length - 1 ? <>오답으로 다음 문제 <ChevronRight size={20} /></> : <>오답으로 결과 보기 <Trophy size={20} /></>}
                </button>
              ) : testResults && feedback === "wrong" ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    onClick={checkAnswer}
                    disabled={!canCheck || isRunning}
                    className="py-4 rounded-2xl font-extrabold text-base text-white flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
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
                    ) : (
                      <><RotateCcw size={18} />다시 실행</>
                    )}
                  </button>
                  <button
                    onClick={next}
                    disabled={isRunning}
                    className="py-4 rounded-2xl font-extrabold text-base border-2 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ borderColor: "var(--primary)", color: "var(--primary)", background: "#fff" }}
                  >
                    {currentQ < lessonQuestions.length - 1 ? <>오답으로 다음 문제 <ChevronRight size={20} /></> : <>오답으로 결과 보기 <Trophy size={20} /></>}
                  </button>
                </div>
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
                disabled={!canCheck || isRunning}
                className="w-full py-4 rounded-2xl font-extrabold text-base transition-all disabled:cursor-not-allowed"
                style={{
                  background: canCheck ? "var(--primary)" : "#D1C9F0",
                  color: canCheck ? "#fff" : "#6B5B95",
                }}
              >
                {isRunning ? "채점 중…" : question.type === "essay" ? "AI 채점 받기" : "정답 확인"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── RESULT ───────────────────────────────────────────────────────────────────

export function ResultPage({ user, correct, total, xpEarned, wrongs, selectedLang, difficulty, onHome, onRetry, onNextDifficulty, onUpgrade }: {
  user: UserProfile; correct: number; total: number; xpEarned: number;
  wrongs: WrongAnswer[]; selectedLang: Language; difficulty: Difficulty;
  onHome: () => void; onRetry: () => void; onNextDifficulty?: () => void; onUpgrade: () => void;
}) {
  const pct = Math.round((correct / total) * 100);
  const langMeta = LANG_META[selectedLang];
  const nextDiff = nextDifficulty(difficulty);
  const isPremium = user.tier === "premium";
  const resultWrongs = dedupWrongs(wrongs);

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center text-4xl" style={{ background: pct === 100 ? "#DCFCE7" : pct >= 80 ? "#FEF3C7" : pct >= 60 ? "#FEF9C3" : "#FEE2E2" }}>
          {pct === 100 ? "🏆" : pct >= 80 ? "⭐" : pct >= 60 ? "👍" : "📚"}
        </div>
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--foreground)" }}>
          {pct === 100 ? "완벽해요! 만점이에요 🎉" : pct >= 80 ? "잘했어요!" : pct >= 60 ? "꽤 잘했어요!" : "다시 도전해봐요!"}
        </h1>
        <p className="inline-flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}><LanguageIcon language={selectedLang} size={18} />{langMeta.label} 레슨 완료</p>
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
      {isPremium && resultWrongs.length > 0 && (
        <div className="bg-white rounded-2xl border border-border p-5 mb-4">
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <AlertTriangle size={16} style={{ color: "#F59E0B" }} />틀린 문제 ({resultWrongs.length}개)
          </h3>
          <div className="space-y-2">
            {resultWrongs.map(w => (
              <div key={w.qId} className="rounded-xl px-4 py-3 text-sm" style={{ background: "#FEF2F2" }}>
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button onClick={onHome} className="py-3.5 rounded-xl font-bold text-white text-sm" style={{ background: "var(--primary)" }}>홈으로</button>
        {nextDiff && onNextDifficulty && (
          <button onClick={onNextDifficulty} className="py-3.5 rounded-xl font-bold text-white text-sm" style={{ background: DIFFICULTY_META[nextDiff].color }}>
            {DIFFICULTY_META[nextDiff].label}으로
          </button>
        )}
        <button onClick={onRetry} className="py-3.5 rounded-xl font-bold text-sm border-2" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
          <RotateCcw size={14} className="inline mr-1" />다시 도전
        </button>
      </div>
    </div>
  );
}
