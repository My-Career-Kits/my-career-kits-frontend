"use client";
import { useEffect } from "react";

type Theme = "dark" | "light" | "system";
const STORAGE_KEY = "theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light", "system");
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.add(prefersDark ? "dark" : "light");
  } else {
    root.classList.add(theme);
  }
}

function getSafeTheme(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return "dark";
    // Guard against old JSON format like {"theme":"dark"}
    if (raw.startsWith("{")) {
      const parsed = JSON.parse(raw);
      const t = parsed?.theme ?? "dark";
      localStorage.setItem(STORAGE_KEY, t); // fix the bad value
      return t as Theme;
    }
    return raw as Theme;
  } catch {
    return "dark";
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const theme = getSafeTheme();
    applyTheme(theme);

    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && !e.newValue.startsWith("{")) {
        applyTheme(e.newValue as Theme);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return <>{children}</>;
}