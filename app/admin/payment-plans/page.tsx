"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import AdminNavigation from "@/components/AdminNavigation"
import { useToast } from "@/hooks/use-toast"

export default function AdminPaymentPlans() {
  const { toast } = useToast()
  const [paymentApplications, setPaymentApplications] = useState<any[]>([])

  // Load payment applications from localStorage
  useEffect(() => {
    const loadPaymentApplications = () => {
      try {
        const saved = localStorage.getItem('paymentApplications')
        if (saved) {
          const parsed = JSON.parse(saved)
          setPaymentApplications(Array.isArray(parsed) ? parsed : [])
        }
      } catch (e) {
        console.error('Error loading payment applications:', e)
      }
    }

    loadPaymentApplications()

    // Listen for updates from other components
    const handler = (e: any) => {
      if (e?.detail?.key === 'paymentApplications') {
        loadPaymentApplications()
      }
    }
    window.addEventListener('localStorageUpdated', handler)
    return () => window.removeEventListener('localStorageUpdated', handler)
  }, [])

  const handleApprove = (applicationId: string) => {
    const updated = paymentApplications.map(app => {
      if (app.id === applicationId) {
        const updatedApp = {
          ...app,
          status: 'approved',
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'Admin'
        }

        // Add notification for the student
        try {
          const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
          notifications.unshift({
            id: `payment-approved-${applicationId}`,
            title: 'Payment Plan Approved',
            message: `Your ${app.planName} payment plan application has been approved`,
            time: 'Just now',
            timestamp: Date.now(),
            clickable: false
          })
          localStorage.setItem('notifications', JSON.stringify(notifications.slice(0, 20)))
          window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
        } catch (e) {
          console.error('Error updating notifications:', e)
        }

        return updatedApp
      }
      return app
    })

    setPaymentApplications(updated)
    localStorage.setItem('paymentApplications', JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'paymentApplications' } }))

    toast({
      title: "Application Approved",
      description: "The payment plan application has been approved",
    })
  }

  const handleReject = (applicationId: string) => {
    const updated = paymentApplications.map(app => {
      if (app.id === applicationId) {
        const updatedApp = {
          ...app,
          status: 'rejected',
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'Admin'
        }

        // Add notification for the student
        try {
          const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
          notifications.unshift({
            id: `payment-rejected-${applicationId}`,
            title: 'Payment Plan Not Approved',
            message: `Your ${app.planName} payment plan application was not approved`,
            time: 'Just now',
            timestamp: Date.now(),
            clickable: false
          })
          localStorage.setItem('notifications', JSON.stringify(notifications.slice(0, 20)))
          window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
        } catch (e) {
          console.error('Error updating notifications:', e)
        }

        return updatedApp
      }
      return app
    })

    setPaymentApplications(updated)
    localStorage.setItem('paymentApplications', JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'paymentApplications' } }))

    toast({
      title: "Application Rejected",
      description: "The payment plan application has been rejected",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending Review</Badge>
      case 'approved':
        return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Payment Plan Applications</h1>
          <p className="text-muted-foreground">Review and manage student payment plan applications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
            <CardDescription>Review student payment plan applications</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentApplications.length > 0 ? (
              <div className="space-y-4">
                {paymentApplications.map((application) => (
                  <div key={application.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{application.studentName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Applied for: {application.planName}
                        </p>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>

                    <div className="space-y-3 text-sm">
                      <p><span className="font-medium">Monthly Amount:</span> R{application.monthlyAmount}</p>
                      <p><span className="font-medium">Total Duration:</span> {application.totalMonths} months</p>
                      <p><span className="font-medium">Applied On:</span> {new Date(application.appliedAt).toLocaleDateString()}</p>
                    </div>

                    {application.status === 'pending' && (
                      <div className="flex items-center space-x-2 mt-4">
                        <Button 
                          onClick={() => handleApprove(application.id)}
                          className="bg-success text-success-foreground hover:bg-success/90"
                        >
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          onClick={() => handleReject(application.id)}
                          variant="destructive"
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    )}

                    {application.status !== 'pending' && (
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>
                          {application.status === 'approved' ? 'Approved' : 'Rejected'} by {application.reviewedBy} on{' '}
                          {new Date(application.reviewedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg font-medium mb-2">No pending applications</p>
                <p>Payment plan applications will appear here when students apply</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}