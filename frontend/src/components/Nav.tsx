"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

const letterTiles = [
  { letter: "T", bg: "bg-pink", tilt: "-rotate-6", delay: "0s" },
  { letter: "O", bg: "bg-butter", tilt: "rotate-3", delay: "0.2s" },
  { letter: "D", bg: "bg-mint", tilt: "-rotate-2", delay: "0.4s" },
  { letter: "O", bg: "bg-sky", tilt: "rotate-6", delay: "0.6s" },
];

export default function Nav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="relative z-10 border-b-[3px] border-ink bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-baseline gap-1.5" aria-label="TodoApp home">
          {letterTiles.map(({ letter, bg, tilt, delay }, i) => (
            <span
              key={i}
              className={`animate-bob inline-block rounded-lg border-2 border-ink ${bg} ${tilt} px-2 py-0.5 text-lg font-semibold shadow-hard-sm`}
              style={{ animationDelay: delay }}
            >
              {letter}
            </span>
          ))}
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <ThemeToggle />
          {user ? (
            <>
              <span className="rounded-full border-2 border-ink bg-butter px-3 py-1 font-medium">
                Hi, {user.username}
              </span>
              <button onClick={logout} className="btn-pop rounded-full px-3 py-1">
                Sign out
              </button>
            </>
          ) : (
            <>
              {pathname !== "/signin" && (
                <Link href="/signin" className="btn-pop rounded-full px-3 py-1">
                  Sign in
                </Link>
              )}
              {pathname !== "/signup" && (
                <Link
                  href="/signup"
                  className="btn-pop rounded-full bg-grape-soft px-3 py-1"
                >
                  Sign up
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
