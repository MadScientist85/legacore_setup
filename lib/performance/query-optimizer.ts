import { supabase } from "@/lib/supabase/client"
import { CacheManager } from "./cache-manager"

export class QueryOptimizer {
  private cache: CacheManager

  constructor(cachePrefix: string) {
    this.cache = new CacheManager(cachePrefix)
  }

  async cachedQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    options: { ttl?: number; skipCache?: boolean } = {},
  ): Promise<T> {
    if (!options.skipCache) {
      const cached = await this.cache.get<T>(key)
      if (cached !== null) {
        return cached
      }
    }

    const result = await queryFn()
    await this.cache.set(key, result, { ttl: options.ttl || 300 })
    return result
  }

  async batchQuery<T>(table: string, ids: string[], options: { select?: string; ttl?: number } = {}): Promise<T[]> {
    const cacheKeys = ids.map((id) => `${table}:${id}`)
    const cached = await this.cache.mget<T>(cacheKeys)

    const uncachedIndices: number[] = []
    const uncachedIds: string[] = []

    cached.forEach((item, index) => {
      if (item === null) {
        uncachedIndices.push(index)
        uncachedIds.push(ids[index])
      }
    })

    if (uncachedIds.length > 0) {
      const query = supabase
        .from(table)
        .select(options.select || "*")
        .in("id", uncachedIds)

      const { data, error } = await query

      if (error) throw error

      const cacheItems = uncachedIds.map((id, idx) => ({
        key: `${table}:${id}`,
        value: data[idx],
        ttl: options.ttl || 300,
      }))

      await this.cache.mset(cacheItems)

      uncachedIndices.forEach((origIndex, idx) => {
        cached[origIndex] = data[idx] as T
      })
    }

    return cached.filter((item): item is T => item !== null)
  }

  async invalidate(key: string): Promise<void> {
    await this.cache.delete(key)
  }

  async invalidatePattern(pattern: string): Promise<void> {
    await this.cache.invalidatePattern(pattern)
  }
}
