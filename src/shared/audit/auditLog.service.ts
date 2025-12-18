import { query } from '../database/postgres.connection';

export class AuditLogService {
  async log(
    action: string,
    entity: string,
    entityId: number,
    performedBy: number,
    metadata?: Record<string, any>
  ): Promise<void> {
    await query(
      `INSERT INTO audit_logs (action, entity, entity_id, performed_by, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [action, entity, entityId, performedBy, metadata ? JSON.stringify(metadata) : null]
    );
  }

  async findByEntity(entity: string, entityId: number): Promise<any[]> {
    const result = await query(
      `SELECT 
        al.id,
        al.action,
        al.entity,
        al.entity_id as "entityId",
        al.performed_by as "performedBy",
        al.metadata,
        al.created_at as "createdAt",
        u.name as "performedByName",
        u.email as "performedByEmail"
      FROM audit_logs al
      LEFT JOIN users u ON al.performed_by = u.id
      WHERE al.entity = $1 AND al.entity_id = $2
      ORDER BY al.created_at DESC`,
      [entity, entityId]
    );

    return result.rows;
  }

  async findByUser(userId: number): Promise<any[]> {
    const result = await query(
      `SELECT 
        al.id,
        al.action,
        al.entity,
        al.entity_id as "entityId",
        al.performed_by as "performedBy",
        al.metadata,
        al.created_at as "createdAt"
      FROM audit_logs al
      WHERE al.performed_by = $1
      ORDER BY al.created_at DESC
      LIMIT 100`,
      [userId]
    );

    return result.rows;
  }
}

export const auditLog = new AuditLogService();
