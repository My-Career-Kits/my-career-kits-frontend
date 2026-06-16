// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { Eye, BarChart3, Pencil, Trash2, Check, X } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import type { ResumeListItem } from "@/types";
// import { useUpdateResume } from "@/hooks/useUpdateResume";
// import { useDeleteResume } from "@/hooks/useDeleteResume";
// import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
// import { queryClient } from "@/lib/queryClient";

// interface ResumeCardProps {
//   resume: ResumeListItem;
//   onMouseEnter?: () => void;
// }

// export default function ResumeCard({ resume, onMouseEnter }: ResumeCardProps) {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [editTitle, setEditTitle] = useState(resume.title);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const updateResume = useUpdateResume();
//   const deleteResume = useDeleteResume();

//   const handleSaveTitle = async () => {
//     if (editTitle.trim() && editTitle !== resume.title) {
//       await updateResume.mutateAsync({
//         uuid: resume.id,
//         data: { title: editTitle.trim() },
//       });
//     }
//     setIsEditing(false);
//   };

//   const handleDelete = async () => {
//     // Optimistic update
//     const previousData = queryClient.getQueryData<ResumeListItem[]>(["resumes"]);
//     queryClient.setQueryData<ResumeListItem[]>(["resumes"], (old) =>
//       old?.filter((r) => r.id !== resume.id) ?? []
//     );

//     try {
//       await deleteResume.mutateAsync(resume.id);
//     } catch {
//       // Rollback on error
//       queryClient.setQueryData(["resumes"], previousData);
//     }
//   };

//   return (
//     <>
//       <motion.div
//         onMouseEnter={onMouseEnter}
//         className="rounded-xl border border-border bg-surface p-5 hover:border-border-bright hover:shadow-[0_0_30px_rgba(0,194,255,0.08)] transition-all duration-200 group"
//       >
//         <div className="flex items-start justify-between mb-3">
//           {isEditing ? (
//             <div className="flex items-center gap-2 flex-1">
//               <input
//                 type="text"
//                 value={editTitle}
//                 onChange={(e) => setEditTitle(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") handleSaveTitle();
//                   if (e.key === "Escape") {
//                     setEditTitle(resume.title);
//                     setIsEditing(false);
//                   }
//                 }}
//                 onBlur={handleSaveTitle}
//                 autoFocus
//                 className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm text-text-primary focus:border-accent focus:outline-none"
//               />
//               <button onClick={handleSaveTitle} className="text-success">
//                 <Check className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => {
//                   setEditTitle(resume.title);
//                   setIsEditing(false);
//                 }}
//                 className="text-text-tertiary"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           ) : (
//             <Link
//               href={`/resume/${resume.id}`}
//               className="text-base font-semibold text-text-primary hover:text-accent transition-colors line-clamp-1"
//             >
//               {resume.title}
//             </Link>
//           )}

//           {!isEditing && (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-text-secondary transition-all ml-2"
//             >
//               <Pencil className="w-4 h-4" />
//             </button>
//           )}
//         </div>

//         <p className="text-xs text-text-tertiary mb-4">
//           Updated {formatDistanceToNow(new Date(resume.updated_at), { addSuffix: true })}
//         </p>

//         <div className="flex items-center gap-2">
//           <Link
//             href={`/resume/${resume.id}`}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-text-secondary hover:text-text-primary hover:bg-white/[0.08] transition-all"
//           >
//             <Eye className="w-3.5 h-3.5" />
//             View
//           </Link>
//           <button
//             onClick={() => router.push(`/resume/${resume.id}/analysis`)}
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
//         title={resume.title}
//       />
//     </>
//   );
// }



"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, BarChart3, Pencil, Trash2, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ResumeListItem } from "@/types";
import { useUpdateResume } from "@/hooks/useUpdateResume";
import { useDeleteResume } from "@/hooks/useDeleteResume";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
import { queryClient } from "@/lib/queryClient";

interface ResumeCardProps {
  resume: ResumeListItem;
  onMouseEnter?: () => void;
}

export default function ResumeCard({ resume, onMouseEnter }: ResumeCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(resume.title);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const updateResume = useUpdateResume();
  const deleteResume = useDeleteResume();

  const handleSaveTitle = async () => {
    if (editTitle.trim() && editTitle !== resume.title) {
      try {
        await updateResume.mutateAsync({
          uuid: resume.uuid,
          data: { title: editTitle.trim() },
        });
      } catch {
        // Toast handled by hook's onError; revert input to original title
        setEditTitle(resume.title);
        return;
      }
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    // Optimistically remove the card from the list immediately
    const previousData = queryClient.getQueryData<ResumeListItem[]>(["resumes"]);
    queryClient.setQueryData<ResumeListItem[]>(["resumes"], (old) =>
      old?.filter((r) => r.uuid !== resume.uuid) ?? []
    );
    try {
      await deleteResume.mutateAsync(resume.uuid);
    } catch {
      // Toast handled by hook's onError; roll back the optimistic removal
      queryClient.setQueryData(["resumes"], previousData);
    }
  };

  return (
    <>
      <motion.div
        onMouseEnter={onMouseEnter}
        className="rounded-xl border border-border bg-surface p-5 hover:border-border-bright hover:shadow-[0_0_30px_rgba(0,194,255,0.08)] transition-all duration-200 group"
      >
        <div className="flex items-start justify-between mb-3">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") {
                    setEditTitle(resume.title);
                    setIsEditing(false);
                  }
                }}
                onBlur={handleSaveTitle}
                autoFocus
                className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm text-text-primary focus:border-accent focus:outline-none"
              />
              <button onClick={handleSaveTitle} className="text-success">
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setEditTitle(resume.title);
                  setIsEditing(false);
                }}
                className="text-text-tertiary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href={`/resume/${resume.uuid}`}
              className="text-base font-semibold text-text-primary hover:text-accent transition-colors line-clamp-1"
            >
              {resume.title}
            </Link>
          )}

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-text-secondary transition-all ml-2"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-xs text-text-tertiary mb-4">
          Updated {formatDistanceToNow(new Date(resume.updated_at), { addSuffix: true })}
        </p>

        <div className="flex items-center gap-2">
          <Link
            href={`/resume/${resume.uuid}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-text-secondary hover:text-text-primary hover:bg-white/[0.08] transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </Link>
          <button
            onClick={() => router.push(`/resume/${resume.uuid}/analysis`)}
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
        title={resume.title}
      />
    </>
  );
}