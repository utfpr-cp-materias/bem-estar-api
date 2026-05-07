import app from './app';
import { env, prisma } from './config';

const startServer = async () => {
  try {
    // Testar conexão com o banco
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados');

    // Iniciar servidor
    app.listen(env.port, () => {
      console.log(`
🚀 Servidor rodando!
📍 URL: http://localhost:${env.port}
🔧 Ambiente: ${env.nodeEnv}
📚 API Docs: http://localhost:${env.port}/api
❤️  Health: http://localhost:${env.port}/health
      `);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
