"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Download, BarChart3, Trash2 } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";
import ResumePreview from "@/components/resume/ResumePreview";
import ResumeEditForm from "@/components/resume/ResumeEditForm";
import ScoreRing from "@/components/shared/ScoreRing";
import SkeletonCard from "@/components/shared/SkeletonCard";
import ErrorAlert from "@/components/shared/ErrorAlert";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
import { useResumeDetail } from "@/hooks/useResumeDetail";
import { useUpdateResume } from "@/hooks/useUpdateResume";
import { useDeleteResume } from "@/hooks/useDeleteResume";
import type { ResumeContent } from "@/types";

export default function ResumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const uuid = params.uuid as string;
  const { data: resume, isLoading, isError, refetch } = useResumeDetail(uuid);
  const updateResume = useUpdateResume();
  const deleteResume = useDeleteResume();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (content: ResumeContent) => {
    try {
      await updateResume.mutateAsync({ uuid, data: { content } });
      // Only close the editor if the save succeeded
      setIsEditing(false);
    } catch {
      // Toast handled by hook's onError; keep editor open so user doesn't lose their changes
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteResume.mutateAsync(uuid);
      // Only navigate away if delete succeeded
      router.push("/resume");
    } catch {
      // Toast handled by hook's onError; stay on the page
      setIsDeleting(false);
    }
  };

  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("resume-preview-detail");
    if (element) {
      html2pdf().from(element).save(`${resume?.title || "resume"}.pdf`);
    }
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="max-w-6xl mx-auto">
          <SkeletonCard />
        </div>
      </PageTransition>
    );
  }

  if (isError || !resume) {
    return (
      <PageTransition>
        <div className="max-w-6xl mx-auto">
          <ErrorAlert message="Failed to load resume" onRetry={refetch} />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left - Preview (60%) */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary">Resume Preview</h2>
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-text-secondary hover:text-text-primary hover:bg-white/[0.08] transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-text-secondary hover:text-accent hover:bg-accent/10 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <ResumeEditForm
                  content={resume.content}
                  onSave={handleSave}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <div id="resume-preview-detail">
                  <ResumePreview content={resume.content} />
                </div>
              )}
            </div>
          </div>

          {/* Right - Sidebar (40%) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-tertiary">Title</p>
                  <p className="text-sm text-text-primary">{resume.title}</p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">Created</p>
                  <p className="text-sm text-text-primary">
                    {new Date(resume.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">Updated</p>
                  <p className="text-sm text-text-primary">
                    {new Date(resume.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {resume.analysis && (
              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Latest Analysis</h3>
                <div className="flex justify-center mb-4">
                  <ScoreRing score={resume.analysis.score} size={120} strokeWidth={8} />
                </div>
                {resume.analysis.improvements.slice(0, 2).map((imp, i) => (
                  <p key={i} className="text-xs text-text-secondary mb-1">• {imp}</p>
                ))}
              </div>
            )}

            <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
              <button
                onClick={() => router.push(`/resume/${uuid}/analysis`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
              >
                <BarChart3 className="w-4 h-4" />
                {resume.analysis ? "Re-analyze" : "Run ATS Analysis"}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-800 hover:bg-red-950 text-red-400 text-sm font-medium transition-all disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete Resume"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={resume.title}
      />
    </PageTransition>
  );
}

