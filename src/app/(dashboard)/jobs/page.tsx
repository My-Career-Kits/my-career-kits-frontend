// "use client";

// import PageTransition from "@/components/shared/PageTransition";
// import JobSearchBar from "@/components/jobs/JobSearchBar";
// import JobCard from "@/components/jobs/JobCard";
// import SkeletonList from "@/components/shared/SkeletonList";
// import EmptyState from "@/components/shared/EmptyState";
// import ErrorAlert from "@/components/shared/ErrorAlert";
// import { useJobSearch } from "@/hooks/useJobSearch";

// export default function JobsPage() {
//   const { query, inputValues, setInputValues, params } = useJobSearch();

//   return (
//     <PageTransition>
//       <div className="max-w-5xl mx-auto space-y-6">
//         <div>
//           <h1 className="text-2xl font-bold text-text-primary">Job Search</h1>
//           <p className="text-text-secondary mt-1">Find your next opportunity</p>
//         </div>

//         <JobSearchBar
//           keywords={inputValues.keywords}
//           location={inputValues.location}
//           onKeywordsChange={(v) => setInputValues((prev) => ({ ...prev, keywords: v }))}
//           onLocationChange={(v) => setInputValues((prev) => ({ ...prev, location: v }))}
//         />

//         {query.isError && (
//           <ErrorAlert message="Failed to search jobs" onRetry={() => query.refetch()} />
//         )}

//         {query.isLoading && params.keywords && params.location && (
//           <SkeletonList count={6} />
//         )}

//         {query.data && query.data.results.length > 0 && (
//           <div className="space-y-4">
//             <p className="text-sm text-text-secondary">
//               {query.data.total_results} results for &quot;{query.data.keywords}&quot; in {query.data.location}
//             </p>
//             <div className="grid grid-cols-1 gap-4">
//               {query.data.results.map((job) => (
//                 <JobCard key={job.job_id} job={job} />
//               ))}
//             </div>
//           </div>
//         )}

//         {query.data && query.data.results.length === 0 && params.keywords && params.location && (
//           <EmptyState
//             title="No jobs found"
//             description={`No jobs found for "${params.keywords}" in "${params.location}". Try broadening your search.`}
//           />
//         )}
//       </div>
//     </PageTransition>
//   );
// }




"use client";
import PageTransition from "@/components/shared/PageTransition";
import JobSearchBar from "@/components/jobs/JobSearchBar";
import JobCard from "@/components/jobs/JobCard";
import SkeletonList from "@/components/shared/SkeletonList";
import EmptyState from "@/components/shared/EmptyState";
import ErrorAlert from "@/components/shared/ErrorAlert";
import { useJobSearch } from "@/hooks/useJobSearch";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function JobsPage() {
  const {
    query,
    inputValues,
    setInputValues,
    submittedParams,
    hasSearched,
    handleSearch,
    handlePageChange,
  } = useJobSearch();

  const pagination = query.data?.pagination;

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Job Search</h1>
          <p className="text-text-secondary mt-1">Find your next opportunity</p>
        </div>

        {/* search bar */}
        <JobSearchBar
          keywords={inputValues.keywords}
          location={inputValues.location}
          onKeywordsChange={(v) => setInputValues((prev) => ({ ...prev, keywords: v }))}
          onLocationChange={(v) => setInputValues((prev) => ({ ...prev, location: v }))}
          onSearch={handleSearch}
        />

        {/* error */}
        {query.isError && (
          <ErrorAlert message="Failed to search jobs" onRetry={() => query.refetch()} />
        )}

        {/* loading skeleton */}
        {query.isLoading && <SkeletonList count={6} />}

        {/* results */}
        {query.data && query.data.results.length > 0 && (
          <div className="space-y-4">

            {/* result summary */}
            <p className="text-sm text-text-secondary">
              {pagination?.total_results.toLocaleString()} results for{" "}
              <span className="text-text-primary font-medium">&quot;{query.data.keywords}&quot;</span>{" "}
              in{" "}
              <span className="text-text-primary font-medium">{query.data.location}</span>
            </p>

            {/* job cards */}
            <div className="grid grid-cols-1 gap-4">
              {query.data.results.map((job) => (
                <JobCard key={job.job_id} job={job} />
              ))}
            </div>

            {/* pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-4">

                {/* previous */}
                <button
                  onClick={() => handlePageChange(submittedParams.page - 1)}
                  disabled={!pagination.has_previous}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm text-text-secondary hover:border-border-bright hover:text-text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                {/* page numbers — show max 5 pages around current */}
                {getPageNumbers(pagination.current_page, pagination.total_pages).map((pageNum, i) =>
                  pageNum === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-text-tertiary text-sm">
                      ...
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum as number)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        pageNum === pagination.current_page
                          ? "bg-accent text-black border-accent shadow-[0_0_15px_rgba(0,194,255,0.3)]"
                          : "border-border text-text-secondary hover:border-border-bright hover:text-text-primary"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                {/* next */}
                <button
                  onClick={() => handlePageChange(submittedParams.page + 1)}
                  disabled={!pagination.has_next}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm text-text-secondary hover:border-border-bright hover:text-text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>
            )}

            {/* page info */}
            {pagination && (
              <p className="text-center text-xs text-text-tertiary">
                Page {pagination.current_page} of {pagination.total_pages}
              </p>
            )}

          </div>
        )}

        {/* no results */}
        {query.data && query.data.results.length === 0 && hasSearched && (
          <EmptyState
            title="No jobs found"
            description={`No jobs found for "${submittedParams.keywords}" in "${submittedParams.location}". Try broadening your search.`}
          />
        )}

      </div>
    </PageTransition>
  );
}

// shows smart page numbers like: 1 ... 4 5 6 ... 20
function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    // show all pages if total is small
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  // always show first page
  pages.push(1);

  if (current > 3) pages.push("...");

  // show pages around current
  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push("...");

  // always show last page
  pages.push(total);

  return pages;
}