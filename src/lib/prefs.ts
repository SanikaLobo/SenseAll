import { useCallback, useEffect, useState } from "react";

export type Modality = "voice" | "visual" | "isl" | "braille" | "haptic";

export type Prefs = {
  onboarded: boolean;
  name: string;
  modalities: Modality[];
  theme: "dark" | "light";
  highContrast: boolean;
  reduceMotion: boolean;
  textScale: number; // percent
  speechRate: number;
  haptics: boolean;
  hapticIntensity: number; // 1-3
  geminiApiKey: string; // Gemini API key for ISL sign-to-text
};

export const DEFAULT_PREFS: Prefs = {
  onboarded: false,
  name: "",
  modalities: ["voice", "visual"],
  theme: "dark",
  highContrast: false,
  reduceMotion: false,
  textScale: 100,
  speechRate: 1,
  haptics: true,
  hapticIntensity: 2,
  geminiApiKey: "AIzaSyB7bE4Ia9ZWk6D1VbGt2ZPVLDbfYhWvkNI",
};

const PREFS_KEY = "senseall.prefs.v1";
const HISTORY_KEY = "senseall.history.v1";

export type HistoryKind = "voice" | "isl" | "braille" | "haptic";

export type HistoryItem = {
  id: string;
  kind: HistoryKind;
  text: string;
  detail?: string;
  at: number;
};

type Listener = () => void;
const listeners = new Set<Listener>();
const emit = () => listeners.forEach((l) => l());

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}

export function usePrefs() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrefs(read<Prefs>(PREFS_KEY, DEFAULT_PREFS));
    setHydrated(true);
    const listener = () => setPrefs(read<Prefs>(PREFS_KEY, DEFAULT_PREFS));
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const update = useCallback((patch: Partial<Prefs>) => {
    const next = { ...read<Prefs>(PREFS_KEY, DEFAULT_PREFS), ...patch };
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    emit();
  }, []);

  return { prefs, update, hydrated };
}

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function addHistory(item: Omit<HistoryItem, "id" | "at">) {
  if (typeof window === "undefined") return;
  const entry: HistoryItem = { ...item, id: crypto.randomUUID(), at: Date.now() };
  const next = [entry, ...loadHistory()].slice(0, 100);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  emit();
}

export function clearHistory() {
  window.localStorage.removeItem(HISTORY_KEY);
  emit();
}

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => {
    const listener = () => setItems(loadHistory());
    listener();
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return items;
}

/** Applies theme / contrast / motion / text scale to <html>. */
export function useApplyPrefs(prefs: Prefs, hydrated: boolean) {
  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.toggle("dark", prefs.theme === "dark");
    root.classList.toggle("contrast-high", prefs.highContrast);
    root.classList.toggle("reduce-motion", prefs.reduceMotion);
    root.style.setProperty("--app-font-scale", `${prefs.textScale}%`);
  }, [prefs.theme, prefs.highContrast, prefs.reduceMotion, prefs.textScale, hydrated]);
}
