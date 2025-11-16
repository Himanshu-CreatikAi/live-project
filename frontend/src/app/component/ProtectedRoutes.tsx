"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAuth(); // use loading from context
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !admin) {
      router.replace("/"); // replace to avoid flicker
    }
  }, [admin, isLoading, router]);

  // Show loading only while auth is being verified
  if (isLoading || !admin) {
    return (
      <div className="grid place-items-center min-h-[calc(100vh)] w-full text-gray-600">
        Loading page...
      </div>
    );
  }

  return <>{children}</>;
}
