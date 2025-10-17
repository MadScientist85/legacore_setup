import JSZip from "jszip"

export interface ExtractedFile {
  name: string
  path: string
  content: Buffer
  size: number
  isDirectory: boolean
}

export class ZipExtractor {
  async extractZip(zipBuffer: Buffer): Promise<ExtractedFile[]> {
    try {
      const zip = new JSZip()
      const zipContent = await zip.loadAsync(zipBuffer)
      const files: ExtractedFile[] = []

      for (const [path, file] of Object.entries(zipContent.files)) {
        if (!file.dir) {
          const content = await file.async("nodebuffer")
          files.push({
            name: file.name.split("/").pop() || file.name,
            path: path,
            content: content,
            size: content.length,
            isDirectory: false,
          })
        }
      }

      return files
    } catch (error) {
      console.error("ZIP extraction error:", error)
      throw new Error("Failed to extract ZIP file")
    }
  }

  async extractZipFromUrl(url: string): Promise<ExtractedFile[]> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch ZIP from URL: ${response.statusText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      return this.extractZip(buffer)
    } catch (error) {
      console.error("ZIP URL extraction error:", error)
      throw new Error("Failed to extract ZIP from URL")
    }
  }

  async listContents(zipBuffer: Buffer): Promise<string[]> {
    try {
      const zip = new JSZip()
      const zipContent = await zip.loadAsync(zipBuffer)

      return Object.keys(zipContent.files).filter((path) => !zipContent.files[path].dir)
    } catch (error) {
      console.error("ZIP listing error:", error)
      throw new Error("Failed to list ZIP contents")
    }
  }

  async extractFile(zipBuffer: Buffer, filePath: string): Promise<Buffer | null> {
    try {
      const zip = new JSZip()
      const zipContent = await zip.loadAsync(zipBuffer)

      const file = zipContent.files[filePath]
      if (!file || file.dir) {
        return null
      }

      return await file.async("nodebuffer")
    } catch (error) {
      console.error("ZIP file extraction error:", error)
      return null
    }
  }

  getFileType(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase()
    const types: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      txt: "text/plain",
      json: "application/json",
      xml: "application/xml",
      csv: "text/csv",
    }

    return types[ext || ""] || "application/octet-stream"
  }
}

export const zipExtractor = new ZipExtractor()
