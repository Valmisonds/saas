"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const GOALS = [
  { value: "sleep", label: "Dormir melhor" },
  { value: "hydration", label: "Beber mais água" },
  { value: "exercise", label: "Me exercitar com constância" },
];

const OBSTACLES = [
  { value: "falta de tempo", label: "Falta de tempo" },
  { value: "esquecimento", label: "Eu esqueço" },
  { value: "falta de motivacao", label: "Falta de motivação" },
];

export function OnboardingQuiz() {
  const router = useRouter();
  const [goal, setGoal] = useState(GOALS[0].value);
  const [obstacle, setObstacle] = useState(OBSTACLES[0].value);
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, obstacle }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) setPlan(data.plan);
  }

  if (plan) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="max-w-md rounded-xl bg-white p-6 text-lg text-black shadow dark:bg-zinc-950 dark:text-zinc-50">
          {plan}
        </p>
        <button
          onClick={() => router.refresh()}
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Vamos lá — registrar meu primeiro dia
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
        Qual seu objetivo principal?
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="rounded-lg border border-black/10 px-3 py-2 dark:border-white/15 dark:bg-black"
        >
          {GOALS.map((g) => (
            <option key={g.value} value={g.value}>{g.label}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
        O que mais te impede hoje?
        <select
          value={obstacle}
          onChange={(e) => setObstacle(e.target.value)}
          className="rounded-lg border border-black/10 px-3 py-2 dark:border-white/15 dark:bg-black"
        >
          {OBSTACLES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
      >
        {loading ? "Gerando seu plano..." : "Gerar meu plano"}
      </button>
    </form>
  );
}
