import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    tagline: "Para começar o hábito",
    features: ["Registro diário", "Sequência (streak)", "1 hábito acompanhado"],
  },
  {
    name: "Plus",
    price: "$9/mês",
    tagline: "Para quem quer manter o ritmo",
    features: ["Tudo do Free", "Hábitos ilimitados", "Insights semanais personalizados"],
    highlight: true,
  },
  {
    name: "Pro",
    price: "$18/mês",
    tagline: "Para resultado sério",
    features: ["Tudo do Plus", "Relatórios avançados", "Suporte prioritário"],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-5xl flex-col items-center gap-24 px-6 py-24">
        {/* Hero */}
        <section className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-black sm:text-5xl dark:text-zinc-50">
            Construa o hábito de saúde que você nunca conseguiu manter
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Um plano de 7 dias personalizado para o seu objetivo, com lembretes que
            criam consistência de verdade — sem planilhas, sem complicação.
          </p>
          <WaitlistForm />
        </section>

        {/* How it works */}
        <section className="grid w-full grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { step: "1", title: "Responda 3 perguntas", desc: "Seu objetivo, seu nível atual e seu maior obstáculo." },
            { step: "2", title: "Receba seu plano", desc: "Um plano de 7 dias gerado na hora, feito pra você." },
            { step: "3", title: "Registre em 1 toque", desc: "Um lembrete diário e um toque para manter a sequência." },
          ].map((s) => (
            <div key={s.step} className="flex flex-col gap-2 rounded-xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-zinc-950">
              <span className="text-sm font-medium text-zinc-400">Passo {s.step}</span>
              <h3 className="text-lg font-semibold text-black dark:text-zinc-50">{s.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{s.desc}</p>
            </div>
          ))}
        </section>

        {/* Pricing */}
        <section className="flex w-full flex-col items-center gap-8">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">Planos</h2>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col gap-4 rounded-2xl border p-6 ${
                  plan.highlight
                    ? "border-black bg-white shadow-lg dark:border-white dark:bg-zinc-950"
                    : "border-black/10 bg-white dark:border-white/10 dark:bg-zinc-950"
                }`}
              >
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-zinc-50">{plan.name}</h3>
                  <p className="text-sm text-zinc-500">{plan.tagline}</p>
                </div>
                <p className="text-3xl font-bold text-black dark:text-zinc-50">{plan.price}</p>
                <ul className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link
            href="/pricing"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Ver planos e assinar
          </Link>
        </section>
      </main>
    </div>
  );
}
