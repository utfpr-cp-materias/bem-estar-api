import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, env } from '../config';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  birthDate?: Date;
  phone?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    onboardingCompleted: boolean;
  };
  token: string;
}

export class AuthService {
  private generateToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('E-mail já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        birthDate: data.birthDate,
        phone: data.phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        onboardingCompleted: true,
      },
    });

    const token = this.generateToken(user.id, user.email);

    return { user, token };
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('E-mail ou senha inválidos');
    }

    if (!user.isActive) {
      throw new Error('Usuário inativo');
    }

    const passwordValid = await bcrypt.compare(data.password, user.password);

    if (!passwordValid) {
      throw new Error('E-mail ou senha inválidos');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
      },
      token,
    };
  }

  async getProfile(userId: string) {
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
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const passwordValid = await bcrypt.compare(currentPassword, user.password);

    if (!passwordValid) {
      throw new Error('Senha atual incorreta');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}

export const authService = new AuthService();
