import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const daysAgo = (n: number) => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
};

async function seedQuestions() {
  const questions = [
    { text: 'Com que frequência você se sente bem emocionalmente?', description: 'Avalie seu bem-estar emocional geral', category: 'EMOTIONAL_WELLBEING' as const, order: 1, minLabel: 'Raramente', maxLabel: 'Sempre' },
    { text: 'Com que frequência sua mente fica acelerada ou preocupada?', description: 'Avalie seus níveis de ansiedade', category: 'ANXIETY' as const, order: 2, minLabel: 'Raramente', maxLabel: 'Sempre' },
    { text: 'Com que frequência você se sente sobrecarregado(a)?', description: 'Avalie seus níveis de estresse', category: 'STRESS' as const, order: 3, minLabel: 'Raramente', maxLabel: 'Sempre' },
    { text: 'Com que frequência você se sente triste ou desanimado(a)?', description: 'Avalie seu humor geral', category: 'MOOD' as const, order: 4, minLabel: 'Raramente', maxLabel: 'Sempre' },
    { text: 'Como está seu nível de energia na maior parte dos dias?', description: 'Avalie sua energia e disposição', category: 'ENERGY' as const, order: 5, minLabel: 'Muito baixo', maxLabel: 'Muito alto' },
    { text: 'O quanto você tem dificuldade para se concentrar?', description: 'Avalie sua capacidade de foco', category: 'CONCENTRATION' as const, order: 6, minLabel: 'Nenhuma', maxLabel: 'Muita' },
    { text: 'Com que frequência você se sente sozinho(a)?', description: 'Avalie sua conexão social', category: 'SOCIAL' as const, order: 7, minLabel: 'Raramente', maxLabel: 'Sempre' },
    { text: 'Quanto você sente que está conseguindo lidar com os desafios do dia a dia?', description: 'Avalie sua capacidade de lidar com os desafios do dia a dia', category: 'IMPROVEMENT_GOALS' as const, order: 8, minLabel: 'Nunca', maxLabel: 'Sempre' },
  ];

  for (const q of questions) {
    const id = `q-${slug(q.category)}-${q.order}`;
    await prisma.question.upsert({
      where: { id },
      update: q,
      create: { id, ...q },
    });
  }
  console.log(`✅ Perguntas do questionário: ${questions.length}`);
  return questions.map((q) => ({ ...q, id: `q-${slug(q.category)}-${q.order}` }));
}

async function seedEmotions() {
  const emotions = [
    { name: 'Felicidade', icon: '😊', color: '#4CAF50', category: 'POSITIVE' as const },
    { name: 'Gratidão', icon: '🙏', color: '#8BC34A', category: 'POSITIVE' as const },
    { name: 'Calma', icon: '😌', color: '#03A9F4', category: 'POSITIVE' as const },
    { name: 'Esperança', icon: '🌟', color: '#FFEB3B', category: 'POSITIVE' as const },
    { name: 'Amor', icon: '❤️', color: '#E91E63', category: 'POSITIVE' as const },
    { name: 'Entusiasmo', icon: '🎉', color: '#FF9800', category: 'POSITIVE' as const },
    { name: 'Confiança', icon: '💪', color: '#9C27B0', category: 'POSITIVE' as const },
    { name: 'Satisfação', icon: '😄', color: '#4CAF50', category: 'POSITIVE' as const },
    { name: 'Ansiedade', icon: '😰', color: '#FF5722', category: 'NEGATIVE' as const },
    { name: 'Tristeza', icon: '😢', color: '#607D8B', category: 'NEGATIVE' as const },
    { name: 'Raiva', icon: '😠', color: '#F44336', category: 'NEGATIVE' as const },
    { name: 'Medo', icon: '😨', color: '#795548', category: 'NEGATIVE' as const },
    { name: 'Frustração', icon: '😤', color: '#FF5722', category: 'NEGATIVE' as const },
    { name: 'Solidão', icon: '😔', color: '#9E9E9E', category: 'NEGATIVE' as const },
    { name: 'Estresse', icon: '😫', color: '#E91E63', category: 'NEGATIVE' as const },
    { name: 'Culpa', icon: '😞', color: '#673AB7', category: 'NEGATIVE' as const },
    { name: 'Neutro', icon: '😐', color: '#9E9E9E', category: 'NEUTRAL' as const },
    { name: 'Confusão', icon: '🤔', color: '#FF9800', category: 'NEUTRAL' as const },
    { name: 'Surpresa', icon: '😮', color: '#00BCD4', category: 'NEUTRAL' as const },
    { name: 'Tédio', icon: '😑', color: '#BDBDBD', category: 'NEUTRAL' as const },
  ];

  const results: { id: string; name: string; category: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' }[] = [];
  for (const e of emotions) {
    const id = `emo-${slug(e.name)}`;
    await prisma.emotion.upsert({
      where: { id },
      update: e,
      create: { id, ...e },
    });
    results.push({ id, name: e.name, category: e.category });
  }
  console.log(`✅ Emoções: ${emotions.length}`);
  return results;
}

async function seedResources() {
  const resources = [
    { title: 'Técnica de Respiração 4-7-8', description: 'Uma técnica simples de respiração para reduzir ansiedade e promover relaxamento.', type: 'BREATHING' as const, category: 'ANXIETY' as const, content: 'Inspire por 4 segundos, segure por 7 segundos, expire por 8 segundos. Repita 4 vezes.', tags: ['respiração', 'ansiedade', 'relaxamento'] },
    { title: 'Meditação Guiada para Iniciantes', description: 'Uma meditação de 5 minutos perfeita para quem está começando.', type: 'MEDITATION' as const, category: 'MINDFULNESS' as const, content: 'https://example.com/meditacao-iniciantes', tags: ['meditação', 'mindfulness', 'iniciantes'] },
    { title: 'Exercício de Gratidão Diária', description: 'Escreva 3 coisas pelas quais você é grato hoje.', type: 'EXERCISE' as const, category: 'GENERAL' as const, content: 'Todos os dias, antes de dormir, escreva 3 coisas boas que aconteceram hoje.', tags: ['gratidão', 'positividade', 'diário'] },
    { title: 'Técnica de Grounding 5-4-3-2-1', description: 'Técnica para se ancorar no presente durante momentos de ansiedade.', type: 'EXERCISE' as const, category: 'ANXIETY' as const, content: 'Identifique: 5 coisas que você vê, 4 que você toca, 3 que você ouve, 2 que você cheira, 1 que você saboreia.', tags: ['grounding', 'ansiedade', 'presente'] },
    { title: 'Artigo: Como Lidar com o Estresse', description: 'Dicas práticas para gerenciar o estresse no dia a dia.', type: 'ARTICLE' as const, category: 'STRESS_RELIEF' as const, content: 'O estresse é uma resposta natural do corpo...', tags: ['estresse', 'dicas', 'saúde mental'] },
    { title: 'Exercícios de Alongamento para Relaxar', description: 'Série de alongamentos simples para aliviar tensão.', type: 'EXERCISE' as const, category: 'STRESS_RELIEF' as const, content: '1. Alongue o pescoço... 2. Gire os ombros... 3. Estique os braços...', tags: ['alongamento', 'relaxamento', 'corpo'] },
    { title: 'Higiene do Sono', description: 'Boas práticas para dormir melhor e acordar descansado.', type: 'ARTICLE' as const, category: 'SLEEP' as const, content: 'Mantenha horário regular, evite telas 1h antes de dormir, ambiente escuro e fresco.', tags: ['sono', 'higiene', 'rotina'] },
    { title: 'Diário de Autoestima', description: 'Registre uma qualidade sua por dia durante 30 dias.', type: 'EXERCISE' as const, category: 'SELF_ESTEEM' as const, content: 'Reserve 2 minutos por dia para escrever uma qualidade ou conquista pessoal.', tags: ['autoestima', 'diário', 'autoconhecimento'] },
  ];

  for (const r of resources) {
    const id = `res-${slug(r.title)}`;
    await prisma.resource.upsert({
      where: { id },
      update: r,
      create: { id, ...r },
    });
  }
  console.log(`✅ Recursos de autoajuda: ${resources.length}`);
}

async function seedEmergencyContacts() {
  const contacts = [
    { name: 'CVV - Centro de Valorização da Vida', phone: '188', description: 'Apoio emocional e prevenção do suicídio, 24 horas por dia.', type: 'HOTLINE' as const },
    { name: 'SAMU', phone: '192', description: 'Serviço de Atendimento Móvel de Urgência.', type: 'EMERGENCY' as const },
    { name: 'CVV Chat Online', phone: 'www.cvv.org.br', description: 'Chat online do CVV para apoio emocional.', type: 'CHAT' as const },
    { name: 'CAPS - Centro de Atenção Psicossocial', phone: '136', description: 'Disque Saúde para informações sobre CAPS mais próximo.', type: 'SUPPORT_GROUP' as const },
  ];

  for (const c of contacts) {
    const id = `ec-${slug(c.name)}`;
    await prisma.emergencyContact.upsert({
      where: { id },
      update: c,
      create: { id, ...c },
    });
  }
  console.log(`✅ Contatos de emergência: ${contacts.length}`);
}

async function seedTestUsers() {
  const password = await bcrypt.hash('Senha123!', 10);
  const users = [
    { id: 'user-demo-ana', email: 'ana@demo.com', name: 'Ana Demo', phone: '11999999991', birthDate: new Date('2000-03-15') },
    { id: 'user-demo-bruno', email: 'bruno@demo.com', name: 'Bruno Demo', phone: '11999999992', birthDate: new Date('1998-07-22') },
    { id: 'user-demo-carla', email: 'carla@demo.com', name: 'Carla Demo', phone: '11999999993', birthDate: new Date('2002-11-04') },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, phone: u.phone, birthDate: u.birthDate, onboardingCompleted: true },
      create: { ...u, password, onboardingCompleted: true },
    });
  }
  console.log(`✅ Usuários de demo: ${users.length} (senha: Senha123!)`);
  return users.map((u) => u.id);
}

async function seedActivityFor(
  userId: string,
  questions: { id: string; category: string }[],
  emotions: { id: string; name: string; category: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' }[],
  pattern: 'great' | 'okay' | 'struggling',
) {
  const responseValues: Record<typeof pattern, Record<string, number>> = {
    great:      { EMOTIONAL_WELLBEING: 9, ANXIETY: 2, STRESS: 3, MOOD: 9, ENERGY: 8, CONCENTRATION: 2, SOCIAL: 2, IMPROVEMENT_GOALS: 6 },
    okay:       { EMOTIONAL_WELLBEING: 6, ANXIETY: 5, STRESS: 6, MOOD: 6, ENERGY: 6, CONCENTRATION: 5, SOCIAL: 4, IMPROVEMENT_GOALS: 8 },
    struggling: { EMOTIONAL_WELLBEING: 3, ANXIETY: 9, STRESS: 9, MOOD: 3, ENERGY: 3, CONCENTRATION: 8, SOCIAL: 8, IMPROVEMENT_GOALS: 10 },
  };
  const answeredAt = daysAgo(14);
  for (const q of questions) {
    await prisma.questionnaireResponse.upsert({
      where: {
        userId_questionId_answeredAt: { userId, questionId: q.id, answeredAt },
      },
      update: { value: responseValues[pattern][q.category] },
      create: { userId, questionId: q.id, value: responseValues[pattern][q.category], answeredAt },
    });
  }

  const moodByPattern = { great: [8, 9, 7, 8, 9, 8, 9, 7, 8, 9, 8, 7, 9, 8], okay: [6, 5, 7, 6, 5, 6, 7, 5, 6, 6, 7, 5, 6, 7], struggling: [3, 4, 2, 3, 4, 3, 2, 4, 3, 2, 3, 4, 3, 2] };
  const energyByPattern = { great: [8, 9, 7, 8, 8, 9, 8, 7, 9, 8, 8, 7, 9, 8], okay: [6, 5, 6, 7, 5, 6, 6, 7, 5, 6, 7, 5, 6, 6], struggling: [3, 2, 4, 3, 2, 3, 4, 2, 3, 3, 4, 2, 3, 3] };
  const sleepByPattern = { great: [8, 8, 9, 7, 8, 9, 8, 7, 8, 9, 8, 7, 9, 8], okay: [6, 7, 5, 6, 7, 5, 6, 7, 6, 5, 6, 7, 5, 6], struggling: [4, 3, 5, 4, 3, 4, 5, 3, 4, 3, 5, 4, 3, 4] };
  const anxietyByPattern = { great: [2, 3, 2, 1, 3, 2, 2, 3, 1, 2, 3, 2, 1, 2], okay: [5, 6, 5, 4, 5, 6, 5, 4, 5, 6, 5, 4, 5, 5], struggling: [8, 9, 9, 8, 9, 8, 9, 9, 8, 9, 8, 9, 8, 9] };

  for (let i = 13; i >= 0; i--) {
    const date = daysAgo(i);
    await prisma.dailyCheckIn.upsert({
      where: { userId_date: { userId, date } },
      update: {},
      create: {
        userId,
        date,
        overallMood: moodByPattern[pattern][i],
        energyLevel: energyByPattern[pattern][i],
        sleepQuality: sleepByPattern[pattern][i],
        anxietyLevel: anxietyByPattern[pattern][i],
        notes: i === 0 ? 'Check-in de hoje.' : null,
      },
    });
  }

  await prisma.emotionRecord.deleteMany({ where: { userId } });
  const positiveEmotions = emotions.filter((e) => e.category === 'POSITIVE');
  const negativeEmotions = emotions.filter((e) => e.category === 'NEGATIVE');
  const pickList = pattern === 'great' ? positiveEmotions : pattern === 'struggling' ? negativeEmotions : [...positiveEmotions.slice(0, 3), ...negativeEmotions.slice(0, 3)];
  for (let i = 0; i < 10; i++) {
    const emotion = pickList[i % pickList.length];
    const recordedAt = new Date(daysAgo(i % 7));
    recordedAt.setUTCHours(9 + (i % 8), 0, 0, 0);
    await prisma.emotionRecord.create({
      data: {
        userId,
        emotionId: emotion.id,
        intensity: pattern === 'struggling' ? 7 + (i % 4) : 4 + (i % 5),
        notes: i % 3 === 0 ? `Sentindo ${emotion.name.toLowerCase()} hoje.` : null,
        recordedAt,
      },
    });
  }

  const goalsToCreate = [
    { id: `goal-${userId}-meditar`, title: 'Meditar 10 minutos', description: 'Sessão diária de meditação guiada.', category: 'MEDITATION' as const, frequency: 'DAILY' as const, targetValue: 10, unit: 'minutos' },
    { id: `goal-${userId}-caminhar`, title: 'Caminhar 30 minutos', description: 'Atividade física leve ao ar livre.', category: 'EXERCISE' as const, frequency: 'DAILY' as const, targetValue: 30, unit: 'minutos' },
    { id: `goal-${userId}-dormir`, title: 'Dormir 8 horas', description: 'Rotina de sono consistente.', category: 'SLEEP' as const, frequency: 'DAILY' as const, targetValue: 8, unit: 'horas' },
  ];

  for (const g of goalsToCreate) {
    await prisma.goal.upsert({ where: { id: g.id }, update: g, create: { userId, ...g } });
    for (let i = 6; i >= 0; i--) {
      const date = daysAgo(i);
      const completed = pattern === 'great' ? i % 7 !== 3 : pattern === 'okay' ? i % 2 === 0 : i % 3 === 0;
      await prisma.goalProgress.upsert({
        where: { goalId_date: { goalId: g.id, date } },
        update: { completed, value: completed ? g.targetValue : Math.floor(g.targetValue / 2) },
        create: { goalId: g.id, date, completed, value: completed ? g.targetValue : Math.floor(g.targetValue / 2) },
      });
    }
  }

  const onboardingScore =
    pattern === 'great' ? 8.5 : pattern === 'okay' ? 6.0 : 3.0;
  const reportCategory: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'ATTENTION' | 'CRITICAL' =
    onboardingScore >= 8.0 ? 'EXCELLENT' : onboardingScore >= 6.5 ? 'GOOD' : onboardingScore >= 5.0 ? 'MODERATE' : onboardingScore >= 3.5 ? 'ATTENTION' : 'CRITICAL';
  const reportId = `rep-${userId}-onboarding`;
  await prisma.report.upsert({
    where: { id: reportId },
    update: { overallScore: onboardingScore, category: reportCategory },
    create: {
      id: reportId,
      userId,
      type: 'ONBOARDING',
      periodStart: daysAgo(14),
      periodEnd: daysAgo(14),
      overallScore: onboardingScore,
      category: reportCategory,
      insights: pattern === 'great' ? ['Bem-estar emocional alto', 'Boa energia', 'Baixa ansiedade'] : pattern === 'okay' ? ['Bem-estar emocional moderado', 'Ansiedade em nível médio', 'Espaço para melhorar a conexão social'] : ['Bem-estar emocional baixo', 'Ansiedade e estresse elevados', 'Sintomas que merecem atenção'],
      recommendations: pattern === 'struggling' ? ['Buscar apoio profissional (CAPS/CVV)', 'Praticar exercícios de respiração diariamente', 'Manter rotina de sono'] : ['Continuar com check-ins diários', 'Explorar exercícios de mindfulness', 'Estabelecer metas pequenas de autocuidado'],
    },
  });
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  const questions = await seedQuestions();
  const emotions = await seedEmotions();
  await seedResources();
  await seedEmergencyContacts();
  const userIds = await seedTestUsers();

  console.log('\n🌿 Populando atividade dos usuários de demo...');
  const patterns: ('great' | 'okay' | 'struggling')[] = ['great', 'okay', 'struggling'];
  for (let i = 0; i < userIds.length; i++) {
    await seedActivityFor(userIds[i], questions, emotions, patterns[i]);
    console.log(`  • ${userIds[i]} (${patterns[i]}) — check-ins, emoções, metas, relatório de onboarding`);
  }

  console.log('\n🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
