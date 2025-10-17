import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyPrefix?: string
}

export class RateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = {
      keyPrefix: "rate_limit",
      ...config,
    }
  }

  async checkLimit(identifier: string): Promise<{
    allowed: boolean
    remaining: number
    resetAt: Date
  }> {
    const key = `${this.config.keyPrefix}:${identifier}`
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    try {
      const requests = await redis.zrange(key, windowStart, now, {
        byScore: true,
      })

      const requestCount = requests.length

      if (requestCount >= this.config.maxRequests) {
        const oldestRequest = await redis.zrange(key, 0, 0)
        const resetAt = oldestRequest[0]
          ? new Date(Number(oldestRequest[0]) + this.config.windowMs)
          : new Date(now + this.config.windowMs)

        return {
          allowed: false,
          remaining: 0,
          resetAt,
        }
      }

      await redis.zadd(key, { score: now, member: `${now}:${Math.random()}` })
      await redis.zremrangebyscore(key, 0, windowStart)
      await redis.expire(key, Math.ceil(this.config.windowMs / 1000))

      return {
        allowed: true,
        remaining: this.config.maxRequests - requestCount - 1,
        resetAt: new Date(now + this.config.windowMs),
      }
    } catch (error) {
      console.error("Rate limit check error:", error)
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        resetAt: new Date(now + this.config.windowMs),
      }
    }
  }

  async reset(identifier: string): Promise<void> {
    const key = `${this.config.keyPrefix}:${identifier}`
    await redis.del(key)
  }
}

export const apiRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000,
  keyPrefix: "api",
})

export const authRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000,
  keyPrefix: "auth",
})
