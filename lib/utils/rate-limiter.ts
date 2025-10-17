interface RateLimitConfig {
  requestsPerMinute: number
  tokensPerMinute: number
}

interface RateLimitState {
  requests: { timestamp: number }[]
  tokens: { timestamp: number; count: number }[]
}

export class RateLimiter {
  private config: RateLimitConfig
  private state: RateLimitState

  constructor(config: RateLimitConfig) {
    this.config = config
    this.state = {
      requests: [],
      tokens: [],
    }
  }

  async checkLimit(requestCount = 1, tokenCount = 0): Promise<void> {
    const now = Date.now()
    const oneMinuteAgo = now - 60000

    // Clean old entries
    this.state.requests = this.state.requests.filter((req) => req.timestamp > oneMinuteAgo)
    this.state.tokens = this.state.tokens.filter((token) => token.timestamp > oneMinuteAgo)

    // Check request limit
    if (this.state.requests.length + requestCount > this.config.requestsPerMinute) {
      const oldestRequest = this.state.requests[0]
      const waitTime = oldestRequest ? oldestRequest.timestamp + 60000 - now : 0
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)} seconds.`)
    }

    // Check token limit
    const currentTokens = this.state.tokens.reduce((sum, token) => sum + token.count, 0)
    if (currentTokens + tokenCount > this.config.tokensPerMinute) {
      const oldestToken = this.state.tokens[0]
      const waitTime = oldestToken ? oldestToken.timestamp + 60000 - now : 0
      throw new Error(`Token rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)} seconds.`)
    }

    // Record the request and tokens
    for (let i = 0; i < requestCount; i++) {
      this.state.requests.push({ timestamp: now })
    }

    if (tokenCount > 0) {
      this.state.tokens.push({ timestamp: now, count: tokenCount })
    }
  }

  getRemainingRequests(): number {
    const now = Date.now()
    const oneMinuteAgo = now - 60000
    const recentRequests = this.state.requests.filter((req) => req.timestamp > oneMinuteAgo)
    return Math.max(0, this.config.requestsPerMinute - recentRequests.length)
  }

  getRemainingTokens(): number {
    const now = Date.now()
    const oneMinuteAgo = now - 60000
    const recentTokens = this.state.tokens
      .filter((token) => token.timestamp > oneMinuteAgo)
      .reduce((sum, token) => sum + token.count, 0)
    return Math.max(0, this.config.tokensPerMinute - recentTokens)
  }
}
