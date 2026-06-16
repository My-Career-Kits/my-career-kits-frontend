"use client";

import SkeletonCard from "./SkeletonCard";

interface SkeletonListProps {
  count?: number;
}

export default function SkeletonList({ count = 6 }: SkeletonListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
