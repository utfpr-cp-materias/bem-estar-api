import { prisma } from '../config';
import { QuestionCategory, ReportCategory, ReportType } from '@prisma/client';
import { calculateOverallScore, categorizeScore } from '../utils/scoreCalculator';

interface AnswerData {
  questionId: string;
  value: number;
}

export class QuestionnaireService {
  async getAllQuestions() {
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        text: true,
        description: true,
        category: true,
        order: true,
        minValue: true,
        maxValue: true,
        minLabel: true,
        maxLabel: true,
      },
    });

    return questions;
  }

  async getQuestionById(questionId: string) {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new Error('Pergunta não encontrada');
    }

    return question;
  }

  async submitAnswers(userId: string, answers: AnswerData[]) {
    const now = new Date();

    // Salvar todas as respostas
    const savedResponses = await prisma.$transaction(
      answers.map((answer) =>
        prisma.questionnaireResponse.create({
          data: {
            userId,
            questionId: answer.questionId,
            value: answer.value,
            answeredAt: now,
          },
        })
      )
    );

    // Calcular score e criar relatório de onboarding
    const report = await this.generateOnboardingReport(userId, answers);

    // Marcar onboarding como completo
    await prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
    });

    return {
      responses: savedResponses,
      report,
    };
  }

  async getUserResponses(userId: string, fromDate?: Date) {
    const where: any = { userId };

    if (fromDate) {
      where.answeredAt = { gte: fromDate };
    }

    const responses = await prisma.questionnaireResponse.findMany({
      where,
      include: {
        question: {
          select: {
            text: true,
            category: true,
          },
        },
      },
      orderBy: { answeredAt: 'desc' },
    });

    return responses;
  }

  private async generateOnboardingReport(userId: string, answers: AnswerData[]) {
    // Buscar as perguntas para categorização
    const questions = await prisma.question.findMany({
      where: {
        id: { in: answers.map((a) => a.questionId) },
      },
    });

    const averageScore = calculateOverallScore(answers, questions);
    const category = categorizeScore(averageScore);

    // Gerar insights baseados nas respostas
    const insights = this.generateInsights(answers, questions);

    // Gerar recomendações
    const recommendations = this.generateRecommendations(category, answers, questions);

    // Criar relatório
    const report = await prisma.report.create({
      data: {
        userId,
        type: 'ONBOARDING',
        periodStart: new Date(),
        periodEnd: new Date(),
        overallScore: averageScore,
        category,
        insights,
        recommendations,
      },
    });

    return report;
  }

  private generateInsights(answers: AnswerData[], questions: any[]): object {
    const insights: any = {
      strengths: [],
      concerns: [],
      summary: '',
    };

    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) continue;

      const isNegativeCategory = ['ANXIETY', 'STRESS', 'MOOD', 'SOCIAL'].includes(
        question.category
      );

      if (isNegativeCategory) {
        if (answer.value <= 3) {
          insights.strengths.push({
            category: question.category,
            message: `Baixo nível de ${this.getCategoryName(question.category)}`,
          });
        } else if (answer.value >= 7) {
          insights.concerns.push({
            category: question.category,
            message: `Alto nível de ${this.getCategoryName(question.category)}`,
            value: answer.value,
          });
        }
      } else {
        if (answer.value >= 7) {
          insights.strengths.push({
            category: question.category,
            message: `Bom nível de ${this.getCategoryName(question.category)}`,
          });
        } else if (answer.value <= 3) {
          insights.concerns.push({
            category: question.category,
            message: `Baixo nível de ${this.getCategoryName(question.category)}`,
            value: answer.value,
          });
        }
      }
    }

    insights.summary =
      insights.concerns.length > 0
        ? `Identificamos ${insights.concerns.length} área(s) que merecem atenção.`
        : 'Seu bem-estar geral está em um bom nível!';

    return insights;
  }

  private generateRecommendations(
    category: ReportCategory,
    answers: AnswerData[],
    questions: any[]
  ): object {
    const recommendations: string[] = [];

    switch (category) {
      case 'CRITICAL':
        recommendations.push(
          'Recomendamos fortemente que você procure apoio profissional.',
          'Ligue para o CVV (188) se precisar conversar.',
          'Considere agendar uma consulta com um psicólogo.'
        );
        break;
      case 'ATTENTION':
        recommendations.push(
          'Considere conversar com um profissional de saúde mental.',
          'Pratique exercícios de respiração diariamente.',
          'Tente manter uma rotina de sono regular.'
        );
        break;
      case 'MODERATE':
        recommendations.push(
          'Continue monitorando seu bem-estar diariamente.',
          'Experimente técnicas de mindfulness.',
          'Mantenha conexões sociais ativas.'
        );
        break;
      case 'GOOD':
        recommendations.push(
          'Continue com suas práticas atuais de autocuidado.',
          'Explore novos hobbies ou atividades.',
          'Considere ajudar outras pessoas como voluntário.'
        );
        break;
      case 'EXCELLENT':
        recommendations.push(
          'Parabéns pelo seu bem-estar!',
          'Continue mantendo hábitos saudáveis.',
          'Compartilhe suas práticas positivas com outros.'
        );
        break;
    }

    return { items: recommendations };
  }

  private getCategoryName(category: QuestionCategory): string {
    const names: Record<QuestionCategory, string> = {
      EMOTIONAL_WELLBEING: 'bem-estar emocional',
      ANXIETY: 'ansiedade',
      STRESS: 'estresse',
      MOOD: 'humor',
      ENERGY: 'energia',
      CONCENTRATION: 'concentração',
      SOCIAL: 'conexão social',
      IMPROVEMENT_GOALS: 'objetivos de melhoria',
    };
    return names[category] || category;
  }
}

export const questionnaireService = new QuestionnaireService();
