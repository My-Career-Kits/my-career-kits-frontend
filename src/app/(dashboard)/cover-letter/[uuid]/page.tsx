"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Download, BarChart3, Trash2 } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";
import CoverLetterPreview from "@/components/cover-letter/CoverLetterPreview";
import CoverLetterEditForm from "@/components/cover-letter/CoverLetterEditForm";
import ScoreRing from "@/components/shared/ScoreRing";
import SkeletonCard from "@/components/shared/SkeletonCard";
import ErrorAlert from "@/components/shared/ErrorAlert";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
import { useCoverLetterDetail } from "@/hooks/useCoverLetterDetail";
import { useCoverLetterAnalysis } from "@/hooks/useCoverLetterAnalysis";
import { useUpdateCoverLetter } from "@/hooks/useUpdateCoverLetter";
import { useDeleteCoverLetter } from "@/hooks/useDeleteCoverLetter";
import type { CoverLetterContent } from "@/types";

export default function CoverLetterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const uuid = params.uuid as string;

  const { data: coverLetter, isLoading, isError, refetch } = useCoverLetterDetail(uuid);
  // Fetch existing analysis separately — same pattern as ResumeDetailPage
  const { query: analysisQuery } = useCoverLetterAnalysis(uuid);
  const analysis = analysisQuery.data ?? null;

  const updateCoverLetter = useUpdateCoverLetter();
  const deleteCoverLetter = useDeleteCoverLetter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (content: CoverLetterContent) => {
    if (!coverLetter) return;
    try {
      await updateCoverLetter.mutateAsync({
        uuid,
        data: {
          title: coverLetter.title,
          company_name: coverLetter.company_name,
          job_title: coverLetter.job_title,
          content,
        },
      });
      setIsEditing(false);
    } catch {
      // Toast handled by hook's onError
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCoverLetter.mutateAsync(uuid);
      router.push("/cover-letter");
    } catch {
      setIsDeleting(false);
    }
  };

  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("cover-letter-preview-detail");
    if (element) {
      html2pdf().from(element).save(`${coverLetter?.title || "cover-letter"}.pdf`);
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

  if (isError || !coverLetter) {
    return (
      <PageTransition>
        <div className="max-w-6xl mx-auto">
          <ErrorAlert message="Failed to load cover letter" onRetry={refetch} />
        </div>
      </PageTransition>
    );
  }

  // A previous analysis exists if we fetched one OR the detail says last_analysis_at is set
  const hasAnalysis = !!analysis || !!coverLetter.last_analysis_at;

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left — Preview (60%) ── */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary">Cover Letter</h2>
                {!isEditing && (
                  <div className="flex items-center gap-2">
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
                  </div>
                )}
              </div>

              {isEditing ? (
                <CoverLetterEditForm
                  content={coverLetter.content}
                  onSave={handleSave}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <div id="cover-letter-preview-detail">
                  <CoverLetterPreview content={coverLetter.content} />
                </div>
              )}
            </div>
          </div>

          {/* ── Right — Sidebar (40%) ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Details */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-tertiary">Title</p>
                  <p className="text-sm text-text-primary">{coverLetter.title}</p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">Company</p>
                  <p className="text-sm text-text-primary">{coverLetter.company_name}</p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">Job Title</p>
                  <p className="text-sm text-text-primary">{coverLetter.job_title}</p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">Created</p>
                  <p className="text-sm text-text-primary">
                    {new Date(coverLetter.created_at).toLocaleDateString()}
                  </p>
                </div>
                {coverLetter.last_analysis_at && (
                  <div>
                    <p className="text-xs text-text-tertiary">Last Analysis</p>
                    <p className="text-sm text-text-primary">
                      {new Date(coverLetter.last_analysis_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis score panel — only when analysis data is available */}
            {analysis && (
              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Latest Analysis</h3>
                <div className="flex justify-center mb-4">
                  <ScoreRing score={analysis.score} size={120} strokeWidth={8} />
                </div>
                {analysis.improvements?.slice(0, 2).map((imp, i) => (
                  <p key={i} className="text-xs text-text-secondary mb-1">• {imp}</p>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
              <button
                onClick={() => router.push(`/cover-letter/${uuid}/analysis`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
              >
                <BarChart3 className="w-4 h-4" />
                {hasAnalysis ? "Re-analyze" : "Run Analysis"}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-800 hover:bg-red-950 text-red-400 text-sm font-medium transition-all disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete Cover Letter"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={coverLetter.title}
      />
    </PageTransition>
  );
}