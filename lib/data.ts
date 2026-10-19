import reference from "./reference.json";
export type Story = {
  id: string;
  title: string;
  origin: string;
  minutes: number;
  category: string;
  image: string;
  readerImage?: string;
  desc: string;
  available?: boolean;
  body?: string;
  cover?: string;
};
export type Culture = {
  id: string;
  label: string;
  term: string;
  desc: string;
  image: string;
};
export type Artwork = {
  id: string;
  title: string;
  category: string;
  student: string;
  school?: string;
  className?: string;
  likes: number;
  image?: string;
  data?: string;
  created?: number;
};
export type Question = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};
export type Doc = {
  draft?: Record<string, unknown>;
  published?: Record<string, unknown>;
  archived?: boolean;
};
export type Result = {
  kind: "game" | "quiz";
  score: number;
  correct: number;
  total: number;
  elapsed: number;
  questions?: Question[];
  answers?: number[];
};
export type State = {
  version: number;
  name: string;
  className: string;
  visited: Record<string, boolean>;
  completedStories: Record<string, boolean>;
  reflection: string;
  reflections: Record<string, string>;
  gameEarned: boolean;
  quizEarned: boolean;
  bestQuiz: number | null;
  likes: string[];
  uploads: Artwork[];
  lastResult: Result | null;
  docs: Record<string, Doc>;
  customStories: Story[];
  customCultures: Culture[];
  quizzes: {
    id: string;
    published?: Omit<Question, "id">;
    draft?: Omit<Question, "id">;
  }[];
  moderation: Record<string, { status: string; reason: string }>;
  settings: { manager: string; school: string; review: boolean };
};
export const stories: Story[] = reference.stories;
export const cultures: Culture[] = reference.cultures;
export const artworks: Artwork[] = reference.artworks;
export const excerpt =
  "Jokotole adalah putra dari Putri Potre Koneng dan Adipoday. Sejak kecil, ia diasuh oleh Empu Kelleng di Desa Majungan. Jokotole dikenal memiliki kekuatan luar biasa dan hati yang sangat dermawan.\n\nKetika beranjak dewasa, Jokotole mendapat hadiah pusaka cemeti sakti dan kuda bersayap bernama Si Giga. Dengan ketulusan dan keberaniannya, ia membantu membangun pintu gerbang Kerajaan Majapahit yang megah.";
export const seedQuestion = {
  id: "source-jokotole",
  published: {
    question:
      "Siapakah ksatria perkasa asal Madura yang menunggangi kuda bersayap bernama Si Giga untuk membela keadilan?",
    options: ["Jokotole", "Putri Potre Koneng", "Ke’ Lesap", "Empu Kelleng"],
    correct: 0,
    explanation: "Jokotole adalah ksatria yang menunggangi Si Giga.",
  },
};
export const fresh = (): State => ({
  version: 2,
  name: "",
  className: "VI",
  visited: {},
  completedStories: {},
  reflection: "",
  reflections: {},
  gameEarned: false,
  quizEarned: false,
  bestQuiz: null,
  likes: [],
  uploads: [],
  lastResult: null,
  docs: {},
  customStories: [],
  customCultures: [],
  quizzes: [seedQuestion],
  moderation: {},
  settings: { manager: "", school: "", review: true },
});
export const points = (s: State) =>
  (s.gameEarned ? 500 : 0) +
  (s.quizEarned ? 20 : 0) +
  Object.keys(s.completedStories).filter(
    (k) =>
      s.completedStories[k] &&
      (stories.some((story) => story.id === k) ||
        s.customStories.some((story) => story.id === k)),
  ).length *
    50;
export const asset = (image: string) =>
  image.startsWith("data:image/") || image.startsWith("/assets/")
    ? image
    : "/assets/" + image + ".png";
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const text = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;
const image = (value: unknown) =>
  typeof value === "string" &&
  (/^data:image\/(png|jpeg|webp);base64,/.test(value) ||
    /^[-a-z0-9]+$/.test(value) ||
    /^\/assets\/[-a-z0-9]+\.png$/.test(value))
    ? value
    : "";
function content(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return undefined;
  const v = record(value);
  const result: Record<string, unknown> = {};
  for (const k of ["title", "origin", "category", "desc", "body", "label"])
    if (typeof v[k] === "string") result[k] = v[k];
  if (typeof v.minutes === "number" || typeof v.minutes === "string")
    result.minutes = Math.max(1, Math.min(120, Number(v.minutes) || 7));
  if (v.cover !== undefined)
    result.cover = image(
      typeof v.cover === "object" ? record(v.cover).data : v.cover,
    );
  return result;
}
function question(value: unknown): Omit<Question, "id"> | undefined {
  const v = record(value);
  if (
    typeof v.question !== "string" ||
    !Array.isArray(v.options) ||
    v.options.length !== 4 ||
    !v.options.every((o) => typeof o === "string") ||
    !Number.isInteger(v.correct) ||
    Number(v.correct) < 0 ||
    Number(v.correct) > 3 ||
    typeof v.explanation !== "string"
  )
    return undefined;
  return {
    question: v.question,
    options: v.options,
    correct: Number(v.correct),
    explanation: v.explanation,
  };
}
export function readState(raw: unknown): State {
  const f = fresh();
  const v = record(raw);
  const customStories: Story[] = Array.isArray(v.customStories)
    ? v.customStories.flatMap((item) => {
        const s = record(item);
        if (typeof s.id !== "string" || typeof s.title !== "string") return [];
        return [{
          id: s.id.slice(0, 100), title: text(s.title).slice(0, 120),
          origin: text(s.origin).slice(0, 120), minutes: Math.max(1, Math.min(120, Number(s.minutes) || 7)),
          category: text(s.category, "Cerita Madura").slice(0, 80), image: image(s.image) || "art-jokotole",
          desc: text(s.desc).slice(0, 1000), body: text(s.body), available: false,
        }];
      })
    : [];
  const customCultures: Culture[] = Array.isArray(v.customCultures)
    ? v.customCultures.flatMap((item) => {
        const c = record(item);
        if (typeof c.id !== "string" || typeof c.term !== "string") return [];
        return [{
          id: c.id.slice(0, 100), term: text(c.term).slice(0, 120),
          label: text(c.label, "Budaya Madura").slice(0, 120),
          desc: text(c.desc).slice(0, 1000), image: image(c.image) || "pesaan",
        }];
      })
    : [];
  const knownStoryIds = new Set([...stories, ...customStories].map((s) => s.id));
  const flags = (value: unknown, known = false) =>
    Object.fromEntries(
      Object.entries(record(value))
        .filter(
          ([k, x]) => x === true && (!known || knownStoryIds.has(k)),
        )
        .map(([k]) => [k, true]),
    );
  const docs: Record<string, Doc> = {};
  for (const [key, val] of Object.entries(record(v.docs))) {
    const d = record(val);
    docs[key] = {
      draft: content(d.draft),
      published: content(d.published),
      archived: d.archived === true,
    };
  }
  const quizzes: Array<State["quizzes"][number]> = Array.isArray(v.quizzes)
    ? v.quizzes.flatMap((item) => {
        const q = record(item);
        return typeof q.id === "string" &&
          (question(q.draft) || question(q.published))
          ? [
              {
                id: q.id,
                draft: question(q.draft),
                published: question(q.published),
              },
            ]
          : [];
      })
    : f.quizzes;
  const settings = record(v.settings);
  const moderation: State["moderation"] = {};
  for (const [key, value] of Object.entries(record(v.moderation))) {
    const m = record(value);
    moderation[key] = {
      status: ["pending", "approved", "revision"].includes(String(m.status))
        ? String(m.status)
        : "pending",
      reason: text(m.reason),
    };
  }
  const uploads: Artwork[] = Array.isArray(v.uploads)
    ? v.uploads.flatMap((item) => {
        const a = record(item);
        if (
          typeof a.id !== "string" ||
          typeof a.title !== "string" ||
          !image(a.data)
        )
          return [];
        return [
          {
            id: a.id,
            title: a.title,
            category: text(a.category, "Ilustrasi Cerita"),
            student: text(a.student, "Sobat Budaya"),
            className: text(a.className),
            school: text(a.school),
            likes: Math.max(0, Number(a.likes) || 0),
            data: image(a.data),
            created: Number(a.created) || 0,
          },
        ];
      })
    : [];
  const r = record(v.lastResult);
  let lastResult: Result | null = null;
  if (
    ["quiz", "game"].includes(String(r.kind)) &&
    typeof r.score === "number" &&
    typeof r.total === "number" &&
    typeof r.correct === "number"
  ) {
    const qs = Array.isArray(r.questions)
      ? r.questions.flatMap((item) => {
          const q = question(item);
          return q ? [{ ...q, id: text(record(item).id) }] : [];
        })
      : undefined;
    lastResult = {
      kind: r.kind as Result["kind"],
      score: r.score,
      total: r.total,
      correct: r.correct,
      elapsed: Number(r.elapsed) || 0,
      questions: qs,
      answers: Array.isArray(r.answers)
        ? r.answers.map((x) => (Number.isInteger(x) ? x : -1))
        : undefined,
    };
  }
  return {
    ...f,
    name: text(v.name).slice(0, 40),
    className: text(v.className, "VI").slice(0, 20),
    visited: flags(v.visited, true),
    completedStories: flags(v.completedStories, true),
    reflection: text(v.reflection),
    reflections: {
      ...(typeof v.reflection === "string" && v.reflection
        ? { jokotole: v.reflection }
        : {}),
      ...Object.fromEntries(
        Object.entries(record(v.reflections)).filter(
          (entry): entry is [string, string] => typeof entry[1] === "string",
        ),
      ),
    },
    gameEarned: v.gameEarned === true,
    quizEarned: v.quizEarned === true,
    bestQuiz: typeof v.bestQuiz === "number" ? v.bestQuiz : null,
    likes: Array.isArray(v.likes)
      ? v.likes.filter((x): x is string => typeof x === "string")
      : [],
    uploads,
    lastResult,
    docs,
    customStories,
    customCultures,
    quizzes,
    moderation,
    settings: {
      manager: text(settings.manager),
      school: text(settings.school),
      review: settings.review !== false,
    },
  };
}
