"use client"

import { useState } from "react"
import { GraduationCap, User, Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export default function SignIn() {
  const [accountType, setAccountType] = useState("student")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

    const handleSignIn = () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      })
      return
    }

    // Simple local authentication (no database validation for now)
    const lowerEmail = email.toLowerCase()

        // Do not restore per-user data into global keys on signin. User data remains namespaced
        // under `user:{email}:*`. This keeps global admin application list empty until
        // the student actually submits an application.
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userType", accountType)

    if (accountType === "admin") {
      router.push("/admin/dashboard")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Student Financial & Alternative Payment System</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Sign In Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Account Type Selection */}
            <RadioGroup value={accountType} onValueChange={setAccountType} className="flex space-x-4">
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student" className="flex items-center space-x-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>Student</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin" className="flex items-center space-x-2 cursor-pointer">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Label>
              </div>
            </RadioGroup>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">{accountType === "admin" ? "Admin Email" : "Email"}</Label>
              <Input
                id="email"
                type="email"
                placeholder={accountType === "admin" ? "Enter admin email" : "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">{accountType === "admin" ? "Admin Password" : "Password"}</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button className="w-full" size="lg" onClick={handleSignIn}>
              Sign In as {accountType === "admin" ? "Admin" : "Student"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{"Don't have an account? "}</span>
              <Link href="/" className="text-primary hover:underline">
                {accountType === "admin" ? "Register as Admin" : "Sign Up as Student"}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
