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

import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/app';
import { prisma } from '../src/config';

const prismaMock = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
};

describe('POST /api/auth/register', () => {
  it('201 quando o cadastro é bem-sucedido', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    prismaMock.user.create.mockResolvedValueOnce({
      id: 'user-new',
      name: 'Novo',
      email: 'novo@teste.com',
      onboardingCompleted: false,
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Novo', email: 'novo@teste.com', password: 'senha123' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('novo@teste.com');
    expect(res.body.data.token).toBeDefined();
  });

  it('400 quando o body é inválido (faltando nome)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'x@teste.com', password: 'senha123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('409 quando e-mail já está cadastrado', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'existing', email: 'ja@teste.com' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Ja', email: 'ja@teste.com', password: 'senha123' });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('cadastrado');
  });
});

describe('POST /api/auth/login', () => {
  it('200 com token quando credenciais válidas', async () => {
    const hashed = await bcrypt.hash('Senha123!', 10);
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      name: 'Ana',
      email: 'ana@demo.com',
      password: hashed,
      isActive: true,
      onboardingCompleted: true,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ana@demo.com', password: 'Senha123!' });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.id).toBe('user-1');
  });

  it('401 quando senha incorreta', async () => {
    const hashed = await bcrypt.hash('Senha123!', 10);
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'user-1',
      name: 'Ana',
      email: 'ana@demo.com',
      password: hashed,
      isActive: true,
      onboardingCompleted: true,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ana@demo.com', password: 'senha-errada' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('400 quando body inválido', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'sem-senha@teste.com' });
    expect(res.status).toBe(400);
  });
});

describe('GET /health', () => {
  it('200 com status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api', () => {
  it('200 com lista de endpoints', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toBe(200);
    expect(res.body.endpoints.auth).toBe('/api/auth');
  });
});
