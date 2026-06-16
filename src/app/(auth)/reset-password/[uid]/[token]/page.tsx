"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import { parseBackendError } from "@/lib/api";

const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    password2: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post(`/api/auth/reset-password/${params.uid}/${params.token}/`, {
        password: data.password,
        password2: data.password2,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(parseBackendError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-2">Password reset successful</h1>
        <p className="text-sm text-text-secondary mb-4">
          Your password has been updated. Redirecting to login...
        </p>
        <Link
          href="/login"
          className="text-sm text-accent hover:text-accent-dark transition-colors"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Set new password</h1>
        <p className="text-sm text-text-secondary mt-1">
          Enter your new password below
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">New Password</label>
          <input
            type="password"
            {...register("password")}
            className={`w-full bg-background border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] transition-all ${
              errors.password ? "border-danger" : "border-border focus:border-accent"
            }`}
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Confirm Password</label>
          <input
            type="password"
            {...register("password2")}
            className={`w-full bg-background border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] transition-all ${
              errors.password2 ? "border-danger" : "border-border focus:border-accent"
            }`}
            placeholder="••••••••"
          />
          {errors.password2 && <p className="mt-1 text-xs text-danger">{errors.password2.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-all shadow-[0_0_20px_rgba(0,194,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
}
