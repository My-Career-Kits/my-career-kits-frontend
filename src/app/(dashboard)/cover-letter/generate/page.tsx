// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Download, Save, BarChart3, Loader2 } from "lucide-react";
// import PageTransition from "@/components/shared/PageTransition";
// import AIProcessingIndicator from "@/components/shared/AIProcessingIndicator";
// import CoverLetterPreview from "@/components/cover-letter/CoverLetterPreview";
// import { useGenerateCoverLetter } from "@/hooks/useGenerateCoverLetter";
// import { useResumeList } from "@/hooks/useResumeList";
// import { useAuth } from "@/hooks/useAuth";
// import type { CoverLetterContent } from "@/types";
// import { parseBackendError } from "@/lib/api";

// const generateSchema = z.object({
//   job_title: z.string().min(1, "Job title is required"),
//   company_name: z.string().min(1, "Company name is required"),
//   job_description: z.string().min(100, "Job description must be at least 100 characters"),
//   resume_uuid: z.string().optional(),
//   name: z.string().optional(),
//   email: z.string().email().optional(),
// });

// type GenerateForm = z.infer<typeof generateSchema>;

// const AI_STAGES = [
//   "Reading the job description...",
//   "Matching your profile...",
//   "Crafting your letter...",
//   "Polishing the tone...",
// ];

// export default function CoverLetterGeneratePage() {
//   const { user } = useAuth();
//   const generateMutation = useGenerateCoverLetter();
//   const { data: resumes } = useResumeList();
//   const [generatedLetter, setGeneratedLetter] = useState<{
//     uuid: string;
//     content: CoverLetterContent;
//   } | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<GenerateForm>({
//     resolver: zodResolver(generateSchema),
//     defaultValues: {
//       name: user?.name || "",
//       email: user?.email || "",
//     },
//   });

//   const onSubmit = async (data: GenerateForm) => {
//     setError(null);
//     try {
//       const result = await generateMutation.mutateAsync(data as never);
//       setGeneratedLetter({ uuid: result.uuid, content: result.content });
//     } catch (err) {
//       setError(parseBackendError(err));
//     }
//   };

//   const handleDownloadPDF = async () => {
//     if (!generatedLetter) return;
//     const html2pdf = (await import("html2pdf.js")).default;
//     const element = document.getElementById("cover-letter-preview");
//     if (element) {
//       html2pdf().from(element).save("cover-letter.pdf");
//     }
//   };

//   return (
//     <PageTransition>
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-text-primary">Generate Cover Letter</h1>
//           <p className="text-text-secondary mt-1">Tailor a cover letter to a specific job posting</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Form Panel */}
//           <div className={`rounded-xl border border-border bg-surface p-6 ${generatedLetter ? "opacity-50 pointer-events-none" : ""}`}>
//             {error && (
//               <div className="mb-4 p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm text-text-secondary mb-1.5">Name</label>
//                   <input
//                     {...register("name")}
//                     className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)]"
//                     placeholder={user?.name || "Your name"}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-text-secondary mb-1.5">Email</label>
//                   <input
//                     {...register("email")}
//                     className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)]"
//                     placeholder={user?.email || "your@email.com"}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm text-text-secondary mb-1.5">Job Title</label>
//                 <input
//                   {...register("job_title")}
//                   className={`w-full bg-background border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] ${
//                     errors.job_title ? "border-danger" : "border-border"
//                   }`}
//                   placeholder="e.g. Senior Software Engineer"
//                 />
//                 {errors.job_title && <p className="mt-1 text-xs text-danger">{errors.job_title.message}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm text-text-secondary mb-1.5">Company Name</label>
//                 <input
//                   {...register("company_name")}
//                   className={`w-full bg-background border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] ${
//                     errors.company_name ? "border-danger" : "border-border"
//                   }`}
//                   placeholder="e.g. Google"
//                 />
//                 {errors.company_name && <p className="mt-1 text-xs text-danger">{errors.company_name.message}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm text-text-secondary mb-1.5">Job Description</label>
//                 <textarea
//                   {...register("job_description")}
//                   rows={6}
//                   className={`w-full bg-background border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] resize-none ${
//                     errors.job_description ? "border-danger" : "border-border"
//                   }`}
//                   placeholder="Paste the job description here (minimum 100 characters)"
//                 />
//                 {errors.job_description && <p className="mt-1 text-xs text-danger">{errors.job_description.message}</p>}
//               </div>

//               {resumes && resumes.length > 0 && (
//                 <div>
//                   <label className="block text-sm text-text-secondary mb-1.5">Attach Resume (optional)</label>
//                   <select
//                     {...register("resume_uuid")}
//                     className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)]"
//                   >
//                     <option value="">None</option>
//                     {resumes.map((r) => (
//                       <option key={r.id} value={r.id}>{r.title}</option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={generateMutation.isPending}
//                 className="w-full py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-all shadow-[0_0_20px_rgba(0,194,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {generateMutation.isPending ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     Generating...
//                   </>
//                 ) : (
//                   "Generate Cover Letter"
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* Preview Panel */}
//           <div className="relative rounded-xl border border-border bg-surface p-6 min-h-[600px]">
//             <AIProcessingIndicator stages={AI_STAGES} isVisible={generateMutation.isPending} />

//             {!generatedLetter && !generateMutation.isPending && (
//               <div className="h-full flex items-center justify-center text-text-tertiary">
//                 <p className="text-sm">Your cover letter preview will appear here</p>
//               </div>
//             )}

//             {generatedLetter && (
//               <div className="space-y-4">
//                 <div id="cover-letter-preview">
//                   <CoverLetterPreview content={generatedLetter.content} />
//                 </div>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleDownloadPDF}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
//                   >
//                     <Download className="w-4 h-4" />
//                     Download PDF
//                   </button>
//                   <button
//                     onClick={() => window.location.href = `/cover-letter/${generatedLetter.uuid}`}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-bright transition-all"
//                   >
//                     <Save className="w-4 h-4" />
//                     Save & View
//                   </button>
//                   <button
//                     onClick={() => window.location.href = `/cover-letter/${generatedLetter.uuid}/analysis`}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-accent hover:border-accent/30 transition-all"
//                   >
//                     <BarChart3 className="w-4 h-4" />
//                     Analyze
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












// window.location.href










// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Download, Save, BarChart3, Loader2 } from "lucide-react";
// import PageTransition from "@/components/shared/PageTransition";
// import AIProcessingIndicator from "@/components/shared/AIProcessingIndicator";
// import CoverLetterPreview from "@/components/cover-letter/CoverLetterPreview";
// import { useGenerateCoverLetter } from "@/hooks/useGenerateCoverLetter";
// import { useResumeList } from "@/hooks/useResumeList";
// import { useAuth } from "@/hooks/useAuth";
// import type { CoverLetterContent } from "@/types";
// import { parseBackendError } from "@/lib/api";

// const generateSchema = z.object({
//   job_title: z.string().min(1, "Job title is required"),
//   company_name: z.string().min(1, "Company name is required"),
//   job_description: z.string().min(100, "Job description must be at least 100 characters"),
//   resume_uuid: z.string().optional(),
//   name: z.string().optional(),
//   email: z.string().email().optional(),
// });

// type GenerateForm = z.infer<typeof generateSchema>;

// const AI_STAGES = [
//   "Reading the job description...",
//   "Matching your profile...",
//   "Crafting your letter...",
//   "Polishing the tone...",
// ];

// export default function CoverLetterGeneratePage() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const generateMutation = useGenerateCoverLetter();
//   const { data: resumes } = useResumeList();
//   const [generatedLetter, setGeneratedLetter] = useState<{
//     uuid: string;
//     content: CoverLetterContent;
//   } | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<GenerateForm>({
//     resolver: zodResolver(generateSchema),
//     defaultValues: {
//       name: user?.name || "",
//       email: user?.email || "",
//     },
//   });

//   const onSubmit = async (data: GenerateForm) => {
//     setError(null);
//     try {
//       const result = await generateMutation.mutateAsync(data as never);
//       setGeneratedLetter({ uuid: result.uuid, content: result.content });
//     } catch (err) {
//       setError(parseBackendError(err));
//     }
//   };

//   const handleDownloadPDF = async () => {
//     if (!generatedLetter) return;
//     const html2pdf = (await import("html2pdf.js")).default;
//     const element = document.getElementById("cover-letter-preview");
//     if (element) {
//       html2pdf().from(element).save("cover-letter.pdf");
//     }
//   };

//   return (
//     <PageTransition>
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-text-primary">Generate Cover Letter</h1>
//           <p className="text-text-secondary mt-1">Tailor a cover letter to a specific job posting</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Form Panel */}
//           <div className={`rounded-xl border border-border bg-surface p-6 ${generatedLetter ? "opacity-50 pointer-events-none" : ""}`}>
//             {error && (
//               <div className="mb-4 p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="name" className="block text-sm text-text-secondary mb-1.5">Name</label>
//                   <input
//                     id="name"
//                     name="name"
//                     autoComplete="name"
//                     {...register("name")}
//                     className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)]"
//                     placeholder={user?.name || "Your name"}
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="email" className="block text-sm text-text-secondary mb-1.5">Email</label>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     {...register("email")}
//                     className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)]"
//                     placeholder={user?.email || "your@email.com"}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="job_title" className="block text-sm text-text-secondary mb-1.5">Job Title</label>
//                 <input
//                   id="job_title"
//                   name="job_title"
//                   autoComplete="organization-title"
//                   {...register("job_title")}
//                   className={`w-full bg-background border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] ${
//                     errors.job_title ? "border-danger" : "border-border"
//                   }`}
//                   placeholder="e.g. Senior Software Engineer"
//                 />
//                 {errors.job_title && <p className="mt-1 text-xs text-danger">{errors.job_title.message}</p>}
//               </div>

//               <div>
//                 <label htmlFor="company_name" className="block text-sm text-text-secondary mb-1.5">Company Name</label>
//                 <input
//                   id="company_name"
//                   name="company_name"
//                   autoComplete="organization"
//                   {...register("company_name")}
//                   className={`w-full bg-background border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] ${
//                     errors.company_name ? "border-danger" : "border-border"
//                   }`}
//                   placeholder="e.g. Google"
//                 />
//                 {errors.company_name && <p className="mt-1 text-xs text-danger">{errors.company_name.message}</p>}
//               </div>

//               <div>
//                 <label htmlFor="job_description" className="block text-sm text-text-secondary mb-1.5">Job Description</label>
//                 <textarea
//                   id="job_description"
//                   name="job_description"
//                   {...register("job_description")}
//                   rows={6}
//                   className={`w-full bg-background border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] resize-none ${
//                     errors.job_description ? "border-danger" : "border-border"
//                   }`}
//                   placeholder="Paste the job description here (minimum 100 characters)"
//                 />
//                 {errors.job_description && <p className="mt-1 text-xs text-danger">{errors.job_description.message}</p>}
//               </div>

//               {resumes && resumes.length > 0 && (
//                 <div>
//                   <label htmlFor="resume_uuid" className="block text-sm text-text-secondary mb-1.5">Attach Resume (optional)</label>
//                   <select
//                     id="resume_uuid"
//                     name="resume_uuid"
//                     {...register("resume_uuid")}
//                     className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)]"
//                   >
//                     <option value="">None</option>
//                     {resumes.map((r) => (
//                       <option key={r.uuid} value={r.uuid}>{r.title}</option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={generateMutation.isPending}
//                 className="w-full py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-all shadow-[0_0_20px_rgba(0,194,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {generateMutation.isPending ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     Generating...
//                   </>
//                 ) : (
//                   "Generate Cover Letter"
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* Preview Panel */}
//           <div className="relative rounded-xl border border-border bg-surface p-6 min-h-[600px]">
//             <AIProcessingIndicator stages={AI_STAGES} isVisible={generateMutation.isPending} />

//             {!generatedLetter && !generateMutation.isPending && (
//               <div className="h-full flex items-center justify-center text-text-tertiary">
//                 <p className="text-sm">Your cover letter preview will appear here</p>
//               </div>
//             )}

//             {generatedLetter && (
//               <div className="space-y-4">
//                 <div id="cover-letter-preview">
//                   <CoverLetterPreview content={generatedLetter.content} />
//                 </div>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleDownloadPDF}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
//                   >
//                     <Download className="w-4 h-4" />
//                     Download PDF
//                   </button>
//                   <button
//                     onClick={() => router.push(`/cover-letter/${generatedLetter.uuid}`)}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-bright transition-all"
//                   >
//                     <Save className="w-4 h-4" />
//                     Save & View
//                   </button>
//                   <button
//                     onClick={() => router.push(`/cover-letter/${generatedLetter.uuid}/analysis`)}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-accent hover:border-accent/30 transition-all"
//                   >
//                     <BarChart3 className="w-4 h-4" />
//                     Analyze
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

import { useRef } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Download, Save, BarChart3, Loader2 } from "lucide-react";
import { toast } from "sonner";
import PageTransition from "@/components/shared/PageTransition";
import AIProcessingIndicator from "@/components/shared/AIProcessingIndicator";
import CoverLetterPreview from "@/components/cover-letter/CoverLetterPreview";
import { useGenerateCoverLetter } from "@/hooks/useGenerateCoverLetter";
import { useResumeList } from "@/hooks/useResumeList";
import { useAuth } from "@/hooks/useAuth";
import type { CoverLetterContent } from "@/types";
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
  `w-full bg-background border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] transition-colors ${
    hasError ? "border-danger" : "border-border"
  }`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function CoverLetterGeneratePage() {
  const router = useRouter();
  const { user } = useAuth();
  const generateMutation = useGenerateCoverLetter();
  const { data: resumes } = useResumeList();
  const [generatedLetter, setGeneratedLetter] = useState<{
    uuid: string;
    content: CoverLetterContent;
  } | null>(null);

  // --- focus refs for Enter-key navigation ---
  const nameRef    = useRef<HTMLInputElement>(null);
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
  // Submit
  // ---------------------------------------------------------------------------
  const onSubmit = async (data: GenerateForm) => {
    try {
      const result = await generateMutation.mutateAsync({
        ...data,
        resume_uuid: data.resume_uuid || undefined,
      } as never);
      setGeneratedLetter({ uuid: result.uuid, content: result.content });
    } catch (err) {
      toast.error(parseBackendError(err), { duration: 6000 });
    }
  };

  // ---------------------------------------------------------------------------
  // PDF download
  // ---------------------------------------------------------------------------
  const handleDownloadPDF = async () => {
    if (!generatedLetter) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("cover-letter-preview");
    if (element) html2pdf().from(element).save("cover-letter.pdf");
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Generate Cover Letter</h1>
          <p className="text-text-secondary mt-1">Tailor a cover letter to a specific job posting</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Form Panel ── */}
          <div className={`rounded-xl border border-border bg-surface p-6 ${generatedLetter ? "opacity-50 pointer-events-none" : ""}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-text-secondary mb-1.5">Name</label>
                  <input
                    id="name"
                    autoComplete="name"
                    {...nameReg}
                    ref={(el) => { nameReg.ref(el); (nameRef as any).current = el; }}
                    placeholder={user?.name || "Your name"}
                    className={inputCls(!!errors.name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); emailRef.current?.focus(); }
                    }}
                  />
                  {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-text-secondary mb-1.5">Email</label>
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
                  {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
                </div>
              </div>

              {/* Job Title */}
              <div>
                <label htmlFor="job_title" className="block text-sm text-text-secondary mb-1.5">Job Title</label>
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
                {errors.job_title && <p className="mt-1 text-xs text-danger">{errors.job_title.message}</p>}
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="company_name" className="block text-sm text-text-secondary mb-1.5">Company Name</label>
                <input
                  id="company_name"
                  autoComplete="organization"
                  {...companyReg}
                  ref={(el) => { companyReg.ref(el); (companyRef as any).current = el; }}
                  placeholder="e.g. Google"
                  className={inputCls(!!errors.company_name)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); descRef.current?.focus(); }
                  }}
                />
                {errors.company_name && <p className="mt-1 text-xs text-danger">{errors.company_name.message}</p>}
              </div>

              {/* Job Description — textarea: Enter adds newline naturally, Tab → submit */}
              <div>
                <label htmlFor="job_description" className="block text-sm text-text-secondary mb-1.5">
                  Job Description
                  <span className="text-text-tertiary text-xs ml-1">(min. 100 characters — Tab to reach Generate)</span>
                </label>
                <textarea
                  id="job_description"
                  {...descReg}
                  ref={(el) => { descReg.ref(el); (descRef as any).current = el; }}
                  rows={6}
                  placeholder="Paste the job description here"
                  className={`w-full bg-background border rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] resize-none transition-colors ${
                    errors.job_description ? "border-danger" : "border-border"
                  }`}
                  onKeyDown={(e) => {
                    // Tab (without Shift) moves focus to submit button
                    if (e.key === "Tab" && !e.shiftKey && !resumes?.length) {
                      e.preventDefault();
                      submitRef.current?.focus();
                    }
                  }}
                />
                {errors.job_description && (
                  <p className="mt-1 text-xs text-danger">{errors.job_description.message}</p>
                )}
              </div>

              {/* Resume picker — only shown when resumes exist */}
              {resumes && resumes.length > 0 && (
                <div>
                  <label htmlFor="resume_uuid" className="block text-sm text-text-secondary mb-1.5">
                    Attach Resume <span className="text-text-tertiary text-xs">(optional)</span>
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

              <button
                ref={submitRef}
                type="submit"
                disabled={generateMutation.isPending}
                className="w-full py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-all shadow-[0_0_20px_rgba(0,194,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generateMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
                ) : (
                  "Generate Cover Letter"
                )}
              </button>
            </form>
          </div>

          {/* ── Preview Panel ── */}
          <div className="relative rounded-xl border border-border bg-surface p-6 min-h-[600px]">
            <AIProcessingIndicator stages={AI_STAGES} isVisible={generateMutation.isPending} />

            {!generatedLetter && !generateMutation.isPending && (
              <div className="h-full flex items-center justify-center text-text-tertiary">
                <p className="text-sm">Your cover letter preview will appear here</p>
              </div>
            )}

            {generatedLetter && (
              <div className="space-y-4">
                <div id="cover-letter-preview">
                  <CoverLetterPreview content={generatedLetter.content} />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
                  >
                    <Download className="w-4 h-4" />Download PDF
                  </button>
                  <button
                    onClick={() => router.push(`/cover-letter/${generatedLetter.uuid}`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-bright transition-all"
                  >
                    <Save className="w-4 h-4" />Save & View
                  </button>
                  <button
                    onClick={() => router.push(`/cover-letter/${generatedLetter.uuid}/analysis`)}
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