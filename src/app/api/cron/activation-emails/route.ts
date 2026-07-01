import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { renderActivationEmail, type ActivationDay } from "@/lib/emails/templates";

// Days-since-signup -> which template to send. Matches the activation sequence
// designed in the growth plan (day1 welcome, day2 nudge, day3 tip, day5 milestone, day7 paywall).
const SCHEDULE: { day: number; template: ActivationDay }[] = [
  { day: 1, template: "day1" },
  { day: 2, template: "day2" },
  { day: 3, template: "day3" },
  { day: 5, template: "day5" },
  { day: 7, template: "day7" },
];

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Resend isn't set up yet — skip quietly instead of erroring on every cron run.
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ sent: 0, skipped: "RESEND_API_KEY not configured" });
  }

  const supabase = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);
  let sent = 0;

  for (const { day, template } of SCHEDULE) {
    const from = new Date(Date.now() - day * 86_400_000);
    const to = new Date(Date.now() - (day - 1) * 86_400_000);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, goal, plan, current_streak, sent_emails")
      .gte("created_at", from.toISOString())
      .lt("created_at", to.toISOString())
      .not("sent_emails", "cs", `{${template}}`);

    for (const profile of profiles ?? []) {
      const { data: todayLog } = await supabase
        .from("habit_logs")
        .select("id")
        .eq("user_id", profile.id)
        .eq("logged_on", today)
        .maybeSingle();

      const { subject, html } = renderActivationEmail(template, {
        goal: profile.goal,
        hasLoggedToday: !!todayLog,
        currentStreak: profile.current_streak,
        plan: profile.plan,
      });

      await getResend().emails.send({ from: FROM_EMAIL, to: profile.email, subject, html });
      await supabase
        .from("profiles")
        .update({ sent_emails: [...(profile.sent_emails ?? []), template] })
        .eq("id", profile.id);
      sent++;
    }
  }

  return NextResponse.json({ sent });
}
