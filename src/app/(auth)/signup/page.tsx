"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { parseBackendError } from "@/lib/api";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password2: z.string().min(1, "Please confirm your password"),
    tc: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    setError(null);
    try {
      await signup({
        email: data.email,
        name: data.name,
        username: data.username,
        password: data.password,
        password2: data.password2,
        tc: data.tc,
      });
      router.push("/dashboard");
    } catch (err) {
      const message = parseBackendError(err);
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
        const fieldErrors = axiosErr.response?.data?.errors;
        if (fieldErrors && typeof fieldErrors === "object") {
          Object.entries(fieldErrors).forEach(([field, messages]) => {
            if (field in data) {
              setFormError(field as keyof SignupForm, {
                type: "manual",
                message: messages.join(" "),
              });
            }
          });
          return;
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
        <p className="text-sm text-text-secondary mt-1">
          Start building your career with MyCareerKits
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Full Name</label>
          <input
            type="text"
            {...register("name")}
            className={`w-full bg-background border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] transition-all ${
              errors.name ? "border-danger" : "border-border focus:border-accent"
            }`}
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Username</label>
          <input
            type="text"
            {...register("username")}
            className={`w-full bg-background border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] transition-all ${
              errors.username ? "border-danger" : "border-border focus:border-accent"
            }`}
            placeholder="johndoe"
          />
          {errors.username && <p className="mt-1 text-xs text-danger">{errors.username.message}</p>}
        </div>

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

        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`w-full bg-background border rounded-lg px-4 py-2.5 pr-10 text-sm text-text-primary focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] transition-all ${
                errors.password ? "border-danger" : "border-border focus:border-accent"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-text-secondary hover:text-text-primary transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Confirm Password</label>
          <div className="relative">
            <input
              type={showPassword2 ? "text" : "password"}
              {...register("password2")}
              className={`w-full bg-background border rounded-lg px-4 py-2.5 pr-10 text-sm text-text-primary focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] transition-all ${
                errors.password2 ? "border-danger" : "border-border focus:border-accent"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword2((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-text-secondary hover:text-text-primary transition-colors"
              aria-label={showPassword2 ? "Hide password" : "Show password"}
            >
              {showPassword2 ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password2 && <p className="mt-1 text-xs text-danger">{errors.password2.message}</p>}
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="tc"
            {...register("tc")}
            className="mt-1 w-4 h-4 rounded border-border bg-background text-accent focus:ring-accent"
          />
          <label htmlFor="tc" className="text-xs text-text-secondary">
            I agree to the{" "}
            <Link href="/terms" className="text-accent hover:text-accent-dark">
              Terms & Conditions
            </Link>
          </label>
        </div>
        {errors.tc && <p className="text-xs text-danger">{errors.tc.message}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-all shadow-[0_0_20px_rgba(0,194,255,0.3)] hover:shadow-[0_0_30px_rgba(0,194,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:text-accent-dark transition-colors font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}