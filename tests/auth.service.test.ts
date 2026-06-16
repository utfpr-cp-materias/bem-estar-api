jest.mock('../src/config', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
  env: {
    jwtSecret: 'test-secret-key',
    jwtExpiresIn: '1h',
    nodeEnv: 'test',
    corsOrigin: 'http://localhost:5173',
    databaseUrl: 'postgresql://test:test@localhost:5432/test',
    port: 3000,
  },
}));

import { authService } from '../src/services/auth.service';
import { prisma } from '../src/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prismaMock = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
};

describe('AuthService.register', () => {
  it('cria usuário com senha hasheada e retorna token JWT válido', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    prismaMock.user.create.mockImplementationOnce(({ data }: any) =>
      Promise.resolve({
        id: 'user-1',
        name: data.name,
        email: data.email,
        onboardingCompleted: false,
      }),
    );

    const result = await authService.register({
      name: 'Antonio',
      email: 'antonio@teste.com',
      password: 'minhasenha',
    });

    expect(result.user).toEqual({
      id: 'user-1',
      name: 'Antonio',
      email: 'antonio@teste.com',
      onboardingCompleted: false,
    });
    expect(typeof result.token).toBe('string');

    const decoded = jwt.verify(result.token, 'test-secret-key') as any;
    expect(decoded.userId).toBe('user-1');
    expect(decoded.email).toBe('antonio@teste.com');

    const createCall = prismaMock.user.create.mock.calls[0][0];
    expect(createCall.data.password).not.toBe('minhasenha');
    const match = await bcrypt.compare('minhasenha', createCall.data.password);
    expect(match).toBe(true);
  });

  it('rejeita registro se e-mail já existe', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'existing', email: 'usado@teste.com' });

    await expect(
      authService.register({
        name: 'Outro',
        email: 'usado@teste.com',
        password: 'qualquer',
      }),
    ).rejects.toThrow('E-mail já cadastrado');

    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });
});

describe('AuthService.login', () => {
  const validPassword = 'Senha123!';
  let hashedPassword: string;

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash(validPassword, 10);
  });

  it('retorna token quando email + senha estão corretos', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      name: 'Ana',
      email: 'ana@demo.com',
      password: hashedPassword,
      isActive: true,
      onboardingCompleted: true,
    });

    const result = await authService.login({ email: 'ana@demo.com', password: validPassword });

    expect(result.user.email).toBe('ana@demo.com');
    const decoded = jwt.verify(result.token, 'test-secret-key') as any;
    expect(decoded.userId).toBe('user-1');
  });

  it('rejeita login quando usuário não existe', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    await expect(
      authService.login({ email: 'inexistente@x.com', password: validPassword }),
    ).rejects.toThrow('E-mail ou senha inválidos');
  });

  it('rejeita login quando senha está incorreta', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      name: 'Ana',
      email: 'ana@demo.com',
      password: hashedPassword,
      isActive: true,
      onboardingCompleted: true,
    });

    await expect(
      authService.login({ email: 'ana@demo.com', password: 'senha-errada' }),
    ).rejects.toThrow('E-mail ou senha inválidos');
  });

  it('rejeita login de usuário inativo', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      name: 'Ana',
      email: 'ana@demo.com',
      password: hashedPassword,
      isActive: false,
      onboardingCompleted: true,
    });

    await expect(
      authService.login({ email: 'ana@demo.com', password: validPassword }),
    ).rejects.toThrow('Usuário inativo');
  });
});

describe('AuthService.getProfile', () => {
  it('retorna profile quando usuário existe', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      name: 'Ana',
      email: 'ana@demo.com',
      birthDate: null,
      phone: null,
      avatarUrl: null,
      onboardingCompleted: true,
      createdAt: new Date('2026-06-01'),
    });

    const result = await authService.getProfile('user-1');
    expect(result.id).toBe('user-1');
    expect(result.email).toBe('ana@demo.com');
  });

  it('lança erro se usuário não encontrado', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    await expect(authService.getProfile('inexistente')).rejects.toThrow('Usuário não encontrado');
  });
});
