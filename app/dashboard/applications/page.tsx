"use client"

import { ArrowLeft, FileText, Eye, CheckCircle, Clock, XCircle, BarChart3, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/Navigation"
import Link from "next/link"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function Applications() {
  const [apps, setApps] = useState<Array<any>>(() => {
    try {
      const userEmail = localStorage.getItem('userEmail')
      if (userEmail) {
        const { getUserItem } = require('@/lib/userStorage') as any
        const userApps = getUserItem(userEmail, 'applications')
        if (userApps) return JSON.parse(userApps)
      }
      return JSON.parse(localStorage.getItem('applications') || '[]')
    } catch (e) {
      return []
    }
  })

  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [showDocsDialog, setShowDocsDialog] = useState(false)

  React.useEffect(() => {
    const handler = (e: any) => {
      if (!e?.detail) return
      const key = e.detail.key
      if (!key) return
      if (key === 'applications' || key === 'notifications' || key === 'documents') {
        try {
          const userEmail = localStorage.getItem('userEmail')
          if (userEmail) {
            const { getUserItem } = require('@/lib/userStorage') as any
            const userApps = getUserItem(userEmail, 'applications')
            if (userApps) {
              setApps(JSON.parse(userApps))
              return
            }
          }
          setApps(JSON.parse(localStorage.getItem('applications') || '[]'))
        } catch (e) {}
      }
    }
    window.addEventListener('localStorageUpdated', handler)
    return () => window.removeEventListener('localStorageUpdated', handler)
  }, [])

  const total = apps.length
  const pending = apps.filter((a) => a.status === 'Under Review' || a.status === 'Pending').length
  const approved = apps.filter((a) => a.status === 'Approved').length
  const rejected = apps.filter((a) => a.status === 'Rejected').length
  const successRate = total === 0 ? 0 : Math.round((approved / total) * 100)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="h-5 w-5 text-success" />
      case 'Rejected': return <XCircle className="h-5 w-5 text-destructive" />
      case 'Under Review': return <Clock className="h-5 w-5 text-warning" />
      default: return <AlertCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>
      case 'Rejected': return <Badge variant="destructive">Rejected</Badge>
      case 'Under Review': return <Badge variant="secondary">Under Review</Badge>
      case 'Pending': return <Badge variant="outline">Pending</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewDocs = (app: any) => {
    setSelectedApp(app)
    setShowDocsDialog(true)
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Navigation />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">Application History</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Application History</h1>
              <p className="text-muted-foreground">Track your scholarship and work-study applications</p>
            </div>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{total}</div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-warning">{pending}</div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-success">{approved}</div>
                <p className="text-sm text-muted-foreground">Approved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-destructive">{rejected}</div>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold text-info">{successRate}%</div>
                  <TrendingUp className="h-5 w-5 text-info" />
                </div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Your Applications</span>
                  </CardTitle>
                  <CardDescription>
                    {total === 0 ? 'No applications yet. Start by browsing scholarships.' : `${total} application${total !== 1 ? 's' : ''} submitted`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {total === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No applications submitted yet.</p>
                      <p className="text-sm text-muted-foreground mb-6">Start by browsing available scholarships or work-study programs.</p>
                      <div className="flex justify-center space-x-4">
                        <Link href="/dashboard/scholarships">
                          <Button>Browse Scholarships</Button>
                        </Link>
                        <Link href="/dashboard/work-study">
                          <Button variant="outline">Work-Study Programs</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {apps.map((a) => (
                        <div key={a.id} className="border border-border rounded-lg p-4 hover-blend">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                {getStatusIcon(a.status)}
                                <h3 className="font-semibold">{a.scholarshipName}</h3>
                                {getStatusBadge(a.status)}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
                                <div><span className="font-medium">Institution:</span> {a.school}</div>
                                <div><span className="font-medium">Course:</span> {a.course}</div>
                                <div><span className="font-medium">Year:</span> {a.yearLevel}</div>
                                <div><span className="font-medium">Type:</span> {a.type === 'work-study' ? 'Work-Study' : 'Scholarship'}</div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Submitted: {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Recently'}
                              </p>
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                              <Button variant="outline" size="sm" onClick={() => handleViewDocs(a)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Documents
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Chart & Insights */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  {total > 0 ? (
                    <div className="space-y-4">
                      {/* Simple bar chart */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Pending</span>
                          <span className="font-medium">{pending}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-warning rounded-full transition-all" style={{ width: `${total > 0 ? (pending / total) * 100 : 0}%` }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Approved</span>
                          <span className="font-medium">{approved}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-success rounded-full transition-all" style={{ width: `${total > 0 ? (approved / total) * 100 : 0}%` }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Rejected</span>
                          <span className="font-medium">{rejected}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-destructive rounded-full transition-all" style={{ width: `${total > 0 ? (rejected / total) * 100 : 0}%` }} />
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium text-sm mb-2">Insights</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {approved > 0 && (
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span>{approved} application{approved !== 1 ? 's' : ''} approved</span>
                            </li>
                          )}
                          {pending > 0 && (
                            <li className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-warning" />
                              <span>{pending} still under review</span>
                            </li>
                          )}
                          {rejected > 0 && (
                            <li className="flex items-center space-x-2">
                              <XCircle className="h-4 w-4 text-destructive" />
                              <span>{rejected} application{rejected !== 1 ? 's were' : ' was'} rejected</span>
                            </li>
                          )}
                          {total > 0 && (
                            <li className="flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4 text-info" />
                              <span>{successRate}% overall success rate</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Submit applications to see your overview chart</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Dialog */}
      <Dialog open={showDocsDialog} onOpenChange={setShowDocsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Documents</DialogTitle>
            <DialogDescription>
              {selectedApp?.scholarshipName} - Submitted on {selectedApp?.createdAt ? new Date(selectedApp.createdAt).toLocaleDateString() : 'Recently'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedApp?.submittedDocuments && selectedApp.submittedDocuments.length > 0 ? (
              <div className="space-y-3">
                {selectedApp.submittedDocuments.map((doc: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between border rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{typeof doc === 'string' ? doc : doc.label || doc.fileName || 'Document'}</p>
                        {doc.uploadedDate && <p className="text-xs text-muted-foreground">Uploaded: {doc.uploadedDate}</p>}
                      </div>
                    </div>
                    {doc.dataUrl && (
                      <Button variant="outline" size="sm" onClick={() => window.open(doc.dataUrl, '_blank')}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No documents recorded for this application</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
