
"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api, { parseBackendError } from "@/lib/api";
import type { CoverLetter } from "@/types";
import { queryClient } from "@/lib/queryClient";

async function updateCoverLetter(uuid: string, data: unknown): Promise<CoverLetter> {
  const response = await api.put(`/api/coverletter/${uuid}/`, data);
  return response.data;
}

export function useUpdateCoverLetter() {
  return useMutation<CoverLetter, unknown, { uuid: string; data: unknown }>({
    mutationFn: ({ uuid, data }) => updateCoverLetter(uuid, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["coverLetter", variables.uuid] });
      queryClient.invalidateQueries({ queryKey: ["coverLetters"] });
    },
    onError: (err) => {
      toast.error(parseBackendError(err));
    },
  });
}