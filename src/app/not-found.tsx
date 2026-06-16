"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace("/dashboard");
    }
  }, [router]);

  return null;
}