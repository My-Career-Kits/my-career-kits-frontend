"use client";
import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";

const ThemeProvider = dynamic(() => import("@/providers/ThemeProvider"), {
  ssr: false,
});

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            closeButton
            toastOptions={{
              style: {
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#e4e4e7',
              },
              classNames: {
                error: 'bg-red-950 !border-red-900/50 !text-red-400',
                closeButton: '!bg-red-950 !border-red-900/50 !text-red-400 hover:!text-red-300',
              },
            }}
          />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}