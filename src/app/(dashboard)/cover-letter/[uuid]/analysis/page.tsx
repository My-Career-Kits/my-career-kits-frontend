"use client";
import { useParams } from "next/navigation";
import { BarChart3 } from "lucide-react";
import { toast } from "sonner";
import PageTransition from "@/components/shared/PageTransition";
import CoverLetterAnalysisPanel from "@/components/cover-letter/CoverLetterAnalysisPanel";
import AIProcessingIndicator from "@/components/shared/AIProcessingIndicator";
import EmptyState from "@/components/shared/EmptyState";
import ErrorAlert from "@/components/shared/ErrorAlert";
import { useCoverLetterAnalysis } from "@/hooks/useCoverLetterAnalysis";
import { parseBackendError } from "@/lib/api";
import type { CoverLetterAnalysis } from "@/types";

const AI_STAGES = [
  "Reading your cover letter...",
  "Checking tone and structure...",
  "Evaluating personalization...",
  "Generating feedback...",
];

export default function CoverLetterAnalysisPage() {
  const params = useParams();
  const uuid = params.uuid as string;
  const { query, mutation } = useCoverLetterAnalysis(uuid);

  // UPDATED: detect cached response and inform user
  const handleAnalyze = async () => {
  try {
    const result = await mutation.mutateAsync(uuid) as CoverLetterAnalysis & { cached?: boolean };
    if (result.cached) {
      toast.info("Your cover letter hasn't changed since the last analysis. Edit it first to get fresh results.", {
        duration: 6000,
      });
    }
  } catch (err) {
    // UPDATED: hardcoded friendly messages instead of backend errors
    const status = (err as { response?: { status: number } }).response?.status;
    if (status === 503) {
      toast.error("The AI is currently overloaded. Please wait a moment and try again.", { duration: 6000 });
    } else if (status === 502) {
      toast.error("Couldn't reach the AI service. Please check your connection and try again.", { duration: 6000 });
    } else {
      toast.error("Something went wrong. Please try again.", { duration: 5000 });
    }
  }
};

  const isAnalyzing = mutation.isPending;
  const analysis = query.data;
  const hasAnalysis = !!analysis;

  const is404 = query.isError &&
    (query.error as { response?: { status: number } }).response?.status === 404;
  const noAnalysis = (is404 || (!analysis && !query.isLoading)) && !isAnalyzing && !hasAnalysis;

  return (
    <PageTransition>
      {/* UPDATED: removed back button */}
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Cover Letter Analysis</h1>
          <p className="text-text-secondary mt-1">
            Get feedback on your cover letter's effectiveness
          </p>
        </div>

        {query.isError && !is404 && (
          <ErrorAlert message="Failed to load analysis" onRetry={() => query.refetch()} />
        )}

        {noAnalysis && (
          <EmptyState
            title="No Analysis Yet"
            description="Run an analysis to get insights on your cover letter's quality."
            action={{
              label: "Run Analysis",
              onClick: handleAnalyze,
            }}
          />
        )}

        <div className="relative rounded-xl border border-border bg-surface p-8 min-h-[400px]">
          <AIProcessingIndicator stages={AI_STAGES} isVisible={isAnalyzing} />

          {hasAnalysis && analysis && !isAnalyzing && (
            <div className="space-y-6">
              <CoverLetterAnalysisPanel analysis={analysis} />
              <div className="pt-6 border-t border-border">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)] disabled:opacity-50"
                >
                  <BarChart3 className="w-4 h-4" />
                  Re-analyze
                </button>
              </div>
            </div>
          )}

          {/* UPDATED: keep height while re-analyzing */}
          {hasAnalysis && analysis && isAnalyzing && (
            <div className="opacity-0 pointer-events-none">
              <CoverLetterAnalysisPanel analysis={analysis} />
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}