"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else router.push("/");
  };

  return (
    <div className="max-w-sm mx-auto space-y-6 pt-12">
      <h1 className="text-2xl font-bold text-center">Create Account</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
        />
        <input
          type="password" placeholder="Password (min 6 chars)" value={password}
          onChange={(e) => setPassword(e.target.value)} required minLength={6}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-semibold">
          <UserPlus className="w-4 h-4" /> Create Account
        </button>
      </form>
      <p className="text-center text-sm text-gray-500">
        Already have one? <Link href="/auth/login" className="text-blue-500 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
