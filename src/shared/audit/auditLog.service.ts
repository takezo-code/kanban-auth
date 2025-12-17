import { getDatabase } from '../database/connection';

/**
 * Service de auditoria
 * Registra ações importantes no sistema
 * 
 * Uso: Opcional, mas recomendado para rastreabilidade
 */
export class AuditLogService {
  private db = getDatabase();

  /**
   * Registra uma ação no log de auditoria
   */
  log(
    action: string,
    entity: string,
    entityId: number,
    performedBy: number,
    metadata?: Record<string, any>
  ): void {
    const stmt = this.db.prepare(`
      INSERT INTO audit_logs (action, entity, entity_id, performed_by, metadata)
      VALUES (?, ?, ?, ?, ?)
    `);

    const metadataJson = metadata ? JSON.stringify(metadata) : null;
    
    stmt.run(action, entity, entityId, performedBy, metadataJson);
  }

  /**
   * Busca logs por entidade
   */
  findByEntity(entity: string, entityId: number): any[] {
    const stmt = this.db.prepare(`
      SELECT 
        al.id,
        al.action,
        al.entity,
        al.entity_id as entityId,
        al.performed_by as performedBy,
        al.metadata,
        al.created_at as createdAt,
        u.name as performedByName,
        u.email as performedByEmail
      FROM audit_logs al
      LEFT JOIN users u ON al.performed_by = u.id
      WHERE al.entity = ? AND al.entity_id = ?
      ORDER BY al.created_at DESC
    `);

    return stmt.all(entity, entityId);
  }

  /**
   * Busca logs por usuário
   */
  findByUser(userId: number): any[] {
    const stmt = this.db.prepare(`
      SELECT 
        al.id,
        al.action,
        al.entity,
        al.entity_id as entityId,
        al.performed_by as performedBy,
        al.metadata,
        al.created_at as createdAt
      FROM audit_logs al
      WHERE al.performed_by = ?
      ORDER BY al.created_at DESC
      LIMIT 100
    `);

    return stmt.all(userId);
  }
}

// Singleton exportado para uso em qualquer lugar
export const auditLog = new AuditLogService();

