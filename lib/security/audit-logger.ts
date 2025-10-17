import { supabaseAdmin } from "@/lib/supabase/client"

export interface AuditLogEntry {
  user_id?: string
  action: string
  resource_type: string
  resource_id?: string
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, any>
  severity: "info" | "warning" | "error" | "critical"
}

export class AuditLogger {
  static async log(entry: AuditLogEntry): Promise<void> {
    try {
      const { error } = await supabaseAdmin.from("audit_logs").insert({
        user_id: entry.user_id,
        action: entry.action,
        resource_type: entry.resource_type,
        resource_id: entry.resource_id,
        ip_address: entry.ip_address,
        user_agent: entry.user_agent,
        metadata: entry.metadata,
        severity: entry.severity,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Failed to log audit entry:", error)
      }
    } catch (error) {
      console.error("Audit logging error:", error)
    }
  }

  static async logUserAction(
    userId: string,
    action: string,
    resourceType: string,
    resourceId?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
      severity: "info",
    })
  }

  static async logSecurityEvent(
    action: string,
    severity: "warning" | "error" | "critical",
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      action,
      resource_type: "security",
      metadata,
      severity,
    })
  }

  static async getLogs(filters?: {
    userId?: string
    action?: string
    resourceType?: string
    severity?: string
    startDate?: Date
    endDate?: Date
    limit?: number
  }): Promise<any[]> {
    try {
      let query = supabaseAdmin.from("audit_logs").select("*").order("created_at", { ascending: false })

      if (filters?.userId) {
        query = query.eq("user_id", filters.userId)
      }

      if (filters?.action) {
        query = query.eq("action", filters.action)
      }

      if (filters?.resourceType) {
        query = query.eq("resource_type", filters.resourceType)
      }

      if (filters?.severity) {
        query = query.eq("severity", filters.severity)
      }

      if (filters?.startDate) {
        query = query.gte("created_at", filters.startDate.toISOString())
      }

      if (filters?.endDate) {
        query = query.lte("created_at", filters.endDate.toISOString())
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      } else {
        query = query.limit(100)
      }

      const { data, error } = await query

      if (error) {
        console.error("Failed to fetch audit logs:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error fetching audit logs:", error)
      return []
    }
  }
}
