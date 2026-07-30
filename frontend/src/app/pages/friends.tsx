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
import type { Difficulty, FriendUser, Language, Question, QuestionType, RelationStatus, Screen, StudyGroupView, TestCase, UserProfile, WrongAnswer } from "../types";
import {
  DIFFICULTY_META, EMPTY_WEAKNESS_DATA, LANG_META, TOPICS_BY_LANGUAGE,
  TYPE_META, TYPE_XP, firstTopicFor, hasKnownTopic, isAdminUser, isLanguage,
  languageFromSubject, languageFromText, topicForQuestion,
} from "../constants";
import { Avatar, Badge, CodeEditor, LanguageIcon, LockOverlay, PremiumBadge, PublicExamples, TestResultPanel, XpBar, languageLevelProgress } from "../components/shared";

import { DIFF_NUM, NUM_DIFF, dedupWrongs, mapProblem, mapWrongAnswer } from "./problemMappers";

// ─── FRIENDS & GROUPS ────────────────────────────────────────────────────────

export function FriendsPage({ user }: { user: UserProfile }) {
  const [tab, setTab] = useState<"friends" | "groups" | "search">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<FriendUser[]>([]);
  const [groups, setGroups] = useState<StudyGroupView[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionId, setActionId] = useState("");
  const [groupDetail, setGroupDetail] = useState<BackendGroupDetail | null>(null);
  const [groupDetailLoading, setGroupDetailLoading] = useState(false);
  const [groupDetailError, setGroupDetailError] = useState("");
  const [searchResults, setSearchResults] = useState<FriendUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [receivedRequests, setReceivedRequests] = useState<FriendUser[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendUser[]>([]);
  const [groupSearchQuery, setGroupSearchQuery] = useState("");
  const [groupSearchResults, setGroupSearchResults] = useState<StudyGroupView[]>([]);
  const [groupSearchLoading, setGroupSearchLoading] = useState(false);
  const [groupSearchError, setGroupSearchError] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [createGroupForm, setCreateGroupForm] = useState({
    name: "",
    description: "",
    maxMembers: 10,
    language: "python" as Language,
    imageUrl: "",
  });
  const [createGroupError, setCreateGroupError] = useState("");

  const toFriendUser = (u: BackendFriend): FriendUser => ({
    id: u.id,
    username: u.username,
    avatar: u.avatar,
    xp: u.xp,
    level: u.level,
    isFriend: u.friend,
    relationStatus: u.relationStatus,
  });

  const toStudyGroupView = (g: BackendStudyGroup): StudyGroupView => ({
    id: g.id,
    name: g.name,
    description: g.description ?? "",
    memberCount: g.memberCount,
    maxMembers: g.maxMembers || 20,
    language: g.language as Language,
    avatar: g.name.slice(0, 2).toUpperCase(),
    imageUrl: g.imageUrl ?? "",
    ownerId: g.ownerId ?? "",
    ownerName: g.ownerName ?? "",
    joined: g.joined,
    pendingRequest: g.pendingRequest,
    ownedByMe: g.ownedByMe,
  });

  const applyFriendsData = (data: BackendFriendsResponse) => {
    const nextUsers = data.users.map(toFriendUser);
    const nextGroups = data.groups
      .filter(g => isLanguage(g.language))
      .map(toStudyGroupView);
    setUsers(nextUsers);
    setGroups(nextGroups);
    setSelectedGroupId(current => {
      if (current && nextGroups.some(g => g.id === current)) return current;
      return nextGroups.find(g => g.joined)?.id ?? nextGroups[0]?.id ?? "";
    });
  };

  const loadFriends = async () => {
    setLoading(true);
    setLoadError("");
    try {
      applyFriendsData(await apiGetFriends());
      const requests = await apiGetFriendRequests();
      setReceivedRequests(requests.received.map(request => toFriendUser(request.user)));
      setSentRequests(requests.sent.map(request => toFriendUser(request.user)));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "친구와 그룹을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFriends();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults([]);
      setSearchError("");
      setSearchLoading(false);
      return;
    }
    let cancelled = false;
    setSearchLoading(true);
    setSearchError("");
    const timer = window.setTimeout(async () => {
      try {
        const results = await apiSearchFriends(query);
        if (!cancelled) setSearchResults(results.map(toFriendUser));
      } catch (error) {
        if (!cancelled) setSearchError(error instanceof Error ? error.message : "사용자를 검색하지 못했습니다.");
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    const query = groupSearchQuery.trim();
    if (query.length < 2) {
      setGroupSearchResults([]);
      setGroupSearchError("");
      setGroupSearchLoading(false);
      return;
    }
    let cancelled = false;
    setGroupSearchLoading(true);
    setGroupSearchError("");
    const timer = window.setTimeout(async () => {
      try {
        const results = await apiSearchGroups(query);
        if (!cancelled) setGroupSearchResults(results.filter(g => isLanguage(g.language)).map(toStudyGroupView));
      } catch (error) {
        if (!cancelled) setGroupSearchError(error instanceof Error ? error.message : "그룹을 검색하지 못했습니다.");
      } finally {
        if (!cancelled) setGroupSearchLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [groupSearchQuery]);

  useEffect(() => {
    if (!selectedGroupId) {
      setGroupDetail(null);
      return;
    }
    const loadGroupDetail = async () => {
      setGroupDetailLoading(true);
      setGroupDetailError("");
      try {
        const detail = await apiGetGroupDetail(selectedGroupId);
        setGroupDetail(isLanguage(detail.language) ? detail : null);
      } catch (error) {
        setGroupDetailError(error instanceof Error ? error.message : "그룹 상세를 불러오지 못했습니다.");
      } finally {
        setGroupDetailLoading(false);
      }
    };
    void loadGroupDetail();
  }, [selectedGroupId]);

  const friends = users.filter(u => u.isFriend);
  const selectedGroup = groups.find(g => g.id === selectedGroupId) ?? groups[0];
  const selectedGroupMembers = groupDetail?.members ?? [];
  const visibleGroups = groupSearchQuery.trim().length >= 2 ? groupSearchResults : groups;

  const nextRelationAfterFriendAction = (target: FriendUser): RelationStatus => {
    if (target.relationStatus === "none") return "sent";
    if (target.relationStatus === "received") return "friends";
    return "none";
  };

  const syncFriend = async (target: FriendUser) => {
    setActionId(`friend-${target.id}`);
    setLoadError("");
    try {
      applyFriendsData(target.isFriend ? await apiRemoveFriend(target.id) : await apiAddFriend(target.id));
      const requests = await apiGetFriendRequests();
      setReceivedRequests(requests.received.map(request => toFriendUser(request.user)));
      setSentRequests(requests.sent.map(request => toFriendUser(request.user)));
      const nextRelation = nextRelationAfterFriendAction(target);
      setSearchResults(prev => prev.map(u => u.id === target.id ? { ...u, isFriend: nextRelation === "friends", relationStatus: nextRelation } : u));
      if (target.relationStatus === "none") setSearchQuery("");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "친구 상태를 변경하지 못했습니다.");
    } finally {
      setActionId("");
    }
  };

  const respondFriendRequest = async (target: FriendUser, accept: boolean) => {
    setActionId(`request-${target.id}`);
    setLoadError("");
    try {
      applyFriendsData(accept ? await apiAcceptFriend(target.id) : await apiRejectFriendRequest(target.id));
      const requests = await apiGetFriendRequests();
      setReceivedRequests(requests.received.map(request => toFriendUser(request.user)));
      setSentRequests(requests.sent.map(request => toFriendUser(request.user)));
      setSearchResults(prev => prev.map(u => u.id === target.id ? { ...u, isFriend: accept, relationStatus: accept ? "friends" : "none" } : u));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "친구 요청을 처리하지 못했습니다.");
    } finally {
      setActionId("");
    }
  };

  const syncGroup = async (target: StudyGroupView) => {
    setActionId(`group-${target.id}`);
    setLoadError("");
    try {
      applyFriendsData(target.joined ? await apiLeaveGroup(target.id) : await apiJoinGroup(target.id));
      if (selectedGroupId === target.id) {
        setGroupDetail(await apiGetGroupDetail(target.id));
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "그룹 상태를 변경하지 못했습니다.");
    } finally {
      setActionId("");
    }
  };

  const handleCreateGroup = async () => {
    setActionId("group-create");
    setCreateGroupError("");
    try {
      applyFriendsData(await apiCreateGroup({
        name: createGroupForm.name,
        description: createGroupForm.description,
        maxMembers: createGroupForm.maxMembers,
        language: createGroupForm.language,
        imageUrl: createGroupForm.imageUrl,
      }));
      setShowCreateGroup(false);
      setCreateGroupForm({ name: "", description: "", maxMembers: 10, language: "python", imageUrl: "" });
    } catch (error) {
      setCreateGroupError(error instanceof Error ? error.message : "그룹을 생성하지 못했습니다.");
    } finally {
      setActionId("");
    }
  };

  const handleGroupImage = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCreateGroupError("이미지 파일만 첨부할 수 있습니다.");
      return;
    }
    if (file.size > 700_000) {
      setCreateGroupError("그룹 사진은 700KB 이하로 첨부해주세요.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCreateGroupError("");
      setCreateGroupForm(prev => ({ ...prev, imageUrl: String(reader.result ?? "") }));
    };
    reader.readAsDataURL(file);
  };

  const respondGroupRequest = async (requestUserId: string, accept: boolean) => {
    if (!selectedGroupId) return;
    setActionId(`group-request-${requestUserId}`);
    setGroupDetailError("");
    try {
      const detail = accept
        ? await apiAcceptGroupRequest(selectedGroupId, requestUserId)
        : await apiRejectGroupRequest(selectedGroupId, requestUserId);
      setGroupDetail(detail);
      applyFriendsData(await apiGetFriends());
    } catch (error) {
      setGroupDetailError(error instanceof Error ? error.message : "그룹 참가 신청을 처리하지 못했습니다.");
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-xl font-extrabold mb-1" style={{ color: "var(--foreground)" }}>친구 & 그룹</h1>
      <p className="text-sm mb-5" style={{ color: "var(--muted-foreground)" }}>함께 공부하고 성장해요</p>

      {loading && (
        <div className="bg-white rounded-2xl border border-border p-8 text-center text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
          친구와 그룹을 불러오는 중...
        </div>
      )}

      {!loading && loadError && (
        <div className="bg-white rounded-2xl border border-border p-8 text-center">
          <AlertTriangle size={28} className="mx-auto mb-3" style={{ color: "#EF4444" }} />
          <p className="text-sm font-bold mb-3" style={{ color: "var(--foreground)" }}>{loadError}</p>
          <button onClick={loadFriends} className="px-5 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "var(--primary)" }}>다시 시도</button>
        </div>
      )}

      {!loading && !loadError && (
        <>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[{ id: "friends", label: `친구 ${friends.length}` }, { id: "groups", label: "그룹" }, { id: "search", label: "검색" }].map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id as typeof tab)}
            className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all"
            style={{ borderColor: tab === id ? "var(--primary)" : "var(--border)", background: tab === id ? "var(--secondary)" : "#fff", color: tab === id ? "var(--primary)" : "var(--foreground)" }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "friends" && (
        <div className="space-y-2">
          {receivedRequests.length > 0 && (
            <section className="bg-white rounded-2xl border border-border p-4 mb-4">
              <h2 className="text-sm font-extrabold mb-3" style={{ color: "var(--foreground)" }}>받은 친구 요청</h2>
              <div className="space-y-2">
                {receivedRequests.map(u => (
                  <div key={u.id} className="flex items-center gap-3">
                    <Avatar initials={u.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{u.username}</div>
                      <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Lv.{u.level} · {u.xp.toLocaleString()} XP</div>
                    </div>
                    <button onClick={() => void respondFriendRequest(u, true)} disabled={actionId === `request-${u.id}`} className="px-3 py-1.5 rounded-xl text-xs font-bold text-white disabled:opacity-50" style={{ background: "var(--primary)" }}>수락</button>
                    <button onClick={() => void respondFriendRequest(u, false)} disabled={actionId === `request-${u.id}`} className="px-3 py-1.5 rounded-xl text-xs font-bold border-2 disabled:opacity-50" style={{ borderColor: "#EF4444", color: "#EF4444", background: "#FEF2F2" }}>거절</button>
                  </div>
                ))}
              </div>
            </section>
          )}
          {sentRequests.length > 0 && (
            <section className="bg-white rounded-2xl border border-border p-4 mb-4">
              <h2 className="text-sm font-extrabold mb-3" style={{ color: "var(--foreground)" }}>보낸 친구 요청</h2>
              <div className="space-y-2">
                {sentRequests.map(u => (
                  <div key={u.id} className="flex items-center gap-3">
                    <Avatar initials={u.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{u.username}</div>
                      <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>수락 대기 중</div>
                    </div>
                    <button onClick={() => void respondFriendRequest(u, false)} disabled={actionId === `request-${u.id}`} className="px-3 py-1.5 rounded-xl text-xs font-bold border-2 disabled:opacity-50" style={{ borderColor: "#EF4444", color: "#EF4444", background: "#FEF2F2" }}>취소</button>
                  </div>
                ))}
              </div>
            </section>
          )}
          {friends.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--secondary)" }}>
                <Users size={30} style={{ color: "var(--primary)" }} />
              </div>
              <p className="font-bold mb-1" style={{ color: "var(--foreground)" }}>아직 친구가 없어요</p>
              <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>검색 탭에서 닉네임으로 친구를 찾아보세요!</p>
              <button onClick={() => setTab("search")} className="px-5 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "var(--primary)" }}>
                친구 검색하기
              </button>
            </div>
          )}
          {friends.map((u, index) => (
            <div key={u.id} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
              <Avatar initials={u.avatar} color={["#7C3AED", "#3B82F6", "#10B981", "#F59E0B", "#EC4899"][index % 5]} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{u.username}</div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Lv.{u.level} · {u.xp.toLocaleString()} XP</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs font-bold mb-1" style={{ color: "var(--primary)" }}>{u.xp.toLocaleString()} XP</div>
                  <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-violet-400" style={{ width: `${(u.xp / 6000) * 100}%` }} />
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>주간 목표</div>
                </div>
                <button onClick={() => void syncFriend(u)} disabled={actionId === `friend-${u.id}`} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-50" style={{ color: "#EF4444" }}><X size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "groups" && (
        <div className="space-y-4">
          <section className="bg-white rounded-2xl border border-border p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
                <input
                  value={groupSearchQuery}
                  onChange={event => setGroupSearchQuery(event.target.value)}
                  placeholder="그룹 이름으로 검색"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm focus:outline-none"
                  style={{ borderColor: "var(--border)", background: "var(--input-background)", color: "var(--foreground)" }}
                />
              </div>
              <button
                onClick={() => setShowCreateGroup(value => !value)}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white"
                style={{ background: "var(--primary)" }}
              >
                <UserPlus size={16} />그룹 만들기
              </button>
            </div>
            {groupSearchLoading && <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>그룹을 검색하는 중...</p>}
            {groupSearchError && <p className="text-xs font-bold mt-2" style={{ color: "#EF4444" }}>{groupSearchError}</p>}

            {showCreateGroup && (
              <div className="mt-4 rounded-2xl border border-border p-4" style={{ background: "var(--secondary)" }}>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                    그룹 이름
                    <input
                      value={createGroupForm.name}
                      onChange={event => setCreateGroupForm(prev => ({ ...prev, name: event.target.value }))}
                      className="mt-1 w-full px-3 py-2.5 rounded-xl border-2 text-sm focus:outline-none"
                      style={{ borderColor: "var(--border)", background: "#fff", color: "var(--foreground)" }}
                      placeholder="예: Java 면접 준비반"
                    />
                  </label>
                  <label className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                    언어
                    <select
                      value={createGroupForm.language}
                      onChange={event => setCreateGroupForm(prev => ({ ...prev, language: event.target.value as Language }))}
                      className="mt-1 w-full px-3 py-2.5 rounded-xl border-2 text-sm focus:outline-none"
                      style={{ borderColor: "var(--border)", background: "#fff", color: "var(--foreground)" }}
                    >
                      {(Object.entries(LANG_META) as [Language, typeof LANG_META[Language]][]).map(([lang, meta]) => (
                        <option key={lang} value={lang}>{meta.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-bold md:col-span-2" style={{ color: "var(--foreground)" }}>
                    그룹 설명
                    <textarea
                      value={createGroupForm.description}
                      onChange={event => setCreateGroupForm(prev => ({ ...prev, description: event.target.value }))}
                      rows={3}
                      className="mt-1 w-full px-3 py-2.5 rounded-xl border-2 text-sm focus:outline-none resize-none"
                      style={{ borderColor: "var(--border)", background: "#fff", color: "var(--foreground)" }}
                      placeholder="어떤 사람들이 함께 공부하는 그룹인지 적어주세요."
                    />
                  </label>
                  <label className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                    인원 제한
                    <input
                      type="number"
                      min={2}
                      max={50}
                      value={createGroupForm.maxMembers}
                      onChange={event => setCreateGroupForm(prev => ({ ...prev, maxMembers: Number(event.target.value) }))}
                      className="mt-1 w-full px-3 py-2.5 rounded-xl border-2 text-sm focus:outline-none"
                      style={{ borderColor: "var(--border)", background: "#fff", color: "var(--foreground)" }}
                    />
                  </label>
                  <label className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                    그룹 사진
                    <input
                      type="file"
                      accept="image/*"
                      onChange={event => handleGroupImage(event.target.files?.[0])}
                      className="mt-1 w-full text-xs"
                      style={{ color: "var(--muted-foreground)" }}
                    />
                  </label>
                </div>
                {createGroupForm.imageUrl && (
                  <div className="mt-3 flex items-center gap-3">
                    <img src={createGroupForm.imageUrl} alt="그룹 사진 미리보기" className="w-14 h-14 rounded-2xl object-cover border border-border" />
                    <button onClick={() => setCreateGroupForm(prev => ({ ...prev, imageUrl: "" }))} className="text-xs font-bold" style={{ color: "#EF4444" }}>사진 제거</button>
                  </div>
                )}
                {createGroupError && <p className="text-xs font-bold mt-3" style={{ color: "#EF4444" }}>{createGroupError}</p>}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleCreateGroup}
                    disabled={actionId === "group-create" || createGroupForm.name.trim().length < 2}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                    style={{ background: "var(--primary)" }}
                  >
                    {actionId === "group-create" ? "생성 중" : "그룹 생성"}
                  </button>
                  <button onClick={() => setShowCreateGroup(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold border-2" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>취소</button>
                </div>
              </div>
            )}
          </section>

          {groups.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--secondary)" }}>
                <Users size={30} style={{ color: "var(--primary)" }} />
              </div>
              <p className="font-bold mb-1" style={{ color: "var(--foreground)" }}>참여 가능한 그룹이 없어요</p>
            </div>
          )}
          {selectedGroup && (
          <>
          <div className="grid gap-2">
            {visibleGroups.length === 0 && (
              <div className="bg-white rounded-2xl border border-border p-6 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                검색 결과가 없어요.
              </div>
            )}
            {visibleGroups.map(g => {
              const selected = selectedGroup.id === g.id;
              const full = g.memberCount >= g.maxMembers;
              return (
                <button key={g.id} onClick={() => setSelectedGroupId(g.id)} className="bg-white rounded-2xl border p-4 flex items-center gap-3 text-left transition-all"
                  style={{ borderColor: selected ? LANG_META[g.language].color : "var(--border)", boxShadow: selected ? `0 6px 18px ${LANG_META[g.language].color}18` : "none" }}>
                  {g.imageUrl ? (
                    <img src={g.imageUrl} alt="" className="w-12 h-12 rounded-2xl object-cover border border-border" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white border border-border">
                      <LanguageIcon language={g.language} size={32} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-sm truncate" style={{ color: "var(--foreground)" }}>{g.name}</div>
                      {g.joined && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: LANG_META[g.language].light, color: LANG_META[g.language].color }}>참여중</span>}
                      {g.pendingRequest && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#FEF3C7", color: "#B45309" }}>신청중</span>}
                      {g.ownedByMe && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#ECFDF5", color: "#047857" }}>그룹장</span>}
                    </div>
                    <div className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>
                      멤버 {g.memberCount}/{g.maxMembers}명 · {LANG_META[g.language].label}{g.ownerName ? ` · 그룹장 ${g.ownerName}` : ""}
                    </div>
                    {g.description && <div className="text-xs mt-1 truncate" style={{ color: "var(--muted-foreground)" }}>{g.description}</div>}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); void syncGroup(g); }} disabled={actionId === `group-${g.id}` || g.pendingRequest || g.ownedByMe || full} className="px-4 py-1.5 rounded-xl text-xs font-bold border-2 transition-all disabled:opacity-50"
                    style={{ borderColor: g.joined ? "#EF4444" : "var(--primary)", background: g.joined ? "#FEF2F2" : "var(--secondary)", color: g.joined ? "#EF4444" : "var(--primary)" }}>
                    {actionId === `group-${g.id}` ? "처리중" : g.joined ? "탈퇴" : g.pendingRequest ? "신청중" : full ? "마감" : "가입 신청"}
                  </button>
                </button>
              );
            })}
          </div>

          <section className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-start gap-3 min-w-0">
                {selectedGroup.imageUrl ? (
                  <img src={selectedGroup.imageUrl} alt="" className="w-14 h-14 rounded-2xl object-cover border border-border shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white border border-border shrink-0">
                    <LanguageIcon language={selectedGroup.language} size={34} />
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="font-extrabold text-base truncate" style={{ color: "var(--foreground)" }}>{selectedGroup.name}</h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    {selectedGroup.ownerName ? `그룹장 ${selectedGroup.ownerName} · ` : ""}정원 {selectedGroup.memberCount}/{selectedGroup.maxMembers}명
                  </p>
                  {selectedGroup.description && <p className="text-xs mt-1 leading-5" style={{ color: "var(--muted-foreground)" }}>{selectedGroup.description}</p>}
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: LANG_META[selectedGroup.language].light, color: LANG_META[selectedGroup.language].color }}>
                {LANG_META[selectedGroup.language].label}
              </span>
            </div>

            {groupDetailLoading && (
              <div className="rounded-xl p-5 text-center text-sm font-semibold" style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
                그룹 상세를 불러오는 중...
              </div>
            )}

            {!groupDetailLoading && groupDetailError && (
              <div className="rounded-xl p-5 text-center">
                <AlertTriangle size={24} className="mx-auto mb-2" style={{ color: "#EF4444" }} />
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{groupDetailError}</p>
              </div>
            )}

            {!groupDetailLoading && !groupDetailError && groupDetail && (
            <>
            {groupDetail.ownedByMe && groupDetail.pendingRequests.length > 0 && (
              <div className="rounded-2xl border border-amber-200 p-4 mb-5" style={{ background: "#FFFBEB" }}>
                <h3 className="text-sm font-extrabold mb-3" style={{ color: "#92400E" }}>참가 신청</h3>
                <div className="space-y-2">
                  {groupDetail.pendingRequests.map(request => (
                    <div key={request.id} className="flex items-center gap-3">
                      <Avatar initials={request.user.avatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{request.user.username}</div>
                        <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Lv.{request.user.level} · {request.user.xp.toLocaleString()} XP</div>
                      </div>
                      <button
                        onClick={() => void respondGroupRequest(request.user.id, true)}
                        disabled={actionId === `group-request-${request.user.id}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white disabled:opacity-50"
                        style={{ background: "var(--primary)" }}
                      >
                        수락
                      </button>
                      <button
                        onClick={() => void respondGroupRequest(request.user.id, false)}
                        disabled={actionId === `group-request-${request.user.id}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border-2 disabled:opacity-50"
                        style={{ borderColor: "#EF4444", color: "#EF4444", background: "#FEF2F2" }}
                      >
                        거절
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "주간 풀이", value: `${groupDetail.weeklySolved}/${groupDetail.weeklyGoal}`, icon: <CheckCircle2 size={16} />, color: "#10B981" },
                { label: "평균 연속", value: `${groupDetail.averageStreak}일`, icon: <Flame size={16} />, color: "#EF4444" },
                { label: "온라인", value: `${groupDetail.onlineCount}명`, icon: <Users size={16} />, color: "var(--primary)" },
              ].map(item => (
                <div key={item.label} className="rounded-xl p-3" style={{ background: "var(--secondary)" }}>
                  <div className="flex items-center gap-1.5 text-xs font-bold mb-1" style={{ color: item.color }}>{item.icon}{item.label}</div>
                  <div className="font-extrabold text-base" style={{ color: "var(--foreground)" }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div className="h-2.5 rounded-full overflow-hidden mb-5" style={{ background: "var(--muted)" }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, (groupDetail.weeklySolved / Math.max(1, groupDetail.weeklyGoal)) * 100)}%`, background: LANG_META[selectedGroup.language].color }} />
            </div>

            <div className="space-y-3">
              {selectedGroupMembers.length === 0 && (
                <p className="text-center py-6 text-sm" style={{ color: "var(--muted-foreground)" }}>아직 그룹원이 없어요.</p>
              )}
              {selectedGroupMembers.map((member, index) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-6 text-center text-xs font-extrabold" style={{ color: index === 0 ? "#F59E0B" : "var(--muted-foreground)" }}>{index + 1}</div>
                  <div className="relative">
                    <Avatar initials={member.avatar} size="sm" color={member.id === user.id ? "var(--primary)" : undefined} />
                    {member.online && <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: "#10B981" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold truncate" style={{ color: "var(--foreground)" }}>{member.username}{member.id === user.id ? " (나)" : ""}</span>
                      <span className="text-xs font-bold shrink-0" style={{ color: LANG_META[selectedGroup.language].color }}>{member.weeklySolved}문제</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs flex items-center gap-1" style={{ color: "#EF4444" }}><Flame size={12} />{member.streak}일</span>
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--primary)" }}><Zap size={12} />{member.xp.toLocaleString()} XP</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: "var(--muted)" }}>
                      <div className="h-full rounded-full" style={{ width: `${member.progress}%`, background: LANG_META[selectedGroup.language].color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </>
            )}
          </section>
          </>
          )}
        </div>
      )}

      {tab === "search" && (
        <div>
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3.5 top-3.5" style={{ color: "var(--muted-foreground)" }} />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="유저 닉네임 검색..." className="w-full pl-9 pr-4 py-3 rounded-xl border-2 text-sm focus:outline-none" style={{ borderColor: "var(--border)", background: "var(--input-background)" }} />
          </div>
          {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
            <p className="text-center py-8 text-sm" style={{ color: "var(--muted-foreground)" }}>닉네임을 2글자 이상 입력해주세요.</p>
          )}
          {searchQuery.trim().length >= 2 && (
            <div className="space-y-2">
              {searchLoading && <p className="text-center py-8 text-sm" style={{ color: "var(--muted-foreground)" }}>검색 중...</p>}
              {!searchLoading && searchError && <p className="text-center py-8 text-sm font-bold" style={{ color: "#EF4444" }}>{searchError}</p>}
              {!searchLoading && !searchError && searchResults.length === 0 && <p className="text-center py-8 text-sm" style={{ color: "var(--muted-foreground)" }}>"{searchQuery}" 검색 결과 없음</p>}
              {searchResults.map(u => (
                <div key={u.id} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
                  <Avatar initials={u.avatar} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{u.username}</div>
                    <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Lv.{u.level} · {u.xp.toLocaleString()} XP</div>
                  </div>
                  <button
                    onClick={() => void syncFriend(u)}
                    disabled={actionId === `friend-${u.id}` || u.relationStatus === "sent"}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-bold text-white disabled:opacity-50"
                    style={{ background: u.relationStatus === "friends" ? "#EF4444" : u.relationStatus === "sent" ? "#9CA3AF" : "var(--primary)" }}
                  >
                    {u.relationStatus === "friends" ? <X size={13} /> : <UserPlus size={13} />}
                    {actionId === `friend-${u.id}` ? "처리중" : u.relationStatus === "friends" ? "친구 삭제" : u.relationStatus === "sent" ? "요청됨" : u.relationStatus === "received" ? "요청 수락" : "친구 요청"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
        </>
      )}
    </div>
  );
}
