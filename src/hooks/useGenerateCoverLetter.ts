// "use client";

// import { useMutation } from "@tanstack/react-query";
// import api from "@/lib/api";
// import type { CoverLetterGenerateInput, CoverLetter } from "@/types";
// import { queryClient } from "@/lib/queryClient";

// async function generateCoverLetter(data: CoverLetterGenerateInput): Promise<CoverLetter> {
//   const response = await api.post("/api/coverletter/generate/", data);
//   return response.data;
// }

// export function useGenerateCoverLetter() {
//   return useMutation<CoverLetter, unknown, CoverLetterGenerateInput>({
//     mutationFn: generateCoverLetter,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["coverLetters"] });
//     },
//   });
// }





"use client";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import type { CoverLetterGenerateInput, CoverLetter } from "@/types";
import { queryClient } from "@/lib/queryClient";

async function generateCoverLetter(data: CoverLetterGenerateInput): Promise<CoverLetter> {
  const response = await api.post("/api/coverletter/generate/", data);
  return response.data;
}

export function useGenerateCoverLetter() {
  return useMutation<CoverLetter, unknown, CoverLetterGenerateInput>({
    mutationFn: generateCoverLetter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coverLetters"] });
    },
  });
}