"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { DocumentUpload } from "@/components/documents/document-upload"
import { DocumentList } from "@/components/documents/document-list"

export default function DocumentsPage() {
  const { user } = useAuth()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // For now, using a default company ID
  const companyId = "default-company"

  const handleUploadComplete = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Document Management</h1>
        <p className="text-muted-foreground">Upload, process, and manage your documents with AI-powered analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DocumentUpload companyId={companyId} onUploadComplete={handleUploadComplete} />
        </div>
        <div className="lg:col-span-2">
          <DocumentList companyId={companyId} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}
