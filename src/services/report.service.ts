import { prisma } from '../config';
import { ReportType, ReportCategory } from '@prisma/client';
import { emotionService } from './emotion.service';
import { goalService } from './goal.service';

export class ReportService {
  async generateWeeklyReport(userId: string) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // Coletar dados da semana
    const [checkIns, emotionStats, goalStats] = await Promise.all([
      prisma.dailyCheckIn.findMany({
        where: {
          userId,
          date: { gte: startDate, lte: endDate },
        },
        orderBy: { date: 'asc' },
      }),
      emotionService.getEmotionStats(userId, 7),
      goalService.getGoalStats(userId, undefined, 7),
    ]);

    // Calcular score geral
    const avgMood =
      checkIns.length > 0
        ? checkIns.reduce((sum, c) => sum + c.overallMood, 0) / checkIns.length
        : 5;

    // Determinar categoria
    const category = this.determineCategory(avgMood);

    // Gerar insights
    const insights = this.generateWeeklyInsights(checkIns, emotionStats, goalStats);

    // Gerar recomendações
    const recommendations = this.generateRecommendations(category, insights);

    // Salvar relatório
    const report = await prisma.report.create({
      data: {
        userId,
        type: 'WEEKLY',
        periodStart: startDate,
        periodEnd: endDate,
        overallScore: avgMood,
        category,
        insights,
        recommendations,
      },
    });

    return report;
  }

  async generateMonthlyReport(userId: string) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Coletar dados do mês
    const [checkIns, emotionStats, goalStats] = await Promise.all([
      prisma.dailyCheckIn.findMany({
        where: {
          userId,
          date: { gte: startDate, lte: endDate },
        },
        orderBy: { date: 'asc' },
      }),
      emotionService.getEmotionStats(userId, 30),
      goalService.getGoalStats(userId, undefined, 30),
    ]);

    // Calcular score geral
    const avgMood =
      checkIns.length > 0
        ? checkIns.reduce((sum, c) => sum + c.overallMood, 0) / checkIns.length
        : 5;

    // Determinar categoria
    const category = this.determineCategory(avgMood);

    // Gerar insights mensais
    const insights = this.generateMonthlyInsights(checkIns, emotionStats, goalStats);

    // Gerar recomendações
    const recommendations = this.generateRecommendations(category, insights);

    // Salvar relatório
    const report = await prisma.report.create({
      data: {
        userId,
        type: 'MONTHLY',
        periodStart: startDate,
        periodEnd: endDate,
        overallScore: avgMood,
        category,
        insights,
        recommendations,
      },
    });

    return report;
  }

  async getUserReports(userId: string, type?: ReportType, limit: number = 10) {
    const where: any = { userId };
    if (type) where.type = type;

    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return reports;
  }

  async getReportById(userId: string, reportId: string) {
    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
        userId,
      },
    });

    if (!report) {
      throw new Error('Relatório não encontrado');
    }

    return report;
  }

  async getLatestReport(userId: string, type?: ReportType) {
    const where: any = { userId };
    if (type) where.type = type;

    const report = await prisma.report.findFirst({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return report;
  }

  private determineCategory(score: number): ReportCategory {
    if (score >= 8) return 'EXCELLENT';
    if (score >= 6.5) return 'GOOD';
    if (score >= 5) return 'MODERATE';
    if (score >= 3.5) return 'ATTENTION';
    return 'CRITICAL';
  }

  private generateWeeklyInsights(
    checkIns: any[],
    emotionStats: any,
    goalStats: any
  ): object {
    const insights: any = {
      checkInConsistency: checkIns.length >= 5 ? 'excellent' : checkIns.length >= 3 ? 'good' : 'needs_improvement',
      moodTrend: this.calculateTrend(checkIns.map((c) => c.overallMood)),
      topEmotions: emotionStats?.topEmotions?.slice(0, 3) || [],
      goalsCompleted: goalStats?.completedCount || 0,
      goalsCompletionRate: goalStats?.completionRate || 0,
      currentStreak: goalStats?.currentStreak || 0,
    };

    // Análise de padrões
    if (checkIns.length >= 3) {
      const moods = checkIns.map((c) => c.overallMood);
      insights.bestDay = this.findBestDay(checkIns);
      insights.worstDay = this.findWorstDay(checkIns);
      insights.volatility = this.calculateVolatility(moods);
    }

    return insights;
  }

  private generateMonthlyInsights(
    checkIns: any[],
    emotionStats: any,
    goalStats: any
  ): object {
    const weeklyInsights = this.generateWeeklyInsights(checkIns, emotionStats, goalStats);

    // Dividir em semanas para análise
    const weeks: any[][] = [];
    let currentWeek: any[] = [];

    for (const checkIn of checkIns) {
      currentWeek.push(checkIn);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    // Calcular média por semana
    const weeklyAverages = weeks.map(
      (week) => week.reduce((sum, c) => sum + c.overallMood, 0) / week.length
    );

    return {
      ...weeklyInsights,
      weeklyAverages,
      monthlyProgress: this.calculateTrend(weeklyAverages),
      totalCheckIns: checkIns.length,
      emotionDistribution: emotionStats?.categoryDistribution || {},
    };
  }

  private generateRecommendations(category: ReportCategory, insights: any): object {
    const recommendations: string[] = [];

    // Baseado na categoria geral
    switch (category) {
      case 'CRITICAL':
        recommendations.push(
          'Seu bem-estar está em nível crítico. Por favor, considere buscar ajuda profissional.',
          'Ligue para o CVV (188) se precisar de apoio imediato.',
          'Tente fazer pelo menos uma atividade prazerosa por dia.'
        );
        break;
      case 'ATTENTION':
        recommendations.push(
          'Recomendamos conversar com um profissional de saúde mental.',
          'Tente manter uma rotina de check-ins diários.',
          'Pratique exercícios de respiração quando se sentir sobrecarregado.'
        );
        break;
      case 'MODERATE':
        recommendations.push(
          'Continue monitorando seu bem-estar regularmente.',
          'Experimente adicionar uma meta de autocuidado à sua rotina.',
          'Considere praticar meditação ou mindfulness.'
        );
        break;
      case 'GOOD':
        recommendations.push(
          'Você está indo bem! Continue com suas práticas atuais.',
          'Que tal desafiar-se com uma nova meta?',
          'Compartilhe seu progresso com pessoas próximas.'
        );
        break;
      case 'EXCELLENT':
        recommendations.push(
          'Excelente! Seu bem-estar está em ótimo nível.',
          'Continue cultivando hábitos saudáveis.',
          'Considere ajudar outros em sua jornada de bem-estar.'
        );
        break;
    }

    // Baseado em insights específicos
    if (insights.checkInConsistency === 'needs_improvement') {
      recommendations.push(
        'Tente fazer check-ins mais frequentes para acompanhar melhor seu humor.'
      );
    }

    if (insights.goalsCompletionRate < 50) {
      recommendations.push(
        'Considere revisar suas metas - talvez seja melhor ter menos metas mais alcançáveis.'
      );
    }

    return { items: recommendations };
  }

  private calculateTrend(values: number[]): 'improving' | 'stable' | 'declining' {
    if (values.length < 2) return 'stable';

    const midpoint = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, midpoint);
    const secondHalf = values.slice(midpoint);

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (secondAvg - firstAvg > 0.5) return 'improving';
    if (firstAvg - secondAvg > 0.5) return 'declining';
    return 'stable';
  }

  private findBestDay(checkIns: any[]): string | null {
    if (checkIns.length === 0) return null;
    const best = checkIns.reduce((prev, curr) =>
      curr.overallMood > prev.overallMood ? curr : prev
    );
    return best.date.toISOString().split('T')[0];
  }

  private findWorstDay(checkIns: any[]): string | null {
    if (checkIns.length === 0) return null;
    const worst = checkIns.reduce((prev, curr) =>
      curr.overallMood < prev.overallMood ? curr : prev
    );
    return worst.date.toISOString().split('T')[0];
  }

  private calculateVolatility(values: number[]): 'low' | 'medium' | 'high' {
    if (values.length < 2) return 'low';

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev < 1) return 'low';
    if (stdDev < 2) return 'medium';
    return 'high';
  }
}

export const reportService = new ReportService();
