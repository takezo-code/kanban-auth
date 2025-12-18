import { testConnection as testPostgres, closePool } from './postgres.connection';
import { runMigrations as runPostgresMigrations } from './postgres.migrate';
import { env } from '../config/env';

export async function initDatabase(): Promise<void> {
  console.log('📦 Conectando ao PostgreSQL...');
  console.log(`   Host: ${env.postgres.host}:${env.postgres.port}`);
  console.log(`   Database: ${env.postgres.database}`);
  
  const connected = await testPostgres();
  if (!connected) {
    console.error('❌ Falha ao conectar com PostgreSQL');
    console.error('💡 Verifique se:');
    console.error('   1. Docker está rodando');
    console.error('   2. Container PostgreSQL está rodando: docker-compose ps');
    console.error('   3. Variáveis de ambiente estão configuradas no .env');
    console.error('   4. Porta não está em conflito');
    throw new Error('Falha ao conectar com PostgreSQL');
  }
  
  await runPostgresMigrations();
}

export async function closeDatabase(): Promise<void> {
  await closePool();
}
