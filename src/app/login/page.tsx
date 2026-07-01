"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    setStatus(error ? "error" : "sent");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-6 dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Entrar</h1>
      {status === "sent" ? (
        <p className="max-w-sm text-center text-zinc-600 dark:text-zinc-400">
          Enviamos um link mágico para <strong>{email}</strong>. Abra seu e-mail para continuar.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3">
          <input
            required
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
          >
            {status === "loading" ? "Enviando..." : "Receber link mágico"}
          </button>
          {status === "error" && (
            <p className="text-sm text-red-600">Algo deu errado, tenta de novo.</p>
          )}
        </form>
      )}
    </main>
  );
}
