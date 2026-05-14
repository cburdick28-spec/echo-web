"use client";

import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { LogOut, User } from "lucide-react";

export default function AuthMenu() {
  const { user, loading } = useAuth();
  const supabase = createClient();

  if (loading) return null;

  return (
    <div className="max-w-lg mx-auto px-4 pt-3 flex justify-end items-center gap-3">
      {user ? (
        <>
          <span className="text-sm text-gray-500 truncate max-w-[160px]">{user.email}</span>
          <button
            onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
          >
            <LogOut className="w-3 h-3" /> Sign out
          </button>
        </>
      ) : (
        <Link href="/auth/login" className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700">
          <User className="w-4 h-4" /> Sign In
        </Link>
      )}
    </div>
  );
}
