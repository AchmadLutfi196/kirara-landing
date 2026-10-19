"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "./store";
import {
  cultures,
  stories,
  points,
  type Doc,
  type Question,
  type Story,
} from "@/lib/data";
import { Button, Go, Heading, Field, Image } from "./ui";
const sections = [
  ["", "Ringkasan"],
  ["konten", "Konten Belajar"],
  ["kuis", "Bank Kuis"],
  ["mini-game", "Mini Game"],
  ["karya", "Moderasi Karya"],
  ["siswa", "Progres Siswa"],
  ["pengaturan", "Pengaturan"],
];
export function Admin({ route }: { route: string }) {
  const section = route.split("/")[1] || "";
  const { state } = useStore();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">
          <Image name="logo" alt="KIRARA" className="admin-logo" />
          <span className="admin-brand-label">Ruang Pengelola</span>
        </Link>
        <nav aria-label="Navigasi admin">
          {sections.map(([path, label]) => (
            <Link
              key={path}
              className="admin-nav-link"
              href={"/admin" + (path ? "/" + path : "")}
              aria-current={section === path ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Go to="menu">Lihat Tampilan Siswa</Go>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <strong>Ruang Pengelola</strong>
          <span>Data perangkat ini</span>
        </header>
        <details className="admin-mobile-nav">
          <summary>Menu admin</summary>
          <nav>
            {sections.map(([path, label]) => (
              <Link
                className="admin-nav-link"
                key={path}
                href={"/admin" + (path ? "/" + path : "")}
                aria-current={section === path ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Go to="menu">Tampilan Siswa</Go>
        </details>
        <div className="admin-content">
          <p className="notice admin-local-notice">
            Pengelolaan lokal pada perangkat ini. Tidak ada autentikasi atau
            sinkronisasi server.
          </p>
          {section === "" ? (
            <div className="admin-dashboard">
              <section className="admin-dashboard-hero" aria-labelledby="admin-dashboard-title">
                <div className="admin-dashboard-intro">
                  <p className="admin-dashboard-kicker">Ringkasan admin</p>
                  <h1 id="admin-dashboard-title">Belajar berakar budaya.</h1>
                </div>
                <p className="admin-dashboard-description">Kelola kisah, tumbuhkan karya, dan pantau aktivitas belajar di perangkat ini.</p>
                <div className="od-cluster admin-dashboard-actions">
                  <Go to="admin/konten" primary>Kelola Konten Belajar</Go>
                  <Go to="admin/karya">Tinjau Karya</Go>
                </div>
                <Image
                  name="menu-cerita-v1"
                  alt=""
                  className="admin-dashboard-art"
                  width={256}
                  height={256}
                />
              </section>
              <section className="admin-dashboard-overview" aria-labelledby="admin-overview-title">
                <div className="admin-dashboard-section-head">
                  <h2 id="admin-overview-title">Ringkasan perangkat</h2>
                  <p>Data berikut tersimpan di browser ini.</p>
                </div>
                <dl className="admin-summary-grid">
                  <div className="admin-summary-item">
                    <dt>Cerita terbit</dt>
                    <dd>{stories.length + state.customStories.filter((s) => !!state.docs["story:" + s.id]?.published && !state.docs["story:" + s.id]?.archived).length}</dd>
                  </div>
                  <div className="admin-summary-item">
                    <dt>Soal terbit</dt>
                    <dd>{state.quizzes.filter((q) => q.published).length}</dd>
                  </div>
                  <div className="admin-summary-item">
                    <dt>Karya menunggu moderasi</dt>
                    <dd>{state.uploads.filter((a) => state.moderation[a.id]?.status !== "approved").length}</dd>
                  </div>
                </dl>
              </section>
              <div className="admin-dashboard-columns">
                <section className="admin-dashboard-shortcuts" aria-labelledby="admin-shortcuts-title">
                  <div className="admin-dashboard-section-head">
                    <h2 id="admin-shortcuts-title">Lanjutkan pengelolaan</h2>
                    <p>Pilih area yang ingin Anda perbarui.</p>
                  </div>
                  <div className="admin-shortcut-links">
                    {[
                      ["kuis", "Bank Kuis", "Kelola soal dan jawaban."],
                      ["mini-game", "Materi Mini Game", "Periksa pasangan budaya."],
                      ["siswa", "Progres Siswa", "Lihat aktivitas belajar."],
                      ["pengaturan", "Pengaturan", "Atur data perangkat."],
                    ].map(([path, title, description]) => (
                      <Link className="admin-shortcut-link" href={"/admin/" + path} key={path}>
                        <span>
                          <strong>{title}</strong>
                          <span>{description}</span>
                        </span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    ))}
                  </div>
                </section>
                <section className="admin-dashboard-profile" aria-labelledby="admin-profile-title">
                  <div className="admin-dashboard-section-head">
                    <h2 id="admin-profile-title">Profil siswa lokal</h2>
                    <p>Satu profil pada browser ini.</p>
                  </div>
                  <div className="admin-dashboard-student">
                    <span className="admin-student-initial" aria-hidden="true">{state.name ? Array.from(state.name.trim())[0] : "?"}</span>
                    <div>
                      <strong>{state.name || "Belum ada nama siswa"}</strong>
                      <p>{state.name ? `Kelas ${state.className} · ${points(state)} poin budaya` : "Profil akan muncul setelah siswa memasukkan nama."}</p>
                    </div>
                  </div>
                  <Go to="admin/siswa">Lihat Progres Siswa</Go>
                </section>
              </div>
            </div>
          ) : section === "konten" ? (
            <Content />
          ) : section === "kuis" ? (
            <QuestionBank />
          ) : section === "mini-game" ? (
            <>
              <Heading title="Lima Pasangan Budaya">
                Pasangan sumber digunakan konsisten dalam Mini Game. Materi
                dapat dikelola melalui Konten Belajar.
              </Heading>
              {cultures.map((c) => (
                <div className="card panel admin-list-row" key={c.id}>
                  <strong>
                    {String(
                      state.docs["material:" + c.id]?.published?.label ||
                        c.label,
                    )}
                  </strong>
                  <span>
                    →{" "}
                    {String(
                      state.docs["material:" + c.id]?.published?.title ||
                        c.term,
                    )}
                  </span>
                </div>
              ))}
              <div className="od-cluster">
                <Go to="mini-game">Coba Permainan</Go>
                <Go to="admin/konten">Edit Materi Budaya</Go>
              </div>
            </>
          ) : section === "karya" ? (
            <Moderation />
          ) : section === "siswa" ? (
            <>
              <Heading title="Progres Siswa">
                Satu profil lokal pada browser ini.
              </Heading>
              <section className="card panel od-stack">
                <h2>{state.name || "Belum ada nama siswa"}</h2>
                <p>
                  Kelas {state.className} · {points(state)} Poin Budaya
                </p>
                <p>
                  Mini Game: {state.gameEarned ? "Selesai" : "Belum selesai"}
                </p>
                <p>Kuis terbaik: {state.bestQuiz ?? "Belum dikerjakan"}</p>
                <p>
                  Cerita selesai: {Object.keys(state.completedStories).length}
                </p>
                <h3>Refleksi siswa</h3>
                {Object.entries(state.reflections).map(([id, text]) => (
                  <p key={id}>
                    <strong>
                      {stories.find((s) => s.id === id)?.title || id}
                    </strong>
                    : {text}
                  </p>
                ))}
              </section>
            </>
          ) : section === "pengaturan" ? (
            <Settings />
          ) : (
            <Heading title="Halaman pengelola tidak ditemukan" />
          )}
        </div>
      </div>
    </div>
  );
}
function Content() {
  const { state, setState, notify } = useStore();
  const [tab, setTab] = useState("story");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [value, setValue] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  function open(id: string) {
    const base =
      tab === "story"
        ? [...stories, ...state.customStories].find((s) => s.id === id)!
        : [...cultures, ...state.customCultures].find((c) => c.id === id)!;
    const doc = state.docs[tab + ":" + id];
    const initial = {
      ...(tab === "story"
        ? base
        : { ...base, title: "term" in base ? base.term : "" }),
      ...doc?.published,
      ...doc?.draft,
    };
    setValue(
      Object.fromEntries(
        Object.entries(initial).map(([k, v]) => [k, String(v ?? "")]),
      ),
    );
    setEditing(id);
    setError("");
  }
  function create() {
    setValue(tab === "story"
      ? { title: "", origin: "", minutes: "7", category: "Cerita Rakyat Madura", image: "art-jokotole", desc: "", body: "" }
      : { title: "", label: "Budaya Madura", desc: "", body: "", image: "pesaan" });
    setEditing("new");
    setError("");
  }
  function publishCover(reset = false) {
    if (!editing) return;
    const key = "story:" + editing;
    const cover = reset ? "" : value.cover || "";
    setState((s) => ({
      ...s,
      docs: {
        ...s.docs,
        [key]: {
          ...s.docs[key],
          published: { ...s.docs[key]?.published, cover },
        },
      },
    }));
    if (reset) setValue((v) => ({ ...v, cover: "" }));
    notify(
      reset
        ? "Sampul asli dipulihkan."
        : "Sampul diterbitkan tanpa mengubah naskah atau metadata.",
    );
  }
  function save(publish: boolean) {
    if (!editing) return;
    if (
      tab === "material" &&
      publish &&
      [...cultures, ...state.customCultures].some(
        (c) =>
          c.id !== editing &&
          String(state.docs["material:" + c.id]?.published?.title || c.term)
            .trim()
            .toLocaleLowerCase() === value.title?.trim().toLocaleLowerCase(),
      )
    ) {
      setError(
        "Nama budaya harus unik agar pasangan permainan tidak membingungkan.",
      );
      return;
    }
    if (
      value.title?.trim().length < 3 ||
      !value.desc?.trim() ||
      (tab === "story" && !value.origin?.trim()) ||
      (publish && tab === "story" && !value.body?.trim())
    ) {
      setError(
        publish && tab === "story"
          ? "Isi judul, asal, deskripsi, dan naskah lengkap asli sebelum menerbitkan."
          : "Isi judul minimal 3 karakter, deskripsi, dan asal cerita.",
      );
      return;
    }
    const id = editing === "new" ? "custom-" + crypto.randomUUID() : editing;
    const key = tab + ":" + id;
    const payload = {
      ...value,
      ...(tab === "story"
        ? { minutes: Math.max(1, Number(value.minutes) || 1) }
        : {}),
    };
    setState((s) => {
      const custom = tab === "story"
        ? { id, title: value.title, origin: value.origin, minutes: Number(value.minutes) || 7, category: value.category || "Cerita Rakyat Madura", image: value.image || "art-jokotole", desc: value.desc, body: value.body || "", available: false }
        : { id, term: value.title, label: value.label || "Budaya Madura", desc: value.desc, image: value.image || "pesaan" };
      const isCustom = id.startsWith("custom-");
      const customStories = tab === "story" && isCustom
        ? (s.customStories.some((item) => item.id === id) ? s.customStories.map((item) => item.id === id ? custom as Story : item) : [...s.customStories, custom as Story])
        : s.customStories;
      const customCultures = tab === "material" && isCustom
        ? (s.customCultures.some((item) => item.id === id) ? s.customCultures.map((item) => item.id === id ? custom as (typeof item) : item) : [...s.customCultures, custom as (typeof s.customCultures)[number]])
        : s.customCultures;
      return {
        ...s,
        customStories,
        customCultures,
        docs: {
          ...s.docs,
          [key]: publish
            ? { ...s.docs[key], published: payload, draft: undefined, archived: false }
            : { ...s.docs[key], draft: payload },
        },
      };
    });
    notify(
      publish
        ? "Konten diterbitkan untuk siswa."
        : "Draf tersimpan; siswa masih melihat versi terbit.",
    );
    setEditing(null);
  }
  async function cover(file: File | undefined) {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      setError("Sampul harus JPG, PNG, atau WebP maksimal 2 MB.");
      return;
    }
    setBusy(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      await new Promise<void>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = data;
      });
      setValue((v) => ({ ...v, cover: data }));
      setError("");
    } catch {
      setError("Sampul tidak dapat dibaca.");
    } finally {
      setBusy(false);
    }
  }
  const items = tab === "story" ? [...stories, ...state.customStories] : [...cultures, ...state.customCultures];
  return (
    <>
      <Heading title="Konten Belajar">
        Simpan draf untuk meninjau, lalu terbitkan agar tersedia untuk siswa.
      </Heading>
      {editing ? (
        <form
          className="card panel admin-editor-form od-stack"
          onSubmit={(e) => {
            e.preventDefault();
            save(false);
          }}
        >
          <h2>{editing === "new" ? "Tambah" : "Edit"} {tab === "story" ? "Cerita" : "Materi"}</h2>
          <Field label="Judul">
            <input
              className="input"
              value={value.title || ""}
              onChange={(e) =>
                setValue((v) => ({ ...v, title: e.target.value }))
              }
              maxLength={120}
            />
          </Field>
          {tab === "story" ? (
            <>
              <Field label="Asal cerita">
                <input
                  className="input"
                  value={value.origin || ""}
                  onChange={(e) =>
                    setValue((v) => ({ ...v, origin: e.target.value }))
                  }
                />
              </Field>
              <Field label="Estimasi menit baca">
                <input
                  className="input"
                  type="number"
                  min={1}
                  max={120}
                  value={value.minutes || "7"}
                  onChange={(e) =>
                    setValue((v) => ({ ...v, minutes: e.target.value }))
                  }
                />
              </Field>
              <Field label="Kategori cerita">
                <input
                  className="input"
                  value={value.category || ""}
                  onChange={(e) =>
                    setValue((v) => ({ ...v, category: e.target.value }))
                  }
                />
              </Field>
            </>
          ) : (
            <>
              <Field label="Label budaya">
                <input
                  className="input"
                  value={value.label || ""}
                  onChange={(e) =>
                    setValue((v) => ({ ...v, label: e.target.value }))
                  }
                />
              </Field>
              <Field label="Isi materi">
                <textarea
                  className="input"
                  value={value.body || ""}
                  onChange={(e) =>
                    setValue((v) => ({ ...v, body: e.target.value }))
                  }
                />
              </Field>
            </>
          )}
          <Field label="Deskripsi">
            <textarea
              className="input"
              value={value.desc || ""}
              onChange={(e) =>
                setValue((v) => ({ ...v, desc: e.target.value }))
              }
              maxLength={1000}
            />
          </Field>
          {tab === "story" && (
            <>
              <Field label="Naskah lengkap (dari sumber asli)">
                <textarea
                  className="input story-editor"
                  value={value.body || ""}
                  onChange={(e) =>
                    setValue((v) => ({ ...v, body: e.target.value }))
                  }
                  maxLength={100000}
                />
              </Field>
              <p>
                Cuplikan sumber tetap tersedia pada halaman siswa. Terbitkan
                hanya naskah lengkap yang sudah diverifikasi pengelola.
              </p>
              <Image
                name={value.cover || value.image || "art-jokotole"}
                alt="Pratinjau sampul"
                className="upload-preview"
              />
              <Field label="Sampul cerita (JPG, PNG, WebP, maksimal 2 MB)">
                <input
                  className="input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => cover(e.target.files?.[0])}
                />
              </Field>
              <div className="od-cluster">
                <Button
                  disabled={busy || !value.cover}
                  onClick={() => publishCover()}
                >
                  Terbitkan Sampul
                </Button>
                <Button disabled={busy} onClick={() => publishCover(true)}>
                  Pulihkan Sampul Asli
                </Button>
              </div>
            </>
          )}
          <p role="alert">{error}</p>
          <div className="od-cluster">
            <Button type="submit" disabled={busy}>
              Simpan Draf
            </Button>
            <Button disabled={busy} onClick={() => save(true)}>
              Terbitkan
            </Button>
            <Button onClick={() => setEditing(null)}>Batal</Button>
          </div>
        </form>
      ) : (
        <>
          <div className="od-cluster">
            <Button
              aria-pressed={tab === "story"}
              onClick={() => setTab("story")}
            >
              Cerita
            </Button>
            <Button
              aria-pressed={tab === "material"}
              onClick={() => setTab("material")}
            >
              Materi
            </Button>
            <Button onClick={create}>Tambah {tab === "story" ? "Cerita" : "Materi"}</Button>
          </div>
          <div className="gallery-toolbar">
            <Field label="Cari konten">
              <input
                className="input"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Field>
            <Field label="Status konten">
              <select
                className="input"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Semua status</option>
                <option value="draft">Draf</option>
                <option value="published">Terbit</option>
                <option value="source">Referensi</option>
                <option value="archived">Diarsipkan</option>
              </select>
            </Field>
          </div>
          <div className="od-stack">
            {items
              .filter((item) => {
                const d = state.docs[tab + ":" + item.id];
                const status = d?.archived
                  ? "archived"
                  : d?.draft
                    ? "draft"
                    : d?.published
                      ? "published"
                      : "source";
                return (
                  (filter === "all" || filter === status) &&
                  JSON.stringify({
                    ...item,
                    ...state.docs[tab + ":" + item.id]?.published,
                    ...state.docs[tab + ":" + item.id]?.draft,
                  })
                    .toLowerCase()
                    .includes(search.toLowerCase())
                );
              })
              .map((item) => {
                const key = tab + ":" + item.id;
                const doc = state.docs[key];
                return (
                  <article className="card panel admin-list-row" key={item.id}>
                    <div>
                      <h2>
                        {String(
                          doc?.draft?.title ||
                            doc?.published?.title ||
                            ("title" in item ? item.title : item.term),
                        )}
                      </h2>
                      <p>
                        {doc?.archived
                          ? "Diarsipkan"
                          : doc?.draft
                            ? "Draf"
                            : doc?.published
                              ? "Terbit"
                              : "Referensi"}
                      </p>
                    </div>
                    <div className="od-cluster">
                      <Button onClick={() => open(item.id)}>
                        Edit {"title" in item ? item.title : item.term}
                      </Button>
                      {String(item.id).startsWith("custom-") ? <Button onClick={() => {
                        if (!window.confirm("Hapus konten ini secara permanen dari perangkat?") ) return;
                        setState((s) => ({
                          ...s,
                          customStories: tab === "story" ? s.customStories.filter((x) => x.id !== item.id) : s.customStories,
                          customCultures: tab === "material" ? s.customCultures.filter((x) => x.id !== item.id) : s.customCultures,
                          docs: Object.fromEntries(Object.entries(s.docs).filter(([docKey]) => docKey !== key)),
                        }));
                        notify("Konten dihapus dari perangkat.");
                      }}>Hapus</Button> : <Button
                        onClick={() => {
                          setState((s) => ({
                            ...s,
                            docs: {
                              ...s.docs,
                              [key]: {
                                ...s.docs[key],
                                archived: !s.docs[key]?.archived,
                              },
                            },
                          }));
                          notify(
                            doc?.archived
                              ? "Konten dipulihkan."
                              : "Konten diarsipkan dari daftar siswa.",
                          );
                        }}
                      >
                        {doc?.archived ? "Pulihkan" : "Arsipkan"}
                      </Button>}
                    </div>
                  </article>
                );
              })}
          </div>
        </>
      )}
    </>
  );
}
function QuestionBank() {
  const { state, setState, notify } = useStore();
  const [id, setId] = useState<string | null>(null);
  const [q, setQ] = useState<Omit<Question, "id">>({
    question: "",
    options: ["", "", "", ""],
    correct: 0,
    explanation: "",
  });
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  function save(publish: boolean) {
    if (
      q.question.trim().length < 5 ||
      q.options.some((o) => !o.trim()) ||
      new Set(q.options.map((o) => o.trim().toLowerCase())).size !== 4 ||
      !q.explanation.trim()
    ) {
      setError(
        "Isi pertanyaan, empat pilihan unik, jawaban benar, dan pembahasan.",
      );
      return;
    }
    const key = id === "new" ? "q-" + crypto.randomUUID() : id!;
    setState((s) => {
      const existing = s.quizzes.find((x) => x.id === key);
      const entry = publish
        ? { ...existing, id: key, published: q, draft: undefined }
        : { ...existing, id: key, draft: q };
      return {
        ...s,
        quizzes: existing
          ? s.quizzes.map((x) => (x.id === key ? entry : x))
          : [...s.quizzes, entry],
      };
    });
    notify(publish ? "Soal diterbitkan." : "Draf soal tersimpan.");
    setId(null);
  }
  return (
    <>
      <Heading title="Bank Kuis">
        Hanya soal terbit yang digunakan dalam kuis siswa.
      </Heading>
      {id ? (
        <form
          className="card panel od-stack"
          onSubmit={(e) => {
            e.preventDefault();
            save(false);
          }}
        >
          <h2>{id === "new" ? "Tambah Soal" : "Edit Soal"}</h2>
          <Field label="Pertanyaan">
            <textarea
              className="input"
              value={q.question}
              onChange={(e) =>
                setQ((v) => ({ ...v, question: e.target.value }))
              }
            />
          </Field>
          {q.options.map((o, i) => (
            <Field key={i} label={"Pilihan " + String.fromCharCode(65 + i)}>
              <input
                className="input"
                value={o}
                onChange={(e) =>
                  setQ((v) => ({
                    ...v,
                    options: v.options.map((x, j) =>
                      i === j ? e.target.value : x,
                    ),
                  }))
                }
              />
            </Field>
          ))}
          <Field label="Jawaban benar">
            <select
              className="input"
              value={q.correct}
              onChange={(e) =>
                setQ((v) => ({ ...v, correct: Number(e.target.value) }))
              }
            >
              {q.options.map((_, i) => (
                <option value={i} key={i}>
                  {String.fromCharCode(65 + i)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Pembahasan">
            <textarea
              className="input"
              value={q.explanation}
              onChange={(e) =>
                setQ((v) => ({ ...v, explanation: e.target.value }))
              }
            />
          </Field>
          <p role="alert">{error}</p>
          <div className="od-cluster">
            <Button type="submit">Simpan Draf</Button>
            <Button onClick={() => save(true)}>Terbitkan Soal</Button>
            <Button onClick={() => setId(null)}>Batal</Button>
          </div>
        </form>
      ) : (
        <>
          <Button
            onClick={() => {
              setId("new");
              setQ({
                question: "",
                options: ["", "", "", ""],
                correct: 0,
                explanation: "",
              });
              setError("");
            }}
          >
            Tambah Soal
          </Button>
          <Field label="Cari soal">
            <input
              className="input"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>
          <div className="od-stack">
            {state.quizzes
              .filter((item) =>
                (item.draft?.question || item.published?.question || "")
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              )
              .map((item) => (
                <article className="card panel od-stack" key={item.id}>
                  <h2>{item.draft?.question || item.published?.question}</h2>
                  <p>
                    {item.draft ? "Draf · " : ""}
                    {item.published ? "Terbit" : "Belum diterbitkan"}
                  </p>
                  <div className="od-cluster">
                    <Button
                      onClick={() => {
                        setId(item.id);
                        setQ(structuredClone(item.draft || item.published!));
                        setError("");
                      }}
                    >
                      Edit Soal
                    </Button>
                    {item.published && (
                      <Button
                        onClick={() => {
                          setState((s) => ({
                            ...s,
                            quizzes: s.quizzes.map((x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    draft: x.draft || x.published,
                                    published: undefined,
                                  }
                                : x,
                            ),
                          }));
                          notify("Soal ditarik dari publikasi.");
                        }}
                      >
                        Tarik Publikasi
                      </Button>
                    )}
                    {item.id !== "source-jokotole" && (
                      <Button
                        onClick={() => {
                          if (
                            window.confirm("Hapus soal ini dari bank kuis?")
                          ) {
                            setState((s) => ({
                              ...s,
                              quizzes: s.quizzes.filter(
                                (x) => x.id !== item.id,
                              ),
                            }));
                            notify("Soal dihapus.");
                          }
                        }}
                      >
                        Hapus Soal
                      </Button>
                    )}
                  </div>
                </article>
              ))}
          </div>
        </>
      )}
    </>
  );
}
function Moderation() {
  const { state, setState, notify } = useStore();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  function moderate(id: string, status: string) {
    const reason = reasons[id]?.trim() || "";
    if (status === "revision" && reason.length < 5) {
      setError("Tulis masukan revisi minimal 5 karakter.");
      return;
    }
    setState((s) => ({
      ...s,
      moderation: {
        ...s.moderation,
        [id]: { status, reason: status === "revision" ? reason : "" },
      },
    }));
    notify(
      status === "approved"
        ? "Karya disetujui dan tampil pada galeri lokal."
        : "Status karya diperbarui.",
    );
    setError("");
  }
  const list = state.uploads.filter(
    (a) =>
      (filter === "all" ||
        (state.moderation[a.id]?.status || "pending") === filter) &&
      (a.title + " " + a.student).toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <Heading title="Moderasi Karya">
        Tinjau unggahan pada perangkat ini.
      </Heading>
      <div className="gallery-toolbar">
        <Field label="Cari karya">
          <input
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Field>
        <Field label="Status karya">
          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Semua status</option>
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="revision">Perlu revisi</option>
          </select>
        </Field>
      </div>
      <p role="alert">{error}</p>
      {!list.length && (
        <section className="card panel">
          <h2>Belum ada karya untuk ditinjau</h2>
          <p>
            Unggahan siswa akan muncul di sini. Karya contoh referensi tidak
            termasuk antrean moderasi.
          </p>
        </section>
      )}
      <div className="od-stack">
        {list.map((a) => (
          <article className="card panel od-stack" key={a.id}>
            <Image
              name={a.data || a.image!}
              alt={a.title}
              className="upload-preview"
            />
            <h2>{a.title}</h2>
            <p>
              {a.student} · {a.category}
            </p>
            <p>
              Status:{" "}
              {
                {
                  pending: "Menunggu",
                  approved: "Disetujui",
                  revision: "Perlu revisi",
                }[state.moderation[a.id]?.status || "pending"]
              }
            </p>
            <Field label={"Masukan revisi untuk " + a.title}>
              <textarea
                className="input"
                value={reasons[a.id] ?? state.moderation[a.id]?.reason ?? ""}
                onChange={(e) =>
                  setReasons((r) => ({ ...r, [a.id]: e.target.value }))
                }
              />
            </Field>
            <div className="od-cluster">
              <Button onClick={() => moderate(a.id, "approved")}>
                Setujui Karya
              </Button>
              <Button onClick={() => moderate(a.id, "revision")}>
                Minta Revisi
              </Button>
              <Button onClick={() => moderate(a.id, "pending")}>
                Kembalikan ke Antrean
              </Button>
              <Button onClick={() => {
                if (!window.confirm("Hapus karya ini dari perangkat?")) return;
                setState((s) => ({
                  ...s,
                  uploads: s.uploads.filter((upload) => upload.id !== a.id),
                  likes: s.likes.filter((like) => like !== a.id),
                  moderation: Object.fromEntries(Object.entries(s.moderation).filter(([id]) => id !== a.id)),
                }));
                notify("Karya dihapus dari perangkat.");
              }}>
                Hapus Karya
              </Button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
function Settings() {
  const { state, setState, notify } = useStore();
  const [value, setValue] = useState(state.settings);
  return (
    <>
      <Heading title="Pengaturan">
        Preferensi pengelola dan moderasi lokal.
      </Heading>
      <form
        className="card panel od-stack"
        onSubmit={(e) => {
          e.preventDefault();
          setState((s) => ({ ...s, settings: value }));
          notify("Pengaturan tersimpan.");
        }}
      >
        <Field label="Nama pengelola">
          <input
            className="input"
            value={value.manager}
            maxLength={80}
            onChange={(e) =>
              setValue((v) => ({ ...v, manager: e.target.value }))
            }
          />
        </Field>
        <Field label="Sekolah">
          <input
            className="input"
            value={value.school}
            maxLength={120}
            onChange={(e) =>
              setValue((v) => ({ ...v, school: e.target.value }))
            }
          />
        </Field>
        <label className="doubt-control">
          <input
            type="checkbox"
            checked={value.review}
            onChange={(e) =>
              setValue((v) => ({ ...v, review: e.target.checked }))
            }
          />{" "}
          Tinjau karya sebelum tampil di galeri lokal
        </label>
        <Button type="submit">Simpan Pengaturan</Button>
      </form>
    </>
  );
}
