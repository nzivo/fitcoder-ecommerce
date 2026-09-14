"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm({ redirectTo = "/account" }: { redirectTo?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (mode === "signup") {
      toast.success("Check your email to confirm your account.");
      return;
    }

    router.refresh();
    router.push(redirectTo);
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex gap-6 mb-6 text-xs tracking-widest-xl uppercase">
        <button
          className={mode === "login" ? "border-b border-foreground pb-1" : "text-muted pb-1"}
          onClick={() => setMode("login")}
        >
          Sign In
        </button>
        <button
          className={mode === "signup" ? "border-b border-foreground pb-1" : "text-muted pb-1"}
          onClick={() => setMode("signup")}
        >
          Create Account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-xs">
          <span className="text-muted">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
          />
        </label>
        <label className="block text-xs">
          <span className="text-muted">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-foreground text-background py-3 text-xs tracking-widest-xl uppercase disabled:opacity-50"
        >
          {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
    </div>
  );
}
