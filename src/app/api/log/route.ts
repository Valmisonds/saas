import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  value: z.number().optional(),
  note: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const userId = userData.user.id;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

  const { error: logError } = await supabase
    .from("habit_logs")
    .upsert(
      { user_id: userId, logged_on: today, value: parsed.data.value, note: parsed.data.note },
      { onConflict: "user_id,logged_on" },
    );
  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 500 });
  }

  const { data: yesterdayLog } = await supabase
    .from("habit_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("logged_on", yesterday)
    .maybeSingle();

  const { data: profile } = await supabase
    .from("profiles")
    .select("current_streak, longest_streak")
    .eq("id", userId)
    .single();

  const newStreak = yesterdayLog ? (profile?.current_streak ?? 0) + 1 : 1;
  const newLongest = Math.max(newStreak, profile?.longest_streak ?? 0);

  await supabase
    .from("profiles")
    .update({ current_streak: newStreak, longest_streak: newLongest })
    .eq("id", userId);

  return NextResponse.json({ streak: newStreak, longestStreak: newLongest });
}
