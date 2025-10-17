import PDFDocument from "pdfkit"
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx"

export interface DocumentSection {
  title?: string
  content: string
  level?: number
}

export interface DocumentOptions {
  title: string
  sections: DocumentSection[]
  author?: string
  subject?: string
}

export class DocumentGenerator {
  async generatePDF(options: DocumentOptions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: "A4",
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        })

        const chunks: Buffer[] = []

        doc.on("data", (chunk) => chunks.push(chunk))
        doc.on("end", () => resolve(Buffer.concat(chunks)))
        doc.on("error", reject)

        // Title
        doc.fontSize(24).font("Helvetica-Bold").text(options.title, { align: "center" })

        doc.moveDown()

        if (options.author) {
          doc.fontSize(12).font("Helvetica").text(`Author: ${options.author}`, { align: "center" })
        }

        doc.moveDown(2)

        // Sections
        options.sections.forEach((section) => {
          if (section.title) {
            doc.fontSize(16).font("Helvetica-Bold").text(section.title)
            doc.moveDown(0.5)
          }

          doc.fontSize(12).font("Helvetica").text(section.content, {
            align: "justify",
            lineGap: 5,
          })

          doc.moveDown()
        })

        // Footer
        const pageCount = doc.bufferedPageRange().count
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i)
          doc.fontSize(10).text(`Page ${i + 1} of ${pageCount}`, 50, doc.page.height - 50, {
            align: "center",
          })
        }

        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  async generateWord(options: DocumentOptions): Promise<Buffer> {
    try {
      const children: Paragraph[] = []

      // Title
      children.push(
        new Paragraph({
          text: options.title,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        }),
      )

      // Author
      if (options.author) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `Author: ${options.author}`, italics: true })],
            spacing: { after: 400 },
          }),
        )
      }

      // Sections
      options.sections.forEach((section) => {
        if (section.title) {
          children.push(
            new Paragraph({
              text: section.title,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
          )
        }

        const paragraphs = section.content.split("\n\n")
        paragraphs.forEach((para) => {
          children.push(
            new Paragraph({
              text: para,
              spacing: { after: 200 },
            }),
          )
        })
      })

      const doc = new Document({
        sections: [
          {
            properties: {},
            children,
          },
        ],
      })

      return await Packer.toBuffer(doc)
    } catch (error) {
      console.error("Word generation error:", error)
      throw new Error("Failed to generate Word document")
    }
  }

  markdownToSections(markdown: string): DocumentSection[] {
    const lines = markdown.split("\n")
    const sections: DocumentSection[] = []
    let currentSection: DocumentSection | null = null

    lines.forEach((line) => {
      const heading = line.match(/^(#{1,6})\s+(.+)$/)
      if (heading) {
        if (currentSection) {
          sections.push(currentSection)
        }
        currentSection = {
          title: heading[2],
          content: "",
          level: heading[1].length,
        }
      } else if (line.trim()) {
        if (currentSection) {
          currentSection.content += line + "\n"
        } else {
          if (sections.length === 0) {
            currentSection = { content: line + "\n" }
          } else {
            sections[sections.length - 1].content += line + "\n"
          }
        }
      }
    })

    if (currentSection) {
      sections.push(currentSection)
    }

    return sections
  }
}

export const documentGenerator = new DocumentGenerator()
