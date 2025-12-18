import dotenv from 'dotenv';
import path from 'path';

// Carrega variáveis de ambiente
dotenv.config();

/**
 * Configuração centralizada de variáveis de ambiente
 * Com validação e valores padrão
 */
export const env = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  databasePath: process.env.DATABASE_PATH || path.join(process.cwd(), 'database.sqlite'),
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'kanban_user',
    password: process.env.POSTGRES_PASSWORD || 'kanban_pass',
    database: process.env.POSTGRES_DB || 'kanban_db',
  },
  databaseUrl: process.env.DATABASE_URL || '',

  // JWT
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'default_access_secret_CHANGE_IN_PRODUCTION',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_CHANGE_IN_PRODUCTION',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10),
};

// Validação básica em produção
if (env.nodeEnv === 'production') {
  if (env.jwtAccessSecret.includes('default') || env.jwtRefreshSecret.includes('default')) {
    console.error('⚠️  ERRO: JWT secrets padrão não podem ser usados em produção!');
    console.error('💡 Configure JWT_ACCESS_SECRET e JWT_REFRESH_SECRET no .env');
    process.exit(1);
  }
}

