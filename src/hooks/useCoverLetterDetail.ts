// "use client";

// import { useQuery } from "@tanstack/react-query";
// import api from "@/lib/api";
// import type { CoverLetter } from "@/types";

// async function fetchCoverLetterDetail(uuid: string): Promise<CoverLetter> {
//   const response = await api.get(`/api/coverletter/${uuid}/`);
//   return response.data;
// }

// export function useCoverLetterDetail(uuid: string | null) {
//   return useQuery<CoverLetter>({
//     queryKey: ["coverLetter", uuid],
//     queryFn: () => fetchCoverLetterDetail(uuid!),
//     staleTime: 0,
//     enabled: !!uuid,
//   });
// }





"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { CoverLetter } from "@/types";

async function fetchCoverLetterDetail(uuid: string): Promise<CoverLetter> {
  const response = await api.get(`/api/coverletter/${uuid}/`);
  return response.data;
}

export function useCoverLetterDetail(uuid: string | null) {
  return useQuery<CoverLetter>({
    queryKey: ["coverLetter", uuid],
    queryFn: () => fetchCoverLetterDetail(uuid!),
    staleTime: 0,
    enabled: !!uuid,
  });
}