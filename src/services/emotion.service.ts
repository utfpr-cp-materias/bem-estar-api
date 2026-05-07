import { prisma } from '../config';
import { EmotionCategory } from '@prisma/client';

interface RecordEmotionData {
  emotionId: string;
  intensity?: number;
  notes?: string;
}

interface DailyCheckInData {
  overallMood: number;
  energyLevel?: number;
  sleepQuality?: number;
  anxietyLevel?: number;
  notes?: string;
}

export class EmotionService {
  // ==================== EMOÇÕES ====================

  async getAllEmotions() {
    const emotions = await prisma.emotion.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    return emotions;
  }

  async getEmotionsByCategory(category: EmotionCategory) {
    const emotions = await prisma.emotion.findMany({
      where: {
        isActive: true,
        category,
      },
      orderBy: { name: 'asc' },
    });

    return emotions;
  }

  async recordEmotion(userId: string, data: RecordEmotionData) {
    const record = await prisma.emotionRecord.create({
      data: {
        userId,
        emotionId: data.emotionId,
        intensity: data.intensity || 5,
        notes: data.notes,
      },
      include: {
        emotion: true,
      },
    });

    return record;
  }

  async recordMultipleEmotions(userId: string, emotions: RecordEmotionData[]) {
    const records = await prisma.$transaction(
      emotions.map((emotion) =>
        prisma.emotionRecord.create({
          data: {
            userId,
            emotionId: emotion.emotionId,
            intensity: emotion.intensity || 5,
            notes: emotion.notes,
          },
          include: {
            emotion: true,
          },
        })
      )
    );

    return records;
  }

  async getUserEmotionHistory(
    userId: string,
    fromDate?: Date,
    toDate?: Date,
    limit?: number
  ) {
    const where: any = { userId };

    if (fromDate || toDate) {
      where.recordedAt = {};
      if (fromDate) where.recordedAt.gte = fromDate;
      if (toDate) where.recordedAt.lte = toDate;
    }

    const records = await prisma.emotionRecord.findMany({
      where,
      include: {
        emotion: {
          select: {
            name: true,
            icon: true,
            color: true,
            category: true,
          },
        },
      },
      orderBy: { recordedAt: 'desc' },
      take: limit,
    });

    return records;
  }

  async getEmotionStats(userId: string, days: number = 30) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const records = await prisma.emotionRecord.findMany({
      where: {
        userId,
        recordedAt: { gte: fromDate },
      },
      include: {
        emotion: true,
      },
    });

    // Agrupar por emoção
    const emotionCounts: Record<string, { count: number; emotion: any }> = {};

    for (const record of records) {
      const key = record.emotionId;
      if (!emotionCounts[key]) {
        emotionCounts[key] = { count: 0, emotion: record.emotion };
      }
      emotionCounts[key].count++;
    }

    // Ordenar por frequência
    const topEmotions = Object.values(emotionCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calcular distribuição por categoria
    const categoryDistribution: Record<string, number> = {
      POSITIVE: 0,
      NEGATIVE: 0,
      NEUTRAL: 0,
    };

    for (const record of records) {
      categoryDistribution[record.emotion.category]++;
    }

    return {
      totalRecords: records.length,
      topEmotions,
      categoryDistribution,
      period: { from: fromDate, to: new Date(), days },
    };
  }

  // ==================== CHECK-IN DIÁRIO ====================

  async createDailyCheckIn(userId: string, data: DailyCheckInData) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Verificar se já existe check-in hoje
    const existing = await prisma.dailyCheckIn.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    if (existing) {
      // Atualizar check-in existente
      const updated = await prisma.dailyCheckIn.update({
        where: { id: existing.id },
        data: {
          overallMood: data.overallMood,
          energyLevel: data.energyLevel,
          sleepQuality: data.sleepQuality,
          anxietyLevel: data.anxietyLevel,
          notes: data.notes,
          updatedAt: new Date(),
        },
      });
      return { checkIn: updated, isNew: false };
    }

    // Criar novo check-in
    const checkIn = await prisma.dailyCheckIn.create({
      data: {
        userId,
        date: today,
        overallMood: data.overallMood,
        energyLevel: data.energyLevel,
        sleepQuality: data.sleepQuality,
        anxietyLevel: data.anxietyLevel,
        notes: data.notes,
      },
    });

    return { checkIn, isNew: true };
  }

  async getTodayCheckIn(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkIn = await prisma.dailyCheckIn.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    return checkIn;
  }

  async getCheckInHistory(userId: string, days: number = 30) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    fromDate.setHours(0, 0, 0, 0);

    const checkIns = await prisma.dailyCheckIn.findMany({
      where: {
        userId,
        date: { gte: fromDate },
      },
      orderBy: { date: 'desc' },
    });

    return checkIns;
  }

  async getCheckInStats(userId: string, days: number = 30) {
    const checkIns = await this.getCheckInHistory(userId, days);

    if (checkIns.length === 0) {
      return null;
    }

    const avgMood =
      checkIns.reduce((sum, c) => sum + c.overallMood, 0) / checkIns.length;

    const avgEnergy =
      checkIns.filter((c) => c.energyLevel !== null).length > 0
        ? checkIns
            .filter((c) => c.energyLevel !== null)
            .reduce((sum, c) => sum + (c.energyLevel || 0), 0) /
          checkIns.filter((c) => c.energyLevel !== null).length
        : null;

    const avgSleep =
      checkIns.filter((c) => c.sleepQuality !== null).length > 0
        ? checkIns
            .filter((c) => c.sleepQuality !== null)
            .reduce((sum, c) => sum + (c.sleepQuality || 0), 0) /
          checkIns.filter((c) => c.sleepQuality !== null).length
        : null;

    // Calcular tendência (comparando primeira e segunda metade do período)
    const midpoint = Math.floor(checkIns.length / 2);
    const recentAvg =
      checkIns.slice(0, midpoint).reduce((sum, c) => sum + c.overallMood, 0) /
      (midpoint || 1);
    const olderAvg =
      checkIns.slice(midpoint).reduce((sum, c) => sum + c.overallMood, 0) /
      (checkIns.length - midpoint || 1);

    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentAvg - olderAvg > 0.5) trend = 'improving';
    else if (olderAvg - recentAvg > 0.5) trend = 'declining';

    return {
      totalCheckIns: checkIns.length,
      averageMood: Math.round(avgMood * 10) / 10,
      averageEnergy: avgEnergy ? Math.round(avgEnergy * 10) / 10 : null,
      averageSleep: avgSleep ? Math.round(avgSleep * 10) / 10 : null,
      trend,
      period: { days },
    };
  }
}

export const emotionService = new EmotionService();
