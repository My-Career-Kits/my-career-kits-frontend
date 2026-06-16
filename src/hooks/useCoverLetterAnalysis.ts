// "use client";

// import { useQuery, useMutation } from "@tanstack/react-query";
// import api from "@/lib/api";
// import type { CoverLetterAnalysis } from "@/types";
// import { queryClient } from "@/lib/queryClient";

// async function fetchCoverLetterAnalysis(uuid: string): Promise<CoverLetterAnalysis> {
//   const response = await api.get(`/api/coverletter/analysis/${uuid}/`);
//   return response.data;
// }

// async function triggerCoverLetterAnalysis(uuid: string): Promise<CoverLetterAnalysis> {
//   const response = await api.post(`/api/coverletter/analysis/${uuid}/`);
//   return response.data;
// }

// export function useCoverLetterAnalysis(uuid: string) {
//   const query = useQuery<CoverLetterAnalysis>({
//     queryKey: ["coverLetter-analysis", uuid],
//     queryFn: () => fetchCoverLetterAnalysis(uuid),
//     staleTime: 0,
//     retry: false,
//   });

//   const mutation = useMutation<CoverLetterAnalysis, unknown, string>({
//     mutationFn: triggerCoverLetterAnalysis,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["coverLetter-analysis", uuid] });
//     },
//   });

//   return { query, mutation };
// }






"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import type { CoverLetterAnalysis } from "@/types";
import { queryClient } from "@/lib/queryClient";

async function fetchCoverLetterAnalysis(uuid: string): Promise<CoverLetterAnalysis> {
  const response = await api.get(`/api/coverletter/analysis/${uuid}/`);
  return response.data;
}

async function triggerCoverLetterAnalysis(uuid: string): Promise<CoverLetterAnalysis> {
  const response = await api.post(`/api/coverletter/analysis/${uuid}/`);
  return response.data;
}

export function useCoverLetterAnalysis(uuid: string) {
  const query = useQuery<CoverLetterAnalysis>({
    queryKey: ["coverLetter-analysis", uuid],
    queryFn: () => fetchCoverLetterAnalysis(uuid),
    staleTime: 0,
    retry: false,
  });

  const mutation = useMutation<CoverLetterAnalysis, unknown, string>({
    mutationFn: triggerCoverLetterAnalysis,
    // UPDATED: set data immediately so UI updates without waiting for refetch
    onSuccess: (data) => {
      queryClient.setQueryData(["coverLetter-analysis", uuid], data);
    },
  });

  return { query, mutation };
}