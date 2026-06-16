"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";
import ResumeCard from "@/components/resume/ResumeCard";
import SkeletonList from "@/components/shared/SkeletonList";
import EmptyState from "@/components/shared/EmptyState";
import ErrorAlert from "@/components/shared/ErrorAlert";
import { useResumeList } from "@/hooks/useResumeList";
import { useRouter } from "next/navigation";
import { queryClient } from "@/lib/queryClient";
import { fetchResumeDetail } from "@/hooks/useResumeDetail";

export default function ResumeListPage() {
  const router = useRouter();
  const { data: resumes, isLoading, isError, refetch } = useResumeList();

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">My Resumes</h1>
            <p className="text-text-secondary mt-1">Manage and generate your resumes</p>
          </div>
          <Link
            href="/resume/generate"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
          >
            <Plus className="w-4 h-4" />
            Generate New
          </Link>
        </div>

        {isError && <ErrorAlert message="Failed to load resumes" onRetry={refetch} />}

        {isLoading ? (
          <SkeletonList count={6} />
        ) : resumes && resumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.uuid}
                resume={resume}
                onMouseEnter={() => {
                  queryClient.prefetchQuery({
                    queryKey: ["resume", resume.uuid],
                    queryFn: () => fetchResumeDetail(resume.uuid),
                    staleTime: 30 * 1000,
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No resumes yet"
            description="Get started by generating your first AI-powered resume."
            action={{
              label: "Generate your first resume",
              onClick: () => router.push("/resume/generate"),
            }}
          />
        )}
      </div>
    </PageTransition>
  );
}
