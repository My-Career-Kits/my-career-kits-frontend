// "use client";

// import { useQuery, useMutation } from "@tanstack/react-query";
// import api from "@/lib/api";
// import type { UserSettings } from "@/types";
// import { queryClient } from "@/lib/queryClient";

// async function fetchSettings(): Promise<UserSettings> {
//   const response = await api.get("/api/auth/me/");
//   return { theme: response.data.theme || "dark" };
// }

// async function updateSettings(data: UserSettings): Promise<UserSettings> {
//   const response = await api.patch("/api/auth/settings/", data);
//   return response.data;
// }

// export function useSettings() {
//   const query = useQuery<UserSettings>({
//     queryKey: ["user-settings"],
//     queryFn: fetchSettings,
//     staleTime: 5 * 60 * 1000,
//   });

//   const mutation = useMutation<UserSettings, unknown, UserSettings>({
//     mutationFn: updateSettings,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["user-settings"] });
//     },
//   });

//   return { query, mutation };
// }



// "use client";
// import { useEffect } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import api from "@/lib/api";
// import type { UserSettings } from "@/types";
// import { queryClient } from "@/lib/queryClient";
// import { useAuth } from "@/hooks/useAuth";

// async function fetchSettings(): Promise<UserSettings> {
//   const response = await api.get("/api/auth/settings/");
//   return response.data;
// }

// async function updateSettings(data: UserSettings): Promise<UserSettings> {
//   const response = await api.patch("/api/auth/settings/", data);
//   return response.data;
// }

// export function useSettings() {
//   const { isAuthenticated } = useAuth();

//   const query = useQuery<UserSettings>({
//     queryKey: ["user-settings"],
//     queryFn: fetchSettings,
//     staleTime: 5 * 60 * 1000,
//     enabled: isAuthenticated,  // ← only fetch when logged in
//   });

//   useEffect(() => {
//     if (query.data?.theme) {
//       const root = document.documentElement;
//       root.classList.remove("dark", "light", "system");
//       root.classList.add(query.data.theme);
//     }
//   }, [query.data?.theme]);

//   const mutation = useMutation<UserSettings, unknown, UserSettings>({
//     mutationFn: updateSettings,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["user-settings"] });
//       const root = document.documentElement;
//       root.classList.remove("dark", "light", "system");
//       root.classList.add(data.theme);
//     },
//   });

//   return { query, mutation };
// }









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