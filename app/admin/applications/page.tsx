"use client"

import { useEffect, useState, useRef } from "react"
import { ArrowLeft, Eye, Check, X, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import AdminNavigation from "@/components/AdminNavigation"
import Link from "next/link"

type DocumentLike = { name?: string; fileName?: string; dataUrl?: string; url?: string; uploadedDate?: string }

export default function AdminApplications() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingDocument, setViewingDocument] = useState<DocumentLike | null>(null)
  const [indexedUrls, setIndexedUrls] = useState<Record<string, string>>({})
  const requestedIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const load = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('applications') || '[]')
        setApplications(Array.isArray(stored) ? stored : [])
      } catch (e) {
        console.error('Error parsing applications', e)
      } finally {
        setLoading(false)
      }
    }

    load()
    const onUpdate = (e: any) => { if (e?.detail?.key === 'applications') load() }
    window.addEventListener('localStorageUpdated', onUpdate)
    return () => window.removeEventListener('localStorageUpdated', onUpdate)
  }, [])

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-100'
      case 'Under Review': return 'text-yellow-600 bg-yellow-100'
      case 'Pending': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const updateApplicationStatus = (applicationId: number | string, status: string) => {
    try {
      const stored = JSON.parse(localStorage.getItem('applications') || '[]')
      const updated = (Array.isArray(stored) ? stored : []).map((a: any) => a.id === applicationId ? { ...a, status } : a)
      localStorage.setItem('applications', JSON.stringify(updated))
      setApplications(updated)
      window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'applications' } }))

        try {
        const notes = JSON.parse(localStorage.getItem('notifications') || '[]')
        notes.unshift({ id: `app-status-${applicationId}-${Date.now()}`, title: `Application ${status}`, message: `Application ${applicationId} is now ${status}.`, time: 'Just now', timestamp: Date.now(), applicationId, clickable: true })
        localStorage.setItem('notifications', JSON.stringify(notes.slice(0, 20)))
        window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
      } catch {}

    } catch (e) {
      console.error('Failed to update application status', e)
      toast({ title: 'Error', description: 'Unable to update status' })
    }
  }

  // Attempt to resolve and open a document preview for admins.
  const handleViewDocumentClick = async (doc: any, application: any) => {
    try {
      let dataUrl = doc?.dataUrl || doc?.fileUrl || ''

      // Try per-user documents (fast, synchronous)
      if (!dataUrl && doc?.docId && application?.userEmail) {
        try {
          const { getUserItem } = require('@/lib/userStorage') as any
          const raw = getUserItem(application.userEmail, 'documents') || '[]'
          const userDocs = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : []
          const found = userDocs.find((d: any) => d.id === doc.docId)
          if (found && found.dataUrl) dataUrl = found.dataUrl
        } catch (e) {}
      }

      // Try IndexedDB (async)
      if (!dataUrl && doc?.docId) {
        try {
          const { getDocumentUrlFromIndexedDB } = require('@/lib/indexedDb') as any
          const indexedUrl = await getDocumentUrlFromIndexedDB(doc.docId)
          if (indexedUrl) dataUrl = indexedUrl
        } catch (e) {}
      }

      // Fallback: scan users' per-user documents
      if (!dataUrl && doc?.docId) {
        try {
          const usersRaw = localStorage.getItem('users')
          if (usersRaw) {
            const users = JSON.parse(usersRaw)
            if (Array.isArray(users)) {
              for (const u of users) {
                try {
                  const { getUserItem } = require('@/lib/userStorage') as any
                  const raw2 = getUserItem(u.email, 'documents') || '[]'
                  const userDocs2 = Array.isArray(JSON.parse(raw2)) ? JSON.parse(raw2) : []
                  const found2 = userDocs2.find((d: any) => d.id === doc.docId || d.fileName === (doc.fileName || doc.name))
                  if (found2 && found2.dataUrl) {
                    dataUrl = found2.dataUrl
                    break
                  }
                } catch (_) { }
              }
            }
          }
        } catch (_) { }
      }

      if (dataUrl) {
        // viewer expects `dataUrl` (some records use `dataUrl`), so provide that key
        setViewingDocument({ name: doc.label || doc.fileName || '(document)', fileName: doc.fileName || '', dataUrl })
      } else {
        toast({ title: 'No document', description: 'This document was not submitted or has no preview available.' })
      }
    } catch (e) {
      console.error('Error resolving document preview', e)
      toast({ title: 'Error', description: 'Unable to load document preview.' })
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-2 mb-6">
          <Link href="/admin/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">Application History</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Application History</h1>
            <p className="text-muted-foreground">Review and manage scholarship applications</p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button>
          </Link>
        </div>

        

        <Card>
          <CardHeader><CardTitle>All Applications</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Program/Scholarship</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden lg:table-cell">School</TableHead>
                  <TableHead className="hidden lg:table-cell">Course</TableHead>
                  <TableHead className="hidden lg:table-cell">Year Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application: any) => {
                  const docs: DocumentLike[] = application.documents || application.submittedDocuments || []
                  return (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.id}</TableCell>
                      <TableCell>{application.studentName}</TableCell>
                      <TableCell className="text-primary">{application.scholarshipName}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${application.type === 'scholarship' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                          {application.type === 'scholarship' ? 'Scholarship' : 'Work-Study'}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{application.school}</TableCell>
                      <TableCell className="hidden lg:table-cell">{application.course}</TableCell>
                      <TableCell className="hidden lg:table-cell">{application.yearLevel}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(application.status)}`}>{application.status}</span>
                      </TableCell>
                      <TableCell className="w-44">
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Application Details - {application.studentName}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Full Name</p>
                                    <p className="text-muted-foreground">{application.studentName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Program/Scholarship</p>
                                    <p className="text-muted-foreground">{application.scholarshipName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Type</p>
                                    <p className="text-muted-foreground">{application.type === 'scholarship' ? 'Scholarship' : 'Work-Study'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">School</p>
                                    <p className="text-muted-foreground">{application.school}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Course</p>
                                    <p className="text-muted-foreground">{application.course}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Year Level</p>
                                    <p className="text-muted-foreground">{application.yearLevel}</p>
                                  </div>
                                </div>

                                <div className="border-t pt-4">
                                  <p className="text-sm font-medium mb-2">Submitted Documents</p>
                                  <div className="space-y-2">
                                    {docs.length > 0 ? docs.map((doc: any, idx: number) => {
                                      // Documents come in multiple shapes across the app:
                                      // - { label, fileName, dataUrl, uploadedDate }
                                      // - { name, fileName, dataUrl }
                                      // - simple strings (from data fixtures)
                                      let label = ''
                                      let fileName = ''
                                      let dataUrl = ''
                                      let uploadedDate = ''
                                      let uploaded = true

                                      if (typeof doc === 'string') {
                                        // Work-study stored cover letters as filename strings — treat as submitted
                                        label = doc
                                        fileName = doc
                                        uploaded = true
                                      } else if (doc && typeof doc === 'object') {
                                        label = doc.label || doc.name || ''
                                        fileName = doc.fileName || ''
                                        dataUrl = doc.dataUrl || doc.fileUrl || ''
                                        uploadedDate = doc.uploadedDate || doc.submittedAt || ''
                                        // if the doc references a per-user stored doc (docId) and the application
                                        // contains a userEmail, try to load the actual dataUrl from that user's documents
                                        try {
                                          if (!dataUrl && doc.docId && application.userEmail) {
                                            const { getUserItem } = require('@/lib/userStorage') as any
                                            const raw = getUserItem(application.userEmail, 'documents') || '[]'
                                            const userDocs = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : []
                                            const found = userDocs.find((d: any) => d.id === doc.docId)
                                            if (found && found.dataUrl) dataUrl = found.dataUrl
                                            // If still no dataUrl, try IndexedDB by docId
                                            if (!dataUrl && doc.docId) {
                                              try {
                                                const idKey = String(doc.docId)
                                                const { getDocumentUrlFromIndexedDB } = require('@/lib/indexedDb') as any
                                                if (!requestedIdsRef.current.has(idKey)) {
                                                  requestedIdsRef.current.add(idKey)
                                                  getDocumentUrlFromIndexedDB(doc.docId).then((indexedUrl: string | null) => {
                                                    if (indexedUrl) setIndexedUrls(prev => ({ ...prev, [idKey]: indexedUrl }))
                                                  }).catch(() => {})
                                                }
                                                if (indexedUrls[idKey]) dataUrl = indexedUrls[idKey]
                                              } catch (e) { /* ignore */ }
                                            }
                                          }
                                        } catch (e) {
                                          // ignore lookup errors and proceed without dataUrl
                                        }
                                        // Fallback: if we still don't have a dataUrl, try scanning stored users to locate the document
                                        if (!dataUrl && doc.docId) {
                                          try {
                                            const usersRaw = localStorage.getItem('users')
                                            if (usersRaw) {
                                              const users = JSON.parse(usersRaw)
                                              if (Array.isArray(users)) {
                                                for (const u of users) {
                                                  try {
                                                    const { getUserItem } = require('@/lib/userStorage') as any
                                                    const raw2 = getUserItem(u.email, 'documents') || '[]'
                                                    const userDocs2 = Array.isArray(JSON.parse(raw2)) ? JSON.parse(raw2) : []
                                                    const found2 = userDocs2.find((d: any) => d.id === doc.docId || d.fileName === fileName)
                                                    if (found2 && found2.dataUrl) {
                                                      dataUrl = found2.dataUrl
                                                      break
                                                    }
                                                  } catch (inner) { /* continue */ }
                                                }
                                              }
                                            }
                                          } catch (e) { /* ignore */ }
                                        }
                                        // some older records use 'uploaded' boolean or 'uploaded: false'
                                        if (typeof doc.uploaded === 'boolean') uploaded = !!doc.uploaded
                                        if (doc.uploaded === undefined && !fileName && !dataUrl) uploaded = false
                                      }

                                      const displayName = label || fileName || '(unnamed document)'

                                      return (
                                        <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                                          <div className="flex items-center space-x-2">
                                            <FileText className="h-4 w-4" />
                                            <span className="text-sm">{displayName}</span>
                                            {uploadedDate && <span className="text-xs text-muted-foreground ml-2">Uploaded on {uploadedDate}</span>}
                                            {!uploaded && <span className="ml-2 text-xs text-destructive">Not submitted</span>}
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Button variant="ghost" size="sm" onClick={() => uploaded && dataUrl ? setViewingDocument({ name: displayName, fileName, dataUrl, uploadedDate }) : toast({ title: 'No document', description: 'This document was not submitted or has no preview available.' })}>
                                              <Eye className="h-4 w-4 mr-2" />View
                                            </Button>
                                            {dataUrl ? (
                                              <a href={dataUrl} target="_blank" rel="noreferrer" className="inline-block">
                                                <Button variant="ghost" size="sm">Download</Button>
                                              </a>
                                            ) : (
                                              <Button variant="ghost" size="sm" disabled className="opacity-50">Download</Button>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    }) : (
                                      <span className="text-muted-foreground text-sm">No documents submitted.</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {application.status !== 'Approved' && application.status !== 'Rejected' && (
                            <>
                              <Button variant="ghost" size="sm" className="text-green-600" onClick={() => { updateApplicationStatus(application.id, 'Approved'); toast({ title: 'Application Approved', description: `${application.studentName}'s application has been approved.` }) }}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { updateApplicationStatus(application.id, 'Rejected'); toast({ title: 'Application Rejected', description: `${application.studentName}'s application has been rejected.` }) }}>
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={!!viewingDocument} onOpenChange={() => setViewingDocument(null)}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader><DialogTitle>Document Viewer</DialogTitle></DialogHeader>
            <div className="flex-1 bg-muted rounded-lg flex items-center justify-center p-6">
              {viewingDocument ? (
                viewingDocument.dataUrl ? (
                  <iframe src={viewingDocument.dataUrl} title={viewingDocument.name || viewingDocument.fileName} className="w-full h-full" />
                ) : (
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{viewingDocument.name || viewingDocument.fileName}</p>
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
    </div>
  )
}
