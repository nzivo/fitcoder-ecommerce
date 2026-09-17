"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const params = new URLSearchParams(pathname === "/shop" ? searchParams.toString() : "");
    params.set("search", q);
    router.push(`/shop?${params.toString()}`);
    onClose();
  }

  return (
    <div className="border-b border-border bg-background">
      <form
        onSubmit={handleSubmit}
        className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex items-center gap-3"
      >
        <Search size={18} className="text-muted shrink-0" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="flex-1 min-w-0 bg-transparent text-sm focus:outline-none"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="p-1 text-muted hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>
      </form>
    </div>
  );
}
