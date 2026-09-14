"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-detection to avoid SSR/client theme hydration mismatch
  useEffect(() => setMounted(true), []);

  return (
    <button
      aria-label="Toggle dark and light theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-1 hover:text-muted transition-colors"
    >
      {mounted && resolvedTheme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
