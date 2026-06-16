"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Palette, Lock, Mail, Loader2, CheckCircle, BadgeCheck } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import api from "@/lib/api";
import { parseBackendError } from "@/lib/api";

const passwordSchema = z.object({
  old_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(8, "New password must be at least 8 characters"),
});

type PasswordForm = z.infer<typeof passwordSchema>;
type Theme = "dark" | "light" | "system";

export default function SettingsPage() {
  const { user } = useAuth();
  const { mutation: settingsMutation } = useSettings();
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) ?? "dark"
  );
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError: setFormError,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const handleThemeChange = (theme: Theme) => {
    settingsMutation.mutate(theme);
    setCurrentTheme(theme);
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setIsChangingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await api.patch("/api/auth/changepassword/", {
        old_password: data.old_password,
        new_password: data.new_password,
      });
      setPasswordSuccess(true);
      reset();
    } catch (err) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { errors?: Record<string, string | string[]> } } };
        const fieldErrors = axiosErr.response?.data?.errors;
        if (fieldErrors && typeof fieldErrors === "object") {
          Object.entries(fieldErrors).forEach(([field, messages]) => {
            if (field === "old_password" || field === "new_password") {
              setFormError(field as keyof PasswordForm, {
                type: "manual",
                message: Array.isArray(messages) ? messages.join(" ") : messages,
              });
            }
          });
          return;
        }
      }
      setPasswordError(parseBackendError(err));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary mt-1">Manage your account preferences</p>
        </div>

        {/* Profile */}
        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <User className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Profile</h2>
              <p className="text-xs text-text-tertiary">Your personal information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={user?.name || ""}
                  disabled
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-tertiary cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Username</label>
                <input
                  type="text"
                  value={user?.username || ""}
                  disabled
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-tertiary cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Bio</label>
              <textarea
                value={user?.bio || ""}
                disabled
                rows={3}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-tertiary cursor-not-allowed resize-none"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-surface-elevated border border-border text-text-tertiary">
              <BadgeCheck className="w-3 h-3" />
              Coming soon
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Palette className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Appearance</h2>
              <p className="text-xs text-text-tertiary">Customize your visual experience</p>
            </div>
          </div>

          <div className="flex gap-3">
            {(["dark", "light", "system"] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  currentTheme === theme
                    ? "bg-accent text-black shadow-[0_0_15px_rgba(0,194,255,0.3)]"
                    : "bg-background border border-border text-text-secondary hover:text-text-primary hover:border-border-bright"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Security</h2>
              <p className="text-xs text-text-tertiary">Update your password</p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/30 text-success text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Password updated successfully
            </div>
          )}

          {passwordError && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Current Password</label>
              <input
                type="password"
                {...register("old_password")}
                className={`w-full bg-background border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] ${
                  errors.old_password ? "border-danger" : "border-border"
                }`}
              />
              {errors.old_password && <p className="mt-1 text-xs text-danger">{errors.old_password.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5">New Password</label>
              <input
                type="password"
                {...register("new_password")}
                className={`w-full bg-background border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] ${
                  errors.new_password ? "border-danger" : "border-border"
                }`}
              />
              {errors.new_password && <p className="mt-1 text-xs text-danger">{errors.new_password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-5 py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)] disabled:opacity-50 flex items-center gap-2"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </section>

        {/* Account */}
        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Account</h2>
              <p className="text-xs text-text-tertiary">Your account details</p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-tertiary cursor-not-allowed"
            />
          </div>
        </section>
      </div>
    </PageTransition>
  );
}