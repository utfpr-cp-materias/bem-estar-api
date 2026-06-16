import { prisma } from '../config';
import { GoalCategory, GoalFrequency } from '@prisma/client';

interface CreateGoalData {
  title: string;
  description?: string;
  category: GoalCategory;
  frequency: GoalFrequency;
  targetValue?: number;
  unit?: string;
}

interface UpdateGoalData {
  title?: string;
  description?: string;
  category?: GoalCategory;
  frequency?: GoalFrequency;
  targetValue?: number;
  unit?: string;
  isActive?: boolean;
}

export class GoalService {
  async createGoal(userId: string, data: CreateGoalData) {
    const goal = await prisma.goal.create({
      data: {
        userId,
        ...data,
      },
    });

    return goal;
  }

  async getUserGoals(userId: string, activeOnly: boolean = true) {
    const goals = await prisma.goal.findMany({
      where: {
        userId,
        ...(activeOnly && { isActive: true }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return goals;
  }

  async getGoalById(userId: string, goalId: string) {
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
      include: {
        progress: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    if (!goal) {
      throw new Error('Meta não encontrada');
    }

    return goal;
  }

  async updateGoal(userId: string, goalId: string, data: UpdateGoalData) {
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new Error('Meta não encontrada');
    }

    const updated = await prisma.goal.update({
      where: { id: goalId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return updated;
  }

  async deleteGoal(userId: string, goalId: string) {
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new Error('Meta não encontrada');
    }

    await prisma.goal.delete({
      where: { id: goalId },
    });
  }

  async recordProgress(
    userId: string,
    goalId: string,
    data: { completed: boolean; value?: number; notes?: string; date?: Date }
  ) {
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new Error('Meta não encontrada');
    }

    const targetDate = data.date || new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Upsert - criar ou atualizar progresso do dia
    const progress = await prisma.goalProgress.upsert({
      where: {
        goalId_date: {
          goalId,
          date: targetDate,
        },
      },
      update: {
        completed: data.completed,
        value: data.value,
        notes: data.notes,
      },
      create: {
        goalId,
        date: targetDate,
        completed: data.completed,
        value: data.value,
        notes: data.notes,
      },
    });

    return progress;
  }

  async getTodayGoals(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const goals = await prisma.goal.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        progress: {
          where: { date: today },
          take: 1,
        },
      },
    });

    return goals.map((goal) => ({
      ...goal,
      todayProgress: goal.progress[0] || null,
      isCompletedToday: goal.progress[0]?.completed || false,
    }));
  }

  async getGoalStats(userId: string, goalId?: string, days: number = 30) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    fromDate.setHours(0, 0, 0, 0);

    const where: any = {
      goal: { userId },
      date: { gte: fromDate },
    };

    if (goalId) {
      where.goalId = goalId;
    }

    const allProgress = await prisma.goalProgress.findMany({
      where,
      include: {
        goal: {
          select: { title: true, category: true },
        },
      },
    });

    const completedCount = allProgress.filter((p) => p.completed).length;
    const totalCount = allProgress.length;

    // Streak atual (dias consecutivos completando metas)
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < days; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);

      const dayProgress = allProgress.filter(
        (p) => p.date.getTime() === checkDate.getTime() && p.completed
      );

      if (dayProgress.length > 0) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      completedCount,
      totalCount,
      completionRate: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      currentStreak,
      period: { days },
    };
  }

}

export const goalService = new GoalService();
