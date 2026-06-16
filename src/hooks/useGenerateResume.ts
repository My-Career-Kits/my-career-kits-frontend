"use client";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ResumeGenerateInput, Resume } from "@/types";
import { queryClient } from "@/lib/queryClient";

async function generateResume(data: ResumeGenerateInput): Promise<Resume> {
  const response = await api.post("/api/resume/generate/", data);
  return response.data;
}

export function useGenerateResume() {
  return useMutation<Resume, unknown, ResumeGenerateInput>({
    mutationFn: generateResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}
