"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? "/todos" : "/signup");
  }, [user, loading, router]);

  return <p className="text-ink/60 dark:text-cream/70">Loading…</p>;
}
