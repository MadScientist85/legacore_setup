"use client"

import { Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MediaGenerator } from "@/components/ai/media-generator"
import { DocumentGeneratorUI } from "@/components/documents/document-generator-ui"

export default function AIStudioPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">AI Studio</h1>
          <p className="text-muted-foreground">Generate images, videos, and documents with AI</p>
        </div>
      </div>

      <Tabs defaultValue="media" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="media">Media Generation</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="media" className="space-y-4">
          <MediaGenerator />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <DocumentGeneratorUI />
        </TabsContent>
      </Tabs>
    </div>
  )
}
