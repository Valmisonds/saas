import { Resend } from "resend";

let cached: Resend | null = null;

// Lazily constructed so builds / page-data collection don't crash before
// RESEND_API_KEY is configured. Throws only if you actually try to send an email without it.
export function getResend(): Resend {
  if (!cached) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set — add it to .env.local (see README setup checklist)");
    }
    cached = new Resend(process.env.RESEND_API_KEY);
  }
  return cached;
}

// Change this once you've verified a domain in Resend (Dashboard > Domains).
// Until then Resend only lets you send from "onboarding@resend.dev" to your own account email.
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
