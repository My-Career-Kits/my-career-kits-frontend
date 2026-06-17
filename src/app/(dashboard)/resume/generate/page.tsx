// "use client";

// import { useState, useRef, useCallback } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Plus, X, Download, Save, BarChart3, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import PageTransition from "@/components/shared/PageTransition";
// import AIProcessingIndicator from "@/components/shared/AIProcessingIndicator";
// import ResumePreview from "@/components/resume/ResumePreview";
// import { useGenerateResume } from "@/hooks/useGenerateResume";
// import { useAuth } from "@/hooks/useAuth";
// import type { ExperienceLevel, ResumeContent, ResumeGenerateInput } from "@/types";
// import { parseBackendError } from "@/lib/api";

// // ---------------------------------------------------------------------------
// // Unified Configuration & Types
// // ---------------------------------------------------------------------------
// const experienceLevels: ExperienceLevel[] = [
//   "Student", "Fresher", "Junior", "Mid Level", "Senior",
// ];

// type EduEntry = { degree: string; institution: string; graduation_year: string };
// type EduErrors = { degree?: string; institution?: string };
// const emptyEdu = (): EduEntry => ({ degree: "", institution: "", graduation_year: "" });

// const AI_STAGES = [
//   "Analyzing your skills...",
//   "Crafting your experience...",
//   "Optimizing for ATS...",
//   "Finalizing your resume...",
// ];

// // ---------------------------------------------------------------------------
// // Form Validation Schema (Synced completely with form structure)
// // ---------------------------------------------------------------------------
// const generateSchema = z.object({
//   role: z.string().min(2, "Target role must be at least 2 characters"),
//   experience_level: z.enum(["Student", "Fresher", "Junior", "Mid Level", "Senior"]),
//   skills: z.array(z.string().min(2)).min(1, "Add at least one skill"),
//   projects: z.array(z.string()).optional(),
//   certifications: z.array(z.string()).optional(),
//   achievements: z.array(z.string()).optional(),
//   name: z.string().min(2, "Name must be at least 2 characters").or(z.literal("")),
//   email: z.string().email("Enter a valid email address").or(z.literal("")),
// });

// type GenerateForm = z.infer<typeof generateSchema>;

// // ---------------------------------------------------------------------------
// // Main Component
// // ---------------------------------------------------------------------------
// export default function ResumeGeneratePage() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const generateMutation = useGenerateResume();
//   const [generatedResume, setGeneratedResume] = useState<{ uuid: string; content: ResumeContent } | null>(null);

//   // --- Local Text States for Tag Elements ---
//   const [skillInput, setSkillInput] = useState("");
//   const [skillError, setSkillError] = useState("");
//   const [projectInput, setProjectInput] = useState("");
//   const [certInput, setCertInput] = useState("");
//   const [achievementInput, setAchievementInput] = useState("");

//   // --- Education Local Object State ---
//   const [educationEntries, setEducationEntries] = useState<EduEntry[]>([emptyEdu()]);
//   const [eduErrors, setEduErrors] = useState<EduErrors[]>([{}]);

//   // --- Layout DOM Focus Refs ---
//   const nameRef = useRef<HTMLInputElement>(null);
//   const emailRef = useRef<HTMLInputElement>(null);
//   const roleRef = useRef<HTMLInputElement>(null);
//   const skillInputRef = useRef<HTMLInputElement>(null);
//   const projectInputRef = useRef<HTMLInputElement>(null);
//   const certInputRef = useRef<HTMLInputElement>(null);
//   const achievementInputRef = useRef<HTMLInputElement>(null);
//   const submitRef = useRef<HTMLButtonElement>(null);
  
//   const eduRefs = useRef<Array<{ degree: HTMLInputElement | null; institution: HTMLInputElement | null; year: HTMLInputElement | null }>>([]);
//   const ensureEduRef = (i: number) => {
//     if (!eduRefs.current[i]) eduRefs.current[i] = { degree: null, institution: null, year: null };
//     return eduRefs.current[i];
//   };

//   // --- React Hook Form Setup ---
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<GenerateForm>({
//     resolver: zodResolver(generateSchema),
//     mode: "onSubmit",
//     defaultValues: {
//       experience_level: "Junior",
//       skills: [],
//       projects: [],
//       certifications: [],
//       achievements: [],
//       name: user?.name ?? "",
//       email: user?.email ?? "",
//     },
//   });

//   const skills = watch("skills") ?? [];
//   const projects = watch("projects") ?? [];
//   const certifications = watch("certifications") ?? [];
//   const achievements = watch("achievements") ?? [];

//   // ---------------------------------------------------------------------------
//   // Tag/Array Manipulators
//   // ---------------------------------------------------------------------------
//   const addSkill = useCallback(() => {
//     const val = skillInput.trim();
//     if (!val) {
//       projectInputRef.current?.focus();
//       return;
//     }
//     if (val.length < 2) {
//       setSkillError("Skill must be at least 2 characters");
//       return;
//     }
//     setSkillError("");
//     setValue("skills", [...skills, val], { shouldValidate: true });
//     setSkillInput("");
//   }, [skillInput, skills, setValue]);

//   const removeSkill = (i: number) =>
//     setValue("skills", skills.filter((_, idx) => idx !== i), { shouldValidate: true });

//   type TagField = "projects" | "certifications" | "achievements";
//   const addTag = (
//     field: TagField,
//     value: string,
//     clear: () => void,
//     nextRef?: React.RefObject<HTMLInputElement | HTMLButtonElement | null>
//   ) => {
//     const val = value.trim();
//     if (!val) {
//       nextRef?.current?.focus();
//       return;
//     }
//     if (val.length < 2) return;
//     const current = (watch(field) ?? []) as string[];
//     setValue(field, [...current, val], { shouldValidate: true });
//     clear();
//   };

//   const removeTag = (field: TagField, i: number) => {
//     const current = (watch(field) ?? []) as string[];
//     setValue(field, current.filter((_, idx) => idx !== i));
//   };

//   // ---------------------------------------------------------------------------
//   // Education Manual Handlers
//   // ---------------------------------------------------------------------------
//   const updateEdu = (i: number, field: keyof EduEntry, value: string) => {
//     setEducationEntries((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
//     setEduErrors((prev) => {
//       const copy = [...prev];
//       if (!copy[i]) copy[i] = {};
//       copy[i] = { ...copy[i], [field]: undefined };
//       return copy;
//     });
//   };

//   const validateEduEntry = (entry: EduEntry, i: number) => {
//     const errs: EduErrors = {};
//     const degreeFilled = !!entry.degree.trim();
//     const instFilled = !!entry.institution.trim();
//     if (degreeFilled && !instFilled) errs.institution = "Institution is required when a degree is provided";
//     if (instFilled && !degreeFilled) errs.degree = "Degree is required when an institution is provided";
//     if (degreeFilled && entry.degree.trim().length < 2) errs.degree = "Degree must be at least 2 characters";
//     if (instFilled && entry.institution.trim().length < 2) errs.institution = "Institution must be at least 2 characters";
//     setEduErrors((prev) => { const c = [...prev]; c[i] = errs; return c; });
//     return Object.keys(errs).length === 0;
//   };

//   const validateAllEdu = () => {
//     let ok = true;
//     educationEntries.forEach((e, i) => { if (!validateEduEntry(e, i)) ok = false; });
//     return ok;
//   };

//   // ---------------------------------------------------------------------------
//   // Submission Pipeline
//   // ---------------------------------------------------------------------------
//   const onSubmit = async (data: GenerateForm) => {
//     if (!validateAllEdu()) return;

//     try {
//       const validEduEntry = educationEntries[0];
//       const hasEducation = validEduEntry && (validEduEntry.degree.trim() || validEduEntry.institution.trim());

//       const cleanEducation = hasEducation 
//         ? {
//             degree: validEduEntry.degree.trim(),
//             institution: validEduEntry.institution.trim(),
//             graduation_year: validEduEntry.graduation_year ? String(validEduEntry.graduation_year).trim() : undefined,
//           }
//         : undefined;

//       const cleanStringArray = (arr: any[]) => {
//         return Array.from(arr || [])
//           .map((item) => (typeof item === "object" && item !== null ? String((item as any).value || (item as any).name || "") : String(item)))
//           .map((str) => str.trim())
//           .filter((str) => str.length > 0);
//       };

//       const purePayload: any = {
//         name: data.name.trim() || user?.name || "",
//         email: data.email.trim() || user?.email || "",
//         role: data.role.trim(),
//         experience_level: data.experience_level,
//         skills: cleanStringArray(skills),
//         projects: cleanStringArray(projects),
//         certifications: cleanStringArray(certifications),
//         achievements: cleanStringArray(achievements),
//         education: cleanEducation, 
//       };

//       const result = await generateMutation.mutateAsync(purePayload);
      
//       setGeneratedResume({ uuid: result.uuid, content: result.content });
//       toast.success("Resume generated successfully!");
//       router.push(`/resume/${result.uuid}`);
//     } catch (err) {
//       toast.error(parseBackendError(err), { duration: 6000 });
//     }
//   };

//   const handleFormSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Commit dangling inputs directly to RHF values before letting the parser fire
//     if (skillInput.trim()) {
//       const val = skillInput.trim();
//       if (val.length >= 2) {
//         setValue("skills", [...skills, val], { shouldValidate: true });
//         setSkillInput("");
//         setSkillError("");
//       }
//     }
//     if (projectInput.trim()) addTag("projects", projectInput, () => setProjectInput(""));
//     if (certInput.trim()) addTag("certifications", certInput, () => setCertInput(""));
//     if (achievementInput.trim()) addTag("achievements", achievementInput, () => setAchievementInput(""));

//     handleSubmit(onSubmit)(e);
//   };

//   // ---------------------------------------------------------------------------
//   // PDF Export Engine
//   // ---------------------------------------------------------------------------
//   const handleDownloadPDF = async () => {
//     if (!generatedResume) return;
//     const html2pdf = (await import("html2pdf.js")).default;
//     const element = document.getElementById("resume-preview");
//     if (element) html2pdf().from(element).save("resume.pdf");
//   };

//   const inputCls = (hasError: boolean) =>
//     `w-full bg-background border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] transition-colors ${
//       hasError ? "border-danger" : "border-border"
//     }`;

//   return (
//     <PageTransition>
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-text-primary">Generate Resume</h1>
//           <p className="text-text-secondary mt-1">Fill in your details and let AI do the rest</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* ── Form Panel ── */}
//           <div className="rounded-xl border border-border bg-surface p-6">
//             <form onSubmit={handleFormSubmit} className="space-y-5">

//               {/* Name + Email */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm text-text-secondary mb-1.5">Name</label>
//                   <input
//                     {...register("name")}
//                     ref={(el) => {
//                       register("name").ref(el);
//                       (nameRef as any).current = el;
//                     }}
//                     placeholder={user?.name || "Your name"}
//                     className={inputCls(!!errors.name)}
//                     onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); emailRef.current?.focus(); } }}
//                   />
//                   {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm text-text-secondary mb-1.5">Email</label>
//                   <input
//                     {...register("email")}
//                     ref={(el) => {
//                       register("email").ref(el);
//                       (emailRef as any).current = el;
//                     }}
//                     type="email"
//                     placeholder={user?.email || "your@email.com"}
//                     className={inputCls(!!errors.email)}
//                     onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); roleRef.current?.focus(); } }}
//                   />
//                   {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
//                 </div>
//               </div>

//               {/* Target Role */}
//               <div>
//                 <label className="block text-sm text-text-secondary mb-1.5">Target Role</label>
//                 <input
//                   {...register("role")}
//                   ref={(el) => {
//                     register("role").ref(el);
//                     (roleRef as any).current = el;
//                   }}
//                   placeholder="e.g. Senior Software Engineer"
//                   className={inputCls(!!errors.role)}
//                   onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); skillInputRef.current?.focus(); } }}
//                 />
//                 {errors.role && <p className="mt-1 text-xs text-danger">{errors.role.message}</p>}
//               </div>

//               {/* Experience Level Selector */}
//               <div>
//                 <label className="block text-sm text-text-secondary mb-2">Experience Level</label>
//                 <div className="flex flex-wrap gap-2">
//                   {experienceLevels.map((level) => (
//                     <button
//                       key={level}
//                       type="button"
//                       onClick={() => setValue("experience_level", level)}
//                       className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                         watch("experience_level") === level
//                           ? "bg-accent text-black shadow-[0_0_15px_rgba(0,194,255,0.3)]"
//                           : "bg-background border border-border text-text-secondary hover:text-text-primary hover:border-border-bright"
//                       }`}
//                     >
//                       {level}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Skills Tag Management */}
//               <div>
//                 <label className="block text-sm text-text-secondary mb-1.5">Skills</label>
//                 {skills.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mb-2">
//                     {skills.map((skill, i) => (
//                       <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20">
//                         {skill}
//                         <button type="button" onClick={() => removeSkill(i)} aria-label={`Remove ${skill}`}>
//                           <X className="w-3 h-3" />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                 )}
//                 <div className="flex gap-2">
//                   <input
//                     ref={skillInputRef}
//                     value={skillInput}
//                     onChange={(e) => {
//                       setSkillInput(e.target.value);
//                       if (skillError) setSkillError("");
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         addSkill();
//                       }
//                     }}
//                     placeholder="Type a skill and press Enter"
//                     className={inputCls(!!skillError || !!errors.skills)}
//                   />
//                   <button
//                     type="button"
//                     onClick={addSkill}
//                     className="px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
//                     aria-label="Add skill"
//                   >
//                     <Plus className="w-4 h-4" />
//                   </button>
//                 </div>
//                 {skillError
//                   ? <p className="mt-1 text-xs text-danger">{skillError}</p>
//                   : errors.skills && <p className="mt-1 text-xs text-danger">{errors.skills.message}</p>
//                 }
//               </div>

//               {/* Education Dynamic Fields */}
//               <div>
//                 <label className="block text-base font-bold text-text-primary mb-1.5">
//                   Education <span className="text-sm font-normal text-accent">(optional — fill both degree & institution or leave empty)</span>
//                 </label>
//                 <div className="space-y-3">
//                   {educationEntries.slice(0, 1).map((entry, i) => {
//                     const refs = ensureEduRef(i);
//                     const errs = eduErrors[i] ?? {};
//                     return (
//                       <div key={i} className="relative rounded-lg border border-border bg-background p-3 space-y-2">
//                         <div className="grid grid-cols-2 gap-2">
//                           <div>
//                             <input
//                               ref={(el) => { refs.degree = el; }}
//                               value={entry.degree}
//                               placeholder="Degree"
//                               onChange={(e) => updateEdu(i, "degree", e.target.value)}
//                               onBlur={() => validateEduEntry(entry, i)}
//                               onKeyDown={(e) => {
//                                 if (e.key === "Enter") { e.preventDefault(); refs.institution?.focus(); }
//                               }}
//                               className={inputCls(!!errs.degree)}
//                             />
//                             {errs.degree && <p className="mt-1 text-xs text-danger">{errs.degree}</p>}
//                           </div>
//                           <div>
//                             <input
//                               ref={(el) => { refs.institution = el; }}
//                               value={entry.institution}
//                               placeholder="Institution"
//                               onChange={(e) => updateEdu(i, "institution", e.target.value)}
//                               onBlur={() => validateEduEntry(entry, i)}
//                               onKeyDown={(e) => {
//                                 if (e.key === "Enter") { e.preventDefault(); refs.year?.focus(); }
//                               }}
//                               className={inputCls(!!errs.institution)}
//                             />
//                             {errs.institution && <p className="mt-1 text-xs text-danger">{errs.institution}</p>}
//                           </div>
//                         </div>
//                         <input
//                           ref={(el) => { refs.year = el; }}
//                           type="text"
//                           value={entry.graduation_year}
//                           placeholder="Graduation Year (optional)"
//                           onChange={(e) => updateEdu(i, "graduation_year", e.target.value)}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               e.preventDefault();
//                               projectInputRef.current?.focus();
//                             }
//                           }}
//                           className={inputCls(false)}
//                         />
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Projects Array Input */}
//               <div>
//                 <label className="block text-sm text-text-secondary mb-1.5">Projects</label>
//                 {projects.length > 0 && (
//                   <div className="space-y-2 mb-2">
//                     {projects.map((project, i) => (
//                       <div key={i} className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
//                         <span className="flex-1 text-sm text-text-primary">{project}</span>
//                         <button type="button" onClick={() => removeTag("projects", i)} className="text-text-tertiary hover:text-danger transition-colors">
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <div className="flex gap-2">
//                   <input
//                     ref={projectInputRef}
//                     value={projectInput}
//                     onChange={(e) => setProjectInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         addTag("projects", projectInput, () => setProjectInput(""), certInputRef);
//                       }
//                     }}
//                     placeholder="Add a project"
//                     className={inputCls(false)}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => addTag("projects", projectInput, () => setProjectInput(""), certInputRef)}
//                     className="px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
//                   >
//                     <Plus className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Certifications Array Input */}
//               <div>
//                 <label className="block text-sm text-text-secondary mb-1.5">Certifications</label>
//                 {certifications.length > 0 && (
//                   <div className="space-y-2 mb-2">
//                     {certifications.map((cert, i) => (
//                       <div key={i} className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
//                         <span className="flex-1 text-sm text-text-primary">{cert}</span>
//                         <button type="button" onClick={() => removeTag("certifications", i)} className="text-text-tertiary hover:text-danger transition-colors">
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <div className="flex gap-2">
//                   <input
//                     ref={certInputRef}
//                     value={certInput}
//                     onChange={(e) => setCertInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         addTag("certifications", certInput, () => setCertInput(""), achievementInputRef);
//                       }
//                     }}
//                     placeholder="Add a certification"
//                     className={inputCls(false)}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => addTag("certifications", certInput, () => setCertInput(""), achievementInputRef)}
//                     className="px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
//                   >
//                     <Plus className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Achievements Array Input */}
//               <div>
//                 <label className="block text-sm text-text-secondary mb-1.5">Achievements</label>
//                 {achievements.length > 0 && (
//                   <div className="space-y-2 mb-2">
//                     {achievements.map((ach, i) => (
//                       <div key={i} className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
//                         <span className="flex-1 text-sm text-text-primary">{ach}</span>
//                         <button type="button" onClick={() => removeTag("achievements", i)} className="text-text-tertiary hover:text-danger transition-colors">
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <div className="flex gap-2">
//                   <input
//                     ref={achievementInputRef}
//                     value={achievementInput}
//                     onChange={(e) => setAchievementInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         addTag("achievements", achievementInput, () => setAchievementInput(""), submitRef);
//                       }
//                     }}
//                     placeholder="Add an achievement"
//                     className={inputCls(false)}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => addTag("achievements", achievementInput, () => setAchievementInput(""), submitRef)}
//                     className="px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
//                   >
//                     <Plus className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Submission Execution Button */}
//               <button
//                 ref={submitRef}
//                 type="submit"
//                 disabled={generateMutation.isPending}
//                 className="w-full py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-all shadow-[0_0_20px_rgba(0,194,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {generateMutation.isPending ? (
//                   <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
//                 ) : (
//                   "Generate Resume"
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* ── Preview Panel ── */}
//           <div className="relative rounded-xl border border-border bg-surface p-6 min-h-[600px]">
//             <AIProcessingIndicator stages={AI_STAGES} isVisible={generateMutation.isPending} />

//             {!generatedResume && !generateMutation.isPending && (
//               <div className="h-full flex items-center justify-center text-text-tertiary">
//                 <p className="text-sm">Your resume preview will appear here</p>
//               </div>
//             )}

//             {generatedResume && (
//               <div className="space-y-4">
//                 <div id="resume-preview">
//                   <ResumePreview content={generatedResume.content} />
//                 </div>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleDownloadPDF}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
//                   >
//                     <Download className="w-4 h-4" />Download PDF
//                   </button>
//                   <button
//                     onClick={() => router.push(`/resume/${generatedResume.uuid}`)}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-bright transition-all"
//                   >
//                     <Save className="w-4 h-4" />Save & View
//                   </button>
//                   <button
//                     onClick={() => router.push(`/resume/${generatedResume.uuid}/analysis`)}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-accent hover:border-accent/30 transition-all"
//                   >
//                     <BarChart3 className="w-4 h-4" />Analyze
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </PageTransition>
//   );
// }





// "use client";

// import { useState, useRef, useCallback } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Plus, X, Download, Save, BarChart3, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import PageTransition from "@/components/shared/PageTransition";
// import AIProcessingIndicator from "@/components/shared/AIProcessingIndicator";
// import ResumePreview from "@/components/resume/ResumePreview";
// import { useGenerateResume } from "@/hooks/useGenerateResume";
// import { useAuth } from "@/hooks/useAuth";
// import type { ExperienceLevel, ResumeContent, ResumeGenerateInput } from "@/types";
// import { parseBackendError } from "@/lib/api";

// // ---------------------------------------------------------------------------
// // Unified Configuration & Types
// // ---------------------------------------------------------------------------
// const experienceLevels: ExperienceLevel[] = [
//   "Student", "Fresher", "Junior", "Mid Level", "Senior",
// ];

// type EduEntry = { degree: string; institution: string; graduation_year: string };
// type EduErrors = { degree?: string; institution?: string };
// const emptyEdu = (): EduEntry => ({ degree: "", institution: "", graduation_year: "" });

// const AI_STAGES = [
//   "Analyzing your skills...",
//   "Crafting your experience...",
//   "Optimizing for ATS...",
//   "Finalizing your resume...",
// ];

// // ---------------------------------------------------------------------------
// // Form Validation Schema (Synced completely with form structure)
// // ---------------------------------------------------------------------------
// const generateSchema = z.object({
//   role: z.string().min(2, "Target role must be at least 2 characters"),
//   experience_level: z.enum(["Student", "Fresher", "Junior", "Mid Level", "Senior"]),
//   skills: z.array(z.string().min(2)).min(1, "Add at least one skill"),
//   projects: z.array(z.string()).optional(),
//   certifications: z.array(z.string()).optional(),
//   achievements: z.array(z.string()).optional(),
//   name: z.string().min(2, "Name must be at least 2 characters").or(z.literal("")),
//   email: z.string().email("Enter a valid email address").or(z.literal("")),
// });

// type GenerateForm = z.infer<typeof generateSchema>;

// // ---------------------------------------------------------------------------
// // Main Component
// // ---------------------------------------------------------------------------
// export default function ResumeGeneratePage() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const generateMutation = useGenerateResume();
//   const [generatedResume, setGeneratedResume] = useState<{ uuid: string; content: ResumeContent } | null>(null);

//   // --- Local Text States for Tag Elements ---
//   const [skillInput, setSkillInput] = useState("");
//   const [skillError, setSkillError] = useState("");
//   const [projectInput, setProjectInput] = useState("");
//   const [certInput, setCertInput] = useState("");
//   const [achievementInput, setAchievementInput] = useState("");

//   // --- Education Local Object State ---
//   const [educationEntries, setEducationEntries] = useState<EduEntry[]>([emptyEdu()]);
//   const [eduErrors, setEduErrors] = useState<EduErrors[]>([{}]);

//   // --- Layout DOM Focus Refs ---
//   const nameRef = useRef<HTMLInputElement>(null);
//   const emailRef = useRef<HTMLInputElement>(null);
//   const roleRef = useRef<HTMLInputElement>(null);
//   const skillInputRef = useRef<HTMLInputElement>(null);
//   const projectInputRef = useRef<HTMLInputElement>(null);
//   const certInputRef = useRef<HTMLInputElement>(null);
//   const achievementInputRef = useRef<HTMLInputElement>(null);
//   const submitRef = useRef<HTMLButtonElement>(null);
  
//   const eduRefs = useRef<Array<{ degree: HTMLInputElement | null; institution: HTMLInputElement | null; year: HTMLInputElement | null }>>([]);
//   const ensureEduRef = (i: number) => {
//     if (!eduRefs.current[i]) eduRefs.current[i] = { degree: null, institution: null, year: null };
//     return eduRefs.current[i];
//   };

//   // --- React Hook Form Setup ---
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<GenerateForm>({
//     resolver: zodResolver(generateSchema),
//     mode: "onSubmit",
//     defaultValues: {
//       experience_level: "Junior",
//       skills: [],
//       projects: [],
//       certifications: [],
//       achievements: [],
//       name: user?.name ?? "",
//       email: user?.email ?? "",
//     },
//   });

//   const skills = watch("skills") ?? [];
//   const projects = watch("projects") ?? [];
//   const certifications = watch("certifications") ?? [];
//   const achievements = watch("achievements") ?? [];

//   // ---------------------------------------------------------------------------
//   // Tag/Array Manipulators
//   // ---------------------------------------------------------------------------
//   const addSkill = useCallback(() => {
//     const val = skillInput.trim();
//     if (!val) {
//       projectInputRef.current?.focus();
//       return;
//     }
//     if (val.length < 2) {
//       setSkillError("Skill must be at least 2 characters");
//       return;
//     }
//     setSkillError("");
//     setValue("skills", [...skills, val], { shouldValidate: true });
//     setSkillInput("");
//   }, [skillInput, skills, setValue]);

//   const removeSkill = (i: number) =>
//     setValue("skills", skills.filter((_, idx) => idx !== i), { shouldValidate: true });

//   type TagField = "projects" | "certifications" | "achievements";
//   const addTag = (
//     field: TagField,
//     value: string,
//     clear: () => void,
//     nextRef?: React.RefObject<HTMLInputElement | HTMLButtonElement | null>
//   ) => {
//     const val = value.trim();
//     if (!val) {
//       nextRef?.current?.focus();
//       return;
//     }
//     if (val.length < 2) return;
//     const current = (watch(field) ?? []) as string[];
//     setValue(field, [...current, val], { shouldValidate: true });
//     clear();
//   };

//   const removeTag = (field: TagField, i: number) => {
//     const current = (watch(field) ?? []) as string[];
//     setValue(field, current.filter((_, idx) => idx !== i));
//   };

//   // ---------------------------------------------------------------------------
//   // Education Manual Handlers
//   // ---------------------------------------------------------------------------
//   const updateEdu = (i: number, field: keyof EduEntry, value: string) => {
//     setEducationEntries((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
//     setEduErrors((prev) => {
//       const copy = [...prev];
//       if (!copy[i]) copy[i] = {};
//       copy[i] = { ...copy[i], [field]: undefined };
//       return copy;
//     });
//   };

//   const validateEduEntry = (entry: EduEntry, i: number) => {
//     const errs: EduErrors = {};
//     const degreeFilled = !!entry.degree.trim();
//     const instFilled = !!entry.institution.trim();
//     if (degreeFilled && !instFilled) errs.institution = "Institution is required when a degree is provided";
//     if (instFilled && !degreeFilled) errs.degree = "Degree is required when an institution is provided";
//     if (degreeFilled && entry.degree.trim().length < 2) errs.degree = "Degree must be at least 2 characters";
//     if (instFilled && entry.institution.trim().length < 2) errs.institution = "Institution must be at least 2 characters";
//     setEduErrors((prev) => { const c = [...prev]; c[i] = errs; return c; });
//     return Object.keys(errs).length === 0;
//   };

//   const validateAllEdu = () => {
//     let ok = true;
//     educationEntries.forEach((e, i) => { if (!validateEduEntry(e, i)) ok = false; });
//     return ok;
//   };

//   // ---------------------------------------------------------------------------
//   // Submission Pipeline
//   // ---------------------------------------------------------------------------
//   const onSubmit = async (data: GenerateForm) => {
//     if (!validateAllEdu()) return;

//     try {
//       const validEduEntry = educationEntries[0];
//       const hasEducation = validEduEntry && (validEduEntry.degree.trim() || validEduEntry.institution.trim());

//       const cleanEducation = hasEducation 
//         ? {
//             degree: validEduEntry.degree.trim(),
//             institution: validEduEntry.institution.trim(),
//             graduation_year: validEduEntry.graduation_year ? String(validEduEntry.graduation_year).trim() : undefined,
//           }
//         : undefined;

//       const cleanStringArray = (arr: any[]) => {
//         return Array.from(arr || [])
//           .map((item) => (typeof item === "object" && item !== null ? String((item as any).value || (item as any).name || "") : String(item)))
//           .map((str) => str.trim())
//           .filter((str) => str.length > 0);
//       };

//       const purePayload: any = {
//         name: data.name.trim() || user?.name || "",
//         email: data.email.trim() || user?.email || "",
//         role: data.role.trim(),
//         experience_level: data.experience_level,
//         skills: cleanStringArray(skills),
//         projects: cleanStringArray(projects),
//         certifications: cleanStringArray(certifications),
//         achievements: cleanStringArray(achievements),
//         education: cleanEducation, 
//       };

//       const result = await generateMutation.mutateAsync(purePayload);
      
//       setGeneratedResume({ uuid: result.uuid, content: result.content });
//       toast.success("Resume generated successfully!");
//       router.push(`/resume/${result.uuid}`);
//     } catch (err) {
//       toast.error(parseBackendError(err), { duration: 6000 });
//     }
//   };

//   const handleFormSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Commit dangling inputs directly to RHF values before letting the parser fire
//     if (skillInput.trim()) {
//       const val = skillInput.trim();
//       if (val.length >= 2) {
//         setValue("skills", [...skills, val], { shouldValidate: true });
//         setSkillInput("");
//         setSkillError("");
//       }
//     }
//     if (projectInput.trim()) addTag("projects", projectInput, () => setProjectInput(""));
//     if (certInput.trim()) addTag("certifications", certInput, () => setCertInput(""));
//     if (achievementInput.trim()) addTag("achievements", achievementInput, () => setAchievementInput(""));

//     handleSubmit(onSubmit)(e);
//   };

//   // ---------------------------------------------------------------------------
//   // PDF Export Engine
//   // ---------------------------------------------------------------------------
//   const handleDownloadPDF = async () => {
//     if (!generatedResume) return;
//     const html2pdf = (await import("html2pdf.js")).default;
//     const element = document.getElementById("resume-preview");
//     if (element) html2pdf().from(element).save("resume.pdf");
//   };

//   const inputCls = (hasError: boolean) =>
//     `w-full bg-background border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] transition-colors ${
//       hasError ? "border-danger" : "border-border"
//     }`;

//   return (
//     <PageTransition>
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-text-primary">Generate Resume</h1>
//           <p className="text-text-secondary mt-1">Fill in your details and let AI do the rest</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* ── Form Panel ── */}
//           <div className="rounded-xl border border-border bg-surface p-6">
//             <form onSubmit={handleFormSubmit} className="space-y-5">

//               {/* Name + Email */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm text-text-secondary mb-1.5">Name</label>
//                   <input
//                     {...register("name")}
//                     ref={(el) => {
//                       register("name").ref(el);
//                       (nameRef as any).current = el;
//                     }}
//                     placeholder={user?.name || "Your name"}
//                     className={inputCls(!!errors.name)}
//                     onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); emailRef.current?.focus(); } }}
//                   />
//                   {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm text-text-secondary mb-1.5">Email</label>
//                   <input
//                     {...register("email")}
//                     ref={(el) => {
//                       register("email").ref(el);
//                       (emailRef as any).current = el;
//                     }}
//                     type="email"
//                     placeholder={user?.email || "your@email.com"}
//                     className={inputCls(!!errors.email)}
//                     onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); roleRef.current?.focus(); } }}
//                   />
//                   {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
//                 </div>
//               </div>

//               {/* Target Role */}
//               <div>
//                 <label className="block text-sm text-text-secondary mb-1.5">Target Role</label>
//                 <input
//                   {...register("role")}
//                   ref={(el) => {
//                     register("role").ref(el);
//                     (roleRef as any).current = el;
//                   }}
//                   placeholder="e.g. Senior Software Engineer"
//                   className={inputCls(!!errors.role)}
//                   onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); skillInputRef.current?.focus(); } }}
//                 />
//                 {errors.role && <p className="mt-1 text-xs text-danger">{errors.role.message}</p>}
//               </div>

//               {/* Experience Level Selector */}
//               <div>
//                 <label className="block text-sm text-text-secondary mb-2">Experience Level</label>
//                 <div className="flex flex-wrap gap-2">
//                   {experienceLevels.map((level) => (
//                     <button
//                       key={level}
//                       type="button"
//                       onClick={() => setValue("experience_level", level)}
//                       className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                         watch("experience_level") === level
//                           ? "bg-accent text-black shadow-[0_0_15px_rgba(0,194,255,0.3)]"
//                           : "bg-background border border-border text-text-secondary hover:text-text-primary hover:border-border-bright"
//                       }`}
//                     >
//                       {level}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Skills Tag Management */}
//               <div>
//                 <label className="block text-sm text-text-secondary mb-1.5">Skills</label>
//                 {skills.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mb-2">
//                     {skills.map((skill, i) => (
//                       <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20">
//                         {skill}
//                         <button type="button" onClick={() => removeSkill(i)} aria-label={`Remove ${skill}`}>
//                           <X className="w-3 h-3" />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                 )}
//                 <div className="flex gap-2">
//                   <input
//                     ref={skillInputRef}
//                     value={skillInput}
//                     onChange={(e) => {
//                       setSkillInput(e.target.value);
//                       if (skillError) setSkillError("");
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         addSkill();
//                       }
//                     }}
//                     placeholder="Type a skill and press Enter"
//                     className={inputCls(!!skillError || !!errors.skills)}
//                   />
//                   <button
//                     type="button"
//                     onClick={addSkill}
//                     className="px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
//                     aria-label="Add skill"
//                   >
//                     <Plus className="w-4 h-4" />
//                   </button>
//                 </div>
//                 {skillError
//                   ? <p className="mt-1 text-xs text-danger">{skillError}</p>
//                   : errors.skills && <p className="mt-1 text-xs text-danger">{errors.skills.message}</p>
//                 }
//               </div>

//               {/* Education Dynamic Fields */}
//               <div>
//                 <label className="block text-base font-bold text-text-primary mb-1.5">
//                   Education <span className="text-sm font-normal text-accent">(optional — fill both degree & institution or leave empty)</span>
//                 </label>
//                 <div className="space-y-3">
//                   {educationEntries.slice(0, 1).map((entry, i) => {
//                     const refs = ensureEduRef(i);
//                     const errs = eduErrors[i] ?? {};
//                     return (
//                       <div key={i} className="relative rounded-lg border border-border bg-background p-3 space-y-2">
//                         <div className="grid grid-cols-2 gap-2">
//                           <div>
//                             <input
//                               ref={(el) => { refs.degree = el; }}
//                               value={entry.degree}
//                               placeholder="Degree"
//                               onChange={(e) => updateEdu(i, "degree", e.target.value)}
//                               onBlur={() => validateEduEntry(entry, i)}
//                               onKeyDown={(e) => {
//                                 if (e.key === "Enter") { e.preventDefault(); refs.institution?.focus(); }
//                               }}
//                               className={inputCls(!!errs.degree)}
//                             />
//                             {errs.degree && <p className="mt-1 text-xs text-danger">{errs.degree}</p>}
//                           </div>
//                           <div>
//                             <input
//                               ref={(el) => { refs.institution = el; }}
//                               value={entry.institution}
//                               placeholder="Institution"
//                               onChange={(e) => updateEdu(i, "institution", e.target.value)}
//                               onBlur={() => validateEduEntry(entry, i)}
//                               onKeyDown={(e) => {
//                                 if (e.key === "Enter") { e.preventDefault(); refs.year?.focus(); }
//                               }}
//                               className={inputCls(!!errs.institution)}
//                             />
//                             {errs.institution && <p className="mt-1 text-xs text-danger">{errs.institution}</p>}
//                           </div>
//                         </div>
//                         <input
//                           ref={(el) => { refs.year = el; }}
//                           type="text"
//                           value={entry.graduation_year}
//                           placeholder="Graduation Year (optional)"
//                           onChange={(e) => updateEdu(i, "graduation_year", e.target.value)}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               e.preventDefault();
//                               projectInputRef.current?.focus();
//                             }
//                           }}
//                           className={inputCls(false)}
//                         />
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Projects Array Input */}
//               <div>
//                 <label className="block text-sm text-text-secondary mb-1.5">Projects</label>
//                 {projects.length > 0 && (
//                   <div className="space-y-2 mb-2">
//                     {projects.map((project, i) => (
//                       <div key={i} className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
//                         <span className="flex-1 text-sm text-text-primary">{project}</span>
//                         <button type="button" onClick={() => removeTag("projects", i)} className="text-text-tertiary hover:text-danger transition-colors">
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <div className="flex gap-2">
//                   <input
//                     ref={projectInputRef}
//                     value={projectInput}
//                     onChange={(e) => setProjectInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         addTag("projects", projectInput, () => setProjectInput(""), certInputRef);
//                       }
//                     }}
//                     placeholder="Add a project"
//                     className={inputCls(false)}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => addTag("projects", projectInput, () => setProjectInput(""), certInputRef)}
//                     className="px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
//                   >
//                     <Plus className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Certifications Array Input */}
//               <div>
//                 <label className="block text-sm text-text-secondary mb-1.5">Certifications</label>
//                 {certifications.length > 0 && (
//                   <div className="space-y-2 mb-2">
//                     {certifications.map((cert, i) => (
//                       <div key={i} className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
//                         <span className="flex-1 text-sm text-text-primary">{cert}</span>
//                         <button type="button" onClick={() => removeTag("certifications", i)} className="text-text-tertiary hover:text-danger transition-colors">
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <div className="flex gap-2">
//                   <input
//                     ref={certInputRef}
//                     value={certInput}
//                     onChange={(e) => setCertInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         addTag("certifications", certInput, () => setCertInput(""), achievementInputRef);
//                       }
//                     }}
//                     placeholder="Add a certification"
//                     className={inputCls(false)}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => addTag("certifications", certInput, () => setCertInput(""), achievementInputRef)}
//                     className="px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
//                   >
//                     <Plus className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Achievements Array Input */}
//               <div>
//                 <label className="block text-sm text-text-secondary mb-1.5">Achievements</label>
//                 {achievements.length > 0 && (
//                   <div className="space-y-2 mb-2">
//                     {achievements.map((ach, i) => (
//                       <div key={i} className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
//                         <span className="flex-1 text-sm text-text-primary">{ach}</span>
//                         <button type="button" onClick={() => removeTag("achievements", i)} className="text-text-tertiary hover:text-danger transition-colors">
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <div className="flex gap-2">
//                   <input
//                     ref={achievementInputRef}
//                     value={achievementInput}
//                     onChange={(e) => setAchievementInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         addTag("achievements", achievementInput, () => setAchievementInput(""), submitRef);
//                       }
//                     }}
//                     placeholder="Add an achievement"
//                     className={inputCls(false)}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => addTag("achievements", achievementInput, () => setAchievementInput(""), submitRef)}
//                     className="px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
//                   >
//                     <Plus className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Submission Execution Button */}
//               <button
//                 ref={submitRef}
//                 type="submit"
//                 disabled={generateMutation.isPending}
//                 className="w-full py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-all shadow-[0_0_20px_rgba(0,194,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {generateMutation.isPending ? (
//                   <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
//                 ) : (
//                   "Generate Resume"
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* ── Preview Panel ── */}
//           <div className="relative rounded-xl border border-border bg-surface p-6 min-h-[600px]">
//             <AIProcessingIndicator stages={AI_STAGES} isVisible={generateMutation.isPending} />

//             {!generatedResume && !generateMutation.isPending && (
//               <div className="h-full flex items-center justify-center text-text-tertiary">
//                 <p className="text-sm">Your resume preview will appear here</p>
//               </div>
//             )}

//             {generatedResume && (
//               <div className="space-y-4">
//                 <div id="resume-preview">
//                   <ResumePreview content={generatedResume.content} />
//                 </div>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleDownloadPDF}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
//                   >
//                     <Download className="w-4 h-4" />Download PDF
//                   </button>
//                   <button
//                     onClick={() => router.push(`/resume/${generatedResume.uuid}`)}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-bright transition-all"
//                   >
//                     <Save className="w-4 h-4" />Save & View
//                   </button>
//                   <button
//                     onClick={() => router.push(`/resume/${generatedResume.uuid}/analysis`)}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-accent hover:border-accent/30 transition-all"
//                   >
//                     <BarChart3 className="w-4 h-4" />Analyze
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </PageTransition>
//   );
// }

"use client";

import { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Download, Save, BarChart3, Loader2, Sparkles, FileText } from "lucide-react";
import { toast } from "sonner";
import PageTransition from "@/components/shared/PageTransition";
import AIProcessingIndicator from "@/components/shared/AIProcessingIndicator";
import ResumePreview from "@/components/resume/ResumePreview";
import { useGenerateResume } from "@/hooks/useGenerateResume";
import { useAuth } from "@/hooks/useAuth";
import type { ExperienceLevel, ResumeContent } from "@/types";
import { parseBackendError } from "@/lib/api";

// ---------------------------------------------------------------------------
// Unified Configuration & Types
// ---------------------------------------------------------------------------
const experienceLevels: ExperienceLevel[] = [
  "Student", "Fresher", "Junior", "Mid Level", "Senior",
];

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
// Form Validation Schema
// ---------------------------------------------------------------------------
const generateSchema = z.object({
  role: z.string().min(2, "Target role must be at least 2 characters"),
  experience_level: z.enum(["Student", "Fresher", "Junior", "Mid Level", "Senior"]),
  skills: z.array(z.string().min(2)).min(1, "Add at least one skill"),
  projects: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  name: z.string().min(2, "Name must be at least 2 characters").or(z.literal("")),
  email: z.string().email("Enter a valid email address").or(z.literal("")),
});

type GenerateForm = z.infer<typeof generateSchema>;

// ---------------------------------------------------------------------------
// Shared styling builder matching Cover Letter inputs exactly
// ---------------------------------------------------------------------------
const inputCls = (hasError: boolean) =>
  `w-full bg-background border rounded-xl px-4 py-3 text-base text-text-primary placeholder:text-text-tertiary/60 focus:border-accent focus:outline-none focus:shadow-[0_0_0_4px_rgba(0,194,255,0.08)] transition-all ${
    hasError ? "border-danger bg-danger/5" : "border-border hover:border-border-bright"
  }`;

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function Page() {
  const router = useRouter();
  const { user } = useAuth();
  const generateMutation = useGenerateResume();
  const [generatedResume, setGeneratedResume] = useState<{ uuid: string; content: ResumeContent } | null>(null);

  // --- Local Text States for Tag Elements ---
  const [skillInput, setSkillInput] = useState("");
  const [skillError, setSkillError] = useState("");
  const [projectInput, setProjectInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");

  // --- Education Local Object State ---
  const [educationEntries, setEducationEntries] = useState<EduEntry[]>([emptyEdu()]);
  const [eduErrors, setEduErrors] = useState<EduErrors[]>([{}]);

  // --- Layout DOM Focus Refs ---
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);
  const projectInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const achievementInputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  
  const eduRefs = useRef<Array<{ degree: HTMLInputElement | null; institution: HTMLInputElement | null; year: HTMLInputElement | null }>>([]);
  const ensureEduRef = (i: number) => {
    if (!eduRefs.current[i]) eduRefs.current[i] = { degree: null, institution: null, year: null };
    return eduRefs.current[i];
  };

  // --- React Hook Form Setup ---
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GenerateForm>({
    resolver: zodResolver(generateSchema),
    mode: "onTouched",
    defaultValues: {
      experience_level: "Junior",
      skills: [],
      projects: [],
      certifications: [],
      achievements: [],
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const skills = watch("skills") ?? [];
  const projects = watch("projects") ?? [];
  const certifications = watch("certifications") ?? [];
  const achievements = watch("achievements") ?? [];

  const nameReg = register("name");
  const emailReg = register("email");
  const roleReg = register("role");

  // ---------------------------------------------------------------------------
  // Tag/Array Manipulators
  // ---------------------------------------------------------------------------
  const addSkill = useCallback(() => {
    const val = skillInput.trim();
    if (!val) {
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
  }, [skillInput, skills, setValue]);

  const removeSkill = (i: number) =>
    setValue("skills", skills.filter((_, idx) => idx !== i), { shouldValidate: true });

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
    if (val.length < 2) return;
    const current = (watch(field) ?? []) as string[];
    setValue(field, [...current, val], { shouldValidate: true });
    clear();
  };

  const removeTag = (field: TagField, i: number) => {
    const current = (watch(field) ?? []) as string[];
    setValue(field, current.filter((_, idx) => idx !== i));
  };

  // ---------------------------------------------------------------------------
  // Education Manual Handlers
  // ---------------------------------------------------------------------------
  const updateEdu = (i: number, field: keyof EduEntry, value: string) => {
    setEducationEntries((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
    setEduErrors((prev) => {
      const copy = [...prev];
      if (!copy[i]) copy[i] = {};
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

  const validateAllEdu = () => {
    let ok = true;
    educationEntries.forEach((e, i) => { if (!validateEduEntry(e, i)) ok = false; });
    return ok;
  };

  // ---------------------------------------------------------------------------
  // Submission Pipeline
  // ---------------------------------------------------------------------------
  const onSubmit = async (data: GenerateForm) => {
    if (!validateAllEdu()) return;

    try {
      const validEduEntry = educationEntries[0];
      const hasEducation = validEduEntry && (validEduEntry.degree.trim() || validEduEntry.institution.trim());

      const cleanEducation = hasEducation 
        ? {
            degree: validEduEntry.degree.trim(),
            institution: validEduEntry.institution.trim(),
            graduation_year: validEduEntry.graduation_year ? String(validEduEntry.graduation_year).trim() : undefined,
          }
        : undefined;

      const cleanStringArray = (arr: any[]) => {
        return Array.from(arr || [])
          .map((item) => (typeof item === "object" && item !== null ? String((item as any).value || (item as any).name || "") : String(item)))
          .map((str) => str.trim())
          .filter((str) => str.length > 0);
      };

      const purePayload: any = {
        name: data.name.trim() || user?.name || "",
        email: data.email.trim() || user?.email || "",
        role: data.role.trim(),
        experience_level: data.experience_level,
        skills: cleanStringArray(data.skills),
        projects: cleanStringArray(data.projects || []),
        certifications: cleanStringArray(data.certifications || []),
        achievements: cleanStringArray(data.achievements || []),
        education: cleanEducation, 
      };

      const result = await generateMutation.mutateAsync(purePayload);
      
      setGeneratedResume({ uuid: result.uuid, content: result.content });
      toast.success("Resume generated successfully!");
      router.push(`/resume/${result.uuid}`);
    } catch (err) {
      toast.error(parseBackendError(err), { duration: 6000 });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalSkills = [...skills];
    if (skillInput.trim()) {
      const val = skillInput.trim();
      if (val.length >= 2) {
        finalSkills.push(val);
        setValue("skills", finalSkills, { shouldValidate: false });
        setSkillInput("");
        setSkillError("");
      }
    }

    if (projectInput.trim() && projectInput.trim().length >= 2) {
      setValue("projects", [...((watch("projects") ?? []) as string[]), projectInput.trim()], { shouldValidate: false });
      setProjectInput("");
    }

    if (certInput.trim() && certInput.trim().length >= 2) {
      setValue("certifications", [...((watch("certifications") ?? []) as string[]), certInput.trim()], { shouldValidate: false });
      setCertInput("");
    }

    if (achievementInput.trim() && achievementInput.trim().length >= 2) {
      setValue("achievements", [...((watch("achievements") ?? []) as string[]), achievementInput.trim()], { shouldValidate: false });
      setAchievementInput("");
    }

    handleSubmit(onSubmit)(e);
  };

  // ---------------------------------------------------------------------------
  // PDF Export Engine
  // ---------------------------------------------------------------------------
  const handleDownloadPDF = async () => {
    if (!generatedResume) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("resume-preview");
    if (element) html2pdf().from(element).save("resume.pdf");
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto py-4 relative">
        <AIProcessingIndicator stages={AI_STAGES} isVisible={generateMutation.isPending} />

        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Generate Resume
          </h1>
          <p className="text-text-secondary mt-2 text-base">
            Fill in your raw career milestones and let AI format your background perfectly for ATS tracking.
          </p>
        </div>

        {/* ── Main Workspace ── */}
        <div className="space-y-8">
          <div className={`rounded-2xl border border-border bg-surface p-6 md:p-8 shadow-sm transition-all duration-300 ${
            generateMutation.isPending ? "opacity-30 pointer-events-none scale-[0.99]" : ""
          }`}>
            <form onSubmit={handleFormSubmit} className="space-y-6">

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
                    ref={(el) => { nameReg.ref(el); (nameRef as any).current = el; }}
                    placeholder={user?.name || "Your legal name"}
                    className={inputCls(!!errors.name)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); emailRef.current?.focus(); } }}
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
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); roleRef.current?.focus(); } }}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-danger font-medium">{errors.email.message}</p>}
                </div>
              </div>

              {/* Target Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-text-secondary mb-2">
                  Target Role
                </label>
                <input
                  id="role"
                  autoComplete="organization-title"
                  {...roleReg}
                  ref={(el) => { roleReg.ref(el); (roleRef as any).current = el; }}
                  placeholder="e.g. Senior Software Engineer"
                  className={inputCls(!!errors.role)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); skillInputRef.current?.focus(); } }}
                />
                {errors.role && <p className="mt-1.5 text-xs text-danger font-medium">{errors.role.message}</p>}
              </div>

              {/* Experience Level Selector */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Experience Level</label>
                <div className="flex flex-wrap gap-2.5">
                  {experienceLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setValue("experience_level", level)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                        watch("experience_level") === level
                          ? "bg-accent text-black shadow-[0_4px_12px_rgba(0,194,255,0.2)]"
                          : "bg-background border border-border text-text-secondary hover:text-text-primary hover:border-border-bright"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills Tag Management */}
              <div>
                <label htmlFor="skills-input" className="block text-sm font-medium text-text-secondary mb-2">
                  Skills
                </label>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm bg-accent/10 text-accent border border-accent/20 font-medium">
                        {skill}
                        <button type="button" onClick={() => removeSkill(i)} aria-label={`Remove ${skill}`} className="hover:text-white transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2.5">
                  <input
                    id="skills-input"
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
                    placeholder="Type a core competence skill and press Enter"
                    className={inputCls(!!skillError || !!errors.skills)}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-3 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 transition-colors flex items-center justify-center shrink-0"
                    aria-label="Add skill"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {skillError
                  ? <p className="mt-1.5 text-xs text-danger font-medium">{skillError}</p>
                  : errors.skills && <p className="mt-1.5 text-xs text-danger font-medium">{errors.skills.message}</p>
                }
              </div>

              {/* Education Section */}
              <div>
                <label className="block text-base font-bold text-text-primary mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-text-tertiary" />
                  Education Profile <span className="text-sm font-normal text-accent">(optional — fill both or leave empty)</span>
                </label>
                <div className="space-y-3">
                  {educationEntries.slice(0, 1).map((entry, i) => {
                    const refs = ensureEduRef(i);
                    const errs = eduErrors[i] ?? {};
                    return (
                      <div key={i} className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <input
                              ref={(el) => { refs.degree = el; }}
                              value={entry.degree}
                              placeholder="Degree / Major"
                              onChange={(e) => updateEdu(i, "degree", e.target.value)}
                              onBlur={() => validateEduEntry(entry, i)}
                              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); refs.institution?.focus(); } }}
                              className={inputCls(!!errs.degree)}
                            />
                            {errs.degree && <p className="mt-1.5 text-xs text-danger font-medium">{errs.degree}</p>}
                          </div>
                          <div>
                            <input
                              ref={(el) => { refs.institution = el; }}
                              value={entry.institution}
                              placeholder="University / School Institution"
                              onChange={(e) => updateEdu(i, "institution", e.target.value)}
                              onBlur={() => validateEduEntry(entry, i)}
                              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); refs.year?.focus(); } }}
                              className={inputCls(!!errs.institution)}
                            />
                            {errs.institution && <p className="mt-1.5 text-xs text-danger font-medium">{errs.institution}</p>}
                          </div>
                        </div>
                        <input
                          ref={(el) => { refs.year = el; }}
                          type="text"
                          value={entry.graduation_year}
                          placeholder="Graduation Year (e.g. 2025)"
                          onChange={(e) => updateEdu(i, "graduation_year", e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              projectInputRef.current?.focus();
                            }
                          }}
                          className={inputCls(false)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Projects Array Input */}
              <div>
                <label htmlFor="projects-input" className="block text-sm font-medium text-text-secondary mb-2">Projects</label>
                {projects.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {projects.map((project, i) => (
                      <div key={i} className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2.5">
                        <span className="flex-1 text-base text-text-primary">{project}</span>
                        <button type="button" onClick={() => removeTag("projects", i)} className="text-text-tertiary hover:text-danger transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2.5">
                  <input
                    id="projects-input"
                    ref={projectInputRef}
                    value={projectInput}
                    onChange={(e) => setProjectInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("projects", projectInput, () => setProjectInput(""), certInputRef);
                      }
                    }}
                    placeholder="Describe a notable portfolio product piece..."
                    className={inputCls(false)}
                  />
                  <button
                    type="button"
                    onClick={() => addTag("projects", projectInput, () => setProjectInput(""), certInputRef)}
                    className="px-4 py-3 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 transition-colors flex items-center justify-center shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Certifications Array Input */}
              <div>
                <label htmlFor="certs-input" className="block text-sm font-medium text-text-secondary mb-2">Certifications</label>
                {certifications.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {certifications.map((getCert, i) => (
                      <div key={i} className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2.5">
                        <span className="flex-1 text-base text-text-primary">{getCert}</span>
                        <button type="button" onClick={() => removeTag("certifications", i)} className="text-text-tertiary hover:text-danger transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2.5">
                  <input
                    id="certs-input"
                    ref={certInputRef}
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("certifications", certInput, () => setCertInput(""), achievementInputRef);
                      }
                    }}
                    placeholder="AWS, Scrum Master, or equivalent validations..."
                    className={inputCls(false)}
                  />
                  <button
                    type="button"
                    onClick={() => addTag("certifications", certInput, () => setCertInput(""), achievementInputRef)}
                    className="px-4 py-3 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 transition-colors flex items-center justify-center shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Achievements Array Input */}
              <div>
                <label htmlFor="achieve-input" className="block text-sm font-medium text-text-secondary mb-2">Achievements</label>
                {achievements.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {achievements.map((ach, i) => (
                      <div key={i} className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2.5">
                        <span className="flex-1 text-base text-text-primary">{ach}</span>
                        <button type="button" onClick={() => removeTag("achievements", i)} className="text-text-tertiary hover:text-danger transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2.5">
                  <input
                    id="achieve-input"
                    ref={achievementInputRef}
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("achievements", achievementInput, () => setAchievementInput(""), submitRef);
                      }
                    }}
                    placeholder="e.g. Scaled platform coverage metrics by 40%..."
                    className={inputCls(false)}
                  />
                  <button
                    type="button"
                    onClick={() => addTag("achievements", achievementInput, () => setAchievementInput(""), submitRef)}
                    className="px-4 py-3 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 transition-colors flex items-center justify-center shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

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
                      Generate Resume
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── Preview Display Container ── */}
          {generatedResume && (
            <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 shadow-sm space-y-6">
              <div id="resume-preview" className="overflow-hidden rounded-xl border border-border/60">
                <ResumePreview content={generatedResume.content} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent text-black text-sm font-bold hover:bg-accent-dark active:scale-[0.99] transition-all shadow-[0_4px_12px_rgba(0,194,255,0.25)]"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button
                  onClick={() => router.push(`/resume/${generatedResume.uuid}`)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border bg-background text-text-secondary hover:text-text-primary hover:border-border-bright active:scale-[0.99] transition-all text-sm font-bold"
                >
                  <Save className="w-4 h-4" /> Save & View
                </button>
                <button
                  onClick={() => router.push(`/resume/${generatedResume.uuid}/analysis`)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border bg-background text-text-secondary hover:text-accent hover:border-accent/30 active:scale-[0.99] transition-all text-sm font-bold"
                >
                  <BarChart3 className="w-4 h-4" /> Analyze Score
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}