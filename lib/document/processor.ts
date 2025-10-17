import Tesseract from "tesseract.js"
import pdf from "pdf-parse"
import mammoth from "mammoth"

export interface ProcessedDocument {
  text: string
  metadata: {
    pageCount?: number
    wordCount: number
    charCount: number
    language?: string
  }
  extractedData?: any
}

export class DocumentProcessor {
  async processFile(file: Buffer, mimeType: string, filename: string): Promise<ProcessedDocument> {
    switch (mimeType) {
      case "application/pdf":
        return this.processPDF(file)
      case "image/png":
      case "image/jpeg":
      case "image/jpg":
      case "image/tiff":
        return this.processImage(file)
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword":
        return this.processWord(file)
      case "text/plain":
        return this.processText(file)
      default:
        throw new Error(`Unsupported file type: ${mimeType}`)
    }
  }

  private async processPDF(buffer: Buffer): Promise<ProcessedDocument> {
    try {
      const data = await pdf(buffer)
      const text = data.text
      const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length

      return {
        text,
        metadata: {
          pageCount: data.numpages,
          wordCount,
          charCount: text.length,
        },
      }
    } catch (error) {
      throw new Error(`PDF processing failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private async processImage(buffer: Buffer): Promise<ProcessedDocument> {
    try {
      const result = await Tesseract.recognize(buffer, "eng", {
        logger: () => {},
      })

      const text = result.data.text
      const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length

      return {
        text,
        metadata: {
          wordCount,
          charCount: text.length,
          language: result.data.text ? "eng" : undefined,
        },
      }
    } catch (error) {
      throw new Error(`Image OCR failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private async processWord(buffer: Buffer): Promise<ProcessedDocument> {
    try {
      const result = await mammoth.extractRawText({ buffer })
      const text = result.value
      const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length

      return {
        text,
        metadata: {
          wordCount,
          charCount: text.length,
        },
      }
    } catch (error) {
      throw new Error(`Word document processing failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private async processText(buffer: Buffer): Promise<ProcessedDocument> {
    const text = buffer.toString("utf-8")
    const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length

    return {
      text,
      metadata: {
        wordCount,
        charCount: text.length,
      },
    }
  }

  async analyzeDocument(text: string, documentType?: string): Promise<any> {
    // This will be enhanced with AI analysis
    const analysis = {
      sentiment: this.analyzeSentiment(text),
      entities: this.extractEntities(text),
      keywords: this.extractKeywords(text),
      summary: text.slice(0, 500) + (text.length > 500 ? "..." : ""),
    }

    return analysis
  }

  private analyzeSentiment(text: string): string {
    // Simple sentiment analysis (will be enhanced with AI)
    const positiveWords = ["good", "great", "excellent", "positive", "success", "win"]
    const negativeWords = ["bad", "poor", "negative", "fail", "loss", "problem"]

    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.reduce(
      (count, word) => count + (lowerText.match(new RegExp(word, "g")) || []).length,
      0,
    )
    const negativeCount = negativeWords.reduce(
      (count, word) => count + (lowerText.match(new RegExp(word, "g")) || []).length,
      0,
    )

    if (positiveCount > negativeCount) return "positive"
    if (negativeCount > positiveCount) return "negative"
    return "neutral"
  }

  private extractEntities(text: string): string[] {
    // Extract potential entities (emails, phone numbers, dates)
    const entities: string[] = []

    // Email regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const emails = text.match(emailRegex) || []
    entities.push(...emails)

    // Phone regex
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
    const phones = text.match(phoneRegex) || []
    entities.push(...phones)

    return [...new Set(entities)]
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction (will be enhanced with AI)
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 4)

    const wordFreq: { [key: string]: number } = {}
    words.forEach((word) => {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    })

    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word)
  }
}

export const documentProcessor = new DocumentProcessor()
