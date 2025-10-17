interface AirtableRecord {
  id: string
  fields: Record<string, any>
  createdTime: string
}

interface AirtableResponse {
  records: AirtableRecord[]
  offset?: string
}

export class AirtableClient {
  private baseUrl: string
  private apiKey: string
  private baseId: string
  private tableName: string

  constructor(apiKey: string, baseId: string, tableName: string) {
    this.apiKey = apiKey
    this.baseId = baseId
    this.tableName = tableName
    this.baseUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Airtable API error")
    }

    return response.json()
  }

  async listRecords(options?: {
    maxRecords?: number
    pageSize?: number
    view?: string
    sort?: Array<{ field: string; direction: "asc" | "desc" }>
    filterByFormula?: string
  }): Promise<AirtableRecord[]> {
    const params = new URLSearchParams()

    if (options?.maxRecords) params.append("maxRecords", options.maxRecords.toString())
    if (options?.pageSize) params.append("pageSize", options.pageSize.toString())
    if (options?.view) params.append("view", options.view)
    if (options?.filterByFormula) params.append("filterByFormula", options.filterByFormula)
    if (options?.sort) {
      options.sort.forEach((s, i) => {
        params.append(`sort[${i}][field]`, s.field)
        params.append(`sort[${i}][direction]`, s.direction)
      })
    }

    const queryString = params.toString()
    const data: AirtableResponse = await this.request(queryString ? `?${queryString}` : "")

    return data.records
  }

  async getRecord(recordId: string): Promise<AirtableRecord> {
    return this.request(`/${recordId}`)
  }

  async createRecord(fields: Record<string, any>): Promise<AirtableRecord> {
    const data = await this.request("", {
      method: "POST",
      body: JSON.stringify({ fields }),
    })

    return data
  }

  async updateRecord(recordId: string, fields: Record<string, any>): Promise<AirtableRecord> {
    const data = await this.request(`/${recordId}`, {
      method: "PATCH",
      body: JSON.stringify({ fields }),
    })

    return data
  }

  async deleteRecord(recordId: string): Promise<{ id: string; deleted: boolean }> {
    return this.request(`/${recordId}`, {
      method: "DELETE",
    })
  }

  async batchCreate(records: Array<Record<string, any>>): Promise<AirtableRecord[]> {
    const data = await this.request("", {
      method: "POST",
      body: JSON.stringify({
        records: records.map((fields) => ({ fields })),
      }),
    })

    return data.records
  }

  async search(field: string, value: string): Promise<AirtableRecord[]> {
    const formula = `{${field}} = "${value}"`
    return this.listRecords({ filterByFormula: formula })
  }
}

export function createAirtableClient(): AirtableClient {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Main"

  if (!apiKey || !baseId) {
    throw new Error("Airtable credentials not configured")
  }

  return new AirtableClient(apiKey, baseId, tableName)
}
