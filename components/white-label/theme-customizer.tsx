"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { ThemeConfig } from "@/lib/white-label/theme-manager"

interface ThemeCustomizerProps {
  companyId: string
  initialTheme?: ThemeConfig
}

export function ThemeCustomizer({ companyId, initialTheme }: ThemeCustomizerProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState<Partial<ThemeConfig>>(
    initialTheme || {
      primary_color: "#4B0082",
      secondary_color: "#6A0DAD",
      accent_color: "#FFD700",
      font_family: "Inter, sans-serif",
      logo_url: "",
      favicon_url: "",
      custom_css: "",
    },
  )

  const handleSave = async () => {
    setLoading(true)
    try {
      const method = initialTheme ? "PUT" : "POST"
      const response = await fetch("/api/white-label/theme", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, theme }),
      })

      if (!response.ok) throw new Error("Failed to save theme")

      toast({
        title: "Success",
        description: "Theme saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save theme",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    const style = document.createElement("style")
    style.textContent = `
      :root {
        --primary: ${theme.primary_color};
        --secondary: ${theme.secondary_color};
        --accent: ${theme.accent_color};
        --font-family: ${theme.font_family};
      }
      ${theme.custom_css || ""}
    `
    document.head.appendChild(style)

    toast({
      title: "Preview Applied",
      description: "Theme preview is now active. Refresh to reset.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
          <CardDescription>Customize your brand colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary"
                  type="color"
                  value={theme.primary_color}
                  onChange={(e) => setTheme({ ...theme, primary_color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={theme.primary_color}
                  onChange={(e) => setTheme({ ...theme, primary_color: e.target.value })}
                  placeholder="#4B0082"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary"
                  type="color"
                  value={theme.secondary_color}
                  onChange={(e) => setTheme({ ...theme, secondary_color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={theme.secondary_color}
                  onChange={(e) => setTheme({ ...theme, secondary_color: e.target.value })}
                  placeholder="#6A0DAD"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  id="accent"
                  type="color"
                  value={theme.accent_color}
                  onChange={(e) => setTheme({ ...theme, accent_color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={theme.accent_color}
                  onChange={(e) => setTheme({ ...theme, accent_color: e.target.value })}
                  placeholder="#FFD700"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding Assets</CardTitle>
          <CardDescription>Upload your logo and favicon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              type="url"
              value={theme.logo_url || ""}
              onChange={(e) => setTheme({ ...theme, logo_url: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="favicon">Favicon URL</Label>
            <Input
              id="favicon"
              type="url"
              value={theme.favicon_url || ""}
              onChange={(e) => setTheme({ ...theme, favicon_url: e.target.value })}
              placeholder="https://example.com/favicon.ico"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Choose your font family</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="font">Font Family</Label>
            <Input
              id="font"
              type="text"
              value={theme.font_family}
              onChange={(e) => setTheme({ ...theme, font_family: e.target.value })}
              placeholder="Inter, sans-serif"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom CSS</CardTitle>
          <CardDescription>Add custom styles (advanced)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="css">Custom CSS</Label>
            <Textarea
              id="css"
              value={theme.custom_css || ""}
              onChange={(e) => setTheme({ ...theme, custom_css: e.target.value })}
              placeholder=".custom-class { color: red; }"
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handlePreview} variant="outline">
          Preview Theme
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Theme"}
        </Button>
      </div>
    </div>
  )
}
