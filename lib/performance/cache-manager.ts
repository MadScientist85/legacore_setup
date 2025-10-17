import { Redis } from "@upstash/redis"

let redis: Redis | null = null

function getRedisClient() {
  if (!redis && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  }
  return redis
}

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  prefix?: string
}

export class CacheManager {
  private prefix: string

  constructor(prefix = "legacore") {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`
  }

  async get<T>(key: string): Promise<T | null> {
    const client = getRedisClient()
    if (!client) return null

    try {
      const data = await client.get(this.getKey(key))
      return data as T
    } catch (error) {
      console.error("Cache get error:", error)
      return null
    }
  }

  async set(key: string, value: any, options: CacheOptions = {}): Promise<boolean> {
    const client = getRedisClient()
    if (!client) return false

    try {
      const fullKey = this.getKey(key)
      if (options.ttl) {
        await client.setex(fullKey, options.ttl, JSON.stringify(value))
      } else {
        await client.set(fullKey, JSON.stringify(value))
      }
      return true
    } catch (error) {
      console.error("Cache set error:", error)
      return false
    }
  }

  async delete(key: string): Promise<boolean> {
    const client = getRedisClient()
    if (!client) return false

    try {
      await client.del(this.getKey(key))
      return true
    } catch (error) {
      console.error("Cache delete error:", error)
      return false
    }
  }

  async invalidatePattern(pattern: string): Promise<boolean> {
    const client = getRedisClient()
    if (!client) return false

    try {
      const keys = await client.keys(`${this.prefix}:${pattern}`)
      if (keys.length > 0) {
        await client.del(...keys)
      }
      return true
    } catch (error) {
      console.error("Cache invalidate error:", error)
      return false
    }
  }

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    const client = getRedisClient()
    if (!client) return keys.map(() => null)

    try {
      const fullKeys = keys.map((k) => this.getKey(k))
      const data = await client.mget(...fullKeys)
      return data as (T | null)[]
    } catch (error) {
      console.error("Cache mget error:", error)
      return keys.map(() => null)
    }
  }

  async mset(items: Array<{ key: string; value: any; ttl?: number }>): Promise<boolean> {
    const client = getRedisClient()
    if (!client) return false

    try {
      for (const item of items) {
        await this.set(item.key, item.value, { ttl: item.ttl })
      }
      return true
    } catch (error) {
      console.error("Cache mset error:", error)
      return false
    }
  }
}

// Pre-configured cache instances
export const userCache = new CacheManager("user")
export const agentCache = new CacheManager("agent")
export const documentCache = new CacheManager("document")
export const analyticsCache = new CacheManager("analytics")
