"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api, { parseBackendError } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

async function deleteCoverLetter(uuid: string): Promise<void> {
  await api.delete(`/api/coverletter/${uuid}/`);
}

export function useDeleteCoverLetter() {
  return useMutation<void, unknown, string>({
    mutationFn: deleteCoverLetter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverLetters"] });
    },
    onError: (err) => {
      toast.error(parseBackendError(err));
    },
  });
}