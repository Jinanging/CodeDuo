import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart2,
  BookOpen,
  CheckCircle2,
  Code2,
  Crown,
  Flame,
  Heart,
  Home,
  Lock,
  LogOut,
  NotebookPen,
  Play,
  Sparkles,
  Trophy,
  User,
  Users,
  XCircle,
  Zap
} from "lucide-react";
import { Bar, BarChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import "./styles.css";

type Screen = "login" | "home" | "lesson" | "result" | "errors" | "analytics" | "friends" | "profile" | "upgrade";
type UserProfile = { id: number; email: string; nickname: string; tier: "free" | "premium"; xp: number; streak: number; hearts: number; avatar: string };
type Course = { id: number; title: string; language: string; description: string; level: string };
type Lesson = { id: number; courseId: number; title: string; description: string; orderIndex: number };
type Problem = {
  id: number;
  lessonId: number;
  type: string;
  language: string;
  title: string;
  description: string;
  codeTemplate?: string;
  optionsJson?: string;
  hint?: string;
  explanation?: string;
  testCasesJson?: string;
};
type SubmissionResult = { correct: boolean; score: number; resultMessage: string; aiReview?: string; runtimeMs?: number; memoryKb?: number; testResultsJson?: string };

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("codeduo_token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {})
    }
  });
  const body = await res.json();
  if (!res.ok || !body.success) throw new Error(body.message ?? "요청 실패");
  return body.data;
}

function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [lastResult, setLastResult] = useState<SubmissionResult | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("codeduo_token");
    if (token) {
      api<UserProfile>("/api/users/me")
        .then((me) => {
          setUser(me);
          setScreen("home");
          return loadCourses();
        })
        .catch(() => localStorage.removeItem("codeduo_token"));
    }
  }, []);

  const loadCourses = async () => {
    const data = await api<Course[]>("/api/courses");
    setCourses(data);
    setSelectedCourse(data[0] ?? null);
    if (data[0]) {
      const lessonData = await api<Lesson[]>(`/api/courses/${data[0].id}/lessons`);
      setLessons(lessonData);
    }
  };

  const login = async (email: string, password: string, mode: "login" | "signup", nickname?: string) => {
    const data = await api<{ accessToken: string; user: UserProfile }>(`/api/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify(mode === "signup" ? { email, password, nickname } : { email, password })
    });
    localStorage.setItem("codeduo_token", data.accessToken);
    setUser(data.user);
    setScreen("home");
    await loadCourses();
  };

  const startLesson = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    const data = await api<Problem[]>(`/api/lessons/${lesson.id}/problems`);
    setProblems(data);
    setCurrentIndex(0);
    setAnswers({});
    setLastResult(null);
    setScreen("lesson");
  };

  const submitCurrent = async () => {
    const problem = problems[currentIndex];
    const answer = answers[problem.id] ?? "";
    const result = await api<SubmissionResult>("/api/submissions", {
      method: "POST",
      body: JSON.stringify({ problemId: problem.id, answer })
    });
    setLastResult(result);
    if (currentIndex === problems.length - 1) {
      setScreen("result");
    } else {
      setCurrentIndex((v) => v + 1);
    }
  };

  const logout = () => {
    localStorage.removeItem("codeduo_token");
    setUser(null);
    setScreen("login");
  };

  if (!user || screen === "login") {
    return <AuthScreen onLogin={login} message={message} setMessage={setMessage} />;
  }

  return (
    <div className="shell">
      {screen !== "lesson" && screen !== "result" && screen !== "upgrade" && <Sidebar screen={screen} setScreen={setScreen} user={user} logout={logout} />}
      <main className="main">
        {screen === "home" && <HomePage user={user} courses={courses} lessons={lessons} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} setLessons={setLessons} startLesson={startLesson} />}
        {screen === "lesson" && problems[currentIndex] && <LessonPage problem={problems[currentIndex]} answer={answers[problems[currentIndex].id] ?? ""} setAnswer={(v) => setAnswers((prev) => ({ ...prev, [problems[currentIndex].id]: v }))} onBack={() => setScreen("home")} onSubmit={submitCurrent} index={currentIndex} total={problems.length} />}
        {screen === "result" && <ResultPage result={lastResult} onHome={() => setScreen("home")} onRetry={() => selectedLesson && startLesson(selectedLesson)} />}
        {screen === "errors" && <ErrorsPage />}
        {screen === "analytics" && <AnalyticsPage user={user} />}
        {screen === "friends" && <FriendsPage />}
        {screen === "profile" && <ProfilePage user={user} onUpgrade={() => setScreen("upgrade")} />}
        {screen === "upgrade" && <UpgradePage onBack={() => setScreen("profile")} />}
      </main>
    </div>
  );
}

function AuthScreen({ onLogin, message, setMessage }: { onLogin: (email: string, password: string, mode: "login" | "signup", nickname?: string) => Promise<void>; message: string; setMessage: (m: string) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("demo@codeduo.dev");
  const [password, setPassword] = useState("password");
  const [nickname, setNickname] = useState("newbie");
  return (
    <div className="auth">
      <section className="authBrand">
        <div className="brand"><Code2 /> CodeDuo</div>
        <h1>진짜 코드를 짜면서 쉽게 배우는 코딩 학습</h1>
        <p>객관식, 빈칸, 단답형, 코드 문제를 풀고 실행 기반 채점과 AI 리뷰를 받아보세요.</p>
        <div className="check"><CheckCircle2 /> 백엔드 API와 바로 연결되는 MVP</div>
        <div className="check"><CheckCircle2 /> Swagger, JWT, Judge0 경계 포함</div>
      </section>
      <form className="authForm" onSubmit={(e) => { e.preventDefault(); onLogin(email, password, mode, nickname).catch((err) => setMessage(err.message)); }}>
        <h2>{mode === "login" ? "로그인" : "회원가입"}</h2>
        {mode === "signup" && <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임" />}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="비밀번호" />
        {message && <p className="error">{message}</p>}
        <button>{mode === "login" ? "시작하기" : "가입하기"}</button>
        <button type="button" className="ghost" onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "새 계정 만들기" : "로그인으로 돌아가기"}</button>
      </form>
    </div>
  );
}

function Sidebar({ screen, setScreen, user, logout }: { screen: Screen; setScreen: (s: Screen) => void; user: UserProfile; logout: () => void }) {
  const items: { id: Screen; label: string; icon: React.ElementType; premium?: boolean }[] = [
    { id: "home", label: "홈", icon: Home },
    { id: "errors", label: "오답", icon: NotebookPen, premium: true },
    { id: "analytics", label: "분석", icon: BarChart2, premium: true },
    { id: "friends", label: "친구", icon: Users },
    { id: "profile", label: "나", icon: User }
  ];
  return (
    <aside className="sidebar">
      <div className="brand"><Code2 /> CodeDuo</div>
      <nav>{items.map(({ id, label, icon: Icon, premium }) => <button className={screen === id ? "active" : ""} onClick={() => setScreen(id)} key={id}><Icon size={18} /> {label}{premium && user.tier === "free" && <Lock size={12} />}</button>)}</nav>
      <button className="logout" onClick={logout}><LogOut size={16} /> 로그아웃</button>
    </aside>
  );
}

function HomePage({ user, courses, lessons, selectedCourse, setSelectedCourse, setLessons, startLesson }: { user: UserProfile; courses: Course[]; lessons: Lesson[]; selectedCourse: Course | null; setSelectedCourse: (c: Course) => void; setLessons: (l: Lesson[]) => void; startLesson: (l: Lesson) => void }) {
  const selectCourse = async (course: Course) => {
    setSelectedCourse(course);
    setLessons(await api<Lesson[]>(`/api/courses/${course.id}/lessons`));
  };
  return (
    <div>
      <header className="top">
        <div><h1>오늘의 학습</h1><p>{user.nickname}님, 연속 {user.streak}일 학습 중입니다.</p></div>
        <div className="stats"><span><Flame /> {user.streak}</span><span><Heart /> {user.hearts}</span><span><Zap /> {user.xp} XP</span></div>
      </header>
      <div className="courseTabs">{courses.map((c) => <button className={selectedCourse?.id === c.id ? "active" : ""} onClick={() => selectCourse(c)} key={c.id}>{c.language.toUpperCase()} {c.title}</button>)}</div>
      <section className="grid">{lessons.map((lesson) => <article className="card" key={lesson.id}><BookOpen /><h3>{lesson.title}</h3><p>{lesson.description}</p><button onClick={() => startLesson(lesson)}>레슨 시작</button></article>)}</section>
    </div>
  );
}

function LessonPage({ problem, answer, setAnswer, onBack, onSubmit, index, total }: { problem: Problem; answer: string; setAnswer: (v: string) => void; onBack: () => void; onSubmit: () => void; index: number; total: number }) {
  const options = useMemo(() => problem.optionsJson ? JSON.parse(problem.optionsJson) as string[] : [], [problem.optionsJson]);
  return (
    <div className="lessonPage">
      <button className="ghost" onClick={onBack}>← 홈</button>
      <div className="progressLine"><span style={{ width: `${((index + 1) / total) * 100}%` }} /></div>
      <section className="problem">
        <span className="badge">{problem.type}</span>
        <h1>{problem.title}</h1>
        <p>{problem.description}</p>
        {problem.hint && <div className="hint">힌트: {problem.hint}</div>}
        {problem.type === "MULTIPLE_CHOICE" ? <div className="options">{options.map((opt, i) => <button className={answer === String(i) ? "active" : ""} onClick={() => setAnswer(String(i))} key={opt}>{opt}</button>)}</div> : <textarea value={answer || problem.codeTemplate || ""} onChange={(e) => setAnswer(e.target.value)} />}
        <button className="primary" onClick={onSubmit}><Play size={16} /> 제출</button>
      </section>
    </div>
  );
}

function ResultPage({ result, onHome, onRetry }: { result: SubmissionResult | null; onHome: () => void; onRetry: () => void }) {
  return <div className="centerPanel">{result?.correct ? <Trophy className="successIcon" /> : <XCircle className="failIcon" />}<h1>{result?.resultMessage ?? "레슨 완료"}</h1><p>점수 {result?.score ?? 0}점</p>{result?.aiReview && <div className="review"><Sparkles /> {result.aiReview}</div>}<button onClick={onHome}>홈으로</button><button className="ghost" onClick={onRetry}>다시 풀기</button></div>;
}

function ErrorsPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { api<any[]>("/api/wrong-answers").then(setItems); }, []);
  return <Page title="오답노트" subtitle="틀린 문제를 다시 확인하세요.">{items.length === 0 ? <Empty text="아직 오답이 없습니다." /> : items.map((w) => <article className="card" key={w.id}><XCircle /><h3>{w.question}</h3><p>내 답: {w.lastAnswer}</p><p>정답: {w.correctAnswer}</p></article>)}</Page>;
}

function AnalyticsPage({ user }: { user: UserProfile }) {
  const [data, setData] = useState<any | null>(null);
  useEffect(() => { api<any>("/api/analytics").then(setData); }, []);
  if (user.tier === "free") return <Locked title="분석은 프리미엄 기능입니다." />;
  return <Page title="취약점 분석" subtitle="학습 데이터를 기반으로 약점을 확인합니다.">{data && <><div className="chart"><ResponsiveContainer><RadarChart data={data.weakness}><PolarGrid /><PolarAngleAxis dataKey="subject" /><Radar dataKey="score" fill="#7c3aed" fillOpacity={0.35} stroke="#7c3aed" /></RadarChart></ResponsiveContainer></div><div className="chart"><ResponsiveContainer><BarChart data={data.activity}><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="solved" fill="#10b981" /></BarChart></ResponsiveContainer></div></>}</Page>;
}

function FriendsPage() {
  const [data, setData] = useState<any | null>(null);
  useEffect(() => { api<any>("/api/friends").then(setData); }, []);
  return <Page title="친구 & 그룹" subtitle="함께 공부하고 성장하세요.">{data?.users.map((u: any) => <article className="row" key={u.id}><strong>{u.avatar}</strong><div>{u.username}<small>Lv.{u.level} · {u.xp} XP</small></div><button>{u.friend ? "친구" : "추가"}</button></article>)}</Page>;
}

function ProfilePage({ user, onUpgrade }: { user: UserProfile; onUpgrade: () => void }) {
  return <Page title="프로필" subtitle={user.email}><div className="profile"><div className="avatar">{user.avatar}</div><h2>{user.nickname}</h2><p>{user.tier.toUpperCase()} · {user.xp} XP · {user.streak}일 연속</p>{user.tier === "free" && <button onClick={onUpgrade}><Crown size={16} /> 프리미엄 보기</button>}</div></Page>;
}

function UpgradePage({ onBack }: { onBack: () => void }) {
  return <div className="centerPanel"><Crown className="successIcon" /><h1>CodeDuo 프리미엄</h1><p>AI 코드 리뷰, 오답 전체 이력, 취약점 분석을 잠금 해제합니다.</p><button onClick={onBack}>돌아가기</button></div>;
}

function Page({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <div><header className="top"><div><h1>{title}</h1><p>{subtitle}</p></div></header><section className="grid">{children}</section></div>;
}

function Empty({ text }: { text: string }) {
  return <div className="empty"><CheckCircle2 /> {text}</div>;
}

function Locked({ title }: { title: string }) {
  return <div className="centerPanel"><Lock className="failIcon" /><h1>{title}</h1><p>무료 플랜에서는 미리보기만 제공됩니다.</p></div>;
}

createRoot(document.getElementById("root")!).render(<App />);
