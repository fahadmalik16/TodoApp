"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";

export default function SignUpPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.signup({ username, email, password });
      // Auto sign-in after successful signup for a smoother flow.
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
        <h1 className="mb-6 inline-block rotate-1 rounded-xl border-[3px] border-ink bg-mint px-4 py-1.5 text-2xl font-semibold shadow-hard">
          Join the club!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-xl border-[3px] border-ink border-l-8 border-l-berry bg-white px-3 py-2 text-sm shadow-hard-sm">
              {error}
            </p>
          )}
          <div>
            <label className="mb-1 block text-sm font-semibold">Username</label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={50}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-pop"
            />
          </div>
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
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-pop"
            />
            <p className="mt-1 text-xs text-ink/60">At least 8 characters.</p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-pop w-full bg-grape-soft px-4 py-2"
          >
            {submitting ? "Creating account…" : "Sign up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-ink/70">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-ink underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
