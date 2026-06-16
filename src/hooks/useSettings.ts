"use client";
import { useCallback, useState } from "react";

type Theme = "dark" | "light" | "system";
const STORAGE_KEY = "theme";
const VALID_THEMES: Theme[] = ["dark", "light", "system"];

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

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return "dark";
    // If it's a valid plain string, use it
    if (VALID_THEMES.includes(raw as Theme)) return raw as Theme;
    // It's corrupted (object, JSON, etc) — nuke it
    localStorage.removeItem(STORAGE_KEY);
    return "dark";
  } catch {
    return "dark";
  }
}

export function useSettings() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  const mutate = useCallback((newTheme: Theme) => {
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
    setTheme(newTheme);
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: newTheme }));
  }, []);

  return {
    query: {
      data: { theme },
      isLoading: false,
      isPending: false,
    },
    mutation: {
      mutate,
      mutateAsync: async (newTheme: Theme) => mutate(newTheme),
      isPending: false,
    },
  };
}