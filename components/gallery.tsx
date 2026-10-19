"use client";
import { useRef, useState } from "react";
import { artworks, type Artwork } from "@/lib/data";
import { useStore } from "./store";
import { Button, Heading, Field, Image } from "./ui";
const categories = ["Ilustrasi Cerita", "Komik Mini", "Kerajinan Tangan"];
export function Gallery() {
  const { state, setState, notify } = useStore();
  const [filter, setFilter] = useState("Semua Karya");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [upload, setUpload] = useState(false);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [detail, setDetail] = useState<Artwork | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const list = [
    ...artworks,
    ...state.uploads.filter(
      (a) => state.moderation[a.id]?.status === "approved",
    ),
  ]
    .filter(
      (a) =>
        (filter === "Semua Karya" || a.category === filter) &&
        (a.title + " " + a.student)
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title)
        : sort === "newest"
          ? (b.created || 0) - (a.created || 0)
          : b.likes +
            Number(state.likes.includes(b.id)) -
            (a.likes + Number(state.likes.includes(a.id))),
    );
  function appreciate(id: string) {
    setState((s) => ({
      ...s,
      likes: s.likes.includes(id)
        ? s.likes.filter((x) => x !== id)
        : [...s.likes, id],
    }));
  }
  async function read(file: File | undefined) {
    setPreview("");
    setError("");
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      setError("Pilih JPG, PNG, atau WebP maksimal 2 MB.");
      return;
    }
    setBusy(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(new Error());
        r.readAsDataURL(file);
      });
      await new Promise<void>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () =>
          img.width && img.height ? resolve() : reject(new Error());
        img.onerror = () => reject(new Error());
        img.src = data;
      });
      setPreview(data);
    } catch {
      setError("Gambar tidak dapat dibaca. Pilih berkas gambar yang valid.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading title="Ruang Karya">
        Rayakan imajinasi dan apresiasi kreativitas teman.
      </Heading>
      <p className="notice">
        Karya awal, nama siswa, dan jumlah apresiasi adalah contoh referensi.
        Unggahan dan apresiasi baru hanya disimpan di perangkat ini.
      </p>
      <div className="gallery-toolbar">
        <Field label="Cari karya atau nama siswa">
          <input
            className="input"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Field>
        <Field label="Urutkan karya">
          <select
            className="input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="popular">Paling diapresiasi</option>
            <option value="newest">Terbaru</option>
            <option value="title">Judul A–Z</option>
          </select>
        </Field>
        <Button onClick={() => setUpload(!upload)}>
          {upload ? "Tutup Unggahan" : "Unggah Karya"}
        </Button>
      </div>
      <div className="filters">
        {["Semua Karya", ...categories].map((c) => (
          <button
            className="btn filter-btn"
            aria-pressed={filter === c}
            key={c}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      {upload && (
        <form
          className="card panel upload-form od-stack"
          onSubmit={(e) => {
            e.preventDefault();
            if (title.trim().length < 3 || !preview) {
              setError("Isi judul minimal 3 karakter dan pilih gambar valid.");
              return;
            }
            const id = "local-" + crypto.randomUUID();
            setState((s) => ({
              ...s,
              uploads: [
                ...s.uploads,
                {
                  id,
                  title: title.trim(),
                  category,
                  student: s.name || "Sobat Budaya",
                  className: s.className,
                  likes: 0,
                  data: preview,
                  created: Date.now(),
                },
              ],
              moderation: {
                ...s.moderation,
                [id]: {
                  status: s.settings.review ? "pending" : "approved",
                  reason: "",
                },
              },
            }));
            notify(
              "Karya tersimpan di perangkat ini. " +
                (state.settings.review
                  ? "Menunggu persetujuan pengelola."
                  : "Karya disetujui sesuai pengaturan."),
            );
            setPreview("");
            setTitle("");
            setUpload(false);
          }}
        >
          <h2>Unggah karya di perangkat ini</h2>
          <Field label="Judul karya">
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </Field>
          <Field label="Kategori karya">
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Gambar karya (JPG, PNG, WebP, maksimal 2 MB)">
            <input
              className="input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => read(e.target.files?.[0])}
            />
          </Field>
          {preview && (
            <img
              className="upload-preview"
              src={preview}
              alt="Pratinjau karya"
            />
          )}
          <p role="alert">{error}</p>
          <Button type="submit" disabled={busy}>
            {busy ? "Membaca gambar…" : "Simpan Karya Lokal"}
          </Button>
        </form>
      )}
      {state.uploads.length > 0 && (
        <details className="card panel local-work-status">
          <summary>
            Status karya di perangkat ini ({state.uploads.length})
          </summary>
          {state.uploads.map((a) => (
            <p key={a.id}>
              <strong>{a.title}</strong> ·{" "}
              {
                {
                  pending: "Menunggu",
                  approved: "Disetujui",
                  revision: "Perlu revisi",
                }[state.moderation[a.id]?.status || "pending"]
              }{" "}
              {state.moderation[a.id]?.reason}
            </p>
          ))}
        </details>
      )}
      <div className="od-grid gallery-grid">
        {list.map((a) => (
          <article className="card art-card" key={a.id}>
            <button
              className="art-open"
              aria-label={"Lihat karya " + a.title}
              onClick={(e) => {
                trigger.current = e.currentTarget;
                setDetail(a);
                dialog.current?.showModal();
              }}
            >
              <Image name={a.data || a.image!} alt={a.title} />
              <div className="art-info">
                <span className="badge">{a.category}</span>
                <h2>{a.title}</h2>
                <p>
                  {a.student} {a.className && "· " + a.className}
                </p>
                <p>
                  {a.id.startsWith("ref") ? "Contoh referensi" : "Karya lokal"}
                </p>
              </div>
            </button>
            <div className="art-footer">
              <span>{a.school || "Perangkat ini"}</span>
              <button
                className="like-button"
                aria-label={"Apresiasi " + a.title}
                aria-pressed={state.likes.includes(a.id)}
                onClick={() => appreciate(a.id)}
              >
                ♡ {a.likes + Number(state.likes.includes(a.id))}
              </button>
            </div>
          </article>
        ))}
      </div>
      {!list.length && (
        <div className="empty-state">
          <h2>Belum ada karya yang cocok</h2>
          <p>Coba kata pencarian atau kategori lain.</p>
        </div>
      )}
      <dialog
        ref={dialog}
        onClose={() => trigger.current?.focus()}
        aria-labelledby="art-dialog-title"
      >
        <div className="dialog-head">
          <h2 id="art-dialog-title">{detail?.title}</h2>
          <Button onClick={() => dialog.current?.close()}>Tutup</Button>
        </div>
        {detail && (
          <>
            <Image name={detail.data || detail.image!} alt={detail.title} />
            <p>
              {detail.student} · {detail.category}
            </p>
          </>
        )}
      </dialog>
    </>
  );
}
