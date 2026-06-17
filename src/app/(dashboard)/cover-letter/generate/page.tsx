"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, FileText } from "lucide-react";
import { toast } from "sonner";
import PageTransition from "@/components/shared/PageTransition";
import AIProcessingIndicator from "@/components/shared/AIProcessingIndicator";
import { useGenerateCoverLetter } from "@/hooks/useGenerateCoverLetter";
import { useResumeList } from "@/hooks/useResumeList";
import { useAuth } from "@/hooks/useAuth";
import { parseBackendError } from "@/lib/api";

// ---------------------------------------------------------------------------
// Schema — all min-2 constraints, job_description min-100, optionals allow ""
// ---------------------------------------------------------------------------
const generateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").or(z.literal("")),
  email: z.string().email("Enter a valid email address").or(z.literal("")),
  job_title: z.string().min(2, "Job title must be at least 2 characters"),
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  job_description: z.string().min(100, "Job description must be at least 100 characters"),
  resume_uuid: z.string().optional(),
});

type GenerateForm = z.infer<typeof generateSchema>;

const AI_STAGES = [
  "Reading the job description...",
  "Matching your profile...",
  "Crafting your letter...",
  "Polishing the tone...",
];

// ---------------------------------------------------------------------------
// Shared input class builder
// ---------------------------------------------------------------------------
const inputCls = (hasError: boolean) =>
  `w-full bg-background border rounded-xl px-4 py-3 text-base text-text-primary placeholder:text-text-tertiary/60 focus:border-accent focus:outline-none focus:shadow-[0_0_0_4px_rgba(0,194,255,0.08)] transition-all ${
    hasError ? "border-danger bg-danger/5" : "border-border hover:border-border-bright"
  }`;

export default function Page() {
  const router = useRouter();
  const { user } = useAuth();
  const generateMutation = useGenerateCoverLetter();
  const { data: resumes } = useResumeList();

  // --- focus refs for Enter-key navigation ---
  const emailRef   = useRef<HTMLInputElement>(null);
  const titleRef   = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const descRef    = useRef<HTMLTextAreaElement>(null);
  const submitRef  = useRef<HTMLButtonElement>(null);

  // --- RHF — validate on blur, then live once touched ---
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateForm>({
    resolver: zodResolver(generateSchema),
    mode: "onTouched",
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      job_title: "",
      company_name: "",
      job_description: "",
      resume_uuid: "",
    },
  });

  // Wire RHF refs together with our focus refs
  const nameReg    = register("name");
  const emailReg   = register("email");
  const titleReg   = register("job_title");
  const companyReg = register("company_name");
  const descReg    = register("job_description");

  // ---------------------------------------------------------------------------
  // Submit — Automatically routes to the view page on success
  // ---------------------------------------------------------------------------
  const onSubmit = async (data: GenerateForm) => {
    try {
      const result = await generateMutation.mutateAsync({
        ...data,
        resume_uuid: data.resume_uuid || undefined,
      } as never);
      
      toast.success("Cover letter generated successfully!");
      router.push(`/cover-letter/${result.uuid}`);
    } catch (err) {
      toast.error(parseBackendError(err), { duration: 6000 });
    }
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto py-4 relative">
        <AIProcessingIndicator stages={AI_STAGES} isVisible={generateMutation.isPending} />

        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Create Cover Letter
          </h1>
          <p className="text-text-secondary mt-2 text-base">
            Align your profile with any targeted role description using AI coaching mechanics.
          </p>
        </div>

        <div className={`rounded-2xl border border-border bg-surface p-6 md:p-8 shadow-sm transition-all duration-300 ${
          generateMutation.isPending ? "opacity-30 pointer-events-none scale-[0.99]" : ""
        }`}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Name + Email Info Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  autoComplete="name"
                  {...nameReg}
                  ref={(el) => { nameReg.ref(el); }}
                  placeholder={user?.name || "Your legal name"}
                  className={inputCls(!!errors.name)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); emailRef.current?.focus(); }
                  }}
                />
                {errors.name && <p className="mt-1.5 text-xs text-danger font-medium">{errors.name.message}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                  Contact Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...emailReg}
                  ref={(el) => { emailReg.ref(el); (emailRef as any).current = el; }}
                  placeholder={user?.email || "your@email.com"}
                  className={inputCls(!!errors.email)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); titleRef.current?.focus(); }
                  }}
                />
                {errors.email && <p className="mt-1.5 text-xs text-danger font-medium">{errors.email.message}</p>}
              </div>
            </div>

            {/* Target Job Title */}
            <div>
              <label htmlFor="job_title" className="block text-sm font-medium text-text-secondary mb-2">
                Target Job Title
              </label>
              <input
                id="job_title"
                autoComplete="organization-title"
                {...titleReg}
                ref={(el) => { titleReg.ref(el); (titleRef as any).current = el; }}
                placeholder="e.g. Senior Software Engineer"
                className={inputCls(!!errors.job_title)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); companyRef.current?.focus(); }
                }}
              />
              {errors.job_title && <p className="mt-1.5 text-xs text-danger font-medium">{errors.job_title.message}</p>}
            </div>

            {/* Target Company Name */}
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-text-secondary mb-2">
                Company Name
              </label>
              <input
                id="company_name"
                autoComplete="organization"
                {...companyReg}
                ref={(el) => { companyReg.ref(el); (companyRef as any).current = el; }}
                placeholder="e.g. Stripe"
                className={inputCls(!!errors.company_name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); descRef.current?.focus(); }
                }}
              />
              {errors.company_name && <p className="mt-1.5 text-xs text-danger font-medium">{errors.company_name.message}</p>}
            </div>

            {/* Job Description Textarea Block */}
            <div>
              <label htmlFor="job_description" className="block text-base font-bold text-text-primary mb-1.5">
                Job Description <span className="text-sm font-normal text-danger">(Minimum 100 characters required)</span>
              </label>
              <textarea
                id="job_description"
                {...descReg}
                ref={(el) => { descReg.ref(el); (descRef as any).current = el; }}
                rows={7}
                placeholder="Paste the raw corporate job description posting details here..."
                className={`w-full bg-background border rounded-xl px-4 py-3 text-base text-text-primary placeholder:text-text-tertiary/60 focus:border-accent focus:outline-none focus:shadow-[0_0_0_4px_rgba(0,194,255,0.08)] resize-none transition-all ${
                  errors.job_description ? "border-danger bg-danger/5" : "border-border hover:border-border-bright"
                }`}
                onKeyDown={(e) => {
                  if (e.key === "Tab" && !e.shiftKey && !resumes?.length) {
                    e.preventDefault();
                    submitRef.current?.focus();
                  }
                }}
              />
              {errors.job_description && (
                <p className="mt-1.5 text-xs text-danger font-medium">{errors.job_description.message}</p>
              )}
            </div>

            {/* Optional Resume Selection Context Attachment */}
            {resumes && resumes.length > 0 && (
              <div className="pt-2">
                <label htmlFor="resume_uuid" className="block text-base font-bold text-text-primary mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-text-tertiary" />
                  Source Experience Profile <span className="text-sm font-normal text-accent">(optional — attach context structure)</span>
                </label>
                <select
                  id="resume_uuid"
                  {...register("resume_uuid")}
                  className={inputCls(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); submitRef.current?.focus(); }
                  }}
                >
                  <option value="">None</option>
                  {resumes.map((r) => (
                    <option key={r.uuid} value={r.uuid}>{r.title}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Trigger Button */}
            <div className="pt-4">
              <button
                ref={submitRef}
                type="submit"
                disabled={generateMutation.isPending}
                className="w-full py-3.5 rounded-xl bg-accent text-black font-bold text-base hover:bg-accent-dark active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 shadow-[0_4px_24px_rgba(0,194,255,0.25)] disabled:opacity-50 disabled:pointer-events-none"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Data & Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 fill-current" />
                    Generate Tailored Letter
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </PageTransition>
  );
}