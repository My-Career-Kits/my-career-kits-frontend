"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api, { parseBackendError } from "@/lib/api";
import type { Resume } from "@/types";
import { queryClient } from "@/lib/queryClient";

async function updateResume(
  uuid: string,
  data: { title?: string; content?: unknown }
): Promise<Resume> {
  const response = await api.patch(`/api/resume/${uuid}/`, data);
  return response.data;
}

export function useUpdateResume() {
  return useMutation<Resume, unknown, { uuid: string; data: { title?: string; content?: unknown } }>({
    mutationFn: ({ uuid, data }) => updateResume(uuid, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["resume", variables.uuid] });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: (err) => {
      toast.error(parseBackendError(err));
    },
  });
}