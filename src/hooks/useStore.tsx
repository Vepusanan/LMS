import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { initialMessages, notifications } from "../data/seed";
export function useLocal<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("focus-" + key) || "null") ?? initial
      );
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("focus-" + key, JSON.stringify(value));
    } catch {
      /* Storage may be unavailable in private mode. */
    }
  }, [key, value]);
  return [value, setValue] as const;
}
export const defaults = {
  theme: "light",
  size: 100,
  contrast: false,
  motion: false,
  dyslexia: false,
  language: "English",
  email: true,
  push: false,
  digest: true,
  quiet: true,
  quietStart: "22:00",
  quietEnd: "07:00",
  assignments: true,
  announcements: true,
  messages: true,
  spoken: false,
};
export type Settings = typeof defaults;
export type Submission = { name: string; size: number; date: string };
function useAppStore() {
  const [settings, setSettings] = useLocal("settings", defaults);
  const [stars, setStars] = useLocal<string[]>("stars", ["ml", "algo"]);
  const [done, setDone] = useLocal<string[]>("done", []);
  const [messages, setMessages] = useLocal("messages", initialMessages);
  const [alerts, setAlerts] = useLocal("alerts", notifications);
  const [submissions, setSubmissions] = useLocal<Record<string, Submission>>(
    "submissions",
    {},
  );
  const [session, setSession] = useLocal("session", "demo");
  const [toast, setToast] = useState<{
    text: string;
    undo?: () => void;
  } | null>(null);
  const notify = useCallback(
    (text: string, undo?: () => void) => setToast({ text, undo }),
    [],
  );
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(t);
    }
  }, [toast]);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme =
        settings.theme === "system"
          ? media.matches
            ? "dark"
            : "light"
          : settings.theme;
    };
    apply();
    media.addEventListener("change", apply);
    document.documentElement.style.fontSize = settings.size + "%";
    document.documentElement.dataset.contrast = String(settings.contrast);
    document.documentElement.dataset.motion = String(settings.motion);
    document.documentElement.dataset.dyslexia = String(settings.dyslexia);
    return () => media.removeEventListener("change", apply);
  }, [settings]);
  return {
    settings,
    setSettings,
    stars,
    setStars,
    done,
    setDone,
    messages,
    setMessages,
    alerts,
    setAlerts,
    submissions,
    setSubmissions,
    session,
    setSession,
    toast,
    setToast,
    notify,
  };
}
type Store = ReturnType<typeof useAppStore>;
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useAppStore();
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useStore() {
  const store = useContext(Context);
  if (!store) throw new Error("Store unavailable");
  return store;
}
