"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export default function SignInPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/todos");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto mt-6 max-w-sm">
      <div className="card-pop rounded-2xl p-6">
        <h1 className="mb-6 inline-block -rotate-1 rounded-xl border-[3px] border-ink bg-sky px-4 py-1.5 text-2xl font-semibold shadow-hard">
          Welcome back!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-xl border-[3px] border-ink border-l-8 border-l-berry bg-white px-3 py-2 text-sm shadow-hard-sm">
              {error}
            </p>
          )}
          <div>
            <label className="mb-1 block text-sm font-semibold">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-pop"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-pop"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-pop w-full bg-pink-deep px-4 py-2"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-sm text-ink/70">
          No account?{" "}
          <Link href="/signup" className="font-semibold text-ink underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
