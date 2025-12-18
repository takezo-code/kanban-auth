import { createApp } from './app';
import { env } from './shared/config/env';
import { initDatabase, closeDatabase } from './shared/database/connection';

async function bootstrap() {
  try {
    await initDatabase();
    console.log('✅ Banco de dados conectado');

    const app = createApp();

    app.listen(env.port, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${env.port}`);
      console.log(`📋 Health check: http://localhost:${env.port}/health`);
      console.log(`📚 Swagger docs: http://localhost:${env.port}/api-docs`);
    });

    process.on('SIGTERM', async () => {
      console.log('🛑 SIGTERM recebido, encerrando...');
      await closeDatabase();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('🛑 SIGINT recebido, encerrando...');
      await closeDatabase();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    await closeDatabase();
    process.exit(1);
  }
}

bootstrap();
