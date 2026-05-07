import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // ==================== PERGUNTAS DO QUESTIONÁRIO ====================
  const questions = [
    {
      text: 'Com que frequência você se sente bem emocionalmente?',
      description: 'Avalie seu bem-estar emocional geral',
      category: 'EMOTIONAL_WELLBEING' as const,
      order: 1,
      minLabel: 'Raramente',
      maxLabel: 'Sempre',
    },
    {
      text: 'Com que frequência sua mente fica acelerada ou preocupada?',
      description: 'Avalie seus níveis de ansiedade',
      category: 'ANXIETY' as const,
      order: 2,
      minLabel: 'Raramente',
      maxLabel: 'Sempre',
    },
    {
      text: 'Com que frequência você se sente sobrecarregado(a)?',
      description: 'Avalie seus níveis de estresse',
      category: 'STRESS' as const,
      order: 3,
      minLabel: 'Raramente',
      maxLabel: 'Sempre',
    },
    {
      text: 'Com que frequência você se sente triste ou desanimado(a)?',
      description: 'Avalie seu humor geral',
      category: 'MOOD' as const,
      order: 4,
      minLabel: 'Raramente',
      maxLabel: 'Sempre',
    },
    {
      text: 'Como está seu nível de energia na maior parte dos dias?',
      description: 'Avalie sua energia e disposição',
      category: 'ENERGY' as const,
      order: 5,
      minLabel: 'Muito baixo',
      maxLabel: 'Muito alto',
    },
    {
      text: 'O quanto você tem dificuldade para se concentrar?',
      description: 'Avalie sua capacidade de foco',
      category: 'CONCENTRATION' as const,
      order: 6,
      minLabel: 'Nenhuma',
      maxLabel: 'Muita',
    },
    {
      text: 'Com que frequência você se sente sozinho(a)?',
      description: 'Avalie sua conexão social',
      category: 'SOCIAL' as const,
      order: 7,
      minLabel: 'Raramente',
      maxLabel: 'Sempre',
    },
    {
      text: 'O que você gostaria de melhorar agora?',
      description: 'Selecione áreas de foco para melhoria',
      category: 'IMPROVEMENT_GOALS' as const,
      order: 8,
      minLabel: 'Pouco importante',
      maxLabel: 'Muito importante',
    },
  ];

  for (const question of questions) {
    await prisma.question.upsert({
      where: { id: question.text.substring(0, 36) },
      update: question,
      create: question,
    });
  }
  console.log('✅ Perguntas do questionário criadas');

  // ==================== EMOÇÕES ====================
  const emotions = [
    // Positivas
    { name: 'Felicidade', icon: '😊', color: '#4CAF50', category: 'POSITIVE' as const },
    { name: 'Gratidão', icon: '🙏', color: '#8BC34A', category: 'POSITIVE' as const },
    { name: 'Calma', icon: '😌', color: '#03A9F4', category: 'POSITIVE' as const },
    { name: 'Esperança', icon: '🌟', color: '#FFEB3B', category: 'POSITIVE' as const },
    { name: 'Amor', icon: '❤️', color: '#E91E63', category: 'POSITIVE' as const },
    { name: 'Entusiasmo', icon: '🎉', color: '#FF9800', category: 'POSITIVE' as const },
    { name: 'Confiança', icon: '💪', color: '#9C27B0', category: 'POSITIVE' as const },
    { name: 'Satisfação', icon: '😊', color: '#4CAF50', category: 'POSITIVE' as const },

    // Negativas
    { name: 'Ansiedade', icon: '😰', color: '#FF5722', category: 'NEGATIVE' as const },
    { name: 'Tristeza', icon: '😢', color: '#607D8B', category: 'NEGATIVE' as const },
    { name: 'Raiva', icon: '😠', color: '#F44336', category: 'NEGATIVE' as const },
    { name: 'Medo', icon: '😨', color: '#795548', category: 'NEGATIVE' as const },
    { name: 'Frustração', icon: '😤', color: '#FF5722', category: 'NEGATIVE' as const },
    { name: 'Solidão', icon: '😔', color: '#9E9E9E', category: 'NEGATIVE' as const },
    { name: 'Estresse', icon: '😫', color: '#E91E63', category: 'NEGATIVE' as const },
    { name: 'Culpa', icon: '😞', color: '#673AB7', category: 'NEGATIVE' as const },

    // Neutras
    { name: 'Neutro', icon: '😐', color: '#9E9E9E', category: 'NEUTRAL' as const },
    { name: 'Confusão', icon: '🤔', color: '#FF9800', category: 'NEUTRAL' as const },
    { name: 'Surpresa', icon: '😮', color: '#00BCD4', category: 'NEUTRAL' as const },
    { name: 'Tédio', icon: '😑', color: '#BDBDBD', category: 'NEUTRAL' as const },
  ];

  for (const emotion of emotions) {
    await prisma.emotion.upsert({
      where: { id: emotion.name.toLowerCase().replace(/\s/g, '-') },
      update: emotion,
      create: emotion,
    });
  }
  console.log('✅ Emoções criadas');

  // ==================== RECURSOS DE AUTOAJUDA ====================
  const resources = [
    {
      title: 'Técnica de Respiração 4-7-8',
      description: 'Uma técnica simples de respiração para reduzir ansiedade e promover relaxamento.',
      type: 'BREATHING' as const,
      category: 'ANXIETY' as const,
      content: 'Inspire por 4 segundos, segure por 7 segundos, expire por 8 segundos. Repita 4 vezes.',
      tags: ['respiração', 'ansiedade', 'relaxamento'],
    },
    {
      title: 'Meditação Guiada para Iniciantes',
      description: 'Uma meditação de 5 minutos perfeita para quem está começando.',
      type: 'MEDITATION' as const,
      category: 'MINDFULNESS' as const,
      content: 'https://example.com/meditacao-iniciantes',
      tags: ['meditação', 'mindfulness', 'iniciantes'],
    },
    {
      title: 'Exercício de Gratidão Diária',
      description: 'Escreva 3 coisas pelas quais você é grato hoje.',
      type: 'EXERCISE' as const,
      category: 'GENERAL' as const,
      content: 'Todos os dias, antes de dormir, escreva 3 coisas boas que aconteceram hoje.',
      tags: ['gratidão', 'positividade', 'diário'],
    },
    {
      title: 'Técnica de Grounding 5-4-3-2-1',
      description: 'Técnica para se ancorar no presente durante momentos de ansiedade.',
      type: 'EXERCISE' as const,
      category: 'ANXIETY' as const,
      content: 'Identifique: 5 coisas que você vê, 4 que você toca, 3 que você ouve, 2 que você cheira, 1 que você saboreia.',
      tags: ['grounding', 'ansiedade', 'presente'],
    },
    {
      title: 'Artigo: Como Lidar com o Estresse',
      description: 'Dicas práticas para gerenciar o estresse no dia a dia.',
      type: 'ARTICLE' as const,
      category: 'STRESS_RELIEF' as const,
      content: 'O estresse é uma resposta natural do corpo...',
      tags: ['estresse', 'dicas', 'saúde mental'],
    },
    {
      title: 'Exercícios de Alongamento para Relaxar',
      description: 'Série de alongamentos simples para aliviar tensão.',
      type: 'EXERCISE' as const,
      category: 'STRESS_RELIEF' as const,
      content: '1. Alongue o pescoço... 2. Gire os ombros... 3. Estique os braços...',
      tags: ['alongamento', 'relaxamento', 'corpo'],
    },
  ];

  for (const resource of resources) {
    await prisma.resource.create({
      data: resource,
    });
  }
  console.log('✅ Recursos de autoajuda criados');

  // ==================== CONTATOS DE EMERGÊNCIA ====================
  const emergencyContacts = [
    {
      name: 'CVV - Centro de Valorização da Vida',
      phone: '188',
      description: 'Apoio emocional e prevenção do suicídio, 24 horas por dia.',
      type: 'HOTLINE' as const,
    },
    {
      name: 'SAMU',
      phone: '192',
      description: 'Serviço de Atendimento Móvel de Urgência.',
      type: 'EMERGENCY' as const,
    },
    {
      name: 'CVV Chat Online',
      phone: 'www.cvv.org.br',
      description: 'Chat online do CVV para apoio emocional.',
      type: 'CHAT' as const,
    },
    {
      name: 'CAPS - Centro de Atenção Psicossocial',
      phone: '136',
      description: 'Disque Saúde para informações sobre CAPS mais próximo.',
      type: 'SUPPORT_GROUP' as const,
    },
  ];

  for (const contact of emergencyContacts) {
    await prisma.emergencyContact.create({
      data: contact,
    });
  }
  console.log('✅ Contatos de emergência criados');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
