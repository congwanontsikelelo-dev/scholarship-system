"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export default function Index() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    accountType: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [passwordError, setPasswordError] = useState("")

  function handleInputChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "password" || field === "confirmPassword") setPasswordError("")
  }

  async function handleSignUp() {
    if (!formData.accountType) {
      toast({ title: "Validation Error", description: "Please select an account type", variant: "destructive" })
      return
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({ title: "Validation Error", description: "Please complete all required fields", variant: "destructive" })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match")
      toast({ title: "Validation Error", description: "Passwords do not match", variant: "destructive" })
      return
    }

    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      toast({ title: "Validation Error", description: "Password must be at least 6 characters", variant: "destructive" })
      return
    }

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const existing = users.find((u: any) => u.email === formData.email)
      if (!existing) {
        const user = {
          id: Date.now(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          accountType: formData.accountType,
          password: formData.password,
          createdAt: new Date().toISOString(),
        }
        users.unshift(user)
        localStorage.setItem("users", JSON.stringify(users.slice(0, 200)))
      }

      try {
        const { copyGlobalToUser } = await import("@/lib/userStorage")
        await copyGlobalToUser(formData.email, ["documents", "tempDocuments", "applications", "notifications"])
      } catch (err) {
        console.warn("copyGlobalToUser failed or not available", err)
      }

      localStorage.setItem("userEmail", formData.email)
      localStorage.setItem("userType", formData.accountType)
      localStorage.setItem("userData", JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        accountType: formData.accountType,
      }))

      const existingNotes = JSON.parse(localStorage.getItem("notifications") || "[]")
      const note = { id: `signup-${Date.now()}`, title: "Account Created", message: `Welcome ${formData.firstName} ${formData.lastName}`, time: "Just now", timestamp: Date.now(), clickable: false, source: formData.accountType === 'student' ? 'student' : 'system' }
      existingNotes.unshift(note)
      localStorage.setItem("notifications", JSON.stringify(existingNotes.slice(0, 20)))

      toast({ title: "Success", description: "Account created." })

      if (formData.accountType === "admin") router.push("/admin/dashboard"); else router.push("/dashboard")
    } catch (error: any) {
      console.error("Sign-Up Error:", error)
      toast({ title: "Sign-Up Failed", description: error?.message || "Something went wrong", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-primary rounded-lg">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold">SFAPS</h2>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                Student Financial &<br />
                <span className="text-primary">Alternative Payment System</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-md">
                Discover and apply for South African scholarships and bursaries that match your academic goals. 
                Our platform connects students with funding opportunities to achieve their dreams.
              </p>

              <div className="flex space-x-4">
                <Button size="lg" className="px-8" onClick={() => router.push("/auth/signup")}>
                  Sign Up Now
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/learn-more">Learn More</Link>
                </Button>
              </div>

              <div className="pt-4">
                <p className="text-sm text-info mb-2">
                  Not sure which account type?{" "}
                  <Link href="/help/account-types" className="text-primary hover:underline">
                    Learn about Student vs Admin accounts
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Create Account form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-lg shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Create Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    <Label htmlFor="firstName">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input id="firstName" placeholder="Please enter your first name" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input id="lastName" placeholder="Please enter your last name" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input id="email" type="email" placeholder="Please enter your email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Input id="password" type="password" placeholder="Please enter your password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} />
                  {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
                </div>

                <Button className="w-full" size="lg" onClick={handleSignUp}>
                  Sign Up
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <Link href="/auth/signin" className="text-primary hover:underline">
                    Sign In
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
