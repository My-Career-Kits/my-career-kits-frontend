// "use client";

// import Link from "next/link";
// import { Plus } from "lucide-react";
// import PageTransition from "@/components/shared/PageTransition";
// import CoverLetterCard from "@/components/cover-letter/CoverLetterCard";
// import SkeletonList from "@/components/shared/SkeletonList";
// import EmptyState from "@/components/shared/EmptyState";
// import ErrorAlert from "@/components/shared/ErrorAlert";
// import { useCoverLetterList } from "@/hooks/useCoverLetterList";
// import { useRouter } from "next/navigation";

// export default function CoverLetterListPage() {
//   const router = useRouter();
//   const { data: coverLetters, isLoading, isError, refetch } = useCoverLetterList();

//   return (
//     <PageTransition>
//       <div className="max-w-5xl mx-auto space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-text-primary">My Cover Letters</h1>
//             <p className="text-text-secondary mt-1">Manage and generate your cover letters</p>
//           </div>
//           <Link
//             href="/cover-letter/generate"
//             className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
//           >
//             <Plus className="w-4 h-4" />
//             Generate New
//           </Link>
//         </div>

//         {isError && <ErrorAlert message="Failed to load cover letters" onRetry={refetch} />}

//         {isLoading ? (
//           <SkeletonList count={6} />
//         ) : coverLetters && coverLetters.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {coverLetters.map((cl) => (
//               <CoverLetterCard key={cl.uuid} coverLetter={cl} />
//             ))}
//           </div>
//         ) : (
//           <EmptyState
//             title="No cover letters yet"
//             description="Get started by generating your first AI-powered cover letter."
//             action={{
//               label: "Generate your first cover letter",
//               onClick: () => router.push("/cover-letter/generate"),
//             }}
//           />
//         )}
//       </div>
//     </PageTransition>
//   );
// }








"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";
import CoverLetterCard from "@/components/cover-letter/CoverLetterCard";
import SkeletonList from "@/components/shared/SkeletonList";
import EmptyState from "@/components/shared/EmptyState";
import ErrorAlert from "@/components/shared/ErrorAlert";
import { useCoverLetterList } from "@/hooks/useCoverLetterList";
import { useRouter } from "next/navigation";

export default function CoverLetterListPage() {
  const router = useRouter();
  const { data: coverLetters, isLoading, isError, refetch } = useCoverLetterList();

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">My Cover Letters</h1>
            <p className="text-text-secondary mt-1">Manage and generate your cover letters</p>
          </div>
          <Link
            href="/cover-letter/generate"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)]"
          >
            <Plus className="w-4 h-4" />
            Generate New
          </Link>
        </div>

        {isError && <ErrorAlert message="Failed to load cover letters" onRetry={refetch} />}

        {isLoading ? (
          <SkeletonList count={6} />
        ) : coverLetters && coverLetters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coverLetters.map((cl) => (
              <CoverLetterCard key={cl.uuid} coverLetter={cl} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No cover letters yet"
            description="Get started by generating your first AI-powered cover letter."
            action={{
              label: "Generate your first cover letter",
              onClick: () => router.push("/cover-letter/generate"),
            }}
          />
        )}
      </div>
    </PageTransition>
  );
}