"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

interface DocumentUploadProps {
  companyId: string
  onUploadComplete?: () => void
}

export function DocumentUpload({ companyId, onUploadComplete }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState("general")
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: "general", label: "General" },
    { value: "legal", label: "Legal Documents" },
    { value: "financial", label: "Financial Records" },
    { value: "contracts", label: "Contracts" },
    { value: "correspondence", label: "Correspondence" },
    { value: "reports", label: "Reports" },
    { value: "receipts", label: "Receipts" },
    { value: "invoices", label: "Invoices" },
  ]

  const acceptedTypes = [".pdf", ".doc", ".docx", ".txt", ".png", ".jpg", ".jpeg", ".tiff"].join(",")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setStatus("idle")
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setStatus("uploading")
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("companyId", companyId)
      formData.append("category", category)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      setProgress(100)
      setStatus("success")

      setTimeout(() => {
        setFile(null)
        setStatus("idle")
        setProgress(0)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        onUploadComplete?.()
      }, 2000)
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={category} onValueChange={setCategory} disabled={isUploading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select File</label>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes}
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              {file ? file.name : "Choose File"}
            </Button>
            <Button onClick={handleUpload} disabled={!file || isUploading} className="bg-blue-500 hover:bg-blue-600">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Supported: PDF, Word, Text, Images (PNG, JPG, TIFF)</p>
        </div>

        {file && status !== "idle" && (
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{file.name}</span>
              {status === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
              {status === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
            </div>

            {(status === "uploading" || status === "processing") && (
              <>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  {status === "uploading" && "Uploading..."}
                  {status === "processing" && "Processing document..."}
                </p>
              </>
            )}

            {status === "success" && (
              <p className="text-sm text-green-600 dark:text-green-400 text-center">
                ✓ Document uploaded and processed successfully
              </p>
            )}

            {status === "error" && error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
