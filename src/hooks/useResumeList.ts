"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ResumeListItem } from "@/types";

async function fetchResumes(): Promise<ResumeListItem[]> {
  const response = await api.get("/api/resume/");
  return response.data;
}

export function useResumeList() {
  return useQuery<ResumeListItem[]>({
    queryKey: ["resumes"],
    queryFn: fetchResumes,
    staleTime: 5 * 60 * 1000,
  });
}
