"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { CoverLetterListItem } from "@/types";

async function fetchCoverLetters(): Promise<CoverLetterListItem[]> {
  const response = await api.get("/api/coverletter/");
  return response.data;
}

export function useCoverLetterList() {
  return useQuery<CoverLetterListItem[]>({
    queryKey: ["coverLetters"],
    queryFn: fetchCoverLetters,
    staleTime: 5 * 60 * 1000,
  });
}