"use client";

import { useState } from "react";

export function LogAction({ initialStreak }: { initialStreak: number }) {
  const [streak, setStreak] = useState(initialStreak);
  const [done, setDone] = useState(false);

  async function handleLog() {
    const res = await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: 1 }),
    });
    if (res.ok) {
      const data = await res.json();
      setStreak(data.streak);
      setDone(true);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="text-5xl font-bold text-black dark:text-zinc-50">🔥 {streak}</p>
      <p className="text-sm text-zinc-500">dias seguidos</p>
      <button
        onClick={handleLog}
        disabled={done}
        className="rounded-full bg-foreground px-8 py-4 text-base font-medium text-background hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
      >
        {done ? "Registrado hoje ✓" : "Registrar hoje"}
      </button>
    </div>
  );
}
