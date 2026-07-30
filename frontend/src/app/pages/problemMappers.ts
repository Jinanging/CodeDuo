import type { BackendProblem, BackendWrongAnswer } from "../api";
import type { Difficulty, Language, Question, QuestionType, WrongAnswer } from "../types";

// ── 백엔드 오답(BackendWrongAnswer) → 프론트 WrongAnswer 매핑 ──
export function mapWrongAnswer(w: BackendWrongAnswer): WrongAnswer {
  const parseOptions = () => {
    try { return w.optionsJson ? JSON.parse(w.optionsJson) as string[] : undefined; } catch { return undefined; }
  };
  return {
    qId: w.problemId,
    question: w.question,
    type: PROBLEM_TYPE_MAP[w.type] ?? "short-answer",
    language: w.language as Language,
    userAnswer: w.lastAnswer ?? "",
    explanation: w.explanation,
    options: parseOptions(),
    codeTemplate: w.codeTemplate,
    solvedAt: (w.updatedAt ?? "").slice(0, 10),
  };
}
export function dedupWrongs(list: WrongAnswer[]): WrongAnswer[] {
  const map = new Map<number, WrongAnswer>();
  for (const w of list) if (!map.has(w.qId)) map.set(w.qId, w);
  return [...map.values()];
}

// ── 백엔드 문제(BackendProblem) → 프론트 Question 매핑 ──
export const PROBLEM_TYPE_MAP: Record<string, QuestionType> = {
  MULTIPLE_CHOICE: "mcq", SHORT_ANSWER: "short-answer", FILL_BLANK: "fill-blank", CODE: "code", ESSAY: "short-answer",
};
export const DIFF_NUM: Record<Difficulty, number> = { beginner: 1, intermediate: 2, advanced: 3 };
export const NUM_DIFF: Record<number, Difficulty> = { 1: "beginner", 2: "intermediate", 3: "advanced" };
export function mapProblem(p: BackendProblem): Question {
  const parse = <T,>(str: string | undefined, fb: T): T => { try { return str ? (JSON.parse(str) as T) : fb; } catch { return fb; } };
  return {
    id: p.id,
    type: PROBLEM_TYPE_MAP[p.type] ?? "short-answer",
    language: p.language as Language,
    difficulty: NUM_DIFF[p.difficulty] ?? "beginner",
    title: p.title,
    question: p.description,
    options: parse<string[] | undefined>(p.optionsJson, undefined),
    hint: p.hint,
    template: p.codeTemplate,
    tags: parse<string[]>(p.tagsJson, []),
    testcases: p.sampleInput != null || p.sampleOutput != null
      ? [{ input: p.sampleInput ?? "", expected: p.sampleOutput ?? "" }]
      : undefined,
  };
}
