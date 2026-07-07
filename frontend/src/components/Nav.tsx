"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function Nav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          TodoApp
        </Link>
        {user ? (
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium text-gray-700">Hi, {user.username}</span>
            <button
              onClick={logout}
              className="cursor-pointer rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-700"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            {pathname !== "/signin" && (
              <Link href="/signin" className="cursor-pointer rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-700">
                Sign in
              </Link>
            )}
            {pathname !== "/signup" && (
              <Link
                href="/signup"
                className="cursor-pointer rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-700"
              >
                Sign up
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
