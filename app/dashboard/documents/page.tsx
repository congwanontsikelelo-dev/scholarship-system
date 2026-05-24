"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Upload, FileText, Eye, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Navigation from "@/components/Navigation"
import { useToast } from "@/hooks/use-toast"

interface Document {
  id: number
  name: string
  type: string
  status: string
  required: boolean
  fileName?: string
  uploadedDate?: string
  fileUrl?: string
  fileType?: string
  dataUrl?: string
}

const Documents = () => {
  const { toast } = useToast()

  const [documents, setDocuments] = useState<Document[]>([])
  const [hasSubmittedApplications, setHasSubmittedApplications] = useState(false)

  const defaults: Document[] = [
    { id: 1, name: "Certified ID Copy", type: "id", status: "not_uploaded", required: true },
    { id: 2, name: "Proof of Registration", type: "registration", status: "not_uploaded", required: true },
    { id: 3, name: "Academic Transcripts", type: "transcripts", status: "not_uploaded", required: true },
    { id: 4, name: "Motivation Letter", type: "motivation", status: "not_uploaded", required: true },
    { id: 5, name: "Proof of Residence", type: "residence", status: "not_uploaded", required: true },
  ]

  useEffect(() => {
    try {
      const userEmail = localStorage.getItem('userEmail') || null
      const { getUserItem } = require('@/lib/userStorage') as any

      const applicationsRaw = userEmail ? getUserItem(userEmail, 'applications') || localStorage.getItem('applications') : localStorage.getItem('applications')
      const applications = JSON.parse(applicationsRaw || '[]')
      const hasSubmitted = applications.length > 0
      setHasSubmittedApplications(hasSubmitted)

      if (hasSubmitted) {
        const permRaw = userEmail ? getUserItem(userEmail, 'documents') || localStorage.getItem('documents') : localStorage.getItem('documents')
        const parsedPerm = permRaw ? JSON.parse(permRaw) : []

        if (Array.isArray(parsedPerm) && parsedPerm.length > 0) {
          const uploadedDocs = parsedPerm.filter((doc: any) => doc.dataUrl || doc.fileName)
          const uniqueDocs = uploadedDocs.filter((doc: any, index: number, self: any[]) =>
            index === self.findIndex((d) => d.name === doc.name)
          )
          setDocuments(uniqueDocs)
        } else {
          setDocuments([])
        }
      } else {
        setDocuments([])
      }
    } catch (e) {
      console.error(`Error loading documents:`, e)
      setDocuments([])
    }

    const onUpdate = (e: any) => {
      const key = e?.detail?.key
      if (key === 'documents' || key === 'applications' || !key) {
        try {
          const userEmail = localStorage.getItem('userEmail') || null
          const { getUserItem } = require('@/lib/userStorage') as any
          const permRaw = userEmail ? getUserItem(userEmail, 'documents') || localStorage.getItem('documents') : localStorage.getItem('documents')
          const parsedPerm = permRaw ? JSON.parse(permRaw) : []

          if (Array.isArray(parsedPerm)) {
            const uploadedDocs = parsedPerm.filter((doc: any) => doc.dataUrl || doc.fileName)
            const uniqueDocs = uploadedDocs.filter((doc: any, index: number, self: any[]) =>
              index === self.findIndex((d) => d.name === doc.name)
            )
            setDocuments(uniqueDocs)
          }
        } catch (err) {
          console.error('Error reloading documents after update', err)
        }
      }
    }

    window.addEventListener('localStorageUpdated', onUpdate)
    return () => window.removeEventListener('localStorageUpdated', onUpdate)
  }, [])

  const handleFileUpload = async (documentId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileUrl = URL.createObjectURL(file)
    const uploadedDate = new Date().toISOString().split("T")[0]

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const updated = documents.map((doc) =>
        doc.id === documentId
          ? { ...doc, status: "pending", fileName: file.name, uploadedDate, fileUrl, fileType: file.type, dataUrl }
          : doc
      )

      if (!updated.find(d => d.id === documentId)) {
        const defaultDoc = defaults.find(d => d.id === documentId)
        if (defaultDoc) {
          updated.push({
            ...defaultDoc,
            status: "pending",
            fileName: file.name,
            uploadedDate,
            fileUrl,
            fileType: file.type,
            dataUrl
          })
        }
      }

      setDocuments(updated)
      const userEmail = localStorage.getItem('userEmail') || null
      if (userEmail) {
        const { setUserItem } = require('@/lib/userStorage') as any
        setUserItem(userEmail, 'documents', JSON.stringify(updated.map(({ fileUrl: _, ...rest }) => rest)))
      } else {
        localStorage.setItem("documents", JSON.stringify(
          updated.map(({ fileUrl: _, ...rest }) => rest)
        ))
      }

      event.target.value = ``

      toast({
        title: "Document uploaded",
        description: `${file.name} has been uploaded successfully`,
      })

      window.dispatchEvent(new CustomEvent("localStorageUpdated", { detail: { key: "documents" } }))

    } catch (e) {
      console.error(`Error uploading document:`, e)
      URL.revokeObjectURL(fileUrl)
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      })
    }
  }

  const [viewDocument, setViewDocument] = useState<null | { name: string; url?: string; type?: string }>(null)

  const handleViewDocument = (doc: Document) => {
    const url = doc.dataUrl || doc.fileUrl
    const name = doc.fileName || doc.name
    const type = doc.fileType || doc.type

    const ensureAndOpen = async () => {
      if (!url) {
        toast({ title: "Error", description: "Document is not available for preview", variant: "destructive" })
        return
      }

      try {
        const dataUrl = await ensureDataUrl(url)
        if (dataUrl) {
          setViewDocument({ name, url: dataUrl, type })
        } else {
          toast({ title: "Preview not available", description: "This file cannot be previewed inline.", variant: "destructive" })
        }
      } catch (e) {
        console.error('Error preparing document preview', e)
        toast({ title: "Error", description: "Failed to open document preview", variant: "destructive" })
      }
    }

    void ensureAndOpen()
  }

  const ensureDataUrl = async (url?: string): Promise<string | null> => {
    if (!url) return null
    try {
      if (url.startsWith('data:')) return url
      const res = await fetch(url)
      if (!res.ok) return null
      const blob = await res.blob()
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch (e) {
      console.error('ensureDataUrl failed for', url, e)
      return null
    }
  }

  const handleDeleteDocument = (documentId: number) => {
    const doc = documents.find((d) => d.id === documentId)
    if (doc?.fileUrl) {
      try { URL.revokeObjectURL(doc.fileUrl) } catch (e) {}
    }

    const updated = documents.filter((d) => d.id !== documentId)
    setDocuments(updated)
    const userEmail = localStorage.getItem('userEmail') || null
    if (userEmail) {
      const { setUserItem } = require('@/lib/userStorage') as any
      setUserItem(userEmail, 'documents', JSON.stringify(updated))
    } else {
      localStorage.setItem("documents", JSON.stringify(updated))
    }

    toast({
      title: "Document deleted",
      description: "The document has been removed"
    })
    window.dispatchEvent(new CustomEvent("localStorageUpdated", { detail: { key: "documents" } }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>
      case "pending": return <Badge variant="secondary">Pending</Badge>
      case "rejected": return <Badge variant="destructive">Rejected</Badge>
      default: return <Badge variant="outline">Not Uploaded</Badge>
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Navigation />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Documents</h1>
            <p className="text-muted-foreground">Upload and manage your required documents</p>
          </div>

          {/* Required Documents */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Upload all required documents for your scholarship applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {defaults.map((doc) => {
                  const uploadedDoc = documents.find(d => d.name === doc.name)
                  return (
                    <div key={doc.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h3 className="font-medium">{doc.name}</h3>
                            {uploadedDoc?.fileName ? (
                              <p className="text-sm text-muted-foreground">
                                {uploadedDoc.fileName} • Uploaded on {uploadedDoc.uploadedDate}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">Not uploaded yet</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {uploadedDoc?.dataUrl && (
                            <Button variant="outline" size="sm" onClick={() => handleViewDocument(uploadedDoc)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          )}
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(doc.id, e)}
                            className="hidden"
                            id={`file-${doc.id}`}
                          />
                          <Button variant="outline" size="sm" onClick={() => document.getElementById(`file-${doc.id}`)?.click()}>
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadedDoc?.fileName ? 'Re-upload' : 'Upload'}
                          </Button>
                          {uploadedDoc && (
                            <Button variant="outline" size="sm" onClick={() => handleDeleteDocument(doc.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Document Viewer Dialog */}
      <Dialog open={!!viewDocument} onOpenChange={() => setViewDocument(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Document Viewer</DialogTitle>
            <DialogDescription>{viewDocument?.name}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 bg-muted rounded-lg flex items-center justify-center overflow-hidden h-full">
            {viewDocument?.url ? (
              viewDocument.type?.startsWith("image") ? (
                <img src={viewDocument.url} alt={viewDocument.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <iframe src={viewDocument.url} title={viewDocument.name} className="w-full h-full" />
              )
            ) : (
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No preview available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Documents
