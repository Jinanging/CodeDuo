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

// ─── ADMIN PAGE ──────────────────────────────────────────────────────────────

type AdminForm = {
  lessonId: number;
  type: "MULTIPLE_CHOICE" | "FILL_BLANK" | "SHORT_ANSWER" | "CODE" | "ESSAY";
  language: "PYTHON" | "JAVA" | "C" | "CPP";
  difficulty: number;
  title: string;
  description: string;
  answer: string;
  correctOptionIndex: string;
  codeTemplate: string;
  testInput: string;
  expectedOutput: string;
  rubric: string;
  optionsJson: string;
  hint: string;
  explanation: string;
  tagsJson: string;
  testCasesJson: string;
  orderIndex: string;
};

const emptyAdminForm = (lessonId = 1): AdminForm => ({
  lessonId,
  type: "MULTIPLE_CHOICE",
  language: "PYTHON",
  difficulty: 1,
  title: "",
  description: "",
  answer: "",
  correctOptionIndex: "",
  codeTemplate: "",
  testInput: "",
  expectedOutput: "",
  rubric: "",
  optionsJson: "[\"\", \"\", \"\", \"\"]",
  hint: "",
  explanation: "",
  tagsJson: "[]",
  testCasesJson: "[{\"input\":\"\", \"expected\":\"\"}]",
  orderIndex: "",
});

export function AdminPage({ user }: { user: UserProfile }) {
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [problems, setProblems] = useState<AdminProblem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminForm>(emptyAdminForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedProblem = problems.find(problem => problem.id === selectedId) ?? null;

  const fillForm = (problem: AdminProblem) => {
    setSelectedId(problem.id);
    setForm({
      lessonId: problem.lessonId,
      type: problem.type as AdminForm["type"],
      language: problem.language as AdminForm["language"],
      difficulty: problem.difficulty,
      title: problem.title ?? "",
      description: problem.description ?? "",
      answer: problem.answer ?? "",
      correctOptionIndex: problem.correctOptionIndex === undefined || problem.correctOptionIndex === null ? "" : String(problem.correctOptionIndex),
      codeTemplate: problem.codeTemplate ?? "",
      testInput: problem.testInput ?? "",
      expectedOutput: problem.expectedOutput ?? "",
      rubric: problem.rubric ?? "",
      optionsJson: problem.optionsJson ?? "[\"\", \"\", \"\", \"\"]",
      hint: problem.hint ?? "",
      explanation: problem.explanation ?? "",
      tagsJson: problem.tagsJson ?? "[]",
      testCasesJson: problem.testCasesJson ?? "[{\"input\":\"\", \"expected\":\"\"}]",
      orderIndex: String(problem.orderIndex),
    });
  };

  const loadAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      const [lessonList, problemList] = await Promise.all([getAdminLessons(), getAdminProblems()]);
      setLessons(lessonList);
      setProblems(problemList);
      if (!selectedId) setForm(emptyAdminForm(lessonList[0]?.id ?? 1));
    } catch (e) {
      setError(e instanceof Error ? e.message : "관리자 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const updateField = <K extends keyof AdminForm>(key: K, value: AdminForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validateJson = (label: string, value: string) => {
    if (!value.trim()) return;
    try {
      JSON.parse(value);
    } catch {
      throw new Error(`${label} JSON 형식이 올바르지 않습니다.`);
    }
  };

  const toPayload = (): AdminProblemPayload => {
    validateJson("선택지", form.optionsJson);
    validateJson("태그", form.tagsJson);
    validateJson("테스트케이스", form.testCasesJson);
    return {
      lessonId: form.lessonId,
      type: form.type,
      language: form.language,
      difficulty: form.difficulty,
      title: form.title.trim(),
      description: form.description.trim(),
      answer: form.type === "MULTIPLE_CHOICE" ? "" : form.answer.trim(),
      correctOptionIndex: form.type === "MULTIPLE_CHOICE" && form.correctOptionIndex.trim() ? Number(form.correctOptionIndex) : undefined,
      codeTemplate: form.codeTemplate,
      testInput: form.testInput,
      expectedOutput: form.expectedOutput,
      rubric: form.rubric,
      optionsJson: form.optionsJson,
      hint: form.hint,
      explanation: form.explanation,
      tagsJson: form.tagsJson,
      testCasesJson: form.testCasesJson,
      orderIndex: form.orderIndex.trim() ? Number(form.orderIndex) : undefined,
    };
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = toPayload();
      if (!payload.title || !payload.description) {
        setError("제목과 문제 설명은 필수입니다.");
        return;
      }
      if (payload.type === "MULTIPLE_CHOICE" && payload.correctOptionIndex === undefined) {
        setError("객관식 문제는 정답 보기 번호를 선택해야 합니다.");
        return;
      }
      const saved = selectedId ? await updateAdminProblem(selectedId, payload) : await createAdminProblem(payload);
      setMessage(selectedId ? "문제를 수정했습니다." : "문제를 추가했습니다.");
      setProblems(await getAdminProblems());
      fillForm(saved);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId || !window.confirm("이 문제를 삭제할까요?")) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await deleteAdminProblem(selectedId);
      setSelectedId(null);
      setForm(emptyAdminForm(lessons[0]?.id ?? 1));
      setProblems(await getAdminProblems());
      setMessage("문제를 삭제했습니다.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-purple-400";
  const labelClass = "text-xs font-bold uppercase";

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: "var(--foreground)" }}>문제 관리</h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{user.email} 계정으로 DB 문제를 추가하고 수정합니다.</p>
          </div>
          <button onClick={() => { setSelectedId(null); setForm(emptyAdminForm(lessons[0]?.id ?? 1)); }} className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: "var(--primary)" }}>새 문제</button>
        </div>

        {loading ? (
          <div className="rounded-lg border border-border bg-white p-6 text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>불러오는 중...</div>
        ) : (
          <div className="grid lg:grid-cols-[360px_1fr] gap-5">
            <aside className="rounded-lg border border-border bg-white overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="font-bold" style={{ color: "var(--foreground)" }}>문제 목록</span>
                <button onClick={loadAdminData} className="text-xs font-bold" style={{ color: "var(--primary)" }}>새로고침</button>
              </div>
              <div className="max-h-[720px] overflow-auto">
                {problems.map(problem => (
                  <button key={problem.id} onClick={() => fillForm(problem)} className="w-full text-left p-4 border-b border-border transition-colors" style={{ background: selectedId === problem.id ? "var(--secondary)" : "#fff" }}>
                    <div className="flex items-center gap-2 text-xs font-bold mb-1" style={{ color: "var(--primary)" }}>
                      <span>{problem.language}</span><span>{problem.difficulty}</span><span>#{problem.orderIndex}</span><span>{problem.type}</span>
                    </div>
                    <div className="font-bold text-sm line-clamp-1" style={{ color: "var(--foreground)" }}>{problem.title}</div>
                    <div className="text-xs mt-1 line-clamp-2" style={{ color: "var(--muted-foreground)" }}>{problem.description}</div>
                  </button>
                ))}
              </div>
            </aside>

            <section className="rounded-lg border border-border bg-white p-5">
              <div className="grid md:grid-cols-4 gap-3 mb-4">
                <div>
                  <label className={labelClass}>레슨</label>
                  <select className={inputClass} value={form.lessonId} onChange={e => updateField("lessonId", Number(e.target.value))}>
                    {lessons.map(lesson => <option key={lesson.id} value={lesson.id}>{lesson.language} · {lesson.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>언어</label>
                  <select className={inputClass} value={form.language} onChange={e => updateField("language", e.target.value as AdminForm["language"])}>
                    {["PYTHON", "JAVA", "C", "CPP"].map(lang => <option key={lang}>{lang}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>난이도</label>
                  <input className={inputClass} type="number" min={1} max={9} value={form.difficulty} onChange={e => updateField("difficulty", Number(e.target.value))} />
                </div>
                <div>
                  <label className={labelClass}>순서</label>
                  <input className={inputClass} type="number" placeholder="자동" value={form.orderIndex} onChange={e => updateField("orderIndex", e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className={labelClass}>타입</label>
                  <select className={inputClass} value={form.type} onChange={e => updateField("type", e.target.value as AdminForm["type"])}>
                    {["MULTIPLE_CHOICE", "FILL_BLANK", "SHORT_ANSWER", "CODE", "ESSAY"].map(type => <option key={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>{form.type === "MULTIPLE_CHOICE" ? "정답 보기 번호" : "정답"}</label>
                  {form.type === "MULTIPLE_CHOICE" ? (
                    <select className={inputClass} value={form.correctOptionIndex} onChange={e => updateField("correctOptionIndex", e.target.value)}>
                      <option value="">선택</option>
                      <option value="0">A / 0번</option>
                      <option value="1">B / 1번</option>
                      <option value="2">C / 2번</option>
                      <option value="3">D / 3번</option>
                    </select>
                  ) : (
                    <input className={inputClass} value={form.answer} onChange={e => updateField("answer", e.target.value)} placeholder="단답형/빈칸형 정답 문자열" />
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className={labelClass}>제목</label>
                <input className={inputClass} value={form.title} onChange={e => updateField("title", e.target.value)} />
              </div>
              <div className="mb-4">
                <label className={labelClass}>문제 설명</label>
                <textarea className={`${inputClass} min-h-24`} value={form.description} onChange={e => updateField("description", e.target.value)} />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div><label className={labelClass}>선택지 JSON</label><textarea className={`${inputClass} min-h-24 font-mono`} value={form.optionsJson} onChange={e => updateField("optionsJson", e.target.value)} /></div>
                <div><label className={labelClass}>태그 JSON</label><textarea className={`${inputClass} min-h-24 font-mono`} value={form.tagsJson} onChange={e => updateField("tagsJson", e.target.value)} /></div>
                <div><label className={labelClass}>힌트</label><textarea className={`${inputClass} min-h-24`} value={form.hint} onChange={e => updateField("hint", e.target.value)} /></div>
                <div><label className={labelClass}>해설</label><textarea className={`${inputClass} min-h-24`} value={form.explanation} onChange={e => updateField("explanation", e.target.value)} /></div>
                <div className="md:col-span-2"><label className={labelClass}>코드 템플릿</label><textarea className={`${inputClass} min-h-36 font-mono`} value={form.codeTemplate} onChange={e => updateField("codeTemplate", e.target.value)} /></div>
                <div><label className={labelClass}>공개 예시 입력</label><textarea className={`${inputClass} min-h-20 font-mono`} value={form.testInput} onChange={e => updateField("testInput", e.target.value)} /></div>
                <div><label className={labelClass}>공개 예시 출력</label><textarea className={`${inputClass} min-h-20 font-mono`} value={form.expectedOutput} onChange={e => updateField("expectedOutput", e.target.value)} /></div>
                <div className="md:col-span-2"><label className={labelClass}>숨김 테스트케이스 JSON</label><textarea className={`${inputClass} min-h-32 font-mono`} value={form.testCasesJson} onChange={e => updateField("testCasesJson", e.target.value)} placeholder='[{"input":"2 3","expected":"5"}]' /></div>
                <div className="md:col-span-2"><label className={labelClass}>서술형 루브릭</label><textarea className={`${inputClass} min-h-24`} value={form.rubric} onChange={e => updateField("rubric", e.target.value)} /></div>
              </div>

              {(message || error) && <div className="mt-4 rounded-lg p-3 text-sm font-bold" style={{ background: error ? "#FEF2F2" : "#ECFDF5", color: error ? "#DC2626" : "#047857" }}>{error || message}</div>}

              <div className="flex items-center justify-between mt-5">
                <button onClick={handleDelete} disabled={!selectedProblem || saving} className="px-4 py-2 rounded-lg text-sm font-bold border border-red-200 disabled:opacity-40" style={{ color: "#DC2626" }}>삭제</button>
                <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-60" style={{ background: "var(--primary)" }}>{saving ? "저장 중..." : selectedProblem ? "수정 저장" : "문제 추가"}</button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
