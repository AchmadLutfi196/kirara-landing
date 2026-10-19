"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cultures as sourceCultures, type Question } from "@/lib/data";
import { useStore } from "./store";
import { Button, Go, Heading, Guide, Image } from "./ui";
function useTimer(running = true, reset = 0) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => setElapsed(0), [reset]);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  return elapsed;
}
export function Matching() {
  const { state, setState } = useStore();
  const [completed, setCompleted] = useState(false);
  const [round, setRound] = useState(0);
  const elapsed = useTimer(!completed, round);
  const cultures = sourceCultures.map((c) => {
    const p = state.docs["material:" + c.id]?.published;
    return {
      ...c,
      term: String(p?.title || c.term),
      label: String(p?.label || c.label),
      desc: String(p?.desc || c.desc),
    };
  });
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [selected, select] = useState<string | null>(null);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [checked, check] = useState(false);
  const [message, say] = useState("Pilih gambar budaya untuk mulai.");
  const correct = Object.keys(pairs).filter((id) => id === pairs[id]);
  const terms = ["celurit", "batik", "pesaan", "karapan", "odeng"];
  function pair(id: string) {
    if (confirmed.includes(id)) return;
    if (!selected) {
      say("Pilih gambar budaya terlebih dahulu.");
      return;
    }
    setPairs((old) => {
      const next = { ...old };
      Object.keys(next).forEach((k) => {
        if (next[k] === id) delete next[k];
      });
      next[selected] = id;
      return next;
    });
    select(null);
    check(false);
    say("Pasangan terhubung. Lanjutkan, lalu periksa jawabanmu.");
  }
  function finish() {
    check(true);
    setConfirmed(correct);
    if (correct.length !== 5) {
      say(
        `${correct.length} dari 5 pasangan benar. Pilih ulang pasangan yang bertanda Coba lagi.`,
      );
      return;
    }
    setCompleted(true);
    say("Hebat! Semua pasangan benar. Hadiah 500 poin hanya diberikan sekali.");
    setState((s) => ({
      ...s,
      gameEarned: true,
      lastResult: { kind: "game", score: 100, correct: 5, total: 5, elapsed },
    }));
  }
  return (
    <div className="mini-game">
      <Heading title="Pasangkan Budaya Madura">
        Pilih gambar budaya, lalu pilih nama tradisinya. Bisa dengan sentuhan,
        Enter, atau Spasi.
      </Heading>
      <div className="game-counters">
        <span className="badge">{correct.length} / 5 pasangan benar</span>
        <span className="badge">{elapsed} detik</span>
        <span className="badge">
          {state.gameEarned
            ? "500 poin sudah diperoleh"
            : "Hadiah 500 Poin Budaya"}
        </span>
      </div>
      <Guide>
        Pilih satu kartu di kiri, lalu pasang dengan istilah di kanan. Setiap
        istilah hanya punya satu pasangan.
      </Guide>
      <div className="pairing-board card">
        <div className="pairing-column">
          <h2>Gambar budaya</h2>
          {cultures.map((c, i) => {
            const good = confirmed.includes(c.id);
            const wrong = checked && pairs[c.id] && pairs[c.id] !== c.id;
            return (
              <button
                data-testid={"culture-" + c.id}
                className={
                  "pair-card " +
                  (selected === c.id ? "selected " : "") +
                  (good ? "correct" : wrong ? "wrong" : "")
                }
                key={c.id}
                aria-pressed={selected === c.id}
                disabled={completed || good}
                onClick={() => {
                  select(c.id);
                  say(`Dipilih: ${c.label}. Sekarang pilih nama tradisinya.`);
                }}
              >
                <Image name={c.image} alt="" />
                <span>
                  <strong>
                    {i + 1}. {c.label}
                  </strong>
                  <span className="pair-description">{c.desc}</span>
                  <small>
                    {good
                      ? "✓ Benar"
                      : wrong
                        ? "× Coba lagi"
                        : pairs[c.id]
                          ? "→ " +
                            cultures.find((t) => t.id === pairs[c.id])?.term
                          : selected === c.id
                            ? "● Terpilih"
                            : "Pilih kartu"}
                  </small>
                </span>
              </button>
            );
          })}
        </div>
        <div className="pairing-column">
          <h2>Nama tradisi</h2>
          {terms.map((id) => {
            const c = cultures.find((x) => x.id === id)!;
            const source = Object.keys(pairs).find((k) => pairs[k] === id);
            const locked = confirmed.includes(id);
            return (
              <button
                data-testid={"term-" + id}
                key={id}
                className={"pair-card term " + (locked ? "correct" : "")}
                disabled={completed || locked}
                onClick={() => pair(id)}
              >
                <strong>{c.term}</strong>
                <small>
                  {locked
                    ? "✓ Benar"
                    : source
                      ? "Terhubung: kartu " +
                        (cultures.findIndex((c) => c.id === source) + 1)
                      : "Pilih pasangan"}
                </small>
              </button>
            );
          })}
        </div>
      </div>
      <p className="notice game-feedback" role="status">
        {message}
      </p>
      <div className="od-cluster">
        <Button
          disabled={Object.keys(pairs).length !== 5 || completed}
          onClick={finish}
        >
          Periksa Jawaban
        </Button>
        <Button
          onClick={() => {
            setPairs({});
            setRound((r) => r + 1);
            setConfirmed([]);
            select(null);
            check(false);
            setCompleted(false);
            say("Permainan direset. Hadiah tetap hanya sekali.");
          }}
        >
          Ulangi Permainan
        </Button>
        {completed && <Go to="hasil">Lihat Hasil</Go>}
      </div>
    </div>
  );
}
export function Quiz() {
  const { state, setState } = useStore();
  const router = useRouter();
  const elapsed = useTimer();
  const [questions] = useState<Question[]>(() =>
    state.quizzes
      .filter(
        (q) =>
          q.published &&
          q.published.options?.length >= 2 &&
          q.published.question,
      )
      .map((q) => ({ ...q.published!, id: q.id })),
  );
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [doubts, setDoubts] = useState<Record<number, boolean>>({});
  const [review, setReview] = useState(false);
  const q = questions[index];
  if (!q)
    return (
      <>
        <Heading title="Kuis Budaya" />
        <p>
          Belum ada soal terbit. Pengelola dapat menerbitkan soal melalui Bank
          Kuis.
        </p>
        <Go to="menu">Menu Utama</Go>
      </>
    );
  function finish() {
    const correct = questions.filter((q, i) => q.correct === answers[i]).length;
    const score = Math.round((correct / questions.length) * 100);
    setState((s) => ({
      ...s,
      quizEarned: s.quizEarned || score === 100,
      bestQuiz: Math.max(s.bestQuiz || 0, score),
      lastResult: {
        kind: "quiz",
        score,
        correct,
        total: questions.length,
        elapsed,
        questions,
        answers: questions.map((_, i) => answers[i]),
      },
    }));
    router.push("/hasil");
  }
  return (
    <>
      <Heading title="Kuis Budaya">
        Soal yang diterbitkan pengelola · {questions.length} soal tersedia ·{" "}
        {elapsed} detik
      </Heading>
      <div className="quiz-layout">
        <aside className="card panel quiz-guide">
          <Image name="sakera" alt="Sakera menyemangatimu" />
          <div className="quiz-guide-copy">
            <h2>Baca, pikirkan, pilih.</h2>
            <progress
              value={Object.keys(answers).length}
              max={questions.length}
              aria-label="Jumlah soal terjawab"
            />
            <p>
              {Object.keys(answers).length} / {questions.length} terjawab
            </p>
            <p>20 Poin Budaya sekali bila semua jawaban benar.</p>
          </div>
        </aside>
        <section className="card quiz-main">
          {review ? (
            <>
              <h2>Tinjau jawabanmu</h2>
              {questions.map((question, i) => (
                <div className="quiz-review-row" key={question.id}>
                  <h3>
                    {i + 1}. {question.question}
                  </h3>
                  <p>
                    Jawabanmu: {question.options[answers[i]] || "Belum dijawab"}{" "}
                    {doubts[i] ? "· Ragu-ragu" : ""}
                  </p>
                  <Button
                    onClick={() => {
                      setIndex(i);
                      setReview(false);
                    }}
                  >
                    Ubah Jawaban {i + 1}
                  </Button>
                </div>
              ))}
              <div className="quiz-actions">
                <Button onClick={() => setReview(false)}>
                  Kembali ke Soal
                </Button>
                <Button
                  disabled={Object.keys(answers).length !== questions.length}
                  onClick={finish}
                >
                  Selesaikan Kuis
                </Button>
              </div>
            </>
          ) : (
            <>
              <p>
                Soal {index + 1} dari {questions.length}
              </p>
              <h2 className="quiz-question">{q.question}</h2>
              <div className="quiz-options">
                {q.options.map((option, i) => (
                  <button
                    className={
                      "quiz-option " + (answers[index] === i ? "selected" : "")
                    }
                    key={i}
                    aria-pressed={answers[index] === i}
                    onClick={() => setAnswers((a) => ({ ...a, [index]: i }))}
                  >
                    <span className="option-key">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
              <label className="doubt-control">
                <input
                  type="checkbox"
                  checked={!!doubts[index]}
                  onChange={(e) =>
                    setDoubts((d) => ({ ...d, [index]: e.target.checked }))
                  }
                />{" "}
                Tandai ragu-ragu
              </label>
              <div className="quiz-actions">
                <Button
                  disabled={index === 0}
                  onClick={() => setIndex(index - 1)}
                >
                  Sebelumnya
                </Button>
                {index < questions.length - 1 && (
                  <Button onClick={() => setIndex(index + 1)}>
                    Soal Berikutnya
                  </Button>
                )}
                <Button onClick={() => setReview(true)}>Tinjau Jawaban</Button>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
export function Results() {
  const { state } = useStore();
  const r = state.lastResult;
  return (
    <>
      <Heading title="Setiap langkah adalah kemajuan.">
        Inilah hasil aktivitas yang baru kamu selesaikan.
      </Heading>
      {!r ? (
        <section className="card panel">
          <h2>Petualanganmu baru dimulai</h2>
          <p>Selesaikan aktivitas untuk melihat hasil.</p>
          <Go to="mini-game">Coba Mini Game</Go>
        </section>
      ) : (
        <>
          <section className="card panel result-layout">
            <div className="result-guide">
              <Image name="sakera" alt="Sakera" />
              <h2>{r.score === 100 ? "Hebat Sakaleh!" : "Terus semangat!"}</h2>
            </div>
            <div>
              <p>Nilai {r.kind === "game" ? "Mini Game" : "Kuis Budaya"}</p>
              <div className="result-score">
                {r.score}
                <small> / 100</small>
              </div>
              <div className="result-stats">
                <p>
                  <strong>
                    {r.correct} dari {r.total}
                  </strong>
                  <br />
                  Jawaban benar
                </p>
                <p>{r.elapsed} detik</p>
              </div>
              <p>
                {r.kind === "game"
                  ? "Lima pasangan budaya dari referensi."
                  : "Hasil hanya mencakup soal yang dikerjakan, bukan penguasaan semua cerita."}
              </p>
              <div className="result-actions">
                <Go to={r.kind === "game" ? "mini-game" : "kuis"}>Main Lagi</Go>
                <Go to="menu">Menu Utama</Go>
                <Go to="karya">Ruang Karya</Go>
              </div>
            </div>
          </section>
          {r.kind === "quiz" && r.questions && (
            <section className="card panel mt-8">
              <h2>Review Jawaban</h2>
              {r.questions.map((q, i) => (
                <div className="quiz-review-row" key={q.id}>
                  <h3>
                    {i + 1}. {q.question}
                  </h3>
                  <p>
                    {r.answers?.[i] === q.correct ? "✓ Benar" : "× Belum tepat"}{" "}
                    · Jawabanmu:{" "}
                    {q.options[r.answers?.[i] ?? -1] || "Belum dijawab"}
                  </p>
                  <p>Jawaban benar: {q.options[q.correct]}</p>
                  <p>{q.explanation}</p>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </>
  );
}
