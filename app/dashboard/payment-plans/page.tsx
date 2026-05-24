"use client"

import React, { useState, useEffect } from "react"
import { Calendar, CheckCircle, AlertCircle, CreditCard, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Navigation from "@/components/Navigation"
import { toast } from "@/hooks/use-toast"

const PaymentPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('paymentApplications') || '[]')
      setApplications(stored)
    } catch (e) {}
  }, [])

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("userData") || "null")
      if (u && (u.firstName || u.lastName)) {
        const name = `${u.firstName || ""} ${u.lastName || ""}`.trim()
        setCardDetails((c) => ({ ...c, cardName: name }))
      }
    } catch (e) {}
  }, [])

  const paymentPlans = [
    {
      id: 1,
      name: "3-Month Plan",
      monthlyAmount: 5000,
      totalMonths: 3,
      description: "Pay tuition in 3 equal installments",
      processingFee: 150,
      recommended: false,
    },
    {
      id: 2,
      name: "6-Month Plan",
      monthlyAmount: 2500,
      totalMonths: 6,
      description: "Pay tuition in 6 equal installments",
      processingFee: 300,
      recommended: true,
    },
    {
      id: 3,
      name: "12-Month Plan",
      monthlyAmount: 1250,
      totalMonths: 12,
      description: "Pay tuition in 12 equal installments",
      processingFee: 600,
      recommended: false,
    },
  ]

  const handleApplyForPlan = () => {
    if (!selectedPlan) {
      toast({ title: "Error", description: "Please select a payment plan first", variant: "destructive" })
      return
    }

    if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
      toast({ title: "Validation Error", description: "Please fill in all card details", variant: "destructive" })
      return
    }

    let studentName = cardDetails.cardName
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      if (userData.firstName || userData.lastName) {
        studentName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
      }
    } catch (e) {}

    const application = {
      id: `payment-${Date.now()}`,
      studentName,
      planName: selectedPlan.name,
      monthlyAmount: selectedPlan.monthlyAmount,
      totalMonths: selectedPlan.totalMonths,
      processingFee: selectedPlan.processingFee,
      cardDetails: {
        last4: cardDetails.cardNumber.slice(-4),
        expiryDate: cardDetails.expiryDate
      },
      status: 'pending',
      appliedAt: new Date().toISOString(),
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }

    try {
      const existing = JSON.parse(localStorage.getItem('paymentApplications') || '[]')
      existing.unshift(application)
      localStorage.setItem('paymentApplications', JSON.stringify(existing))
      setApplications(existing)
      window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'paymentApplications' } }))

      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
      notifications.unshift({
        id: application.id,
        applicationId: application.id,
        title: 'Payment Plan Application Submitted',
        message: `Your application for ${selectedPlan.name} is under review`,
        time: 'Just now',
        timestamp: Date.now(),
        clickable: false,
        source: 'student'
      })
      localStorage.setItem('notifications', JSON.stringify(notifications.slice(0, 20)))
      window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))

      toast({ title: "Application Submitted", description: "Your payment plan application is now under review" })
      setShowPaymentDialog(false)

    } catch (e) {
      console.error('Error saving payment application:', e)
      toast({ title: "Error", description: "Failed to submit application. Please try again.", variant: "destructive" })
    }
  }

  const getActivePlan = () => applications.find((a: any) => a.status === 'pending' || a.status === 'approved')

  const activePlan = getActivePlan()

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Navigation />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Payment Plans</h1>
              <p className="text-muted-foreground">Manage your tuition payment schedule</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Payment Plans */}
            <Card>
              <CardHeader>
                <CardTitle>Available Payment Plans</CardTitle>
                <CardDescription>Choose a payment plan that works for your budget</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPlan?.id === plan.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{plan.name}</h3>
                        {plan.recommended && <Badge variant="secondary">Recommended</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Monthly Payment:</span> R{plan.monthlyAmount.toLocaleString()}</p>
                        <p><span className="font-medium">Processing Fee:</span> R{plan.processingFee}</p>
                        <p><span className="font-medium">Total Duration:</span> {plan.totalMonths} months</p>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedPlan && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Selected: {selectedPlan.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      You will pay R{selectedPlan.monthlyAmount.toLocaleString()} per month for {selectedPlan.totalMonths} months
                    </p>
                    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full">Apply for This Plan</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Payment Plan Application</DialogTitle>
                          <DialogDescription>
                            Enter your card details to apply for the {selectedPlan.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="1234 5678 9012 3456" value={cardDetails.cardNumber} onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardName">Cardholder Name</Label>
                            <Input id="cardName" placeholder="Full name on card" value={cardDetails.cardName} onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input id="expiryDate" placeholder="MM/YY" value={cardDetails.expiryDate} onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input id="cvv" placeholder="123" value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} />
                            </div>
                          </div>
                          <div className="bg-muted p-3 rounded-lg">
                            <h4 className="font-medium mb-2">Payment Schedule</h4>
                            <p className="text-sm text-muted-foreground">
                              First payment of R{selectedPlan.monthlyAmount.toLocaleString()} will be charged immediately
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Subsequent payments on the 1st of each month
                            </p>
                          </div>
                          <Button className="w-full" onClick={handleApplyForPlan}>
                            Confirm Application
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Payment Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>My Payment Plans</CardTitle>
                <CardDescription>
                  {applications.length === 0 ? "No active payment plans" : `${applications.length} application(s)`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No payment plans applied yet</p>
                    <p className="text-sm text-muted-foreground mt-2">Select a plan and apply to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app: any) => (
                      <div key={app.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{app.planName}</h3>
                          <Badge variant={app.status === 'approved' ? 'default' : 'secondary'}>
                            {app.status === 'approved' ? 'Active' : 'Pending Review'}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p><span className="font-medium">Monthly:</span> R{app.monthlyAmount?.toLocaleString()}</p>
                          <p><span className="font-medium">Duration:</span> {app.totalMonths} months</p>
                          <p><span className="font-medium">Applied:</span> {new Date(app.appliedAt).toLocaleDateString()}</p>
                          {app.nextPaymentDate && (
                            <p className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Next payment: {app.nextPaymentDate}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPlans
