import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  goal: z.string().min(1),
  obstacle: z.string().min(1),
});

// Templated "aha moment" insight — no LLM call needed, keeps this free to run at any volume.
function buildPlan(goal: string, obstacle: string) {
  const plans: Record<string, string> = {
    sleep: "Vá para a cama 15 minutos mais cedo hoje. Nada mais. Amanhã registramos e ajustamos.",
    hydration: "Deixe um copo cheio de água visível na sua mesa agora. Beba antes de qualquer café.",
    exercise: "Hoje, 5 minutos contam. Só precisamos que você comece — a consistência vem depois.",
  };
  const obstacles: Record<string, string> = {
    "falta de tempo": "Vamos manter o registro em menos de 10 segundos por dia.",
    "esquecimento": "Vamos te mandar um lembrete no horário que funcionar melhor pra você.",
    "falta de motivacao": "Sua sequência (streak) vai aparecer aqui todo dia — pequenas vitórias visíveis ajudam mais que motivação.",
  };
  const base = plans[goal] ?? "Seu primeiro passo de hoje: registre uma vez, só isso.";
  const extra = obstacles[obstacle] ?? "";
  return `${base} ${extra}`.trim();
}

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }
  const { goal, obstacle } = parsed.data;

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ goal, obstacle, onboarded_at: new Date().toISOString() })
    .eq("id", userData.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ plan: buildPlan(goal, obstacle) });
}
