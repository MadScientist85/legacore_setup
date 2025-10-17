export interface ErrorContext {
  userId?: string
  action?: string
  metadata?: Record<string, any>
}

export class ErrorTracker {
  static log(error: Error | unknown, context?: ErrorContext) {
    const errorInfo = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      context,
    }

    console.error("Error tracked:", errorInfo)

    // Send to monitoring service (Sentry, etc.)
    if (process.env.SENTRY_DSN) {
      // Sentry integration would go here
    }
  }

  static async logToDatabase(error: Error | unknown, context?: ErrorContext) {
    try {
      // Log to database for audit trail
      const { supabase } = await import("@/lib/supabase/client")

      await supabase.from("error_logs").insert({
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        user_id: context?.userId,
        action: context?.action,
        metadata: context?.metadata,
      })
    } catch (logError) {
      console.error("Failed to log error to database:", logError)
    }
  }

  static wrap<T extends (...args: any[]) => any>(
    fn: T,
    context?: Omit<ErrorContext, "userId">,
  ): (...args: Parameters<T>) => ReturnType<T> {
    return ((...args: Parameters<T>) => {
      try {
        const result = fn(...args)
        if (result instanceof Promise) {
          return result.catch((error) => {
            this.log(error, context)
            throw error
          })
        }
        return result
      } catch (error) {
        this.log(error, context)
        throw error
      }
    }) as (...args: Parameters<T>) => ReturnType<T>
  }
}
