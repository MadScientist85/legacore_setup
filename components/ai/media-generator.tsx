"use client"

import { useState } from "react"
import { ImageIcon, Video, Loader2, Download, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function MediaGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [generatedVideo, setGeneratedVideo] = useState<string>("")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const { toast } = useToast()

  const enhancePrompt = async () => {
    if (!prompt.trim()) return

    setIsEnhancing(true)
    try {
      const response = await fetch("/api/ai/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      if (response.ok) {
        const data = await response.json()
        setEnhancedPrompt(data.enhanced)
        setPrompt(data.enhanced)
        toast({
          title: "Prompt Enhanced",
          description: `Quality score: ${data.analysis.score}/100`,
        })
      }
    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: "Could not enhance prompt",
        variant: "destructive",
      })
    } finally {
      setIsEnhancing(false)
    }
  }

  const generateImages = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          numImages: 2,
          width: 1024,
          height: 1024,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedImages(data.images.map((img: any) => img.url))
        toast({
          title: "Images Generated",
          description: `Created ${data.images.length} images`,
        })
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate images",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateVideo = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          duration: 3,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedVideo(data.video.url)
        toast({
          title: "Video Generated",
          description: `Created ${data.video.duration}s video`,
        })
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate video",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          AI Media Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="prompt">Prompt</Label>
            <Button variant="ghost" size="sm" onClick={enhancePrompt} disabled={isEnhancing || !prompt.trim()}>
              {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              Enhance
            </Button>
          </div>
          <Textarea
            id="prompt"
            placeholder="Describe what you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
          {enhancedPrompt && enhancedPrompt !== prompt && (
            <div className="text-sm text-muted-foreground p-2 bg-blue-50 dark:bg-blue-950 rounded">
              <strong>Enhanced:</strong> {enhancedPrompt}
            </div>
          )}
        </div>

        <Tabs defaultValue="images" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="images">
              <ImageIcon className="w-4 h-4 mr-2" />
              Images
            </TabsTrigger>
            <TabsTrigger value="video">
              <Video className="w-4 h-4 mr-2" />
              Video
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-4">
            <Button onClick={generateImages} disabled={isGenerating || !prompt.trim()} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Generate Images
                </>
              )}
            </Button>

            {generatedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img src={url || "/placeholder.svg"} alt={`Generated ${idx + 1}`} className="w-full rounded-lg" />
                    <a
                      href={url}
                      download={`generated-image-${idx + 1}.jpg`}
                      className="absolute top-2 right-2 p-2 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            <Button onClick={generateVideo} disabled={isGenerating || !prompt.trim()} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Generate Video
                </>
              )}
            </Button>

            {generatedVideo && (
              <div className="relative">
                <video src={generatedVideo} controls className="w-full rounded-lg" />
                <a
                  href={generatedVideo}
                  download="generated-video.mp4"
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-lg"
                >
                  <Download className="w-4 h-4 text-white" />
                </a>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
