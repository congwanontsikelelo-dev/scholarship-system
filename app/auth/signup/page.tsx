"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    accountType: "",
    firstName: "",
    lastName: "",
    email: "",
    studentNumber: "",
    password: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "password" || field === "confirmPassword") setPasswordError("")
  }

  useEffect(() => {
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) setPasswordError("Passwords do not match")
      else if (formData.password.length > 0 && formData.password.length < 6) setPasswordError("Password must be at least 6 characters")
      else setPasswordError("")
    } else {
      setPasswordError("")
    }
  }, [formData.password, formData.confirmPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.accountType) {
      toast({ title: "Missing Information", description: "Please select an account type", variant: "destructive" })
      return
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({ title: "Missing Information", description: "Please fill in all required fields", variant: "destructive" })
      return
    }

    if (formData.accountType === "student" && !formData.studentNumber) {
      toast({ title: "Missing Information", description: "Please enter your student number", variant: "destructive" })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match", variant: "destructive" })
      return
    }

    if (formData.password.length < 6) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters", variant: "destructive" })
      return
    }

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      studentNumber: formData.studentNumber,
      accountType: formData.accountType,
      createdAt: new Date().toISOString(),
    }

    try {
      if (formData.accountType === 'student') {
        const emailKey = formData.email || ''
        const { copyGlobalToUser } = await import('@/lib/userStorage')
        copyGlobalToUser(emailKey, ['applications', 'documents', 'notifications'])
        localStorage.removeItem('applications')
        localStorage.removeItem('documents')
        localStorage.removeItem('tempDocuments')
      }
    } catch (e) {
      console.error('Error backing up data during signup', e)
    }

    localStorage.setItem("userData", JSON.stringify(userData))
    localStorage.setItem("userEmail", formData.email)
    localStorage.setItem("userType", formData.accountType)

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      users.unshift({ id: Date.now(), email: formData.email, firstName: formData.firstName, lastName: formData.lastName, accountType: formData.accountType, password: formData.password })
      localStorage.setItem('users', JSON.stringify(users.slice(0, 200)))
    } catch (e) {
      console.error('Error persisting users list', e)
    }

    const existing = JSON.parse(localStorage.getItem("notifications") || "[]")
    const displayName = `${formData.firstName} ${formData.lastName}`.trim()
    const notif = { id: `signup-${Date.now()}`, title: `Account Created`, message: `Welcome ${displayName}`, time: "Just now", timestamp: Date.now(), clickable: false, source: formData.accountType === 'student' ? 'student' : 'system' }
    existing.unshift(notif)
    localStorage.setItem("notifications", JSON.stringify(existing.slice(0, 20)))

    toast({ title: "Account Created Successfully", description: `Welcome, ${displayName}!` })

    if (formData.accountType === "admin") {
      router.push("/admin/dashboard")
    } else {
      router.push("/dashboard")
    }
  }

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search)
      const t = q.get("type")
      if (t === "student" || t === "admin") {
        setFormData(prev => ({ ...prev, accountType: t }))
      }
    } catch (e) {}
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <p className="text-center text-sm text-muted-foreground">SFAPS - Student Financial & Alternative Payment System</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountType">
                  Account Type <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.accountType} onValueChange={(value) => handleInputChange("accountType", value)}>
                  <SelectTrigger id="accountType">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                  <Input id="firstName" placeholder="First name" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                  <Input id="lastName" placeholder="Last name" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
              </div>

              {formData.accountType === "student" && (
                <div className="space-y-2">
                  <Label htmlFor="studentNumber">Student Number <span className="text-destructive">*</span></Label>
                  <Input id="studentNumber" placeholder="Student number" value={formData.studentNumber} onChange={(e) => handleInputChange("studentNumber", e.target.value)} required />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                <Input id="password" type="password" placeholder="Create a password (min. 6 characters)" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-destructive">*</span></Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} required />
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={!!passwordError && passwordError.length > 0}>Create Account</Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-primary hover:underline">Sign in</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
