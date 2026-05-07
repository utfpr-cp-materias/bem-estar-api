import { prisma } from '../config';

interface UpdateUserData {
  name?: string;
  birthDate?: Date;
  phone?: string;
  avatarUrl?: string;
}

export class UserService {
  async getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        birthDate: true,
        phone: true,
        avatarUrl: true,
        onboardingCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }

  async updateUser(userId: string, data: UpdateUserData) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        birthDate: true,
        phone: true,
        avatarUrl: true,
        onboardingCompleted: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async completeOnboarding(userId: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        onboardingCompleted: true,
      },
    });

    return user;
  }

  async deleteUser(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
  }

  async getUserStats(userId: string) {
    const [
      totalCheckIns,
      totalGoals,
      completedGoals,
      totalEmotionRecords,
    ] = await Promise.all([
      prisma.dailyCheckIn.count({ where: { userId } }),
      prisma.goal.count({ where: { userId, isActive: true } }),
      prisma.goalProgress.count({
        where: {
          goal: { userId },
          completed: true,
        },
      }),
      prisma.emotionRecord.count({ where: { userId } }),
    ]);

    return {
      totalCheckIns,
      totalGoals,
      completedGoals,
      totalEmotionRecords,
    };
  }
}

export const userService = new UserService();
