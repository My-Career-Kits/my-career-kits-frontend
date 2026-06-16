"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api, { parseBackendError } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

async function deleteResume(uuid: string): Promise<void> {
  await api.delete(`/api/resume/${uuid}/`);
}

export function useDeleteResume() {
  return useMutation<void, unknown, string>({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: (err) => {
      toast.error(parseBackendError(err));
    },
  });
}