export type LogLevel = "debug" | "info" | "warn" | "error"

export interface LogEntry {
  timestamp: string
  level: LogLevel
  service: string
  message: string
  data?: any
  error?: string
}

export class Logger {
  private service: string
  private isDevelopment: boolean

  constructor(service: string) {
    this.service = service
    this.isDevelopment = process.env.NODE_ENV === "development"
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      this.log("debug", message, data)
    }
  }

  info(message: string, data?: any): void {
    this.log("info", message, data)
  }

  warn(message: string, data?: any): void {
    this.log("warn", message, data)
  }

  error(message: string, data?: any): void {
    this.log("error", message, data)
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      data,
    }

    if (this.isDevelopment) {
      // Pretty print for development
      const color = this.getColor(level)
      console.log(
        `${color}[${entry.timestamp}] ${level.toUpperCase()} [${this.service}]${"\x1b[0m"} ${message}`,
        data ? data : "",
      )
    } else {
      // JSON format for production
      console.log(JSON.stringify(entry))
    }

    // In production, you might want to send logs to a service like DataDog, LogRocket, etc.
    if (!this.isDevelopment && level === "error") {
      this.sendToErrorTracking(entry)
    }
  }

  private getColor(level: LogLevel): string {
    const colors = {
      debug: "\x1b[36m", // Cyan
      info: "\x1b[32m", // Green
      warn: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
    }
    return colors[level] || "\x1b[0m"
  }

  private sendToErrorTracking(entry: LogEntry): void {
    // Integrate with error tracking service
    // Example: Sentry, DataDog, etc.
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "exception", {
        description: entry.message,
        fatal: false,
      })
    }
  }
}
