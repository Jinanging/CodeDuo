import { useEffect, useState } from "react";
import { BookOpen, BarChart2, Home, Lock, NotebookPen, User, Users } from "lucide-react";
import {
  login as apiLogin, signup as apiSignup, updateProfile as apiUpdateProfile,
  upgradeToPremium as apiUpgradeToPremium, heartbeat as apiHeartbeat, getMe, hasToken, clearToken, fetchAnalytics, getLanguageXp,
  type BackendUser,
} from "./api";
import type { Difficulty, Language, Screen, Tier, UserProfile, WrongAnswer } from "./types";
import {
  EMPTY_WEEKLY_ACTIVITY, LANG_META, PATH_SCREENS, SCREEN_PATHS, firstTopicFor,
  isAdminUser, nextDifficulty, normalizeWeeklyActivity, parseRouteQuery,
} from "./constants";
import {
  AdminPage, AIInterviewPage, AnalyticsPage, AuthScreen, ErrorNotebookPage,
  FriendsPage, HomePage, LessonPage, LessonSelectPage, ProfilePage, ResultPage,
  Sidebar, UpgradePage, WrongAnswerReviewPage,
} from "./pages";

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const initialQuery = parseRouteQuery();
  const initialScreen = PATH_SCREENS[window.location.pathname] ?? "login";
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">(initialScreen === "register" ? "register" : "login");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedLang, setSelectedLang] = useState<Language>(initialQuery.lang ?? "python");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(initialQuery.difficulty ?? "beginner");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(initialQuery.topic);
  const [lessonResult, setLessonResult] = useState<{ correct: number; total: number; wrongs: WrongAnswer[] } | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [sessionWrongs, setSessionWrongs] = useState<WrongAnswer[]>([]);
  const [resolvedWrongIds, setResolvedWrongIds] = useState<number[]>([]);

  const makeLangXp = () => Object.fromEntries((Object.keys(LANG_META) as Language[]).map(l => [l, 0])) as Record<Language, number>;

  const profileFromBackend = (u: BackendUser): UserProfile => {
    const tier: Tier = String(u.tier).toLowerCase().includes("premium") ? "premium" : "free";
    return {
      id: String(u.id),
      username: u.nickname,
      email: u.email,
      tier,
      xp: u.xp,
      streak: u.streak,
      hearts: u.hearts,
      totalSolved: 0,
      langXp: makeLangXp(),
      weeklyActivity: EMPTY_WEEKLY_ACTIVITY(),
      friendIds: [],
      groupIds: [],
      avatar: u.avatar || u.nickname.slice(0, 2).toUpperCase(),
    };
  };

  // 로그인 직후와 제출 완료 후 실제 XP·풀이 수·주간 활동을 백엔드 값으로 동기화한다.
  const refreshProgress = async () => {
    const [languageXpResult, analyticsResult] = await Promise.allSettled([
      getLanguageXp(),
      fetchAnalytics(),
    ]);
    setUser((current) => {
      if (!current) return current;
      const next = { ...current };
      if (languageXpResult.status === "fulfilled") {
        const langXp = { ...current.langXp };
        (Object.keys(LANG_META) as Language[]).forEach(language => {
          const value = languageXpResult.value[language];
          langXp[language] = Number.isFinite(value) ? Math.max(0, value) : 0;
        });
        next.langXp = langXp;
      }
      if (analyticsResult.status === "fulfilled") {
        next.totalSolved = Math.max(0, analyticsResult.value.summary.totalSolved);
        next.weeklyActivity = normalizeWeeklyActivity(analyticsResult.value.activity);
      }
      return next;
    });
  };

  const [upgradeReturnScreen, setUpgradeReturnScreen] = useState<Screen>("profile");

  const buildRoute = (next: Screen, query: { lang?: Language; difficulty?: Difficulty; topic?: string | null } = {}) => {
    const params = new URLSearchParams();
    const learningScreen = ["home", "lessonSelect", "lesson", "result"].includes(next);
    if (learningScreen) params.set("lang", query.lang ?? selectedLang);
    if (next === "lesson") params.set("difficulty", query.difficulty ?? selectedDifficulty);
    const topic = Object.prototype.hasOwnProperty.call(query, "topic") ? query.topic : selectedTopic;
    if ((next === "lesson" || next === "lessonSelect") && topic) params.set("topic", topic);
    const queryString = params.toString();
    return `${SCREEN_PATHS[next]}${queryString ? `?${queryString}` : ""}`;
  };

  const navigate = (next: Screen, replace = false, query: { lang?: Language; difficulty?: Difficulty; topic?: string | null } = {}) => {
    setScreen(next);
    const path = buildRoute(next, query);
    const current = `${window.location.pathname}${window.location.search}`;
    if (current !== path) {
      const state = { screen: next };
      if (replace) window.history.replaceState(state, "", path);
      else window.history.pushState(state, "", path);
    }
  };

  const handleLangChange = (lang: Language) => {
    setSelectedLang(lang);
    setSelectedTopic(null);
    navigate(screen, true, { lang, topic: null });
  };

  const handleTopicChange = (topic: string | null) => {
    setSelectedTopic(topic);
    navigate(screen, true, { topic });
  };

  const openUpgrade = (from: Screen) => {
    setUpgradeReturnScreen(from);
    navigate("upgrade");
  };

  useEffect(() => {
    const onPopState = () => {
      const query = parseRouteQuery();
      const nextScreen = PATH_SCREENS[window.location.pathname] ?? "login";
      setScreen(nextScreen);
      if (nextScreen === "login" || nextScreen === "register") setAuthMode(nextScreen);
      if (query.lang) setSelectedLang(query.lang);
      if (query.difficulty) setSelectedDifficulty(query.difficulty);
      setSelectedTopic(query.topic);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/") navigate("login", true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const restoreSession = async () => {
      let restored: UserProfile | null = null;
      if (hasToken()) {
        try {
          restored = profileFromBackend(await getMe());
        } catch {
          clearToken();
        }
      }
      if (cancelled) return;

      if (restored) {
        setUser(restored);
        refreshProgress();
        if (screen === "login" || screen === "register") navigate("home", true);
      } else if (screen !== "login" && screen !== "register") {
        navigate("login", true);
      }
      setAuthLoading(false);
    };

    restoreSession();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!user) return;
    void apiHeartbeat().catch(() => {});
    const heartbeatTimer = window.setInterval(() => {
      void apiHeartbeat().catch(() => {});
    }, 30_000);
    return () => window.clearInterval(heartbeatTimer);
  }, [user?.id]);

  const handleLogin = async (email: string, password: string, mode: "login" | "register", username: string) => {
    // 실제 백엔드 로그인/회원가입만 허용(DB에 있는 계정만). 에러는 AuthScreen이 표시.
    const u = mode === "register" ? await apiSignup(email, password, username) : await apiLogin(email, password);
    const profile = profileFromBackend(u);
    setUser(profile);
    navigate("home");
    refreshProgress();
  };

  const handleComplete = (correct: number, total: number, wrongs: WrongAnswer[], earned: number) => {
    setXpEarned(earned);
    setSessionWrongs(prev => [...prev, ...wrongs]);
    if (user) setUser(u => u ? {
      ...u,
      xp: u.xp + earned,
      langXp: { ...u.langXp, [selectedLang]: u.langXp[selectedLang] + earned },
    } : u);
    setLessonResult({ correct, total, wrongs });
    navigate("result");
    // 백엔드에 저장된 최신 XP/스트릭으로 동기화
    getMe().then((u) => setUser((p) => (p ? { ...p, xp: u.xp, streak: u.streak, hearts: u.hearts } : p))).catch(() => {});
    refreshProgress();
  };

  const handleLogout = () => {
    setUser(null);
    clearToken();
    setAuthMode("login");
    navigate("login");
  };
  const handleUpgrade = async () => {
    try {
      const updated = await apiUpgradeToPremium();
      setUser(u => u ? { ...u, tier: updated.tier as Tier } : u);
      navigate(upgradeReturnScreen);
    } catch (error) {
      alert(error instanceof Error ? error.message : "업그레이드에 실패했습니다.");
    }
  };
  const handleProfileSave = async (patch: Pick<UserProfile, "username" | "email" | "avatar">) => {
    try {
      const updated = await apiUpdateProfile({ nickname: patch.username, email: patch.email, avatar: patch.avatar });
      setUser(u => {
        if (!u) return u;
        return { ...u, username: updated.nickname, email: updated.email, avatar: updated.avatar };
      });
    } catch (e) {
      if (!user?.id || user.id === "me") {
        setUser(u => {
          if (!u) return u;
          return { ...u, ...patch };
        });
        return;
      }
      throw e;
    }
  };
  const handleResolveWrong = (qId: number) => {
    setResolvedWrongIds(prev => prev.includes(qId) ? prev : [...prev, qId]);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-sm font-semibold" style={{ color: "var(--muted-foreground)", background: "var(--background)" }}>불러오는 중...</div>;
  }

  if (screen === "login" || screen === "register" || !user) {
    return <AuthScreen
      mode={authMode}
      onSwitch={() => {
        const next = authMode === "login" ? "register" : "login";
        setAuthMode(next);
        navigate(next);
      }}
      onLogin={handleLogin}
    />;
  }

  const renderContent = () => {
    switch (screen) {
      case "home":     return <HomePage user={user} onStartLesson={() => navigate("lessonSelect")} selectedLang={selectedLang} setSelectedLang={handleLangChange} onNav={navigate} />;
      case "lessonSelect": return <LessonSelectPage selectedLang={selectedLang} setSelectedLang={handleLangChange} selectedTopic={selectedTopic} setSelectedTopic={handleTopicChange} onStart={(d, topic) => { setSelectedDifficulty(d); setSelectedTopic(topic ?? null); navigate("lesson", false, { difficulty: d, topic: topic ?? null }); }} onBack={() => navigate("home")} />;
      case "lesson":   return <LessonPage user={user} selectedLang={selectedLang} difficulty={selectedDifficulty} selectedTopic={selectedTopic} onComplete={handleComplete} onBack={() => navigate("lessonSelect")} />;
      case "result":   return <ResultPage
        user={user}
        correct={lessonResult?.correct ?? 0}
        total={lessonResult?.total ?? 0}
        xpEarned={xpEarned}
        wrongs={lessonResult?.wrongs ?? []}
        selectedLang={selectedLang}
        difficulty={selectedDifficulty}
        onHome={() => navigate("home")}
        onRetry={() => navigate("lesson", false, { difficulty: selectedDifficulty, topic: selectedTopic ?? firstTopicFor(selectedLang) })}
        onNextDifficulty={() => {
          const nextDiff = nextDifficulty(selectedDifficulty);
          if (!nextDiff) return;
          setSelectedDifficulty(nextDiff);
          navigate("lesson", false, { difficulty: nextDiff, topic: selectedTopic ?? firstTopicFor(selectedLang) });
        }}
        onUpgrade={() => openUpgrade("result")}
      />;
      case "analytics":return <AnalyticsPage
        user={user}
        onUpgrade={() => openUpgrade("analytics")}
        onStartLearning={(language, difficulty, topic) => {
          const nextTopic = topic ?? firstTopicFor(language);
          setSelectedLang(language);
          setSelectedDifficulty(difficulty);
          setSelectedTopic(nextTopic);
          navigate("lesson", false, { lang: language, difficulty, topic: nextTopic });
        }}
      />;
      case "errors":   return <ErrorNotebookPage user={user} sessionWrongs={sessionWrongs} resolvedIds={resolvedWrongIds} onReview={() => navigate("wrongReview")} onInterview={() => navigate("interview")} onUpgrade={() => openUpgrade("errors")} />;
      case "wrongReview": return <WrongAnswerReviewPage user={user} sessionWrongs={sessionWrongs} resolvedIds={resolvedWrongIds} onResolve={handleResolveWrong} onBack={() => navigate("errors")} />;
      case "interview": return <AIInterviewPage user={user} onBack={() => navigate("errors")} />;
      case "friends":  return <FriendsPage user={user} />;
      case "profile":  return <ProfilePage user={user} onUpgrade={() => openUpgrade("profile")} onSave={handleProfileSave} />;
      case "admin":    return isAdminUser(user) ? <AdminPage user={user} /> : <HomePage user={user} onStartLesson={() => navigate("lessonSelect")} selectedLang={selectedLang} setSelectedLang={handleLangChange} onNav={navigate} />;
      case "upgrade":  return <UpgradePage onBack={() => navigate(upgradeReturnScreen)} onUpgrade={handleUpgrade} />;
      default:         return null;
    }
  };

  const showNav = !["lesson", "result", "upgrade"].includes(screen);

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "Outfit, sans-serif", background: "var(--background)" }}>
      {/* Desktop sidebar */}
      {showNav && <Sidebar screen={screen} onNav={navigate} user={user} onLogout={handleLogout} />}

      {/* Main content — add bottom padding on mobile so tab bar doesn't overlap */}
      <main className={`flex-1 overflow-y-auto ${showNav ? "pb-20 md:pb-0" : ""}`}>
        {renderContent()}
      </main>

      {/* Mobile bottom tab bar */}
      {showNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border flex items-center" style={{ background: "#ffffff" }}>
          {[
            { id: "home",      label: "홈",    icon: Home,        premium: false },
            { id: "lessonSelect", label: "레슨", icon: BookOpen,  premium: false },
            { id: "errors",    label: "오답",  icon: NotebookPen, premium: true  },
            { id: "analytics", label: "분석",  icon: BarChart2,   premium: true  },
            { id: "friends",   label: "친구",  icon: Users,       premium: false },
            { id: "profile",   label: "나",    icon: User,        premium: false },
          ].map(({ id, label, icon: Icon, premium }) => {
            const active = screen === id;
            const locked = premium && user.tier === "free";
            return (
              <button
                key={id}
                onClick={() => navigate(id as Screen)}
                className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors"
                style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}
              >
                <div className="relative">
                  <Icon size={20} />
                  {locked && <Lock size={9} className="absolute -top-0.5 -right-1" style={{ color: "var(--muted-foreground)" }} />}
                </div>
                <span className="text-[10px] font-semibold">{label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
