import * as fal from "@fal-ai/serverless-client"

fal.config({
  credentials: process.env.FAL_KEY,
})

export interface VideoGenerationOptions {
  prompt: string
  duration?: number
  fps?: number
  width?: number
  height?: number
}

export interface GeneratedVideo {
  url: string
  duration: number
  width: number
  height: number
  fps: number
}

export class VideoGenerator {
  async textToVideo(prompt: string, duration = 3, fps = 30): Promise<GeneratedVideo> {
    try {
      const result = await fal.subscribe("fal-ai/minimax/video-01", {
        input: {
          prompt,
          duration_seconds: duration,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log("Generating video...", update.logs)
          }
        },
      })

      return {
        url: result.data.video.url,
        duration: duration,
        width: result.data.video.width || 1024,
        height: result.data.video.height || 576,
        fps: fps,
      }
    } catch (error) {
      console.error("Video generation error:", error)
      throw new Error("Failed to generate video")
    }
  }

  async imageToVideo(imageUrl: string, prompt: string, duration = 3): Promise<GeneratedVideo> {
    try {
      const result = await fal.subscribe("fal-ai/minimax/video-01", {
        input: {
          prompt,
          image_url: imageUrl,
          duration_seconds: duration,
        },
        logs: true,
      })

      return {
        url: result.data.video.url,
        duration: duration,
        width: result.data.video.width || 1024,
        height: result.data.video.height || 576,
        fps: 30,
      }
    } catch (error) {
      console.error("Image-to-video error:", error)
      throw new Error("Failed to generate video from image")
    }
  }

  async enhancePrompt(prompt: string): Promise<string> {
    const enhancementPrompt = `Enhance this video generation prompt to be more detailed and specific: "${prompt}"
    
Add details about:
- Camera movement and angles
- Scene composition
- Lighting and atmosphere
- Action and motion
- Duration and pacing

Return only the enhanced prompt.`

    try {
      const { generateText } = await import("./openai-client")
      const enhanced = await generateText(enhancementPrompt, "gpt-4o")
      return enhanced.trim()
    } catch (error) {
      console.error("Prompt enhancement error:", error)
      return prompt
    }
  }
}

export const videoGenerator = new VideoGenerator()
