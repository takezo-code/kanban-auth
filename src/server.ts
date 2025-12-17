import { createApp } from './app';
import { env } from './shared/config/env';
import { getDatabase, closeDatabase } from './shared/database/connection';

/**
 * Inicialização do servidor
 * Conecta database e inicia o Express
 */
function startServer(): void {
  try {
    // Inicializa database
    getDatabase();

    // Cria app Express
    const app = createApp();

    // Inicia servidor
    const server = app.listen(env.port, () => {
      console.log('');
      console.log('🚀 Servidor rodando!');
      console.log(`📡 Porta: ${env.port}`);
      console.log(`🌍 Ambiente: ${env.nodeEnv}`);
      console.log(`🗄️  Database: ${env.databasePath}`);
      console.log('');
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log('\n⏳ Encerrando servidor...');
      server.close(() => {
        closeDatabase();
        console.log('👋 Servidor encerrado com sucesso');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Inicia servidor
startServer();

