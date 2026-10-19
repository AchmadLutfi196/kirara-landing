"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "./store";
import { Image, Go, Button, Heading, Guide, Field, Icon } from "./ui";
import {
  stories,
  cultures,
  asset,
  excerpt,
  points,
  type Story,
} from "@/lib/data";
import { Matching, Quiz, Results } from "./learning";
import { Gallery } from "./gallery";
import { Admin } from "./admin";
import studentLayout from "./student-layout.module.css";
const nav = [
  ["menu", "Menu Utama"],
  ["cerita", "Pilih Cerita"],
  ["mini-game", "Mini Game"],
  ["kuis", "Kuis Budaya"],
  ["karya", "Ruang Karya"],
];
export function KiraraApp({ route }: { route: string }) {
  const { state, ready, notice } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!ready) return;
    const hasName = state.name.trim().length >= 2;
    if (
      route &&
      route !== "masuk" &&
      !route.startsWith("admin") &&
      !hasName
    ) {
      router.replace("/masuk");
      return;
    }
    if (location.hash.startsWith("#/")) {
      const target = location.hash.slice(1);
      if (/^\/[a-z0-9/-]*$/.test(target)) {
        const targetRoute = target.slice(1);
        if (
          !hasName &&
          targetRoute !== "masuk" &&
          !targetRoute.startsWith("admin")
        ) router.replace("/masuk");
        else router.replace(target);
      }
      return;
    }
    if (!route) router.replace(hasName ? "/menu" : "/masuk");
  }, [ready, route, state.name, router]);
  useEffect(() => {
    document.body.classList.toggle("admin-view", route.startsWith("admin"));
    document.body.dataset.surface = route.startsWith("admin")
      ? "admin"
      : route === "menu" || route === "masuk"
        ? "entry"
        : route.startsWith("baca")
          ? "reader"
          : route === "mini-game"
            ? "game"
            : route === "kuis"
              ? "quiz"
              : "learning";
    setOpen(false);
    const t = setTimeout(() => document.getElementById("main")?.focus(), 0);
    return () => clearTimeout(t);
  }, [route]);
  if (!ready || !route)
    return (
      <main className="page" aria-busy="true">
        <Image name="logo" alt="KIRARA" className="loading-logo" />
        <p role="status">Menyiapkan petualangan belajarmu…</p>
      </main>
    );
  return (
    <>
      <a className="skip-link" href="#main">
        Langsung ke konten
      </a>
      {!route.startsWith("admin") && (
        <header className="site-header">
          <div className="header-inner">
            <Link href="/menu" className="brand">
              <Image name="logo" alt="KIRARA" />
              <span className="od-field">
                <strong className="brand-name">KIRARA</strong>
                <span className="brand-caption">Kisah Rakyat Madura</span>
              </span>
            </Link>
            <nav
              id="main-nav"
              className={"main-nav " + (open ? "open" : "")}
              aria-label="Navigasi utama"
            >
              {nav.map(([path, label]) => (
                <Link
                  className="nav-item"
                  key={path}
                  href={"/" + path}
                  aria-current={route === path ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
              <Link className="nav-item profile-nav" href="/profil">
                Profil Siswa
              </Link>
            </nav>
            <div className="header-tools">
              <Link
                href="/profil"
                className="avatar"
                aria-label="Buka profil siswa"
              >
                {(state.name || "S").charAt(0).toUpperCase()}
              </Link>
              <span className="points">
                <Icon name="star" /> <strong>{points(state)}</strong>{" "}
                <span className="points-label">Poin Budaya</span>
              </span>
              <button
                className="btn btn-secondary mobile-toggle"
                aria-label="Buka menu navigasi"
                aria-expanded={open}
                aria-controls="main-nav"
                onClick={() => setOpen(!open)}
              >
                <Icon name="menu" />
              </button>
            </div>
          </div>
        </header>
      )}
      {notice && (
        <div className="notice storage-notice" role="status">
          {notice}
        </div>
      )}
      <main
        id="main"
        tabIndex={-1}
        className={
          route.startsWith("admin")
            ? "page admin-page"
            : route === "masuk" || route === "menu"
              ? "entry-main"
              : "page student-page"
        }
      >
        {route.startsWith("admin") ? (
          <Admin route={route} />
        ) : route === "masuk" || route === "menu" ? (
          <Entry menu={route === "menu"} />
        ) : route === "cerita" ? (
          <Stories />
        ) : route.startsWith("baca/") ? (
          <Reader id={route.split("/")[1]} />
        ) : route === "mini-game" ? (
          <Matching />
        ) : route === "kuis" ? (
          <Quiz />
        ) : route === "hasil" ? (
          <Results />
        ) : route === "karya" ? (
          <Gallery />
        ) : route === "profil" ? (
          <Profile />
        ) : route === "materi" ? (
          <Materials />
        ) : route === "ui-kit" ? (
          <Kit />
        ) : (
          <>
            <Heading title="Halaman tidak ditemukan" />
            <Go to="menu">Kembali ke Menu Utama</Go>
          </>
        )}
      </main>
      <footer className="footer">
        <span>KIRARA · Kisah Rakyat Madura</span>
        <span>Belajar dan berkarya · Data tersimpan di perangkat ini</span>
        <Link href="/admin">Ruang Pengelola</Link>
      </footer>
    </>
  );
}
function Entry({ menu }: { menu: boolean }) {
  const { state, setState } = useStore();
  const router = useRouter();
  const [name, setName] = useState(state.name);
  const [error, setError] = useState("");
  return (
    <section className={studentLayout.entry}>
      <Image name="kirara-village-background" className={studentLayout.background} />
      <div className={studentLayout.wrap}>
        <div className={menu ? studentLayout.menuLayout : studentLayout.onboardingLayout}>
          <section className={studentLayout.welcome}>
            <div className={studentLayout.welcomeCopy}>
              <p className={studentLayout.intro}>Kisah Rakyat Madura · Kelas VI SD</p>
              <h1>
                {menu ? (
                  <>
                    Selamat datang,{" "}
                    <span className="primary-text">
                      {state.name || "Sobat Budaya"}!
                    </span>
                  </>
                ) : (
                  <>
                    Kisah dari Madura.
                    <br />
                    Petualangan untukmu.
                  </>
                )}
              </h1>
              <p>
                {menu
                  ? "Setiap cerita menyimpan pelajaran. Ayo kenali keberanian, kebaikan, dan budaya Madura."
                  : "Halo, Sobat Budaya! Jelajahi cerita rakyat Madura bersama Sakera dan Marlena. Yuk, kenalan dulu."}
              </p>
              {menu && (
                <Go to="cerita" primary>Mulai Membaca</Go>
              )}
            </div>
            {menu && (
              <div className={studentLayout.menuCompanions}>
                <Image name="sakera" alt="Sakera, sahabat belajarmu" />
                <Image name="marlena" alt="Marlena, sahabat membaca" />
              </div>
            )}
          </section>
          {menu ? (
            <>
              <section className={studentLayout.activities} aria-labelledby="student-activities-title">
                <div className={studentLayout.activitiesHeading}>
                  <h2 id="student-activities-title">Mau belajar apa hari ini?</h2>
                  <p>Pilih kegiatan dan mulai petualanganmu.</p>
                </div>
                <nav
                  className={studentLayout.activityGrid}
                  aria-label="Pilih kegiatan belajar"
                >
                  {[
                    ["materi", "Materi", "Kenali warisan budaya Madura."],
                    ["cerita", "Cerita", "Jelajahi tiga kisah pilihan."],
                    ["mini-game", "Mini Game", "Pasangkan gambar dan istilah."],
                    ["kuis", "Kuis", "Asah pemahaman ceritamu."],
                    ["karya", "Ruang Karya", "Lihat kreativitas teman."],
                    ["profil", "Profil", "Lihat perjalanan belajarmu."],
                  ].map(([path, title, desc]) => (
                    <Link
                      key={path}
                      href={"/" + path}
                      className={studentLayout.activityLink}
                    >
                      <span className={studentLayout.activityIcon}>
                        <Image name={"menu-" + path + "-v1"} />
                      </span>
                      <span className={studentLayout.activityCopy}>
                        <strong>{title}</strong>
                        <span>{desc}</span>
                      </span>
                      <span className={studentLayout.activityArrow} aria-hidden="true">→</span>
                    </Link>
                  ))}
                </nav>
              </section>
              <aside className={studentLayout.guidance}>
                <Image name="sakera" alt="" />
                <div>
                  <strong>Pesan Sakera</strong>
                  <p>
                    Mulai dari cerita yang paling menarik bagimu. Belajar
                    sedikit demi sedikit, lalu coba tantangannya!
                  </p>
                </div>
              </aside>
            </>
          ) : (
            <form
              className={studentLayout.form}
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim().length < 2 || !/[A-Za-zÀ-ž]/.test(name)) {
                  setError(
                    "Isi nama panggilan minimal 2 karakter dan mengandung huruf.",
                  );
                  return;
                }
                setState((s) => ({ ...s, name: name.trim() }));
                router.push("/menu");
              }}
            >
              <div className={studentLayout.formHeading}>
                <h2>Yuk, kenalan dulu.</h2>
                <p>Isi nama panggilan untuk memulai.</p>
              </div>
              <Field label="Nama panggilan kamu (wajib diisi)">
                <input
                  id="student-name"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  autoComplete="given-name"
                  aria-invalid={!!error}
                  aria-describedby="name-error"
                />
              </Field>
              <p id="name-error" className={studentLayout.error} role="alert">
                {error}
              </p>
              <Button type="submit">Mulai Petualangan</Button>
              <p className={studentLayout.storageHint}>Progres tersimpan di perangkat ini.</p>
              <div className={studentLayout.storyPreview}>
                <Image name="art-jokotole" alt="Jokotole dan kuda Si Giga" />
                <div>
                  <strong>Jokotole &amp; Kuda Si Giga</strong>
                  <p>Salah satu kisah yang akan kamu kenal.</p>
                </div>
              </div>
            </form>
          )}
          {!menu && (
            <div className={studentLayout.onboardingCompanions}>
              <figure>
                <Image name="sakera" alt="Sakera, sahabat belajarmu" />
                <figcaption>Sakera</figcaption>
              </figure>
              <figure>
                <Image name="marlena" alt="Marlena, sahabat membaca" />
                <figcaption>Marlena</figcaption>
              </figure>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
function Stories() {
  const { state } = useStore();
  return (
    <>
      <Heading title="Pilih ceritamu, mulai petualangan.">
        Tiga kisah rakyat Madura tentang keberanian, kebaikan, dan perjuangan.
      </Heading>
      <div className="od-grid story-grid">
        {[...stories, ...state.customStories]
          .filter((s) => {
            const doc = state.docs["story:" + s.id];
            return !doc?.archived && (!state.customStories.some((c) => c.id === s.id) || !!doc?.published);
          })
          .map((base) => {
            const s = {
              ...base,
              ...state.docs["story:" + base.id]?.published,
            } as Story;
            return (
              <article className="card story-card" key={s.id}>
                <div className="story-media">
                  <Image name={s.cover || s.image} alt={s.title} />
                </div>
                <div className="story-body">
                  <p>
                    {s.origin} · ±{s.minutes} menit
                  </p>
                  <h2>{s.title}</h2>
                  <p>{s.desc}</p>
                  <span className="badge">
                    {s.body
                      ? "Naskah pengelola"
                      : s.available
                        ? "Cuplikan tersedia"
                        : "Naskah belum tersedia"}
                  </span>
                  <p>
                    {state.completedStories[s.id]
                      ? "Cerita selesai"
                      : state.visited[s.id]
                        ? "Pernah dibuka"
                        : "Belum mulai membaca"}
                  </p>
                  <Go to={"baca/" + s.id}>Mulai Baca</Go>
                </div>
              </article>
            );
          })}
      </div>
      <p className="section-note">
        +50 poin hanya setelah naskah lengkap selesai dibaca. Membuka cuplikan
        tidak memberi poin cerita.
      </p>
      <Guide>Yuk, mulai mengenal Jokotole dan Si Giga!</Guide>
    </>
  );
}
function Reader({ id }: { id: string }) {
  const { state, setState, notify } = useStore();
  const [large, setLarge] = useState(false);
  const [continuation, setContinuation] = useState(false);
  const [reflection, setReflection] = useState(
    state.reflections[id] || state.reflection || "",
  );
  const base = [...stories, ...state.customStories].find((s) => s.id === id);
  const custom = state.customStories.some((story) => story.id === id);
  const s = base
    ? ({ ...base, ...state.docs["story:" + id]?.published } as Story)
    : undefined;
  useEffect(() => {
    if (base && !state.docs["story:" + id]?.archived && (!custom || !!state.docs["story:" + id]?.published))
      setState((v) =>
        v.visited[id] ? v : { ...v, visited: { ...v.visited, [id]: true } },
      );
  }, [id, base, custom, state.docs, setState]);
  useEffect(() => {
    setContinuation(false);
    setReflection(state.reflections[id] || "");
  }, [id]);
  if (!s || state.docs["story:" + id]?.archived || (custom && !state.docs["story:" + id]?.published))
    return (
      <>
        <Heading title="Cerita tidak tersedia" />
        <Go to="cerita">Daftar Cerita</Go>
      </>
    );
  const body = s.body || (s.available && !continuation ? excerpt : "");
  return (
    <>
      <div className="reader-toolbar">
        <Go to="cerita">Daftar Cerita</Go>
        <Button onClick={() => setLarge(!large)} aria-pressed={large}>
          {large ? "Teks Normal" : "Perbesar Teks"}
        </Button>
      </div>
      <div className="reader-layout">
        <aside>
          <figure className="reader-figure">
            <Image name={s.cover || s.readerImage || s.image} alt={s.title} />
            <figcaption>
              {s.title} · {s.origin}
            </figcaption>
          </figure>
          <section className="card panel">
            <h2>Dengarkan cerita</h2>
            <p>Audio narator belum tersedia</p>
            <button className="btn" disabled>
              Putar audio
            </button>
          </section>
        </aside>
        <section className="card reader-copy">
          <span className="badge">{s.category}</span>
          <h1>{s.title}</h1>
          {body ? (
            <>
              <article
                className="reader-text"
                style={{ fontSize: large ? "22px" : "18px" }}
              >
                {body.split(/\n+/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </article>
              <p className="notice">
                {s.body
                  ? "Naskah diterbitkan pengelola perangkat ini."
                  : "Cuplikan dari referensi. Naskah lengkap cerita belum tersedia."}
              </p>
              <details className="glossary">
                <summary>Kenali kata dalam cerita</summary>
                <p>
                  <strong>Adipoday</strong> — Ayah Jokotole dalam cuplikan.
                </p>
                <p>
                  <strong>Empu Kelleng</strong> — Tokoh yang mengasuh Jokotole.
                </p>
                <p>
                  <strong>Pusaka Cemeti</strong> — Cemeti sakti yang diterima
                  Jokotole.
                </p>
              </details>
              <Guide who="marlena">
                Menurutmu, apa yang bisa kita teladani?
              </Guide>
              <Field label="Refleksimu">
                <textarea
                  className="input"
                  maxLength={1000}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                />
              </Field>
              <div className="od-cluster reader-reflection-actions">
                <Button
                  onClick={() => {
                    setState((v) => ({
                      ...v,
                      reflections: { ...v.reflections, [id]: reflection },
                    }));
                    notify("Refleksi tersimpan.");
                  }}
                >
                  Simpan Refleksi
                </Button>
                {s.body && (
                  <Button
                    disabled={!!state.completedStories[id]}
                    onClick={() => {
                      setState((v) => ({
                        ...v,
                        completedStories: { ...v.completedStories, [id]: true },
                      }));
                      notify("Cerita selesai. +50 Poin Budaya hanya sekali.");
                    }}
                  >
                    {state.completedStories[id]
                      ? "Cerita selesai"
                      : "Tandai Selesai Membaca"}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h2>
                {continuation
                  ? "Kelanjutan cerita belum tersedia"
                  : "Naskah cerita belum tersedia"}
              </h2>
              <p>
                Ilustrasi dan identitas cerita tetap tersedia. Naskah lengkap
                akan ditambahkan dari sumber asli.
              </p>
              <Go to="baca/jokotole">Baca Cuplikan Jokotole</Go>
            </div>
          )}
        </section>
      </div>
      <div className="reader-bottom">
        <Button
          onClick={() => setContinuation(!continuation)}
          disabled={!s.available || !!s.body}
        >
          {continuation ? "Kembali ke Cuplikan" : "Halaman Berikutnya"}
        </Button>
        <Go to="kuis">Lanjut Kuis</Go>
      </div>
    </>
  );
}
function Profile() {
  const { state, setState, notify } = useStore();
  const [name, setName] = useState(state.name);
  const [cls, setCls] = useState(state.className);
  const [error, setError] = useState("");
  return (
    <>
      <Heading title="Profil Siswa">
        Perjalanan belajarmu di perangkat ini.
      </Heading>
      <div className="profile-layout">
        <form
          className="card panel od-stack student-profile-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim().length < 2 || !/[A-Za-zÀ-ž]/.test(name)) {
              setError("Nama minimal 2 karakter dan mengandung huruf.");
              return;
            }
            setState((s) => ({
              ...s,
              name: name.trim(),
              className: cls.trim(),
            }));
            setError("");
            notify("Profil tersimpan.");
          }}
        >
          <div className="student-profile-form-heading">
            <Image name="sakera" alt="Sakera" />
            <div>
              <h2>Profilmu</h2>
              <p>Kenalkan dirimu, Sobat Budaya.</p>
            </div>
          </div>
          <Field label="Nama panggilan">
            <input
              className="input"
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!error}
            />
          </Field>
          <Field label="Kelas">
            <input
              className="input"
              value={cls}
              maxLength={20}
              onChange={(e) => setCls(e.target.value)}
            />
          </Field>
          <p className="student-profile-error" role="alert">{error}</p>
          <Button type="submit">Simpan Profil</Button>
        </form>
        <section className="card panel student-profile-progress" aria-label="Perjalanan belajar">
          <section className="student-profile-summary">
            <h2>{state.name || "Sobat Budaya"}</h2>
            <div className="od-grid stats-grid">
              <div className="stat-card">
                <strong>{points(state)}</strong>
                <p>Poin Budaya</p>
              </div>
              <div className="stat-card">
                <strong>{Object.keys(state.completedStories).length} / {stories.length + state.customStories.filter((s) => !!state.docs["story:" + s.id]?.published).length}</strong>
                <p>Cerita selesai</p>
              </div>
              <div className="stat-card">
                <strong>{state.bestQuiz ?? "—"}</strong>
                <p>Nilai kuis terbaik</p>
              </div>
            </div>
          </section>
          <section className="student-profile-badges">
            <h2>Lencana aktivitas</h2>
            <div className="badge-list">
              <p className={"achievement" + (state.gameEarned ? "" : " locked")}>
                {state.gameEarned ? "★ Sahabat Budaya" : "○ Selesaikan Mini Game"}
              </p>
              <p className={"achievement" + (state.quizEarned ? "" : " locked")}>
                {state.quizEarned
                  ? "★ Pembaca Cermat"
                  : "○ Jawab kuis dengan benar"}
              </p>
            </div>
          </section>
          <section className="student-profile-history">
            <h2>Riwayat Cerita</h2>
            {[...stories, ...state.customStories].filter((s) => !state.docs["story:" + s.id]?.archived && (!state.customStories.some((c) => c.id === s.id) || !!state.docs["story:" + s.id]?.published)).map((s) => (
              <div className="profile-story" key={s.id}>
                <Image name={s.image} alt="" />
                <div>
                  <h3>{s.title}</h3>
                  <p>
                    {state.completedStories[s.id]
                      ? "Selesai"
                      : state.visited[s.id]
                        ? "Pernah dibuka"
                        : "Belum dibuka"}
                  </p>
                </div>
                <Go to={"baca/" + s.id}>Baca</Go>
              </div>
            ))}
          </section>
        </section>
      </div>
    </>
  );
}
function Materials() {
  const { state } = useStore();
  return (
    <>
      <Heading title="Kenali Budaya Madura">
        Bekal kecil untuk petualangan besar.
      </Heading>
      <div className="od-grid material-grid">
        {cultures
          .filter((c) => !state.docs["material:" + c.id]?.archived)
          .map((base) => {
            const doc = state.docs["material:" + base.id]?.published;
            return (
              <article className="card panel od-stack" key={base.id}>
                <Image
                  name={base.image}
                  alt={base.label}
                  className="material-image"
                />
                <h2>{String(doc?.title || base.term)}</h2>
                <strong>{String(doc?.label || base.label)}</strong>
                <p>{String(doc?.desc || base.desc)}</p>
                {typeof doc?.body === "string" &&
                  doc.body.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
              </article>
            );
          })}
        {state.customCultures.filter((c) => !state.docs["material:" + c.id]?.archived && !!state.docs["material:" + c.id]?.published).map((base) => {
          const doc = state.docs["material:" + base.id]?.published;
          return <article className="card panel od-stack" key={base.id}>
            <Image name={base.image} alt={base.label} className="material-image" />
            <h2>{String(doc?.title || base.term)}</h2>
            <strong>{String(doc?.label || base.label)}</strong>
            <p>{String(doc?.desc || base.desc)}</p>
            {typeof doc?.body === "string" && doc.body.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
          </article>;
        })}
      </div>
      <Go to="mini-game">Coba Mini Game</Go>
    </>
  );
}
function Kit() {
  return (
    <>
      <Heading title="UI Kit KIRARA">
        Cream, terracotta, kayu, dan ilustrasi budaya Madura.
      </Heading>
      <section className="card panel od-stack">
        <h2>Kontrol dan status</h2>
        <div className="od-cluster">
          <Button>Mulai Petualangan</Button>
          <Go to="menu">Menu Utama</Go>
          <Button disabled>Belum tersedia</Button>
        </div>
        <Field label="Contoh input">
          <input className="input" placeholder="Nama panggilan" />
        </Field>
        <span className="badge">Cuplikan tersedia</span>
        <progress value={3} max={5} aria-label="Contoh progres 3 dari 5" />
        <Guide>Belajar sedikit demi sedikit.</Guide>
        <h2>Ilustrasi dan lanskap asli</h2>
        <Image name="kirara-village-background" alt="Lanskap desa Madura" />
      </section>
    </>
  );
}
