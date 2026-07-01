import { CustomerPortal } from "@polar-sh/nextjs";
import { createClient } from "@/lib/supabase/server";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: (process.env.POLAR_SERVER as "sandbox" | "production") ?? "sandbox",
  getExternalCustomerId: async () => {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? "";
  },
});
