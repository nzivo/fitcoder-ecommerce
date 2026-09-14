"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Thanks for joining the Legends Club!");
    setEmail("");
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="flex-1 bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
      />
      <button className="bg-foreground text-background px-4 py-2 text-xs tracking-widest-xl uppercase">
        Join
      </button>
    </form>
  );
}
