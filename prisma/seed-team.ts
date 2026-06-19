import { PrismaClient, QuestionCategory, ReportCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { calculateOverallScore, categorizeScore } from '../src/utils/scoreCalculator';

const prisma = new PrismaClient();

// 30 dias = 4 semanas + 2 dias. Cada array de daily* tem 30 entradas, do dia mais antigo (índice 0)
// até hoje (índice 29). Os arcos foram desenhados pra criar diferença real entre o relatório
// semanal (últimos 7) e o mensal (últimos 30).
const DAYS = 30;
const TEAM_PASSWORD = 'bemestar2026';

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
  ra: string;
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

// === EQUIPE APP BEM ESTAR — UTFPR-CP ===
// Arco geral por usuário em 30 dias:
//  S4 (mais antigo) → S3 → S2 → S1 (atual). Cada um tem uma trajetória própria.

const antonio: UserProfile = {
  id: 'user-team-antonio',
  email: 'antonioaugusto@alunos.utfpr.edu.br',
  name: 'Antônio Augusto Polizel Passeto',
  ra: '2600897',
  phone: '43999990001',
  birthDate: new Date('2003-02-14'),
  onboardingAnswers: {
    EMOTIONAL_WELLBEING: 6, ANXIETY: 7, STRESS: 8, MOOD: 5,
    ENERGY: 6, CONCENTRATION: 7, SOCIAL: 5, IMPROVEMENT_GOALS: 9,
  },
  // Arco: começou estável, piorou no meio (crunch da Fase 2), estabilizou, melhorou na última semana
  dailyMood:    [6,6,6,5,6,5,6,7,  5,4,4,5,4,5,4,  5,5,5,6,5,6,6,6,  6,7,7,8,8,8,8],
  dailyEnergy:  [6,6,5,5,6,5,6,6,  5,5,4,5,4,5,5,  5,5,5,6,5,6,7,6,  6,7,7,7,8,8,8],
  dailySleep:   [7,6,7,5,6,6,7,6,  5,5,5,5,5,6,5,  6,5,5,6,5,7,7,6,  6,7,7,7,8,8,8],
  dailyAnxiety: [6,6,6,7,6,7,5,5,  7,8,8,7,8,7,8,  7,8,7,6,7,6,5,6,  6,5,5,4,3,3,3],
  dailyNotes: [
    null, null, 'Trimestre começando, ritmo bom.', null, null, null, null, null,
    'Sprint da Fase 2 ficou pesado.', null, null, 'Acordei mal humorado.', null, null, 'Reunião difícil.',
    null, null, 'Comecei a meditar de manhã.', null, null, null, null, 'Tô melhorando.',
    null, 'JWT funcionando!', null, 'Caminhei depois do código.', null, null, 'Sprint fechou.',
  ],
  goals: [
    { slug: 'estudar', title: 'Estudar 1h por dia', description: 'Foco em arquitetura back-end', category: 'OTHER', frequency: 'DAILY', targetValue: 60, unit: 'minutos', completionRate: 0.8 },
    { slug: 'pausas', title: 'Fazer pausas de 5min', description: 'A cada 1h de código', category: 'MINDFULNESS', frequency: 'DAILY', targetValue: 4, unit: 'pausas', completionRate: 0.6 },
    { slug: 'dormir', title: 'Dormir 7h', description: 'Apagar tela à meia-noite', category: 'SLEEP', frequency: 'DAILY', targetValue: 7, unit: 'horas', completionRate: 0.7 },
  ],
  emotions: [
    { dayOffset: 28, hour: 14, emotionSlug: 'esperanca', intensity: 6 },
    { dayOffset: 25, hour: 19, emotionSlug: 'satisfacao', intensity: 6 },
    { dayOffset: 22, hour: 21, emotionSlug: 'estresse', intensity: 7, notes: 'Sprint começou.' },
    { dayOffset: 20, hour: 23, emotionSlug: 'ansiedade', intensity: 8 },
    { dayOffset: 18, hour: 22, emotionSlug: 'frustracao', intensity: 7 },
    { dayOffset: 16, hour: 11, emotionSlug: 'estresse', intensity: 8, notes: 'Code review pesado.' },
    { dayOffset: 14, hour: 20, emotionSlug: 'ansiedade', intensity: 7 },
    { dayOffset: 12, hour: 17, emotionSlug: 'frustracao', intensity: 6 },
    { dayOffset: 10, hour: 18, emotionSlug: 'calma', intensity: 5, notes: 'Comecei meditação.' },
    { dayOffset: 8, hour: 21, emotionSlug: 'esperanca', intensity: 6 },
    { dayOffset: 6, hour: 19, emotionSlug: 'calma', intensity: 7 },
    { dayOffset: 5, hour: 21, emotionSlug: 'satisfacao', intensity: 7, notes: 'PR aprovado.' },
    { dayOffset: 3, hour: 22, emotionSlug: 'gratidao', intensity: 8 },
    { dayOffset: 2, hour: 8, emotionSlug: 'calma', intensity: 8 },
    { dayOffset: 1, hour: 18, emotionSlug: 'felicidade', intensity: 8, notes: 'Caminhada longa.' },
    { dayOffset: 0, hour: 9, emotionSlug: 'felicidade', intensity: 8, notes: 'Sprint fechada.' },
  ],
};

const gabriel: UserProfile = {
  id: 'user-team-gabriel',
  email: 'gabrielgarcia@alunos.utfpr.edu.br',
  name: 'Gabriel Pereira Garcia',
  ra: '2600935',
  phone: '43999990002',
  birthDate: new Date('2002-09-05'),
  onboardingAnswers: {
    EMOTIONAL_WELLBEING: 7, ANXIETY: 6, STRESS: 6, MOOD: 7,
    ENERGY: 7, CONCENTRATION: 7, SOCIAL: 6, IMPROVEMENT_GOALS: 8,
  },
  // Arco: começou bom, semana de bug ruim, recuperou, mantendo bom
  dailyMood:    [7,7,7,6,7,7,7,7,  6,5,5,6,5,6,5,  7,7,7,6,7,7,8,7,  7,8,7,8,8,8,8],
  dailyEnergy:  [7,7,7,6,7,6,7,7,  6,5,5,6,5,6,6,  6,7,7,7,7,7,7,7,  7,8,7,8,8,8,8],
  dailySleep:   [7,7,6,7,7,7,7,7,  6,5,6,6,5,6,6,  7,7,7,7,7,8,7,7,  7,7,8,8,8,8,8],
  dailyAnxiety: [5,5,5,5,5,5,6,5,  6,7,7,7,7,6,7,  5,4,4,5,4,4,3,4,  4,3,4,3,3,3,3],
  dailyNotes: [
    null, null, 'Começo do trimestre tranquilo.', null, null, null, null, null,
    null, 'Bug do Prisma me prendeu.', null, 'Ainda no bug.', null, null, 'Resolvi finalmente.',
    null, null, 'Pareamento com o Antonio.', null, null, 'Score validation no PR.', null, null,
    null, 'PR aprovado.', null, 'Code review feito.', null, null, 'Pronto pra entrega.',
  ],
  goals: [
    { slug: 'corrida', title: 'Correr 5km', description: '3x na semana', category: 'EXERCISE', frequency: 'WEEKLY', targetValue: 5, unit: 'km', completionRate: 0.7 },
    { slug: 'leitura', title: 'Ler 20 páginas', description: 'Livro técnico ou ficção', category: 'OTHER', frequency: 'DAILY', targetValue: 20, unit: 'páginas', completionRate: 0.6 },
  ],
  emotions: [
    { dayOffset: 27, hour: 16, emotionSlug: 'satisfacao', intensity: 7 },
    { dayOffset: 24, hour: 14, emotionSlug: 'calma', intensity: 7 },
    { dayOffset: 21, hour: 11, emotionSlug: 'frustracao', intensity: 7, notes: 'Bug no Prisma.' },
    { dayOffset: 19, hour: 15, emotionSlug: 'frustracao', intensity: 7 },
    { dayOffset: 17, hour: 13, emotionSlug: 'ansiedade', intensity: 6 },
    { dayOffset: 15, hour: 16, emotionSlug: 'felicidade', intensity: 8, notes: 'Resolvi o bug!' },
    { dayOffset: 13, hour: 18, emotionSlug: 'gratidao', intensity: 7 },
    { dayOffset: 11, hour: 10, emotionSlug: 'satisfacao', intensity: 8 },
    { dayOffset: 9, hour: 20, emotionSlug: 'calma', intensity: 7 },
    { dayOffset: 7, hour: 14, emotionSlug: 'orgulho', intensity: 7, notes: 'PR mergeado.' },
    { dayOffset: 5, hour: 17, emotionSlug: 'satisfacao', intensity: 8 },
    { dayOffset: 3, hour: 9, emotionSlug: 'esperanca', intensity: 8 },
    { dayOffset: 1, hour: 11, emotionSlug: 'felicidade', intensity: 8 },
    { dayOffset: 0, hour: 11, emotionSlug: 'felicidade', intensity: 8 },
  ],
};

const octavio: UserProfile = {
  id: 'user-team-octavio',
  email: 'octaviomoraes@alunos.utfpr.edu.br',
  name: 'Octávio Luís Conejo de Moraes',
  ra: '2268108',
  phone: '43999990003',
  birthDate: new Date('2001-11-20'),
  onboardingAnswers: {
    EMOTIONAL_WELLBEING: 6, ANXIETY: 7, STRESS: 9, MOOD: 6,
    ENERGY: 5, CONCENTRATION: 6, SOCIAL: 8, IMPROVEMENT_GOALS: 9,
  },
  // Arco: estressado começo, agravou no meio (cobranças), aliviou, picos finais com entregas
  dailyMood:    [6,5,6,7,6,6,5,6,  5,5,5,6,5,5,6,  6,6,7,6,7,7,7,7,  6,7,7,7,8,7,8],
  dailyEnergy:  [5,5,5,6,6,5,5,6,  5,5,5,5,5,5,5,  6,6,6,6,6,7,7,6,  6,7,7,7,7,7,7],
  dailySleep:   [5,5,6,6,6,5,5,6,  5,5,5,5,5,5,5,  6,6,6,6,7,7,7,6,  6,7,7,7,7,7,7],
  dailyAnxiety: [7,8,7,6,7,7,8,7,  8,8,8,7,8,8,7,  6,6,5,7,5,5,5,5,  5,5,5,4,5,4,4],
  dailyNotes: [
    'Kickoff da Fase 2.', null, null, null, null, null, null, null,
    'Cliente cobrou roadmap.', null, 'Stand-up cheio.', null, null, 'Pressão de prazo.', null,
    null, 'Validei escopo.', null, null, null, 'Validação com psicólogos.', null, null,
    null, null, 'Fase 2 quase pronta.', null, 'Apresentação hoje.', null, 'Rodou bem!',
  ],
  goals: [
    { slug: 'standup', title: 'Stand-up diário', description: 'Daily 9h com a equipe', category: 'SOCIAL', frequency: 'DAILY', targetValue: 1, unit: 'reunião', completionRate: 0.9 },
    { slug: 'meditar', title: 'Meditar 10min', description: 'Antes da daily', category: 'MEDITATION', frequency: 'DAILY', targetValue: 10, unit: 'minutos', completionRate: 0.5 },
  ],
  emotions: [
    { dayOffset: 28, hour: 9, emotionSlug: 'esperanca', intensity: 7, notes: 'Kickoff da Fase 2.' },
    { dayOffset: 25, hour: 14, emotionSlug: 'estresse', intensity: 7 },
    { dayOffset: 22, hour: 17, emotionSlug: 'ansiedade', intensity: 8 },
    { dayOffset: 20, hour: 18, emotionSlug: 'estresse', intensity: 9, notes: 'Cliente cobrando.' },
    { dayOffset: 18, hour: 22, emotionSlug: 'ansiedade', intensity: 8 },
    { dayOffset: 16, hour: 14, emotionSlug: 'frustracao', intensity: 7 },
    { dayOffset: 14, hour: 15, emotionSlug: 'esperanca', intensity: 6 },
    { dayOffset: 12, hour: 16, emotionSlug: 'satisfacao', intensity: 7 },
    { dayOffset: 10, hour: 19, emotionSlug: 'gratidao', intensity: 7, notes: 'Equipe alinhada.' },
    { dayOffset: 8, hour: 11, emotionSlug: 'calma', intensity: 6 },
    { dayOffset: 6, hour: 15, emotionSlug: 'felicidade', intensity: 8 },
    { dayOffset: 4, hour: 20, emotionSlug: 'orgulho', intensity: 8 },
    { dayOffset: 2, hour: 18, emotionSlug: 'satisfacao', intensity: 7 },
    { dayOffset: 0, hour: 10, emotionSlug: 'gratidao', intensity: 8, notes: 'Apresentação rodou.' },
  ],
};

const marialuisa: UserProfile = {
  id: 'user-team-marialuisa',
  email: 'mariapalacios@alunos.utfpr.edu.br',
  name: 'Maria Luísa Paulo Palácios',
  ra: '2538920',
  phone: '43999990004',
  birthDate: new Date('2002-06-18'),
  onboardingAnswers: {
    EMOTIONAL_WELLBEING: 8, ANXIETY: 4, STRESS: 5, MOOD: 8,
    ENERGY: 7, CONCENTRATION: 7, SOCIAL: 8, IMPROVEMENT_GOALS: 7,
  },
  // Arco: estável-boa, bloqueio criativo numa semana, breakthrough, pico final
  dailyMood:    [7,7,7,8,7,8,7,7,  6,5,6,5,6,6,6,  7,8,7,8,7,8,8,8,  7,8,8,8,9,8,9],
  dailyEnergy:  [7,7,7,7,7,7,7,7,  6,6,6,6,6,6,6,  7,7,7,8,7,7,8,8,  7,8,8,8,8,8,8],
  dailySleep:   [7,7,7,7,7,7,7,7,  6,6,7,6,6,7,6,  7,7,7,8,7,7,8,8,  7,8,8,8,8,8,8],
  dailyAnxiety: [4,3,4,3,4,4,4,3,  5,6,5,6,5,6,5,  4,3,4,3,3,5,3,2,  3,3,3,3,2,3,2],
  dailyNotes: [
    null, null, null, null, null, 'Comecei wireframes.', null, null,
    'Bloqueio criativo chato.', null, null, 'Cansada de iterar.', null, null, null,
    'Insight novo de fluxo!', null, null, 'Iterei o dashboard.', null, null, null, 'Validei com a Tay.',
    null, null, 'Adorei como ficou a tela de meta!', null, null, null, 'Protótipo entregue!',
  ],
  goals: [
    { slug: 'desenhar', title: 'Desenhar livre 20min', description: 'Pra descansar a cabeça', category: 'OTHER', frequency: 'DAILY', targetValue: 20, unit: 'minutos', completionRate: 0.8 },
    { slug: 'agua', title: 'Beber 2L de água', description: 'Garrafa na mesa', category: 'SELF_CARE', frequency: 'DAILY', targetValue: 2, unit: 'litros', completionRate: 0.7 },
  ],
  emotions: [
    { dayOffset: 27, hour: 15, emotionSlug: 'satisfacao', intensity: 7 },
    { dayOffset: 24, hour: 11, emotionSlug: 'calma', intensity: 7 },
    { dayOffset: 22, hour: 17, emotionSlug: 'felicidade', intensity: 8 },
    { dayOffset: 20, hour: 19, emotionSlug: 'frustracao', intensity: 6, notes: 'Bloqueio criativo.' },
    { dayOffset: 18, hour: 16, emotionSlug: 'tedio', intensity: 5 },
    { dayOffset: 16, hour: 13, emotionSlug: 'frustracao', intensity: 5 },
    { dayOffset: 14, hour: 14, emotionSlug: 'esperanca', intensity: 7, notes: 'Vislumbre de ideia.' },
    { dayOffset: 12, hour: 17, emotionSlug: 'felicidade', intensity: 8 },
    { dayOffset: 10, hour: 11, emotionSlug: 'calma', intensity: 7 },
    { dayOffset: 8, hour: 19, emotionSlug: 'gratidao', intensity: 8 },
    { dayOffset: 6, hour: 13, emotionSlug: 'esperanca', intensity: 7 },
    { dayOffset: 4, hour: 16, emotionSlug: 'satisfacao', intensity: 8 },
    { dayOffset: 3, hour: 10, emotionSlug: 'orgulho', intensity: 8 },
    { dayOffset: 2, hour: 20, emotionSlug: 'felicidade', intensity: 9 },
    { dayOffset: 1, hour: 9, emotionSlug: 'calma', intensity: 8 },
    { dayOffset: 0, hour: 14, emotionSlug: 'gratidao', intensity: 9, notes: 'Entrega da Fase 2.' },
  ],
};

const taynara: UserProfile = {
  id: 'user-team-taynara',
  email: 'taynarapecorario@alunos.utfpr.edu.br',
  name: 'Taynara Luísa Pecorario',
  ra: '1914154',
  phone: '43999990005',
  birthDate: new Date('1999-03-30'),
  onboardingAnswers: {
    EMOTIONAL_WELLBEING: 7, ANXIETY: 5, STRESS: 6, MOOD: 7,
    ENERGY: 6, CONCENTRATION: 7, SOCIAL: 6, IMPROVEMENT_GOALS: 8,
  },
  // Arco: começou aprendendo, frustrações com CSS, começou produzir, semana atual ótima
  dailyMood:    [6,5,6,6,5,6,6,7,  5,5,6,5,6,5,5,  6,6,7,7,7,7,7,7,  7,8,7,7,8,8,8],
  dailyEnergy:  [6,5,6,6,6,6,6,7,  5,6,6,5,6,6,5,  6,6,6,7,7,7,7,7,  7,8,7,7,8,8,8],
  dailySleep:   [6,6,6,6,6,6,7,7,  6,6,7,6,6,6,6,  6,7,7,7,7,7,7,8,  7,7,8,8,8,8,8],
  dailyAnxiety: [5,6,5,5,5,5,5,4,  6,5,5,6,5,6,6,  5,5,4,4,4,4,3,3,  4,3,3,3,3,3,3],
  dailyNotes: [
    null, 'Curva de aprendizado do Next.', null, null, null, null, null, null,
    'CSS rebelde, perdi 3h.', null, null, 'Bug bobo no styled-components.', null, null, 'Resolvi.',
    null, 'Comecei a tela de SOS.', null, null, null, 'Integrei primeira chamada.', null, null,
    null, 'Tela de suporte pronta!', null, null, 'CSS tá obedecendo.', null, 'Tudo pra demo.',
  ],
  goals: [
    { slug: 'caminhar', title: 'Caminhar 30min', description: 'Final do dia', category: 'EXERCISE', frequency: 'DAILY', targetValue: 30, unit: 'minutos', completionRate: 0.7 },
    { slug: 'estudar', title: 'Estudar React 1h', description: 'Tutorial + prática', category: 'OTHER', frequency: 'DAILY', targetValue: 60, unit: 'minutos', completionRate: 0.8 },
    { slug: 'pausas', title: 'Pausas de 5min', description: 'A cada 1h', category: 'MINDFULNESS', frequency: 'DAILY', targetValue: 4, unit: 'pausas', completionRate: 0.6 },
  ],
  emotions: [
    { dayOffset: 28, hour: 18, emotionSlug: 'esperanca', intensity: 6 },
    { dayOffset: 25, hour: 14, emotionSlug: 'calma', intensity: 6 },
    { dayOffset: 22, hour: 17, emotionSlug: 'satisfacao', intensity: 6 },
    { dayOffset: 21, hour: 19, emotionSlug: 'frustracao', intensity: 6, notes: 'CSS quebrando.' },
    { dayOffset: 19, hour: 18, emotionSlug: 'frustracao', intensity: 5 },
    { dayOffset: 17, hour: 15, emotionSlug: 'ansiedade', intensity: 5 },
    { dayOffset: 15, hour: 21, emotionSlug: 'satisfacao', intensity: 7, notes: 'Resolvi!' },
    { dayOffset: 13, hour: 15, emotionSlug: 'calma', intensity: 7 },
    { dayOffset: 11, hour: 16, emotionSlug: 'esperanca', intensity: 7 },
    { dayOffset: 9, hour: 18, emotionSlug: 'felicidade', intensity: 7, notes: 'API conectou.' },
    { dayOffset: 7, hour: 11, emotionSlug: 'gratidao', intensity: 7 },
    { dayOffset: 5, hour: 17, emotionSlug: 'orgulho', intensity: 8 },
    { dayOffset: 3, hour: 20, emotionSlug: 'satisfacao', intensity: 8 },
    { dayOffset: 1, hour: 9, emotionSlug: 'calma', intensity: 8 },
    { dayOffset: 0, hour: 14, emotionSlug: 'felicidade', intensity: 8, notes: 'Pronto pra demo.' },
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
  const password = await bcrypt.hash(TEAM_PASSWORD, 10);

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

  // Os WEEKLY e MONTHLY são deletados aqui pra que o GET /api/reports/latest auto-gere
  // com os dados ricos do reportService — não vale a pena duplicar a lógica de insights.
  await prisma.report.deleteMany({ where: { userId: profile.id, type: 'WEEKLY' } });
  await prisma.report.deleteMany({ where: { userId: profile.id, type: 'MONTHLY' } });
}

async function main() {
  console.log(`🌱 Populando 5 contas da equipe (UTFPR-CP) com ${DAYS} dias de uso...\n`);
  const questionMap = await getQuestionsByCategory();
  if (Object.keys(questionMap).length === 0) {
    throw new Error('Nenhuma pergunta encontrada. Rode `npm run prisma:seed` primeiro.');
  }

  const team = [antonio, gabriel, octavio, marialuisa, taynara];
  for (const profile of team) {
    await seedUser(profile, questionMap);
    console.log(`  ✓ ${profile.name} (RA ${profile.ra}) — ${profile.email}`);
  }

  console.log(`\n🎉 Pronto! Senha de TODOS: ${TEAM_PASSWORD}`);
  console.log(`   Os relatórios WEEKLY/MONTHLY são gerados sob demanda no primeiro GET.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
