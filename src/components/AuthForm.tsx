"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { GoogleIcon, FacebookIcon } from "@/components/icons/SocialIcons";

type SocialProvider = "google" | "facebook";

export default function AuthForm({
  redirectTo = "/account",
  allowSignup = true,
}: {
  redirectTo?: string;
  allowSignup?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<SocialProvider | null>(null);

  useEffect(() => {
    if (searchParams.get("error") === "oauth_failed") {
      toast.error("Couldn't sign in with that account. Please try again.");
    }
  }, [searchParams]);

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

  async function handleOAuth(provider: SocialProvider) {
    setOauthLoading(provider);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) {
      toast.error(error.message);
      setOauthLoading(null);
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      {allowSignup && (
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
      )}

      <div className="space-y-2 mb-6">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          disabled={oauthLoading !== null}
          className="w-full flex items-center justify-center gap-2 border border-border py-3 text-xs tracking-widest-xl uppercase disabled:opacity-50"
        >
          <GoogleIcon size={16} />
          {oauthLoading === "google" ? "Redirecting…" : "Continue with Google"}
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("facebook")}
          disabled={oauthLoading !== null}
          className="w-full flex items-center justify-center gap-2 border border-border py-3 text-xs tracking-widest-xl uppercase disabled:opacity-50"
        >
          <FacebookIcon size={16} />
          {oauthLoading === "facebook" ? "Redirecting…" : "Continue with Facebook"}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] tracking-widest-xl uppercase text-muted">Or email</span>
        <div className="h-px flex-1 bg-border" />
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
          className="w-full bg-accent text-accent-foreground py-3 text-xs tracking-widest-xl uppercase disabled:opacity-50"
        >
          {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
    </div>
  );
}
