import { prisma } from '../config';

export class SupportService {
  async createTicket(userId: string, message: string) {
    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        message,
      },
    });

    return ticket;
  }

  async getUserTickets(userId: string) {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return tickets;
  }
}

export const supportService = new SupportService();
