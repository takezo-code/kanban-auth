import { Pool, PoolClient } from 'pg';
import { env } from '../config/env';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = env.databaseUrl || 
      `postgresql://${env.postgres.user}:${env.postgres.password}@${env.postgres.host}:${env.postgres.port}/${env.postgres.database}`;
    
    pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('❌ Erro inesperado no pool do PostgreSQL:', err);
    });
  }

  return pool;
}

export async function getClient(): Promise<PoolClient> {
  const pool = getPool();
  return pool.connect();
}

export async function query(text: string, params?: any[]): Promise<any> {
  const pool = getPool();
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (env.nodeEnv === 'development') {
      console.log('📊 Query executada', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('❌ Erro na query:', { text, error });
    throw error;
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ Conexão com PostgreSQL estabelecida:', result.rows[0].now);
    return true;
  } catch (error: any) {
    console.error('❌ Erro ao conectar com PostgreSQL:');
    if (error.code === 'ECONNREFUSED') {
      console.error('   Conexão recusada. Verifique se o PostgreSQL está rodando.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('   Timeout na conexão. Verifique se o host e porta estão corretos.');
    } else if (error.message) {
      console.error(`   ${error.message}`);
    } else {
      console.error('   ', error);
    }
    return false;
  }
}

