"use client";

import { useState } from "react";

const GOALS = [
  { value: "sleep", label: "Dormir melhor" },
  { value: "hydration", label: "Beber mais água" },
  { value: "exercise", label: "Me exercitar com constância" },
];

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState(GOALS[0].value);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, goal }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="rounded-lg bg-emerald-50 px-4 py-3 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        Prontinho — você está na lista. Avisamos por e-mail assim que abrirmos o acesso.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <select
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
      >
        {GOALS.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>
      <input
        required
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
      >
        {status === "loading" ? "Enviando..." : "Entrar na lista"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600 sm:absolute sm:mt-10">Algo deu errado, tenta de novo.</p>
      )}
    </form>
  );
}
