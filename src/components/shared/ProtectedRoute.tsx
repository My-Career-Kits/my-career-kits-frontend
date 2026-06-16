"use client";
import { useAuth } from "@/hooks/useAuth";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isError } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-red-950/30 border border-red-900/50 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-danger" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-3">
            Server Unavailable
          </h1>
          <p className="text-text-secondary mb-8">
            Cannot connect to the server. Please check your connection or try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-black font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
