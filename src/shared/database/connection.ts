import Database from 'better-sqlite3';
import { env } from '../config/env';

/**
 * Conexão com SQLite usando better-sqlite3
 * Singleton para reutilizar a mesma conexão
 */
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(env.databasePath, {
      verbose: env.nodeEnv === 'development' ? console.log : undefined,
    });

    // Habilita foreign keys (importante para integridade referencial)
    db.pragma('foreign_keys = ON');
    
    console.log(`✅ Database conectado: ${env.databasePath}`);
  }

  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log('🔒 Database fechado');
  }
}

