"use client"

import Navigation from "@/components/Navigation"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

type CoverLetter = { fileName: string; dataUrl?: string | null; uploadedDate?: string }

export default function WorkStudyApply() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [formData, setFormData] = useState<{ fullName: string; email: string; phone: string; institution: string; studentId: string; coverLetter: CoverLetter | null }>({ fullName: '', email: '', phone: '', institution: '', studentId: '', coverLetter: null })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [viewDocument, setViewDocument] = useState<{ name: string; url?: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // load existing draft (if any) from per-user documents - helpful when user navigates back
  useEffect(() => {
    try {
      const userEmail = localStorage.getItem('userEmail')
      if (!userEmail) return
      const raw = require('@/lib/userStorage').getUserItem(userEmail, 'workStudyDraft') || null
      if (raw) {
        const parsed = JSON.parse(raw)
        setFormData(prev => ({ ...prev, ...parsed }))
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null
      setFormData(prev => ({ ...prev, coverLetter: { fileName: file.name, dataUrl, uploadedDate: new Date().toISOString() } }))
    }
    reader.readAsDataURL(file)
  }

  const handleUploadClick = () => fileInputRef.current?.click()

  const handleViewCurrentUpload = () => {
    if (!formData.coverLetter) return toast({ title: 'No document', description: 'No file uploaded.' })
    const url = formData.coverLetter.dataUrl
    const name = formData.coverLetter.fileName
    if (url) setViewDocument({ name, url })
    else toast({ title: 'No preview', description: 'This file has no inline preview.' })
  }

  const handleDeleteCurrentUpload = () => setFormData(prev => ({ ...prev, coverLetter: null }))

  const handleSubmit = async () => {
    const err: Record<string, string> = {}
    if (!formData.fullName) err.fullName = 'Full name is required'
    if (!formData.email) err.email = 'Email is required'
    if (!formData.phone) err.phone = 'Phone is required'
    setErrors(err)
    if (Object.keys(err).length > 0) {
      toast({ title: 'Validation Error', description: 'Please fill in required fields', variant: 'destructive' })
      return
    }

    const stored = JSON.parse(localStorage.getItem('applications') || '[]')
    const userEmail = localStorage.getItem('userEmail') || null

    const newApp: any = {
      id: Date.now(),
      studentName: formData.fullName,
      scholarshipName: `WorkStudy Program ${id}`,
      type: 'work-study',
      userEmail,
      school: formData.institution,
      course: '',
      yearLevel: '',
      status: 'Under Review',
      submittedDocuments: [],
      coverLetterFileName: formData.coverLetter ? formData.coverLetter.fileName : null,
    }

    try {
      if (userEmail && formData.coverLetter && formData.coverLetter.dataUrl) {
        // save blob to IndexedDB and create small per-user doc ref
        try {
          const { saveDocumentToIndexedDB } = await import('@/lib/indexedDb')
          const userStorage = await import('@/lib/userStorage')
          const docId = Date.now()
          await saveDocumentToIndexedDB(docId, formData.coverLetter.fileName, formData.coverLetter.dataUrl)
          const rawDocs = userStorage.getUserItem(userEmail, 'documents') || '[]'
          const existingDocs = Array.isArray(JSON.parse(rawDocs)) ? JSON.parse(rawDocs) : []
          const docEntry = { id: docId, label: 'Cover Letter', fileName: formData.coverLetter.fileName, uploadedDate: formData.coverLetter.uploadedDate }
          userStorage.setUserItem(userEmail, 'documents', JSON.stringify([docEntry, ...existingDocs].slice(0, 200)))
          newApp.submittedDocuments = [{ label: 'Cover Letter', fileName: docEntry.fileName, docId: docEntry.id, uploadedDate: docEntry.uploadedDate }]
        } catch (e) {
          console.error('IndexedDB or user storage failed', e)
          newApp.submittedDocuments = [{ label: 'Cover Letter', fileName: formData.coverLetter.fileName, uploadedDate: formData.coverLetter.uploadedDate }]
        }
      } else if (formData.coverLetter) {
        newApp.submittedDocuments = [{ label: 'Cover Letter', fileName: formData.coverLetter.fileName, uploadedDate: formData.coverLetter.uploadedDate }]
      }

      stored.unshift(newApp)
      localStorage.setItem('applications', JSON.stringify(stored.slice(0, 50)))
    } catch (e) {
      console.error('Failed to save application', e)
      toast({ title: 'Storage Error', description: 'Unable to save application locally.' })
    }

    // notifications (same approach as earlier)
    try {
  const studentNote = { id: `app-user-${newApp.id}`, title: `Application Submitted`, message: `Your application is under review`, time: 'Just now', timestamp: Date.now(), applicationId: newApp.id, clickable: true, source: 'student' }
      const userEmail2 = localStorage.getItem('userEmail') || null
      if (userEmail2) {
        const userStorage = await import('@/lib/userStorage')
        const raw = userStorage.getUserItem(userEmail2, 'notifications') || '[]'
        const parsed = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : []
        parsed.unshift(studentNote)
        userStorage.setUserItem(userEmail2, 'notifications', JSON.stringify(parsed.slice(0, 20)))
        window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
      } else {
        const fallback = JSON.parse(localStorage.getItem('notifications') || '[]')
        fallback.unshift(studentNote)
        localStorage.setItem('notifications', JSON.stringify(fallback.slice(0, 20)))
        window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
      }

      const global = JSON.parse(localStorage.getItem('notifications') || '[]')
  global.unshift({ id: `app-admin-${newApp.id}`, applicationId: newApp.id, title: `Work-Study Application Submitted`, message: `${newApp.studentName} submitted a Work-Study application`, time: 'Just now', timestamp: Date.now(), clickable: true, source: 'student' })
      localStorage.setItem('notifications', JSON.stringify(global.slice(0, 20)))
      window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
    } catch (e) {
      console.error('Error writing notifications', e)
    }

    toast({ title: 'Success', description: 'Work-study application submitted' })
    router.push('/dashboard/applications')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/work-study">
              <Button variant="ghost" size="sm">Back to Work-Study</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Work-Study Application</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full name *</Label>
                <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: (e.target as HTMLInputElement).value })} />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: (e.target as HTMLInputElement).value })} />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: (e.target as HTMLInputElement).value })} />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label>Institution</Label>
                <Input value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: (e.target as HTMLInputElement).value })} />
              </div>

              <div className="space-y-2">
                <Label>Student ID</Label>
                <Input value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: (e.target as HTMLInputElement).value })} />
              </div>

              <div>
                <Label>Cover Letter</Label>
                <div className="border border-border rounded-lg p-4 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">Cover Letter</h3>
                        {formData.coverLetter ? (
                          <p className="text-sm text-muted-foreground">{formData.coverLetter.fileName}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">No file chosen</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input ref={fileInputRef} id="ws-cover" type="file" accept="application/pdf,image/*" className="hidden" onChange={(e) => handleFileSelect((e.target as HTMLInputElement).files?.[0])} />

                      <Button variant="outline" size="sm" onClick={handleUploadClick}>Upload</Button>

                      {formData.coverLetter && (
                        <>
                          <Button variant="outline" size="sm" onClick={handleViewCurrentUpload}>View</Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDeleteCurrentUpload}>Delete</Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSubmit}>Submit Application</Button>
                <Link href="/dashboard/work-study"><Button variant="outline">Cancel</Button></Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!viewDocument} onOpenChange={() => setViewDocument(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader><DialogTitle>Document Viewer</DialogTitle></DialogHeader>
          <div className="flex-1 bg-muted rounded-lg flex items-center justify-center p-6">
            {viewDocument ? (
              viewDocument.url ? (
                <iframe src={viewDocument.url} title={viewDocument.name} className="w-full h-full" />
              ) : (
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">{viewDocument.name}</p>
                  <p className="text-sm text-muted-foreground mt-2">No inline preview available. Use Download if provided.</p>
                </div>
              )
            ) : (
              <div className="text-muted-foreground">No document selected</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
