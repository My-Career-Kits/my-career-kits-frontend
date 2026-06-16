// // "use client";

// // import {
// //   createContext,
// //   useContext,
// //   useState,
// //   useEffect,
// //   ReactNode,
// // } from "react";
// // import api from "@/lib/api";
// // import type { User } from "@/types";
// // import { queryClient } from "@/lib/queryClient";

// // interface AuthContextType {
// //   user: User | null;
// //   isLoading: boolean;
// //   isAuthenticated: boolean;
// //   login: (email: string, password: string) => Promise<void>;
// //   signup: (data: {
// //     email: string;
// //     name: string;
// //     username: string;
// //     password: string;
// //     password2: string;
// //     tc: boolean;
// //   }) => Promise<void>;
// //   logout: () => Promise<void>;
// // }

// // const AuthContext = createContext<AuthContextType | null>(null);

// // export function useAuth() {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error("useAuth must be used within AuthProvider");
// //   }
// //   return context;
// // }

// // export default function AuthProvider({ children }: { children: ReactNode }) {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);

// //   const fetchUser = async () => {
// //     try {
// //       const response = await api.get("/api/auth/me/");
// //       setUser(response.data);
// //     } catch {
// //       setUser(null);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchUser();
// //   }, []);

// //   const login = async (email: string, password: string) => {
// //     await api.post("/api/auth/login/", { email, password });
// //     await fetchUser();
// //   };

// //   const signup = async (data: {
// //     email: string;
// //     name: string;
// //     username: string;
// //     password: string;
// //     password2: string;
// //     tc: boolean;
// //   }) => {
// //     await api.post("/api/auth/signup/", data);
// //     // Backend sets cookies on signup, so fetch user immediately
// //     await fetchUser();
// //   };

// //   const logout = async () => {
// //     try {
// //       await api.post("/api/auth/logout/");
// //     } finally {
// //       setUser(null);
// //       queryClient.clear();
// //       window.location.href = "/login";
// //     }
// //   };

// //   return (
// //     <AuthContext.Provider
// //       value={{
// //         user,
// //         isLoading,
// //         isAuthenticated: !!user,
// //         login,
// //         signup,
// //         logout,
// //       }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }




// "use client";
// import {
//   createContext,
//   useContext,
//   ReactNode,
// } from "react";
// import { usePathname } from "next/navigation";
// import api from "@/lib/api";
// import type { User } from "@/types";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// const AUTH_KEY = ["auth", "me"];
// const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (data: {
//     email: string;
//     name: string;
//     username: string;
//     password: string;
//     password2: string;
//     tc: boolean;
//   }) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// }

// export default function AuthProvider({ children }: { children: ReactNode }) {
//   const qc = useQueryClient();
//   const pathname = usePathname();

//   const isAuthRoute = AUTH_ROUTES.some(route => pathname?.startsWith(route));

//   const { data: user = null, isLoading } = useQuery<User | null>({
//     queryKey: AUTH_KEY,
//     queryFn: async () => {
//       try {
//         const response = await api.get("/api/auth/me/");
//         return response.data;
//       } catch {
//         return null;
//       }
//     },
//     staleTime: Infinity,
//     retry: false,
//     enabled: !isAuthRoute,
//   });

//   const login = async (email: string, password: string) => {
//     await api.post("/api/auth/login/", { email, password });
//     await qc.invalidateQueries({ queryKey: AUTH_KEY });
//   };

//   const signup = async (data: {
//     email: string;
//     name: string;
//     username: string;
//     password: string;
//     password2: string;
//     tc: boolean;
//   }) => {
//     await api.post("/api/auth/signup/", data);
//     await qc.invalidateQueries({ queryKey: AUTH_KEY });
//   };

//   const logout = async () => {
//     try {
//         await api.post("/api/auth/logout/");
//     } catch {
//         // Backend rejected logout — ignore and proceed
//     } finally {
//         qc.clear();
//         window.location.href = "/login";
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoading,
//         isAuthenticated: !!user,
//         login,
//         signup,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }



// AuthProvider.tsx
"use client";
import { createContext, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import api from "@/lib/api";
import type { User } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AUTH_KEY = ["auth", "me"];
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    email: string;
    name: string;
    username: string;
    password: string;
    password2: string;
    tc: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname?.startsWith(route));

  const {
    data: user = null,
    isLoading,
    isError,
  } = useQuery<User | null>({
    queryKey: AUTH_KEY,
    queryFn: async () => {
      try {
        const response = await api.get("/api/auth/me/");
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (!error.response || (status && status >= 500)) {
            throw error;
          }
        }
        return null;
      }
    },
    staleTime: Infinity,
    retry: false,
    enabled: !isAuthRoute,
  });

  const login = async (email: string, password: string) => {
    // Backend returns only { msg: 'Login Success' } and sets cookies
    // so we invalidate the cache and let /dashboard re-fetch /api/auth/me/
    // naturally once the session cookie is set
    await api.post("/api/auth/login/", { email, password });
    qc.invalidateQueries({ queryKey: AUTH_KEY });
  };

  const signup = async (data: {
    email: string;
    name: string;
    username: string;
    password: string;
    password2: string;
    tc: boolean;
  }) => {
    await api.post("/api/auth/signup/", data);
    qc.invalidateQueries({ queryKey: AUTH_KEY });
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout/");
    } catch {
      // Ignore — the server clears the cookie regardless
    } finally {
      await qc.cancelQueries({ queryKey: AUTH_KEY });
      qc.clear();
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isLoading && !isAuthRoute,
        isError,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}