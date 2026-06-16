"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api, { parseBackendError } from "@/lib/api";
import type { ResumeAnalysis } from "@/types";
import { queryClient } from "@/lib/queryClient";

async function fetchResumeAnalysis(uuid: string): Promise<ResumeAnalysis> {
  const response = await api.get(`/api/resume/analysis/${uuid}/`);
  return response.data;
}

async function triggerResumeAnalysis(uuid: string): Promise<ResumeAnalysis> {
  const response = await api.post(`/api/resume/analysis/${uuid}/`);
  return response.data;
}

export function useResumeAnalysis(uuid: string) {
  const query = useQuery<ResumeAnalysis>({
    queryKey: ["resume-analysis", uuid],
    queryFn: () => fetchResumeAnalysis(uuid),
    staleTime: 0,
    retry: false,
  });

  const mutation = useMutation<ResumeAnalysis, unknown, string>({
    mutationFn: triggerResumeAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume-analysis", uuid] });
    },
    onError: (err) => {
      toast.error(parseBackendError(err));
    },
  });

  return { query, mutation };
}