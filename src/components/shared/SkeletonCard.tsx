"use client";

export default function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 animate-shimmer bg-gradient-to-r from-[#1E2D45] via-[#2A3F5F] to-[#1E2D45] bg-[length:200%_100%]">
      <div className="h-5 w-3/4 rounded bg-border/50 mb-4" />
      <div className="h-4 w-1/2 rounded bg-border/50 mb-2" />
      <div className="h-4 w-2/3 rounded bg-border/50" />
    </div>
  );
}
