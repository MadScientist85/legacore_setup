import * as fal from "@fal-ai/serverless-client"

fal.config({
  credentials: process.env.FAL_KEY,
})

export interface ImageGenerationOptions {
  prompt: string
  numImages?: number
  width?: number
  height?: number
  model?: string
}

export interface GeneratedImage {
  url: string
  width: number
  height: number
  contentType: string
}

export class ImageGenerator {
  async generateImage(options: ImageGenerationOptions): Promise<GeneratedImage[]> {
    const { prompt, numImages = 1, width = 1024, height = 1024, model = "fal-ai/flux/schnell" } = options

    try {
      const result = await fal.subscribe(model, {
        input: {
          prompt,
          num_images: numImages,
          image_size: {
            width,
            height,
          },
          num_inference_steps: 4,
          enable_safety_checker: true,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log("Generating image...", update.logs)
          }
        },
      })

      const images = result.data.images || result.data.image ? [result.data.image] : []

      return images.map((img: any) => ({
        url: img.url,
        width: img.width || width,
        height: img.height || height,
        contentType: img.content_type || "image/jpeg",
      }))
    } catch (error) {
      console.error("Image generation error:", error)
      throw new Error("Failed to generate image")
    }
  }

  async enhancePrompt(prompt: string): Promise<string> {
    const enhancementPrompt = `Enhance this image generation prompt to be more detailed and specific while maintaining the core idea: "${prompt}"
    
Return only the enhanced prompt, nothing else. Add details about:
- Style and artistic approach
- Lighting and mood
- Colors and composition
- Quality descriptors (4k, detailed, professional, etc.)

Enhanced prompt:`

    try {
      const { generateText } = await import("./openai-client")
      const enhanced = await generateText(enhancementPrompt, "gpt-4o")
      return enhanced.trim()
    } catch (error) {
      console.error("Prompt enhancement error:", error)
      return prompt
    }
  }

  async textToImage(prompt: string, options?: Partial<ImageGenerationOptions>): Promise<GeneratedImage[]> {
    return this.generateImage({
      prompt,
      ...options,
    })
  }

  async imageToImage(imageUrl: string, prompt: string, strength = 0.8): Promise<GeneratedImage[]> {
    try {
      const result = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
          prompt,
          image_url: imageUrl,
          strength,
          num_inference_steps: 4,
        },
      })

      const images = result.data.images || [result.data.image]

      return images.map((img: any) => ({
        url: img.url,
        width: img.width || 1024,
        height: img.height || 1024,
        contentType: img.content_type || "image/jpeg",
      }))
    } catch (error) {
      console.error("Image-to-image error:", error)
      throw new Error("Failed to transform image")
    }
  }
}

export const imageGenerator = new ImageGenerator()
