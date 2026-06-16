"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Resume } from "@/types";

export async function fetchResumeDetail(uuid: string): Promise<Resume> {
  const response = await api.get(`/api/resume/${uuid}/`);
  return response.data;
}

export function useResumeDetail(uuid: string | null) {
  return useQuery<Resume>({
    queryKey: ["resume", uuid],
    queryFn: () => fetchResumeDetail(uuid!),
    staleTime: 0,
    enabled: !!uuid,
  });
}
