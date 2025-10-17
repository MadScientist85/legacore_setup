import { hash, compare } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"

const SALT_ROUNDS = 10
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key"

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export function generateToken(payload: object, expiresIn = "7d"): string {
  return sign(payload, JWT_SECRET, { expiresIn })
}

export function verifyToken(token: string): any {
  try {
    return verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = "hbu_"
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
