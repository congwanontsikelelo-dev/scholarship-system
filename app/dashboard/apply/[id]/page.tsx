"use client"

import { ArrowLeft, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navigation from "@/components/Navigation"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { scholarshipsData } from "@/data/scholarships"
import { Upload, Eye, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

export default function ApplicationForm() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const appType = searchParams?.get('type') || 'scholarship'
  const id = params.id as string
  const [date, setDate] = useState<Date | undefined>()
  const [inlineError, setInlineError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    dateOfBirth: "",
    email: "",
    address: "",
    phoneNumber: "",
    studentId: "",
    currentInstitution: "",
    program: "",
    yearLevel: "",
    submissionInstructions: "",
  })

  // document state: start empty and load from localStorage after mount
  const [documents, setDocuments] = useState<Array<any>>([])

  // Load documents from localStorage after component mounts
  useEffect(() => {
    try {
      // Use per-user tempDocuments when available
      const userEmail = localStorage.getItem('userEmail') || null
      if (userEmail) {
        const { getUserItem } = require('@/lib/userStorage') as any
        const saved = getUserItem(userEmail, 'tempDocuments') || localStorage.getItem('tempDocuments')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) setDocuments(parsed.map((d: any) => ({ ...d })))
        }
      } else {
        const saved = localStorage.getItem('tempDocuments')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) setDocuments(parsed.map((d: any) => ({ ...d })))
        }
      }
    } catch (e) {
      console.error('Error loading documents:', e)
    }
  }, [])

  const [viewDocument, setViewDocument] = useState<null | { name: string; url?: string; type?: string }>(null)

  const scholarship = scholarshipsData.find((s) => s.id === Number.parseInt(id)) || scholarshipsData[0]
  const deadlinePassed = scholarship.deadline ? new Date(scholarship.deadline) < new Date() : false

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDateSelect = (d?: Date) => {
    setDate(d)
    if (d) {
      const iso = d.toISOString().split('T')[0]
      setFormData((prev) => ({ ...prev, dateOfBirth: iso }))
    }
  }

  const persistDocuments = (updated: any[]) => {
    try {
      // persist temp documents (without session-only fileUrl). They become permanent on submit.
      const meta = updated.map(({ fileUrl, ...rest }) => rest)
      const userEmail = localStorage.getItem('userEmail') || null
      if (userEmail) {
        const { setUserItem } = require('@/lib/userStorage') as any
        setUserItem(userEmail, 'tempDocuments', JSON.stringify(meta))
      } else {
        localStorage.setItem('tempDocuments', JSON.stringify(meta))
      }
    } catch (e) {}
    // notify listeners
    window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'tempDocuments' } }))
  }

  const handleFileUploadInline = (label: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const fileUrl = URL.createObjectURL(file)
    const uploadedDate = new Date().toISOString().split('T')[0]

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : undefined
      setDocuments((docs) => {
        const updated = docs.map((d: any) => {
          // Only update if the full label matches exactly (case-insensitive)
          if (d.name && d.name.toLowerCase() === label.toLowerCase()) {
            return { ...d, status: 'pending', fileName: file.name, uploadedDate, fileUrl, fileType: file.type, dataUrl }
          }
          return d
        })
        persistDocuments(updated)
        return updated
      })

      // add a notification
  try {
  const existing = JSON.parse(localStorage.getItem('notifications') || '[]')
  const note = { id: `doc-${label}-${Date.now()}`, title: `Document Uploaded: ${file.name}`, message: `${file.name} was uploaded for review`, time: 'Just now', timestamp: Date.now(), clickable: false, source: 'student' }
    existing.unshift(note)
    localStorage.setItem('notifications', JSON.stringify(existing.slice(0,20)))
    window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
  } catch (e) {}

      try { (event.target as HTMLInputElement).value = '' } catch (e) {}
    }
    reader.readAsDataURL(file)
  }

  const handleViewDocumentInline = (doc: any) => {
    const url = doc.dataUrl || doc.fileUrl
    const name = doc.fileName || doc.name || 'Document'
    const type = doc.fileType || doc.type || ''

    const openPreview = async () => {
      if (!url) {
        toast({ title: "Document not found", description: "The document is not available for preview.", variant: "destructive" })
        return
      }

      try {
        const dataUrl = await ensureDataUrl(url)
        if (dataUrl) setViewDocument({ name, url: dataUrl, type })
        else toast({ title: "Preview not available", description: "This file cannot be previewed inline.", variant: "destructive" })
      } catch (e) {
        console.error('Error preparing inline preview', e)
        toast({ title: "Error", description: "Failed to open document preview.", variant: "destructive" })
      }
    }

    void openPreview()
  }

  // Helper same as in documents page: try to convert blob/object/http urls to data: urls for inline preview
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

  const handleDeleteDocumentInline = (label: string) => {
    setDocuments((docs) => {
      const updated = docs.map((d: any) => {
        // Only delete if the full label matches exactly (case-insensitive)
        if (d.name && d.name.toLowerCase() === label.toLowerCase()) {
          try { if (d.fileUrl) URL.revokeObjectURL(d.fileUrl) } catch (e) {}
          return { id: d.id, name: d.name, type: d.type, status: 'not_uploaded', required: d.required }
        }
        return d
      })
      persistDocuments(updated)
      return updated
    })
  }

  const handleSubmit = () => {
    // Check if required fields are filled
    const requiredFields = [
      "firstName",
      "surname",
      "email",
      "address",
      "phoneNumber",
      "studentId",
      "currentInstitution",
      "program",
      "yearLevel",
      "submissionInstructions",
    ]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (deadlinePassed) {
      const msg = 'Application closed: the deadline for this program has passed.'
      setInlineError(msg)
      toast({ title: 'Deadline Passed', description: msg, variant: 'destructive' })
      return
    }

    if (missingFields.length > 0 || !date) {
      const msg = 'Please fill in all required fields before submitting.'
      setInlineError(msg)
      const errs: Record<string, string> = {}
      missingFields.forEach((f) => (errs[f] = 'This field is required'))
      if (!date) errs.dateOfBirth = 'Date of birth is required'
      setFieldErrors(errs)
      toast({ title: "Incomplete Application", description: msg, variant: "destructive" })
      return
    }

    // Success notification
    toast({
      title: "Application Submitted Successfully!",
      description: "Your scholarship application has been submitted.",
    })

    // persist application in localStorage mock
    const stored = JSON.parse(localStorage.getItem("applications") || "[]")

    // Get temporary documents stored during upload
    const tempDocs = JSON.parse(localStorage.getItem("tempDocuments") || "[]")
    const required = scholarship.requirements || []
    const submitted = required.map((label: string) => {
      // try to find the matching document by name (case-insensitive, forgiving match)
      const found = (tempDocs || []).find((d: any) => d.name && d.name.toLowerCase().includes(label.toLowerCase().split(' ')[0])) || null
      if (found && found.fileName) {
        return {
          label,
          fileName: found.fileName,
          uploadedDate: found.uploadedDate || null,
          fileType: found.fileType || null,
          dataUrl: found.dataUrl || null,
        }
      }
      return { label, uploaded: false }
    })

    // Convert temporary documents to permanent ones only at submission
    const submittedDocs = tempDocs.filter((doc: any) => {
      return doc.fileName && doc.dataUrl && required.some(label => 
        doc.name.toLowerCase().includes(label.toLowerCase().split(' ')[0])
      )
    }).map((doc: any) => ({
      ...doc,
      status: 'under_review', // Set initial status for admin review
      submittedAt: new Date().toISOString()
    }))

    // Clear temporary documents and store submitted ones
    // Move tempDocuments into permanent documents storage so admin and the Documents page can access them
    try {
      const userEmail = localStorage.getItem('userEmail') || null
      if (userEmail) {
        const { getUserItem, setUserItem, removeUserItem } = require('@/lib/userStorage') as any
        // remove per-user tempDocuments
        removeUserItem(userEmail, 'tempDocuments')
        const existingDocsRaw = getUserItem(userEmail, 'documents') || '[]'
        const existingDocs = JSON.parse(existingDocsRaw)
        const merged = Array.isArray(existingDocs) ? [...submittedDocs, ...existingDocs] : submittedDocs
        setUserItem(userEmail, 'documents', JSON.stringify(merged.slice(0, 200)))
        window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'documents' } }))
      } else {
        localStorage.removeItem('tempDocuments')
        const existingDocs = JSON.parse(localStorage.getItem('documents') || '[]')
        const merged = Array.isArray(existingDocs) ? [...submittedDocs, ...existingDocs] : submittedDocs
        localStorage.setItem('documents', JSON.stringify(merged.slice(0, 200)))
        window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'documents' } }))
      }
    } catch (e) {
      console.error('Error persisting submitted documents', e)
    }

    const newApp = {
      id: Date.now(),
      studentName: `${formData.firstName} ${formData.surname}`,
      scholarshipName: scholarship.name,
      type: appType,
      school: formData.currentInstitution,
      course: formData.program,
      yearLevel: formData.yearLevel,
      status: 'Under Review',
      submittedDocuments: submitted,
      createdAt: new Date().toISOString(),
    }

    stored.unshift(newApp)
    const userEmail = localStorage.getItem('userEmail') || null
    if (userEmail) {
      const { getUserItem, setUserItem } = require('@/lib/userStorage') as any
      const existingAppsRaw = getUserItem(userEmail, 'applications') || '[]'
      const existingApps = JSON.parse(existingAppsRaw)
      const mergedApps = Array.isArray(existingApps) ? [newApp, ...existingApps].slice(0,50) : [newApp]
      setUserItem(userEmail, 'applications', JSON.stringify(mergedApps))
      // Also write a global notifications key for site-wide admin list to pick up if desired
      const existing = JSON.parse(localStorage.getItem("notifications") || "[]")
      const note = {
        id: `app-${newApp.id}`,
        title: `Application Submitted: ${scholarship.name}`,
        message: `Your application is under review`,
        time: 'Just now',
        timestamp: Date.now(),
        applicationId: newApp.id,
        clickable: true,
        source: 'student',
      }
      existing.unshift(note)
      localStorage.setItem("notifications", JSON.stringify(existing.slice(0,20)))
      window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))

      // Also append to global applications so admins see the submission
      try {
        const globalApps = JSON.parse(localStorage.getItem('applications') || '[]')
        if (Array.isArray(globalApps)) {
          globalApps.unshift(newApp)
          localStorage.setItem('applications', JSON.stringify(globalApps.slice(0,50)))
        } else {
          localStorage.setItem('applications', JSON.stringify([newApp]))
        }
        window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'applications' } }))
      } catch (e) {
        console.error('Error writing global applications for admin', e)
      }
    } else {
      localStorage.setItem("applications", JSON.stringify(stored.slice(0,50)))
      // add notifications and notify listeners
      const existing = JSON.parse(localStorage.getItem("notifications") || "[]")
      const note = {
        id: `app-${newApp.id}`,
        title: `Application Submitted: ${scholarship.name}`,
        message: `Your application is under review`,
        time: 'Just now',
        timestamp: Date.now(),
        applicationId: newApp.id,
        clickable: true,
        source: 'student',
      }
      existing.unshift(note)
      localStorage.setItem("notifications", JSON.stringify(existing.slice(0,20)))
      window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
      window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'applications' } }))
    }
    // Create admin-facing notification (include student name so admins know who applied)
    try {
      const globalNotes = JSON.parse(localStorage.getItem('notifications') || '[]')
      globalNotes.unshift({
        id: `app-${newApp.id}`,
        applicationId: newApp.id,
        title: `Application Submitted: ${scholarship.name}`,
        message: `${newApp.studentName} submitted an application for ${scholarship.name}`,
        time: 'Just now',
        timestamp: Date.now(),
        clickable: true,
        source: 'system',
      })
      localStorage.setItem('notifications', JSON.stringify(globalNotes.slice(0,20)))
      window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
    } catch (e) {
      console.error('Error writing admin notification', e)
    }

    // Create a student-facing notification in the user's namespace when possible
    try {
      const userEmailLocal = localStorage.getItem('userEmail') || null
  const studentNote = { id: `app-user-${newApp.id}`, title: `Application Submitted`, message: `Your application is under review`, time: 'Just now', timestamp: Date.now(), applicationId: newApp.id, clickable: true, source: 'student' }
      if (userEmailLocal) {
        const { getUserItem, setUserItem } = require('@/lib/userStorage') as any
        const raw = getUserItem(userEmailLocal, 'notifications') || '[]'
        const parsed = JSON.parse(raw)
        parsed.unshift(studentNote)
        setUserItem(userEmailLocal, 'notifications', JSON.stringify(parsed.slice(0,20)))
        window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
      } else {
        const existingUserFallback = JSON.parse(localStorage.getItem('notifications') || '[]')
        existingUserFallback.unshift({ ...studentNote })
        localStorage.setItem('notifications', JSON.stringify(existingUserFallback.slice(0,20)))
        window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
      }
    } catch (e) {
      console.error('Error writing student notification', e)
    }

    // Navigate to applications page
    router.push("/dashboard/applications")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/scholarships">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Scholarships
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Scholarship Application</h1>
              <p className="text-muted-foreground">{scholarship.name}</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Application Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Please enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                    {fieldErrors.firstName && <p className="text-sm text-destructive mt-1">{fieldErrors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surname">
                      Surname <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="surname"
                      placeholder="Please enter your surname"
                      value={formData.surname}
                      onChange={(e) => handleInputChange("surname", e.target.value)}
                    />
                    {fieldErrors.surname && <p className="text-sm text-destructive mt-1">{fieldErrors.surname}</p>}
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">
                      Date of Birth <span className="text-destructive">*</span>
                    </Label>
                    <div>
                      <div className="flex items-center">
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => {
                            handleInputChange('dateOfBirth', e.target.value)
                            if (e.target.value) setDate(new Date(e.target.value))
                          }}
                          max={new Date().toISOString().split('T')[0]}
                          min="1900-01-01"
                        />
                      </div>
                    </div>
                    {fieldErrors.dateOfBirth && <p className="text-sm text-destructive mt-1">{fieldErrors.dateOfBirth}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Please enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                    {fieldErrors.email && <p className="text-sm text-destructive mt-1">{fieldErrors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Address <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      placeholder="+27 72 123 4567"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentId">
                      Student ID <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="studentId"
                      placeholder="Please enter your student ID"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange("studentId", e.target.value)}
                    />
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-2">
                  <Label htmlFor="currentInstitution">
                    Current School or University <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="currentInstitution"
                    placeholder="Please enter your institution name"
                    value={formData.currentInstitution}
                    onChange={(e) => handleInputChange("currentInstitution", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="program">
                      Course or Program Enrolled <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="program"
                      placeholder="Please enter your course (e.g., Computer Science)"
                      value={formData.program}
                      onChange={(e) => handleInputChange("program", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearLevel">
                      Year Level <span className="text-destructive">*</span>
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("yearLevel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st-year">1st Year</SelectItem>
                        <SelectItem value="2nd-year">2nd Year</SelectItem>
                        <SelectItem value="3rd-year">3rd Year</SelectItem>
                        <SelectItem value="4th-year">4th Year</SelectItem>
                        <SelectItem value="postgraduate">Postgraduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>


                {/* Motivational Letter */}
                <div className="space-y-2">
                  <Label htmlFor="submissionInstructions">
                    Motivational Letter <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="submissionInstructions"
                    placeholder="Write your motivational letter explaining why you deserve this scholarship and your academic goals..."
                    value={formData.submissionInstructions}
                    onChange={(e) => handleInputChange("submissionInstructions", e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Submit Documents Section - mirrors Documents page functionality */}
                <div className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submit Required Documents</CardTitle>
                      <CardDescription>
                        These documents are mandatory for your scholarship application. Upload and view them below.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {scholarship.requirements && scholarship.requirements.length > 0 ? (
                        <div className="space-y-4">
                          {scholarship.requirements.map((label, idx) => {
                            // Use client-loaded `documents` state instead of reading localStorage during render
                            const doc = documents.find((d: any) => d.name === label) || null

                            const documentId = idx + 1 // Use consistent IDs like in documents page
                            
                            return (
                              <div key={`document-${documentId}-${label}`} className="border border-border rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                      <h3 className="font-medium">{label}</h3>
                                      {doc?.fileName && (
                                        <p className="text-sm text-muted-foreground">
                                          {doc.fileName} • Uploaded on {doc.uploadedDate}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="file"
                                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                      id={`file-${documentId}`}
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return
                                        
                                        const fileUrl = URL.createObjectURL(file)
                                        const uploadedDate = new Date().toISOString().split('T')[0]

                                        const reader = new FileReader()
                                        reader.onload = () => {
                                          const dataUrl = typeof reader.result === 'string' ? reader.result : undefined
                                          
                                          setDocuments((docs) => {
                                            // Find if document already exists
                                            const docExists = docs.some(d => d.name === label)
                                            
                                            let updated
                                            if (docExists) {
                                              updated = docs.map((d: any) => {
                                                // Update only if name matches exactly
                                                if (d.name === label) {
                                                  return { 
                                                    ...d,
                                                    id: documentId,
                                                    status: 'pending',
                                                    fileName: file.name,
                                                    uploadedDate,
                                                    fileUrl,
                                                    fileType: file.type,
                                                    dataUrl
                                                  }
                                                }
                                                return d
                                              })
                                            } else {
                                              // Add new document
                                              updated = [...docs, {
                                                id: documentId,
                                                name: label,
                                                type: file.type.split('/')[1] || 'document',
                                                status: 'pending',
                                                required: true,
                                                fileName: file.name,
                                                uploadedDate,
                                                fileUrl,
                                                fileType: file.type,
                                                dataUrl
                                              }]
                                            }
                                            
                                            persistDocuments(updated)
                                            return updated
                                          })

                                          try { (e.target as HTMLInputElement).value = '' } catch (e) {}
                                        }
                                        reader.readAsDataURL(file)
                                      }}
                                    />
                                    <Button variant="outline" size="sm" onClick={() => document.getElementById(`file-${documentId}`)?.click()}>
                                      <Upload className="h-4 w-4 mr-2" />
                                      Upload
                                    </Button>
                                    {doc?.fileName ? (
                                      <>
                                        <Button variant="outline" size="sm" onClick={() => handleViewDocumentInline(doc)}>
                                          <Eye className="h-4 w-4 mr-2" />
                                          View
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          onClick={() => {
                                            setDocuments((docs) => {
                                              const updated = docs.map((d: any) => {
                                                // Delete only if name matches exactly
                                                if (d.name === label) {
                                                  try { if (d.fileUrl) URL.revokeObjectURL(d.fileUrl) } catch (e) {}
                                                  return { 
                                                    id: documentId,
                                                    name: label,
                                                    type: d.type,
                                                    status: 'not_uploaded',
                                                    required: true
                                                  }
                                                }
                                                return d
                                              })
                                              persistDocuments(updated)
                                              return updated
                                            })
                                            // Add deletion notification
                                            try {
                                              // No notification created for document deletion (requested behavior)
                                            } catch (e) {}
                                            
                                            toast({
                                              title: "Document deleted",
                                              description: `${label} has been removed`,
                                            })
                                          }} 
                                          className="text-destructive"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No required documents listed for this scholarship.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Submit Application
                  </Button>
                  {inlineError && (
                    <div className="self-center w-full">
                      <div className="rounded-md bg-destructive/10 border border-destructive p-2 text-destructive text-sm">
                        {inlineError}
                      </div>
                    </div>
                  )}
                  <Link href="/dashboard/scholarships">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Application Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Focus your motivational letter on clarity and evidence: explain your academic goals, relevant
                    achievements, and why the scholarship will support your studies. Ensure all documents are uploaded in
                    acceptable formats on the Documents page before submitting.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tip: Keep your motivational letter concise (400–700 words) and attach transcripts and ID copies where
                    requested.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Document Viewer Dialog */}
      <Dialog open={!!viewDocument} onOpenChange={() => setViewDocument(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Document Viewer</DialogTitle>
            <DialogDescription>{viewDocument?.name}</DialogDescription>
          </DialogHeader>
            <div className="flex-1 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {viewDocument?.url ? (
                viewDocument?.type?.startsWith("image") ? (
                  <img src={viewDocument?.url} alt={viewDocument?.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <iframe src={viewDocument?.url} title={viewDocument?.name} className="w-full h-full" />
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
