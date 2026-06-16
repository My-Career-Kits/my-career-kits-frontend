// "use client";

// import { useState, useEffect } from "react";
// import { useQuery, keepPreviousData } from "@tanstack/react-query";
// import api from "@/lib/api";
// import type { JobSearchResult } from "@/types";

// async function fetchJobs(params: { keywords: string; location: string }): Promise<JobSearchResult> {
//   const response = await api.get("/api/jobs/", {
//     params: {
//       keywords: params.keywords,
//       location: params.location,
//     },
//   });
//   return response.data;
// }

// export function useJobSearch() {
//   const [params, setParams] = useState({ keywords: "", location: "" });
//   const [inputValues, setInputValues] = useState({ keywords: "", location: "" });

//   useEffect(() => {
//     const timer = setTimeout(() => setParams(inputValues), 500);
//     return () => clearTimeout(timer);
//   }, [inputValues.keywords, inputValues.location]);

//   const query = useQuery<JobSearchResult>({
//     queryKey: ["jobs", params],
//     queryFn: () => fetchJobs(params),
//     enabled: !!params.keywords && !!params.location,
//     staleTime: 2 * 60 * 1000,
//     placeholderData: keepPreviousData,
//   });

//   return {
//     query,
//     inputValues,
//     setInputValues,
//     params,
//   };
// }




"use client";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "@/lib/api";
import type { JobSearchResult } from "@/types";

async function fetchJobs(params: {
  keywords: string;
  location: string;
  page: number;
}): Promise<JobSearchResult> {
  const response = await api.get("/api/jobs/", {
    params: {
      keywords: params.keywords,
      location: params.location,
      page: params.page,
    },
  });
  return response.data;
}

export function useJobSearch() {
  // inputValues  — what user is currently typing
  const [inputValues, setInputValues] = useState({ keywords: "", location: "" });

  // submittedParams — only updated when user presses Search or Enter
  const [submittedParams, setSubmittedParams] = useState({
    keywords: "",
    location: "",
    page: 1,
  });

  // tracks whether user has searched at least once
  const [hasSearched, setHasSearched] = useState(false);

  // called when user presses Search button or hits Enter
  function handleSearch() {
    const keywords = inputValues.keywords.trim();
    const location = inputValues.location.trim();

    if (!keywords || !location) return;  // both fields required

    setSubmittedParams({ keywords, location, page: 1 });  // reset to page 1 on new search
    setHasSearched(true);
  }

  // called when user clicks a page number
  function handlePageChange(page: number) {
    setSubmittedParams((prev) => ({ ...prev, page }));
  }

  const query = useQuery<JobSearchResult>({
    queryKey: ["jobs", submittedParams],  // refetches when submittedParams changes
    queryFn: () => fetchJobs(submittedParams),
    enabled: hasSearched,                 // only runs after first search
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,    // keeps old results while fetching new page
  });

  return {
    query,
    inputValues,
    setInputValues,
    submittedParams,
    hasSearched,
    handleSearch,
    handlePageChange,
  };
}