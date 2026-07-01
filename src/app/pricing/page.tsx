import { createClient } from "@/lib/supabase/server";

const TIERS = [
  {
    name: "Plus",
    price: "$9/mês",
    productEnv: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PLUS,
    features: ["Hábitos ilimitados", "Insights semanais personalizados"],
  },
  {
    name: "Pro",
    price: "$18/mês",
    productEnv: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO,
    features: ["Tudo do Plus", "Relatórios avançados", "Suporte prioritário"],
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 bg-zinc-50 px-6 py-24 dark:bg-black">
      <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">Escolha seu plano</h1>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
        {TIERS.map((tier) => {
          const params = new URLSearchParams({ products: tier.productEnv ?? "" });
          if (user) {
            params.set("customerEmail", user.email ?? "");
            params.set("customerExternalId", user.id);
          }
          const checkoutHref = `/api/checkout?${params.toString()}`;

          return (
            <div key={tier.name} className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-950">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50">{tier.name}</h2>
              <p className="text-3xl font-bold text-black dark:text-zinc-50">{tier.price}</p>
              <ul className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                {tier.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <a
                href={user ? checkoutHref : "/login"}
                className="mt-auto rounded-full bg-foreground px-6 py-3 text-center text-sm font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                {user ? "Assinar" : "Entrar para assinar"}
              </a>
            </div>
          );
        })}
      </div>
    </main>
  );
}
