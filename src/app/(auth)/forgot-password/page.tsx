"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import { parseBackendError } from "@/lib/api";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/api/auth/send-reset-password-email/", { email: data.email });
      setSent(true);
    } catch (err) {
      setError(parseBackendError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-2">Check your email</h1>
        <p className="text-sm text-text-secondary mb-6">
          We&apos;ve sent a password reset link to your email address.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Reset password</h1>
        <p className="text-sm text-text-secondary mt-1">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Email</label>
          <input
            type="email"
            {...register("email")}
            className={`w-full bg-background border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] transition-all ${
              errors.email ? "border-danger" : "border-border focus:border-accent"
            }`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-all shadow-[0_0_20px_rgba(0,194,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        <Link href="/login" className="text-accent hover:text-accent-dark transition-colors font-medium">
          Back to login
        </Link>
      </p>
    </div>
  );
}
