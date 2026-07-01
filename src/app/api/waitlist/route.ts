import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM_EMAIL } from "@/lib/resend";

const bodySchema = z.object({
  email: z.string().email(),
  goal: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
  }
  const { email, goal } = parsed.data;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("waitlist")
    .upsert({ email, goal }, { onConflict: "email" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Best-effort: the waitlist signup itself must not fail just because email isn't set up yet.
  if (process.env.RESEND_API_KEY) {
    try {
      await getResend().emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Você está na lista 🎉",
        html: `<p>Obrigado por entrar na lista de espera! Avisamos assim que abrirmos o acesso.</p>`,
      });
    } catch {
      // email confirmation is a nice-to-have; the signup already succeeded above
    }
  }

  return NextResponse.json({ ok: true });
}
