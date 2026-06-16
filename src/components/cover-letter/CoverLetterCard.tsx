// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { Eye, BarChart3, Trash2 } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import type { CoverLetterListItem } from "@/types";
// import { useDeleteCoverLetter } from "@/hooks/useDeleteCoverLetter";
// import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
// import { queryClient } from "@/lib/queryClient";
// import { useState } from "react";

// interface CoverLetterCardProps {
//   coverLetter: CoverLetterListItem;
// }

// export default function CoverLetterCard({ coverLetter }: CoverLetterCardProps) {
//   const router = useRouter();
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const deleteCoverLetter = useDeleteCoverLetter();

//   const handleDelete = async () => {
//     const previousData = queryClient.getQueryData<CoverLetterListItem[]>(["coverLetters"]);
//     queryClient.setQueryData<CoverLetterListItem[]>(["coverLetters"], (old) =>
//       old?.filter((c) => c.uuid !== coverLetter.uuid) ?? []
//     );

//     try {
//       await deleteCoverLetter.mutateAsync(coverLetter.uuid);
//     } catch {
//       queryClient.setQueryData(["coverLetters"], previousData);
//     }
//   };

//   return (
//     <>
//       <motion.div className="rounded-xl border border-border bg-surface p-5 hover:border-border-bright hover:shadow-[0_0_30px_rgba(0,194,255,0.08)] transition-all duration-200">
//         <Link
//           href={`/cover-letter/${coverLetter.uuid}`}
//           className="text-base font-semibold text-text-primary hover:text-accent transition-colors line-clamp-1 block mb-1"
//         >
//           {coverLetter.title}
//         </Link>
//         <p className="text-sm text-text-secondary mb-1">
//           {coverLetter.company_name} · {coverLetter.job_title}
//         </p>
//         <p className="text-xs text-text-tertiary mb-4">
//           Updated {formatDistanceToNow(new Date(coverLetter.updated_at), { addSuffix: true })}
//         </p>

//         <div className="flex items-center gap-2">
//           <Link
//             href={`/cover-letter/${coverLetter.uuid}`}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-text-secondary hover:text-text-primary hover:bg-white/[0.08] transition-all"
//           >
//             <Eye className="w-3.5 h-3.5" />
//             View
//           </Link>
//           <button
//             onClick={() => router.push(`/cover-letter/${coverLetter.uuid}/analysis`)}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-text-secondary hover:text-accent hover:bg-accent/10 transition-all"
//           >
//             <BarChart3 className="w-3.5 h-3.5" />
//             Analyze
//           </button>
//           <button
//             onClick={() => setShowDeleteModal(true)}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-text-secondary hover:text-danger hover:bg-danger/10 transition-all ml-auto"
//           >
//             <Trash2 className="w-3.5 h-3.5" />
//           </button>
//         </div>
//       </motion.div>

//       <DeleteConfirmModal
//         isOpen={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         onConfirm={handleDelete}
//         title={coverLetter.title}
//       />
//     </>
//   );
// }





"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, BarChart3, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { CoverLetterListItem } from "@/types";
import { useDeleteCoverLetter } from "@/hooks/useDeleteCoverLetter";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
import { queryClient } from "@/lib/queryClient";

interface CoverLetterCardProps {
  coverLetter: CoverLetterListItem;
}

export default function CoverLetterCard({ coverLetter }: CoverLetterCardProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteCoverLetter = useDeleteCoverLetter();

  const handleDelete = async () => {
    // Optimistically remove the card from the list immediately
    const previousData = queryClient.getQueryData<CoverLetterListItem[]>(["coverLetters"]);
    queryClient.setQueryData<CoverLetterListItem[]>(["coverLetters"], (old) =>
      old?.filter((c) => c.uuid !== coverLetter.uuid) ?? []
    );
    try {
      await deleteCoverLetter.mutateAsync(coverLetter.uuid);
    } catch {
      // Toast handled by hook's onError; roll back the optimistic removal
      queryClient.setQueryData(["coverLetters"], previousData);
    }
  };

  return (
    <>
      <motion.div className="rounded-xl border border-border bg-surface p-5 hover:border-border-bright hover:shadow-[0_0_30px_rgba(0,194,255,0.08)] transition-all duration-200">
        <Link
          href={`/cover-letter/${coverLetter.uuid}`}
          className="text-base font-semibold text-text-primary hover:text-accent transition-colors line-clamp-1 block mb-1"
        >
          {coverLetter.title}
        </Link>
        <p className="text-sm text-text-secondary mb-1">
          {coverLetter.company_name} · {coverLetter.job_title}
        </p>
        <p className="text-xs text-text-tertiary mb-4">
          Updated {formatDistanceToNow(new Date(coverLetter.updated_at), { addSuffix: true })}
        </p>

        <div className="flex items-center gap-2">
          <Link
            href={`/cover-letter/${coverLetter.uuid}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-text-secondary hover:text-text-primary hover:bg-white/[0.08] transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </Link>
          <button
            onClick={() => router.push(`/cover-letter/${coverLetter.uuid}/analysis`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-text-secondary hover:text-accent hover:bg-accent/10 transition-all"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analyze
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-text-secondary hover:text-danger hover:bg-danger/10 transition-all ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={coverLetter.title}
      />
    </>
  );
}