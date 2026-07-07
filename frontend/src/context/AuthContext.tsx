"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/auth";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // If we have a token, verify it and load the current user; otherwise
    // resolve to null. All state updates happen in async callbacks.
    const token = tokenStorage.get();
    const load = token ? api.me() : Promise.resolve(null);
    load
      .then((u) => {
        if (u) setUser(u);
      })
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const token = await api.signin({ email, password });
    tokenStorage.set(token.access_token);
    const me = await api.me();
    setUser(me);
  }

  function logout() {
    tokenStorage.clear();
    setUser(null);
    router.push("/signin");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
