import { useRef } from "react";
import { CheckCircle2, Crown, Lock, Sparkles, Terminal, XCircle } from "lucide-react";
import { LANG_META, TYPE_META } from "../constants";
import type { Language, MockResult, QuestionType, TestCase } from "../types";

// ─── CODE EDITOR ─────────────────────────────────────────────────────────────

export function CodeEditor({
  value,
  onChange,
  language,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  language: Language;
  disabled: boolean;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const lineCount = value.split("\n").length;
  const langMeta = LANG_META[language];

  const syncScroll = () => {
    if (taRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop;
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: "var(--border)" }}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ background: "#1E1B2E", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ fontFamily: "JetBrains Mono, monospace", color: "#A78BFA" }}>
          <LanguageIcon language={language} size={15} />{langMeta.label}
        </span>
        <Terminal size={13} style={{ color: "#4B5563" }} />
      </div>

      {/* Editor body */}
      <div className="relative flex overflow-hidden" style={{ background: "#12101E", minHeight: 180 }}>
        {/* Line numbers */}
        <div
          ref={gutterRef}
          className="select-none overflow-hidden shrink-0 py-4 pr-3 pl-3 text-right leading-relaxed"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.8125rem",
            color: "#4B5678",
            background: "#0E0C1A",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            minWidth: 44,
            userSelect: "none",
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={taRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onScroll={syncScroll}
          disabled={disabled}
          spellCheck={false}
          rows={Math.max(8, lineCount + 1)}
          className="flex-1 px-4 py-4 focus:outline-none resize-none leading-relaxed w-full"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.8125rem",
            background: "transparent",
            color: "#E2D9F3",
            caretColor: "#A78BFA",
          }}
        />
      </div>
    </div>
  );
}

// ─── PUBLIC CODE EXAMPLES ────────────────────────────────────────────────────

export function PublicExamples({ testcases }: { testcases?: TestCase[] }) {
  const examples = (testcases ?? []).filter(tc => tc.input || tc.expected);

  if (examples.length === 0) {
    return (
      <div className="mb-3 rounded-2xl border border-amber-200 px-4 py-3 text-sm font-semibold" style={{ background: "#FFFBEB", color: "#92400E" }}>
        공개 예시 입출력이 아직 등록되지 않았어요. 문제 설명과 힌트를 참고해 코드를 작성해보세요.
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-2xl overflow-hidden border border-border bg-white">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
        <div className="text-sm font-extrabold" style={{ color: "var(--foreground)" }}>공개 예시 입출력</div>
        <div className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
          숨김 테스트는 제출 후 결과만 표시돼요
        </div>
      </div>
      <div className="divide-y divide-border">
        {examples.map((example, index) => (
          <div key={`${example.input}-${index}`} className="grid gap-3 p-4 md:grid-cols-2">
            <div>
              <div className="mb-1.5 text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>
                예시 {index + 1} 입력
              </div>
              <pre className="min-h-12 whitespace-pre-wrap break-words rounded-xl px-3 py-2 text-sm font-mono" style={{ background: "#1E1B2E", color: "#F8FAFC" }}>
                {example.input || "(입력 없음)"}
              </pre>
            </div>
            <div>
              <div className="mb-1.5 text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>
                예시 {index + 1} 출력
              </div>
              <pre className="min-h-12 whitespace-pre-wrap break-words rounded-xl px-3 py-2 text-sm font-mono" style={{ background: "#ECFDF5", color: "#047857" }}>
                {example.expected || "(출력 없음)"}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TEST RESULT PANEL ────────────────────────────────────────────────────────

export function TestResultPanel({
  results,
  isPremium,
  codeReview,
  resultMessage,
  aiHint,
  aiHintLoading,
  aiHintError,
  onRequestAiHint,
}: {
  results: MockResult[];
  isPremium: boolean;
  codeReview?: string;
  resultMessage?: string;
  aiHint?: string;
  aiHintLoading?: boolean;
  aiHintError?: string;
  onRequestAiHint?: () => void;
}) {
  const passCount = results.filter(r => r.pass).length;
  const allPassed = results.length > 0 && passCount === results.length;

  return (
    <div className="mt-4 space-y-3">
      {/* Summary chip */}
      <div
        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-sm"
        style={{
          background: allPassed ? "#ECFDF5" : passCount > 0 ? "#FFF7ED" : "#FEF2F2",
          color: allPassed ? "#065F46" : passCount > 0 ? "#92400E" : "#991B1B",
          borderLeft: `4px solid ${allPassed ? "#10B981" : passCount > 0 ? "#F59E0B" : "#EF4444"}`,
        }}
      >
        {allPassed
          ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
          : <XCircle size={18} className="text-red-500 shrink-0" />}
        <span>
          {passCount} / {results.length} 테스트케이스 통과
        </span>
        {allPassed && (
          <span className="ml-auto text-emerald-600 font-extrabold">+20 XP 🎉</span>
        )}
      </div>

      {/* Test case rows */}
      <div className="rounded-2xl overflow-hidden border border-border bg-white">
        {results.map((r, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-4 py-3"
            style={{
              background: r.pass ? "transparent" : "#FEF2F2",
              borderTop: i > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            {r.pass
              ? <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-500" />
              : <XCircle size={16} className="shrink-0 mt-0.5 text-red-500" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: r.pass ? "#065F46" : "#991B1B" }}>
                <span>숨김 테스트 #{r.caseNumber}</span>
                <span>·</span>
                <span>{r.pass ? "통과" : "실패"}</span>
              </div>
              {(r.error || (!r.pass && r.status && r.status !== "Accepted")) && (
                <div className="mt-2 rounded-lg px-3 py-2 text-xs whitespace-pre-wrap break-words" style={{ background: "#FEE2E2", color: "#991B1B" }}>
                  <span className="font-bold">{r.status || "실행 오류"}</span>
                  {r.error && <span>: {r.error}</span>}
                </div>
              )}
              {(r.runtimeMs != null || r.memoryKb != null) && (
                <div className="mt-1.5 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                  {r.runtimeMs != null && <span>실행 {r.runtimeMs}ms</span>}
                  {r.runtimeMs != null && r.memoryKb != null && <span> · </span>}
                  {r.memoryKb != null && <span>메모리 {r.memoryKb}KB</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pass: explanation + optional AI review */}
      {allPassed && (
        <div className="rounded-2xl px-5 py-4 flex items-start gap-3" style={{ background: "#ECFDF5", borderLeft: "4px solid #10B981" }}>
          <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm mb-0.5" style={{ color: "#065F46" }}>정답! 모든 테스트케이스를 통과했어요 🎉</p>
            {isPremium && codeReview && (
              <div className="mt-2 flex items-start gap-2 text-sm" style={{ color: "#047857" }}>
                <Sparkles size={14} className="shrink-0 mt-0.5 text-emerald-600" />
                <span>{codeReview}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fail: retry prompt */}
      {!allPassed && (
        <>
          <div className="rounded-2xl px-5 py-4 flex items-start gap-3" style={{ background: "#FEF2F2", borderLeft: "4px solid #EF4444" }}>
            <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm mb-0.5" style={{ color: "#991B1B" }}>{resultMessage || "일부 테스트케이스를 통과하지 못했어요."}</p>
              <p className="text-sm" style={{ color: "#B91C1C" }}>공개 예시와 오류 유형을 참고해 코드를 수정해보세요.</p>
            </div>
          </div>
          <div
            className="rounded-2xl px-5 py-4 flex items-start gap-3"
            style={{
              background: isPremium ? "#F5F3FF" : "#F8FAFC",
              borderLeft: `4px solid ${isPremium ? "#8B5CF6" : "#CBD5E1"}`,
            }}
          >
            {isPremium ? (
              <Sparkles size={20} className="text-violet-500 shrink-0 mt-0.5" />
            ) : (
              <Lock size={20} className="text-slate-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm mb-1" style={{ color: isPremium ? "#5B21B6" : "#475569" }}>AI 힌트</p>
              {isPremium ? (
                aiHint ? (
                  <p className="text-sm whitespace-pre-wrap break-words" style={{ color: "#6D28D9" }}>{aiHint}</p>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm" style={{ color: "#6D28D9" }}>틀린 원인을 AI가 힌트로 정리해줘요.</p>
                    <button
                      type="button"
                      onClick={onRequestAiHint}
                      disabled={aiHintLoading}
                      className="px-3 py-1.5 rounded-xl text-xs font-extrabold text-white disabled:opacity-60"
                      style={{ background: "#8B5CF6" }}
                    >
                      {aiHintLoading ? "생성 중..." : "힌트 받기"}
                    </button>
                  </div>
                )
              ) : (
                <p className="text-sm" style={{ color: "#64748B" }}>프리미엄 계정에서 코드 오답 AI 힌트를 사용할 수 있어요.</p>
              )}
              {aiHintError && <p className="mt-2 text-xs font-bold" style={{ color: "#DC2626" }}>{aiHintError}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function Badge({ type }: { type: QuestionType }) {
  const m = TYPE_META[type];
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: m.color }}>
      {m.label}
    </span>
  );
}

export function LanguageIcon({ language, size = 22, className = "" }: { language: Language; size?: number; className?: string }) {
  return (
    <img
      src={LANG_META[language].icon}
      alt=""
      aria-hidden="true"
      className={`inline-block object-contain align-middle ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)" }}>
      <Crown size={10} /> PREMIUM
    </span>
  );
}

export function LockOverlay({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-10 backdrop-blur-sm" style={{ background: "rgba(240,238,255,0.85)" }}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "var(--primary)" }}>
        <Lock size={22} className="text-white" />
      </div>
      <p className="font-bold mb-1" style={{ color: "var(--foreground)" }}>프리미엄 전용 기능</p>
      <p className="text-sm mb-4 text-center px-6" style={{ color: "var(--muted-foreground)" }}>이 기능은 프리미엄 구독자에게만 제공됩니다.</p>
      <button onClick={onUpgrade} className="px-5 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "var(--primary)" }}>
        업그레이드 →
      </button>
    </div>
  );
}

export function XpBar({ current, max, color }: { current: number; max: number; color: string }) {
  const progress = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0;
  return (
    <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: color }} />
    </div>
  );
}

export function languageLevelProgress(totalXp: number, maxXp: number) {
  const safeXp = Math.max(0, totalXp);
  return {
    level: Math.floor(safeXp / maxXp) + 1,
    currentXp: safeXp % maxXp,
  };
}

export function Avatar({ initials, color, size = "md" }: { initials: string; color?: string; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm";
  const isImage = initials.startsWith("data:image/") || initials.startsWith("http://") || initials.startsWith("https://");
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-bold text-white shrink-0`} style={{ background: color ?? "var(--primary)" }}>
      {isImage ? <img src={initials} alt="" className="w-full h-full rounded-full object-cover" /> : initials}
    </div>
  );
}
