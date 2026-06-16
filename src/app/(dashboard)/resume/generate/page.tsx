"use client";

import { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Download, Save, BarChart3, Loader2 } from "lucide-react";
import { toast } from "sonner";
import PageTransition from "@/components/shared/PageTransition";
import AIProcessingIndicator from "@/components/shared/AIProcessingIndicator";
import ResumePreview from "@/components/resume/ResumePreview";
import { useGenerateResume } from "@/hooks/useGenerateResume";
import { useAuth } from "@/hooks/useAuth";
import type { ExperienceLevel, ResumeContent } from "@/types";
import { parseBackendError } from "@/lib/api";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const experienceLevels: ExperienceLevel[] = [
  "Student", "Fresher", "Junior", "Mid Level", "Senior",
];

const educationEntrySchema = z
  .object({
    degree: z.string().optional(),
    institution: z.string().optional(),
    graduation_year: z.number().optional(),
  })
  .superRefine((entry, ctx) => {
    const degreeFilled = !!entry.degree?.trim();
    const institutionFilled = !!entry.institution?.trim();
    if (degreeFilled && !institutionFilled)
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Institution is required when a degree is provided", path: ["institution"] });
    if (institutionFilled && !degreeFilled)
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Degree is required when an institution is provided", path: ["degree"] });
    if (degreeFilled && entry.degree!.trim().length < 2)
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Degree must be at least 2 characters", path: ["degree"] });
    if (institutionFilled && entry.institution!.trim().length < 2)
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Institution must be at least 2 characters", path: ["institution"] });
  });

const generateSchema = z.object({
  role: z.string().min(2, "Target role must be at least 2 characters"),
  experience_level: z.enum(["Student", "Fresher", "Junior", "Mid Level", "Senior"]),
  skills: z.array(z.string().min(2)).min(1, "Add at least one skill"),
  education: z.array(educationEntrySchema).optional(),
  projects: z.array(z.string().min(2)).optional(),
  certifications: z.array(z.string().min(2)).optional(),
  achievements: z.array(z.string().min(2)).optional(),
  name: z.string().min(2, "Name must be at least 2 characters").or(z.literal("")),
  email: z.string().email("Enter a valid email address").or(z.literal("")),
});

type GenerateForm = z.infer<typeof generateSchema>;

// ---------------------------------------------------------------------------
// Education local state
// ---------------------------------------------------------------------------
type EduEntry = { degree: string; institution: string; graduation_year: string };
type EduErrors = { degree?: string; institution?: string };
const emptyEdu = (): EduEntry => ({ degree: "", institution: "", graduation_year: "" });



const AI_STAGES = [
  "Analyzing your skills...",
  "Crafting your experience...",
  "Optimizing for ATS...",
  "Finalizing your resume...",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ResumeGeneratePage() {
  const router = useRouter();
  const { user } = useAuth();
  const generateMutation = useGenerateResume();
  const [generatedResume, setGeneratedResume] = useState<{ uuid: string; content: ResumeContent } | null>(null);

  // --- tag-input state ---
  const [skillInput, setSkillInput] = useState("");
  const [skillError, setSkillError] = useState("");
  const [projectInput, setProjectInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");

  // --- education local state + per-entry errors ---
  const [educationEntries, setEducationEntries] = useState<EduEntry[]>([emptyEdu()]);
  const [eduErrors, setEduErrors] = useState<EduErrors[]>([{}]);

  // --- focus refs for Enter-key navigation ---
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);
  const projectInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const achievementInputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  // edu refs: [index][field]
  const eduRefs = useRef<Array<{ degree: HTMLInputElement | null; institution: HTMLInputElement | null; year: HTMLInputElement | null }>>([]);
  const ensureEduRef = (i: number) => {
    if (!eduRefs.current[i]) eduRefs.current[i] = { degree: null, institution: null, year: null };
    return eduRefs.current[i];
  };

  // --- RHF ---
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, touchedFields },
  } = useForm<GenerateForm>({
    resolver: zodResolver(generateSchema),
    mode: "onTouched",   // validate on blur, then live on change once touched
    defaultValues: {
      experience_level: "Junior",
      skills: [],
      education: [],
      projects: [],
      certifications: [],
      achievements: [],
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  // Wire RHF register refs together with our focus refs
  const nameReg = register("name");
  const emailReg = register("email");
  const roleReg = register("role");

  const skills = watch("skills") ?? [];
  const projects = watch("projects") ?? [];
  const certifications = watch("certifications") ?? [];
  const achievements = watch("achievements") ?? [];

  // ---------------------------------------------------------------------------
  // Skill helpers
  // ---------------------------------------------------------------------------
  const addSkill = useCallback(() => {
    const val = skillInput.trim();
    if (!val) {
      // empty → move focus to next field
      projectInputRef.current?.focus();
      return;
    }
    if (val.length < 2) {
      setSkillError("Skill must be at least 2 characters");
      return;
    }
    setSkillError("");
    setValue("skills", [...skills, val], { shouldValidate: true });
    setSkillInput("");
    // stay in skill input so user can keep adding
  }, [skillInput, skills, setValue]);

  const removeSkill = (i: number) =>
    setValue("skills", skills.filter((_, idx) => idx !== i), { shouldValidate: true });

  // ---------------------------------------------------------------------------
  // Generic tag-input helpers (projects / certs / achievements)
  // ---------------------------------------------------------------------------
  type TagField = "projects" | "certifications" | "achievements";
  const addTag = (
    field: TagField,
    value: string,
    clear: () => void,
    nextRef?: React.RefObject<HTMLInputElement | HTMLButtonElement | null>
  ) => {
    const val = value.trim();
    if (!val) {
      nextRef?.current?.focus();
      return;
    }
    if (val.length < 2) return; // silently ignore — these fields have no enforced min in schema when optional
    const current = (watch(field) ?? []) as string[];
    setValue(field, [...current, val], { shouldValidate: true });
    clear();
  };

  const removeTag = (field: TagField, i: number) => {
    const current = (watch(field) ?? []) as string[];
    setValue(field, current.filter((_, idx) => idx !== i));
  };

  // ---------------------------------------------------------------------------
  // Education helpers
  // ---------------------------------------------------------------------------
  const updateEdu = (i: number, field: keyof EduEntry, value: string) => {
    setEducationEntries((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
    // live-validate once the field has been touched (blur sets touch)
    setEduErrors((prev) => {
      const copy = [...prev];
      if (!copy[i]) copy[i] = {};
      // clear the error for this field as user types
      copy[i] = { ...copy[i], [field]: undefined };
      return copy;
    });
  };

  const validateEduEntry = (entry: EduEntry, i: number) => {
    const errs: EduErrors = {};
    const degreeFilled = !!entry.degree.trim();
    const instFilled = !!entry.institution.trim();
    if (degreeFilled && !instFilled) errs.institution = "Institution is required when a degree is provided";
    if (instFilled && !degreeFilled) errs.degree = "Degree is required when an institution is provided";
    if (degreeFilled && entry.degree.trim().length < 2) errs.degree = "Degree must be at least 2 characters";
    if (instFilled && entry.institution.trim().length < 2) errs.institution = "Institution must be at least 2 characters";
    setEduErrors((prev) => { const c = [...prev]; c[i] = errs; return c; });
    return Object.keys(errs).length === 0;
  };

  const addEduEntry = () => {
    setEducationEntries((prev) => [...prev, emptyEdu()]);
    setEduErrors((prev) => [...prev, {}]);
    // focus the new entry's degree field on next tick
    setTimeout(() => {
      const next = educationEntries.length;
      eduRefs.current[next]?.degree?.focus();
    }, 50);
  };

  const removeEduEntry = (i: number) => {
    setEducationEntries((prev) => prev.filter((_, idx) => idx !== i));
    setEduErrors((prev) => prev.filter((_, idx) => idx !== i));
    eduRefs.current.splice(i, 1);
  };

  const syncEducation = () => {
    const mapped = educationEntries
      .filter((e) => e.degree.trim() || e.institution.trim() || e.graduation_year.trim())
      .map((e) => ({
        degree: e.degree.trim() || undefined,
        institution: e.institution.trim() || undefined,
        graduation_year: e.graduation_year ? Number(e.graduation_year) : undefined,
      }));
    setValue("education", mapped, { shouldValidate: false });
  };

  // validate all edu entries and return true if all clean
  const validateAllEdu = () => {
    let ok = true;
    educationEntries.forEach((e, i) => { if (!validateEduEntry(e, i)) ok = false; });
    return ok;
  };

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------
  const onSubmit = async (data: GenerateForm) => {
    if (!validateAllEdu()) return;
    try {
      const result = await generateMutation.mutateAsync(data as never);
      setGeneratedResume({ uuid: result.uuid, content: result.content });
    } catch (err) {
      toast.error(parseBackendError(err), { duration: 6000 });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    syncEducation();
    handleSubmit(onSubmit)(e);
  };

  // ---------------------------------------------------------------------------
  // PDF download
  // ---------------------------------------------------------------------------
  const handleDownloadPDF = async () => {
    if (!generatedResume) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("resume-preview");
    if (element) html2pdf().from(element).save("resume.pdf");
  };

  // ---------------------------------------------------------------------------
  // Shared input class builder
  // ---------------------------------------------------------------------------
  const inputCls = (hasError: boolean) =>
    `w-full bg-background border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] transition-colors ${
      hasError ? "border-danger" : "border-border"
    }`;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Generate Resume</h1>
          <p className="text-text-secondary mt-1">Fill in your details and let AI do the rest</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Form Panel ── */}
          <div className={`rounded-xl border border-border bg-surface p-6 ${generatedResume ? "opacity-50 pointer-events-none" : ""}`}>
            <form onSubmit={handleFormSubmit} className="space-y-5">

              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Name</label>
                  <input
                    {...nameReg}
                    ref={(el) => { nameReg.ref(el); (nameRef as any).current = el; }}
                    placeholder={user?.name || "Your name"}
                    className={inputCls(!!errors.name)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); emailRef.current?.focus(); } }}
                  />
                  {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Email</label>
                  <input
                    {...emailReg}
                    ref={(el) => { emailReg.ref(el); (emailRef as any).current = el; }}
                    type="email"
                    placeholder={user?.email || "your@email.com"}
                    className={inputCls(!!errors.email)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); roleRef.current?.focus(); } }}
                  />
                  {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Target Role</label>
                <input
                  {...roleReg}
                  ref={(el) => { roleReg.ref(el); (roleRef as any).current = el; }}
                  placeholder="e.g. Senior Software Engineer"
                  className={inputCls(!!errors.role)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); skillInputRef.current?.focus(); } }}
                />
                {errors.role && <p className="mt-1 text-xs text-danger">{errors.role.message}</p>}
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm text-text-secondary mb-2">Experience Level</label>
                <div className="flex flex-wrap gap-2">
                  {experienceLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setValue("experience_level", level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        watch("experience_level") === level
                          ? "bg-accent text-black shadow-[0_0_15px_rgba(0,194,255,0.3)]"
                          : "bg-background border border-border text-text-secondary hover:text-text-primary hover:border-border-bright"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Skills</label>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20">
                        {skill}
                        <button type="button" onClick={() => removeSkill(i)} aria-label={`Remove ${skill}`}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    ref={skillInputRef}
                    value={skillInput}
                    onChange={(e) => {
                      setSkillInput(e.target.value);
                      if (skillError) setSkillError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Type a skill and press Enter"
                    className={inputCls(!!skillError)}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                    aria-label="Add skill"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {skillError
                  ? <p className="mt-1 text-xs text-danger">{skillError}</p>
                  : errors.skills && <p className="mt-1 text-xs text-danger">{errors.skills.message}</p>
                }
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">
                  Education{" "}
                  <span className="text-text-tertiary text-xs">(optional — degree and institution must both be filled or both left empty)</span>
                </label>
                <div className="space-y-3">
                  {educationEntries.map((entry, i) => {
                    const refs = ensureEduRef(i);
                    const errs = eduErrors[i] ?? {};
                    return (
                      <div key={i} className="relative rounded-lg border border-border bg-background p-3 space-y-2">
                        {educationEntries.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEduEntry(i)}
                            className="absolute top-2 right-2 text-text-tertiary hover:text-danger transition-colors"
                            aria-label="Remove education entry"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          {/* Degree */}
                          <div>
                            <input
                              ref={(el) => { refs.degree = el; }}
                              value={entry.degree}
                              placeholder="Degree"
                              onChange={(e) => updateEdu(i, "degree", e.target.value)}
                              onBlur={() => validateEduEntry(entry, i)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") { e.preventDefault(); refs.institution?.focus(); }
                              }}
                              className={inputCls(!!errs.degree)}
                            />
                            {errs.degree && <p className="mt-1 text-xs text-danger">{errs.degree}</p>}
                          </div>
                          {/* Institution */}
                          <div>
                            <input
                              ref={(el) => { refs.institution = el; }}
                              value={entry.institution}
                              placeholder="Institution"
                              onChange={(e) => updateEdu(i, "institution", e.target.value)}
                              onBlur={() => validateEduEntry(entry, i)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") { e.preventDefault(); refs.year?.focus(); }
                              }}
                              className={inputCls(!!errs.institution)}
                            />
                            {errs.institution && <p className="mt-1 text-xs text-danger">{errs.institution}</p>}
                          </div>
                        </div>
                        {/* Year */}
                        <input
                          ref={(el) => { refs.year = el; }}
                          type="number"
                          value={entry.graduation_year}
                          placeholder="Graduation Year (optional)"
                          onChange={(e) => updateEdu(i, "graduation_year", e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              // move to next edu entry's degree, or project input
                              const nextEdu = eduRefs.current[i + 1];
                              if (nextEdu?.degree) nextEdu.degree.focus();
                              else projectInputRef.current?.focus();
                            }
                          }}
                          className={inputCls(false)}
                        />
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={addEduEntry}
                  className="mt-2 flex items-center gap-1.5 text-xs text-accent hover:text-accent-dark transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add another degree
                </button>
              </div>

              {/* Projects */}
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Projects</label>
                {projects.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {projects.map((project, i) => (
                      <div key={i} className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
                        <span className="flex-1 text-sm text-text-primary">{project}</span>
                        <button type="button" onClick={() => removeTag("projects", i)} className="text-text-tertiary hover:text-danger transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    ref={projectInputRef}
                    value={projectInput}
                    onChange={(e) => setProjectInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("projects", projectInput, () => setProjectInput(""), certInputRef);
                      }
                    }}
                    placeholder="Add a project"
                    className={inputCls(false)}
                  />
                  <button
                    type="button"
                    onClick={() => addTag("projects", projectInput, () => setProjectInput(""), certInputRef)}
                    className="px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Certifications</label>
                {certifications.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {certifications.map((cert, i) => (
                      <div key={i} className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
                        <span className="flex-1 text-sm text-text-primary">{cert}</span>
                        <button type="button" onClick={() => removeTag("certifications", i)} className="text-text-tertiary hover:text-danger transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    ref={certInputRef}
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("certifications", certInput, () => setCertInput(""), achievementInputRef);
                      }
                    }}
                    placeholder="Add a certification"
                    className={inputCls(false)}
                  />
                  <button
                    type="button"
                    onClick={() => addTag("certifications", certInput, () => setCertInput(""), achievementInputRef)}
                    className="px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Achievements</label>
                {achievements.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {achievements.map((ach, i) => (
                      <div key={i} className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
                        <span className="flex-1 text-sm text-text-primary">{ach}</span>
                        <button type="button" onClick={() => removeTag("achievements", i)} className="text-text-tertiary hover:text-danger transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    ref={achievementInputRef}
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("achievements", achievementInput, () => setAchievementInput(""), submitRef);
                      }
                    }}
                    placeholder="Add an achievement"
                    className={inputCls(false)}
                  />
                  <button
                    type="button"
                    onClick={() => addTag("achievements", achievementInput, () => setAchievementInput(""), submitRef)}
                    className="px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                ref={submitRef}
                type="submit"
                disabled={generateMutation.isPending}
                className="w-full py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-all shadow-[0_0_20px_rgba(0,194,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generateMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
                ) : (
                  "Generate Resume"
                )}
              </button>
            </form>
          </div>

          {/* ── Preview Panel ── */}
          <div className="relative rounded-xl border border-border bg-surface p-6 min-h-[600px]">
            <AIProcessingIndicator stages={AI_STAGES} isVisible={generateMutation.isPending} />

            {!generatedResume && !generateMutation.isPending && (
              <div className="h-full flex items-center justify-center text-text-tertiary">
                <p className="text-sm">Your resume preview will appear here</p>
              </div>
            )}

            {generatedResume && (
              <div className="space-y-4">
                <div id="resume-preview">
                  <ResumePreview content={generatedResume.content} />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
                  >
                    <Download className="w-4 h-4" />Download PDF
                  </button>
                  <button
                    onClick={() => router.push(`/resume/${generatedResume.uuid}`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-bright transition-all"
                  >
                    <Save className="w-4 h-4" />Save & View
                  </button>
                  <button
                    onClick={() => router.push(`/resume/${generatedResume.uuid}/analysis`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-accent hover:border-accent/30 transition-all"
                  >
                    <BarChart3 className="w-4 h-4" />Analyze
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}