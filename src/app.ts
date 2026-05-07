import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { env } from './config';
import routes from './routes';
import { errorMiddleware } from './middlewares';

const app: Express = express();

// Middlewares globais
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  });
});

// Rota de informações da API
app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'App Bem Estar API',
    version: '1.0.0',
    description: 'API para plataforma de monitoramento de saúde mental',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      questionnaire: '/api/questionnaire',
      emotions: '/api/emotions',
      goals: '/api/goals',
      reports: '/api/reports',
      resources: '/api/resources',
    },
  });
});

// Rotas da API
app.use('/api', routes);

// Rota 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
  });
});

// Middleware de erro global
app.use(errorMiddleware);

export default app;
