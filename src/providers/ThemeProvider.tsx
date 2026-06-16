// "use client";

// import { useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import api from "@/lib/api";
// import type { UserSettings } from "@/types";

// async function fetchSettings(): Promise<UserSettings> {
//   const response = await api.get("/api/auth/settings/");
//   return response.data;
// }

// export default function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const { data } = useQuery<UserSettings>({
//     queryKey: ["user-settings"],
//     queryFn: fetchSettings,
//     staleTime: 5 * 60 * 1000,
//     retry: false,
//   });

//   useEffect(() => {
//     const theme = data?.theme ?? "dark";
//     const root = document.documentElement;
//     root.classList.remove("dark", "light", "system");
//     root.classList.add(theme);
//   }, [data?.theme]);

//   return <>{children}</>;
// }





// "use client";
// import { useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import api from "@/lib/api";
// import type { UserSettings } from "@/types";

// async function fetchSettings(): Promise<UserSettings> {
//   const response = await api.get("/api/auth/settings/");
//   return response.data;
// }

// export default function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const { data } = useQuery<UserSettings>({
//     queryKey: ["user-settings"],
//     queryFn: fetchSettings,
//     staleTime: 5 * 60 * 1000,
//     retry: false,
//   });

//   useEffect(() => {
//     const theme = data?.theme ?? "dark";
//     const root = document.documentElement;
//     root.classList.remove("dark", "light");
//     root.classList.add(theme);
//   }, [data?.theme]);

//   return <>{children}</>;
// }












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