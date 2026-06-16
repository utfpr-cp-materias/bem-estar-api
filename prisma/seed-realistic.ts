import { PrismaClient, QuestionCategory, ReportCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { calculateOverallScore, categorizeScore } from '../src/utils/scoreCalculator';

const prisma = new PrismaClient();

const DAYS = 10;

const daysAgo = (n: number) => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
};

const atHour = (date: Date, hour: number, minute = 0) => {
  const d = new Date(date);
  d.setUTCHours(hour, minute, 0, 0);
  return d;
};

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  birthDate: Date;
  onboardingAnswers: Partial<Record<QuestionCategory, number>>;
  dailyMood: number[];
  dailyEnergy: number[];
  dailySleep: number[];
  dailyAnxiety: number[];
  dailyNotes: (string | null)[];
  goals: { slug: string; title: string; description: string; category: any; frequency: any; targetValue: number; unit: string; completionRate: number }[];
  emotions: { dayOffset: number; hour: number; emotionSlug: string; intensity: number; notes?: string }[];
}

const lucas: UserProfile = {
  id: 'user-real-lucas',
  email: 'lucas.silva@usuario.com',
  name: 'Lucas Silva',
  phone: '11988887777',
  birthDate: new Date('1996-04-12'),
  onboardingAnswers: {
    EMOTIONAL_WELLBEING: 5, ANXIETY: 7, STRESS: 8, MOOD: 6,
    ENERGY: 4, CONCENTRATION: 6, SOCIAL: 6, IMPROVEMENT_GOALS: 9,
  },
  dailyMood:    [5, 5, 6, 5, 6, 7, 6, 7, 7, 8],
  dailyEnergy:  [4, 5, 5, 6, 5, 6, 7, 6, 7, 7],
  dailySleep:   [5, 6, 6, 7, 6, 7, 7, 8, 7, 8],
  dailyAnxiety: [7, 7, 6, 6, 5, 5, 4, 4, 3, 3],
  dailyNotes: [
    'Dia difícil, muita pressão no trabalho.',
    null,
    'Comecei a meditar pela manhã.',
    null,
    null,
    'Caminhei no parque, ajudou bastante.',
    null,
    'Reunião pesada, mas consegui respirar antes.',
    null,
    'Acordei descansado pela primeira vez na semana.',
  ],
  goals: [
    { slug: 'meditar', title: 'Meditar 10 minutos', description: 'Sessão guiada pela manhã', category: 'MEDITATION', frequency: 'DAILY', targetValue: 10, unit: 'minutos', completionRate: 0.7 },
    { slug: 'caminhar', title: 'Caminhar 30 minutos', description: 'Volta no parque após o trabalho', category: 'EXERCISE', frequency: 'DAILY', targetValue: 30, unit: 'minutos', completionRate: 0.5 },
    { slug: 'dormir', title: 'Dormir 8 horas', description: 'Apagar telas às 23h', category: 'SLEEP', frequency: 'DAILY', targetValue: 8, unit: 'horas', completionRate: 0.6 },
  ],
  emotions: [
    { dayOffset: 9, hour: 19, emotionSlug: 'estresse', intensity: 8, notes: 'Final de prazo apertado.' },
    { dayOffset: 9, hour: 22, emotionSlug: 'ansiedade', intensity: 7 },
    { dayOffset: 8, hour: 20, emotionSlug: 'frustracao', intensity: 6 },
    { dayOffset: 7, hour: 8,  emotionSlug: 'calma', intensity: 5, notes: 'Primeira meditação.' },
    { dayOffset: 7, hour: 19, emotionSlug: 'frustracao', intensity: 6 },
    { dayOffset: 6, hour: 21, emotionSlug: 'ansiedade', intensity: 5 },
    { dayOffset: 5, hour: 18, emotionSlug: 'calma', intensity: 6 },
    { dayOffset: 4, hour: 17, emotionSlug: 'satisfacao', intensity: 7, notes: 'Caminhada longa.' },
    { dayOffset: 3, hour: 9,  emotionSlug: 'esperanca', intensity: 6 },
    { dayOffset: 2, hour: 20, emotionSlug: 'estresse', intensity: 6 },
    { dayOffset: 1, hour: 10, emotionSlug: 'gratidao', intensity: 7 },
    { dayOffset: 0, hour: 8,  emotionSlug: 'felicidade', intensity: 8, notes: 'Acordei bem pela primeira vez.' },
  ],
};

const helena: UserProfile = {
  id: 'user-real-helena',
  email: 'helena.costa@usuario.com',
  name: 'Helena Costa',
  phone: '11977776666',
  birthDate: new Date('2001-08-22') ,
  onboardingAnswers: {
    EMOTIONAL_WELLBEING: 7, ANXIETY: 5, STRESS: 5, MOOD: 4,
    ENERGY: 6, CONCENTRATION: 4, SOCIAL: 5, IMPROVEMENT_GOALS: 7,
  },
  dailyMood:    [6, 7, 6, 8, 7, 4, 5, 7, 8, 7],
  dailyEnergy:  [6, 7, 6, 7, 6, 4, 5, 7, 7, 7],
  dailySleep:   [7, 7, 6, 8, 7, 5, 6, 7, 8, 8],
  dailyAnxiety: [4, 4, 5, 3, 4, 8, 6, 4, 3, 4],
  dailyNotes: [
    null,
    'Dia tranquilo, treino leve depois do trabalho.',
    null,
    'Reencontro com amiga da facul, ótimo dia.',
    null,
    'Discussão familiar, dormi mal.',
    'Ainda processando ontem.',
    null,
    'Voltei a sentir leveza.',
    null,
  ],
  goals: [
    { slug: 'gratidao', title: 'Diário de gratidão', description: '3 coisas boas antes de dormir', category: 'MINDFULNESS', frequency: 'DAILY', targetValue: 3, unit: 'itens', completionRate: 0.8 },
    { slug: 'amigos', title: 'Conversar com alguém', description: 'Mensagem ou ligação para um amigo', category: 'SOCIAL', frequency: 'DAILY', targetValue: 1, unit: 'contato', completionRate: 0.7 },
  ],
  emotions: [
    { dayOffset: 9, hour: 12, emotionSlug: 'neutro', intensity: 5 },
    { dayOffset: 8, hour: 19, emotionSlug: 'satisfacao', intensity: 6, notes: 'Treino leve, mente clara.' },
    { dayOffset: 7, hour: 21, emotionSlug: 'tedio', intensity: 4 },
    { dayOffset: 6, hour: 15, emotionSlug: 'felicidade', intensity: 8, notes: 'Café com a Bia.' },
    { dayOffset: 5, hour: 22, emotionSlug: 'gratidao', intensity: 7 },
    { dayOffset: 4, hour: 22, emotionSlug: 'tristeza', intensity: 7, notes: 'Discussão em casa.' },
    { dayOffset: 4, hour: 23, emotionSlug: 'raiva', intensity: 6 },
    { dayOffset: 3, hour: 10, emotionSlug: 'culpa', intensity: 5 },
    { dayOffset: 2, hour: 17, emotionSlug: 'calma', intensity: 6 },
    { dayOffset: 1, hour: 8,  emotionSlug: 'esperanca', intensity: 7, notes: 'Conversamos.' },
    { dayOffset: 0, hour: 9,  emotionSlug: 'gratidao', intensity: 7 },
  ],
};

async function getQuestionsByCategory(): Promise<Record<QuestionCategory, string>> {
  const all = await prisma.question.findMany();
  const map = {} as Record<QuestionCategory, string>;
  for (const q of all) map[q.category] = q.id;
  return map;
}

async function resolveEmotion(slugAttempt: string): Promise<string> {
  const fallback = 'neutro';
  const tryIds = [`emo-${slugAttempt}`, `emo-${fallback}`];
  for (const id of tryIds) {
    const e = await prisma.emotion.findUnique({ where: { id } });
    if (e) return e.id;
  }
  throw new Error(`Nenhuma emoção encontrada (tentou: ${tryIds.join(', ')})`);
}

async function seedUser(profile: UserProfile, questionMap: Record<QuestionCategory, string>) {
  const password = await bcrypt.hash('Senha123!', 10);

  await prisma.user.upsert({
    where: { email: profile.email },
    update: {
      name: profile.name,
      phone: profile.phone,
      birthDate: profile.birthDate,
      onboardingCompleted: true,
    },
    create: {
      id: profile.id,
      email: profile.email,
      password,
      name: profile.name,
      phone: profile.phone,
      birthDate: profile.birthDate,
      onboardingCompleted: true,
      createdAt: daysAgo(DAYS),
    },
  });

  const onboardingDate = daysAgo(DAYS);
  const onboardingAnswers: { questionId: string; value: number; category: QuestionCategory }[] = [];
  for (const [category, value] of Object.entries(profile.onboardingAnswers) as [QuestionCategory, number][]) {
    const questionId = questionMap[category];
    if (!questionId) continue;
    onboardingAnswers.push({ questionId, value, category });
    await prisma.questionnaireResponse.upsert({
      where: {
        userId_questionId_answeredAt: { userId: profile.id, questionId, answeredAt: onboardingDate },
      },
      update: { value },
      create: { userId: profile.id, questionId, value, answeredAt: onboardingDate },
    });
  }

  for (let i = 0; i < DAYS; i++) {
    const date = daysAgo(DAYS - 1 - i);
    await prisma.dailyCheckIn.upsert({
      where: { userId_date: { userId: profile.id, date } },
      update: {
        overallMood: profile.dailyMood[i],
        energyLevel: profile.dailyEnergy[i],
        sleepQuality: profile.dailySleep[i],
        anxietyLevel: profile.dailyAnxiety[i],
        notes: profile.dailyNotes[i],
      },
      create: {
        userId: profile.id,
        date,
        overallMood: profile.dailyMood[i],
        energyLevel: profile.dailyEnergy[i],
        sleepQuality: profile.dailySleep[i],
        anxietyLevel: profile.dailyAnxiety[i],
        notes: profile.dailyNotes[i],
      },
    });
  }

  await prisma.emotionRecord.deleteMany({ where: { userId: profile.id } });
  for (const e of profile.emotions) {
    const emotionId = await resolveEmotion(e.emotionSlug);
    const recordedAt = atHour(daysAgo(e.dayOffset), e.hour);
    await prisma.emotionRecord.create({
      data: {
        userId: profile.id,
        emotionId,
        intensity: e.intensity,
        notes: e.notes ?? null,
        recordedAt,
      },
    });
  }

  for (const g of profile.goals) {
    const goalId = `goal-${profile.id}-${g.slug}`;
    await prisma.goal.upsert({
      where: { id: goalId },
      update: { title: g.title, description: g.description, category: g.category, frequency: g.frequency, targetValue: g.targetValue, unit: g.unit },
      create: { id: goalId, userId: profile.id, title: g.title, description: g.description, category: g.category, frequency: g.frequency, targetValue: g.targetValue, unit: g.unit, createdAt: daysAgo(DAYS - 1) },
    });

    for (let i = 0; i < DAYS; i++) {
      const date = daysAgo(DAYS - 1 - i);
      const completed = ((i * 31 + g.slug.length) % 10) / 10 < g.completionRate;
      await prisma.goalProgress.upsert({
        where: { goalId_date: { goalId, date } },
        update: { completed, value: completed ? g.targetValue : Math.floor(g.targetValue / 2) },
        create: { goalId, date, completed, value: completed ? g.targetValue : Math.floor(g.targetValue / 2) },
      });
    }
  }

  const onboardingScore = calculateOverallScore(
    onboardingAnswers,
    onboardingAnswers.map((a) => ({ id: a.questionId, category: a.category })),
  );
  const onboardingCategory: ReportCategory = categorizeScore(onboardingScore);

  await prisma.report.upsert({
    where: { id: `rep-${profile.id}-onboarding` },
    update: { overallScore: onboardingScore, category: onboardingCategory },
    create: {
      id: `rep-${profile.id}-onboarding`,
      userId: profile.id,
      type: 'ONBOARDING',
      periodStart: onboardingDate,
      periodEnd: onboardingDate,
      overallScore: onboardingScore,
      category: onboardingCategory,
      insights: { summary: 'Relatório inicial gerado após o questionário.' },
      recommendations: { items: ['Faça check-ins diários', 'Acompanhe suas metas', 'Explore os recursos de autoajuda'] },
    },
  });

  const weeklyStart = daysAgo(6);
  const weeklyEnd = daysAgo(0);
  const last7Mood = profile.dailyMood.slice(-7);
  const avgMood = last7Mood.reduce((a, b) => a + b, 0) / last7Mood.length;
  const weeklyCategory: ReportCategory = categorizeScore(avgMood);

  await prisma.report.upsert({
    where: { id: `rep-${profile.id}-weekly-${weeklyEnd.toISOString().slice(0, 10)}` },
    update: { overallScore: avgMood, category: weeklyCategory },
    create: {
      id: `rep-${profile.id}-weekly-${weeklyEnd.toISOString().slice(0, 10)}`,
      userId: profile.id,
      type: 'WEEKLY',
      periodStart: weeklyStart,
      periodEnd: weeklyEnd,
      overallScore: avgMood,
      category: weeklyCategory,
      insights: { summary: `Humor médio nos últimos 7 dias: ${avgMood.toFixed(1)}.` },
      recommendations: { items: avgMood >= 6.5 ? ['Continue mantendo seus hábitos', 'Compartilhe o que está funcionando'] : ['Reforce a rotina de sono', 'Mantenha as metas de autocuidado'] },
    },
  });
}

async function main() {
  console.log(`🌱 Populando 2 usuários com ${DAYS} dias de uso...\n`);
  const questionMap = await getQuestionsByCategory();
  if (Object.keys(questionMap).length === 0) {
    throw new Error('Nenhuma pergunta encontrada. Rode `npm run prisma:seed` primeiro.');
  }

  for (const profile of [lucas, helena]) {
    await seedUser(profile, questionMap);
    console.log(`  • ${profile.name} (${profile.email}) — onboarding D-${DAYS}, ${DAYS} check-ins, emoções, metas, 2 relatórios`);
  }

  console.log('\n🎉 Pronto! Senha de ambos: Senha123!');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
