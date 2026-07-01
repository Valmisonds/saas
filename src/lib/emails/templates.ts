export type ActivationDay = "day1" | "day2" | "day3" | "day5" | "day7";

type TemplateInput = {
  goal: string | null;
  hasLoggedToday: boolean;
  currentStreak: number;
  plan: string;
};

const GOAL_TIPS: Record<string, string> = {
  sleep: "Dormir no mesmo horário todos os dias, mesmo no fim de semana, é o ajuste que mais melhora a qualidade do sono — mais do que a quantidade de horas.",
  hydration: "Beber um copo de água assim que acordar, antes até do café, ajuda a criar o hábito sem depender de lembrar ao longo do dia.",
  exercise: "5 minutos de movimento contam. O objetivo nas primeiras semanas é frequência, não intensidade.",
};

export function renderActivationEmail(day: ActivationDay, input: TemplateInput): { subject: string; html: string } {
  const tip = (input.goal && GOAL_TIPS[input.goal]) ?? GOAL_TIPS.exercise;

  switch (day) {
    case "day1":
      return {
        subject: "Bem-vindo — aqui está o que esperar",
        html: `<p>Você acabou de dar o primeiro passo. Nos próximos dias vamos te mandar só o essencial: um lembrete pra registrar e uma dica rápida ligada ao seu objetivo.</p><p>Nada de spam, prometido.</p>`,
      };
    case "day2":
      return input.hasLoggedToday
        ? { subject: "Você já registrou hoje — só reforçando", html: `<p>Continue assim, é a sequência que constrói o hábito.</p>` }
        : { subject: "Você esqueceu de registrar hoje?", html: `<p>Leva 10 segundos. <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Registrar agora</a>.</p>` };
    case "day3":
      return { subject: "Uma dica rápida pra você", html: `<p>${tip}</p>` };
    case "day5":
      return {
        subject: `Você já está no dia ${input.currentStreak} 🔥`,
        html: `<p>Isso é mais longe do que a maioria chega. Continue — cada dia fica mais fácil manter.</p>`,
      };
    case "day7":
      return input.plan === "free"
        ? {
            subject: "O que o Plus desbloqueia pra você",
            html: `<p>Você já usou o app por uma semana. No plano Plus você acompanha hábitos ilimitados e recebe um insight semanal personalizado sobre o seu progresso.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing">Ver planos</a>.</p>`,
          }
        : { subject: "Uma semana de progresso 🎉", html: `<p>Obrigado por assinar — seu progresso continua valendo a pena.</p>` };
  }
}
