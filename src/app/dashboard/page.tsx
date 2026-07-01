import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingQuiz } from "./OnboardingQuiz";
import { LogAction } from "./LogAction";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarded_at, current_streak, plan")
    .eq("id", userData.user.id)
    .single();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 px-6 dark:bg-black">
      {profile?.onboarded_at ? (
        <LogAction initialStreak={profile.current_streak} />
      ) : (
        <OnboardingQuiz />
      )}
    </main>
  );
}
