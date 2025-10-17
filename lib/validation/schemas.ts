import { z } from "zod"

// User schemas
export const userRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().optional(),
})

export const userUpdateSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  avatar_url: z.string().url().optional(),
})

// Document schemas
export const documentUploadSchema = z.object({
  name: z.string().min(1).max(255),
  category: z.enum(["contract", "invoice", "legal", "financial", "other"]),
  file: z.instanceof(File),
})

// Payment schemas
export const paymentIntentSchema = z.object({
  amount: z.number().positive(),
  description: z.string().optional(),
})

export const subscriptionSchema = z.object({
  planId: z.string(),
  userId: z.string().uuid(),
})

// Agent schemas
export const agentExecutionSchema = z.object({
  agentId: z.string().uuid(),
  input: z.string().min(1),
  metadata: z.record(z.any()).optional(),
})

// Report schemas
export const reportGenerationSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  format: z.enum(["json", "csv", "pdf"]),
})

// Theme schemas
export const themeSchema = z.object({
  primary_color: z.string().regex(/^#[0-9A-F]{6}$/i),
  secondary_color: z.string().regex(/^#[0-9A-F]{6}$/i),
  accent_color: z.string().regex(/^#[0-9A-F]{6}$/i),
  logo_url: z.string().url().optional(),
  favicon_url: z.string().url().optional(),
  custom_css: z.string().optional(),
  font_family: z.string().optional(),
})

// Notification schemas
export const notificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(["welcome", "document_processed", "payment_success", "agent_complete"]),
  channel: z.enum(["email", "sms", "both"]),
  data: z.record(z.any()),
  scheduledFor: z.string().datetime().optional(),
})

export type UserRegistration = z.infer<typeof userRegistrationSchema>
export type UserUpdate = z.infer<typeof userUpdateSchema>
export type DocumentUpload = z.infer<typeof documentUploadSchema>
export type PaymentIntent = z.infer<typeof paymentIntentSchema>
export type Subscription = z.infer<typeof subscriptionSchema>
export type AgentExecution = z.infer<typeof agentExecutionSchema>
export type ReportGeneration = z.infer<typeof reportGenerationSchema>
export type Theme = z.infer<typeof themeSchema>
export type Notification = z.infer<typeof notificationSchema>
