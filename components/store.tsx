"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { fresh, readState, type State } from "@/lib/data";
const KEY = "kirara.next.v2";
const Context = createContext<{
  state: State;
  setState: Dispatch<SetStateAction<State>>;
  ready: boolean;
  notice: string;
  notify: (s: string) => void;
}>({
  state: fresh(),
  setState: () => {},
  ready: false,
  notice: "",
  notify: () => {},
});
export function Store({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(fresh);
  const [ready, setReady] = useState(false);
  const [notice, notify] = useState("");
  const [writable, setWritable] = useState(true);
  useEffect(() => {
    let failed = false;
    const parse = (key: string) => {
      try {
        const value = localStorage.getItem(key);
        if (!value) return null;
        const parsed = JSON.parse(value);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
          throw new Error("format");
        return parsed;
      } catch {
        failed = true;
        return null;
      }
    };
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = parse(KEY);
        if (parsed) setState(readState(parsed));
        else setWritable(false);
      } else {
        const old = parse("kirara.v1");
        const admin = parse("kirara.admin.v1");
        const imported = { ...old };
        if (admin)
          for (const key of ["docs", "quizzes", "moderation", "settings"])
            if (admin[key] !== undefined) imported[key] = admin[key];
        setState(readState(imported));
      }
      if (failed)
        notify(
          "Sebagian data lokal tidak dapat dibaca. Data lama dipertahankan; sesi tetap dapat digunakan.",
        );
    } catch {
      setWritable(false);
      notify(
        "Penyimpanan lokal tidak dapat dibaca. Data lama dipertahankan; perubahan hanya untuk sesi ini.",
      );
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || !writable) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      notify(
        "Penyimpanan perangkat penuh atau tidak tersedia. Perubahan hanya berlaku pada sesi ini.",
      );
    }
  }, [state, ready, writable]);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue)
        try {
          setState(readState(JSON.parse(e.newValue)));
        } catch {
          notify("Perubahan dari tab lain tidak dapat dibaca.");
        }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const say = useCallback((s: string) => notify(s), []);
  return (
    <Context.Provider value={{ state, setState, ready, notice, notify: say }}>
      {children}
    </Context.Provider>
  );
}
export const useStore = () => useContext(Context);
