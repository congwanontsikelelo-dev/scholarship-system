"use client"

import { ArrowLeft, User, Shield, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function AccountTypes() {
  const studentFeatures = [
    "Browse scholarship programs and bursary opportunities",
    "Submit applications",
    "Track application status",
    "Receive notifications",
    "Manage personal profile",
    "View application history",
  ]

  const adminFeatures = [
    "Create and manage scholarships and bursaries",
    "Review applications",
    "Approve/reject applications",
    "Create announcements",
    "View all user data",
    "System administration",
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Account Types</h1>
          <p className="text-lg text-muted-foreground">Choose the right account type for your needs</p>
        </div>

        {/* Account Types Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Student Account */}
          <Card className="relative border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                <User className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Student Account</CardTitle>
              <Badge variant="secondary" className="w-fit mx-auto">
                Most Common
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">What you can do:</h4>
                <ul className="space-y-2">
                  {studentFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-semibold text-primary mb-2">How to create:</h4>
                <p className="text-sm text-muted-foreground">
                  Simply use any email address and password. No special codes required!
                </p>
              </div>

              <Button className="w-full" asChild>
                <Link href="/">Create Student Account</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Admin Account */}
          <Card className="relative border-2 border-purple/20 hover:border-purple/40 transition-colors">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-purple/10 rounded-full w-fit">
                <Shield className="h-12 w-12 text-purple" />
              </div>
              <CardTitle className="text-2xl">Admin Account</CardTitle>
              <Badge variant="destructive" className="w-fit mx-auto">
                Restricted
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">What you can do:</h4>
                <ul className="space-y-2">
                  {adminFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple/5 rounded-lg p-4">
                <h4 className="font-semibold text-purple mb-2">How to create:</h4>
                <p className="text-sm text-muted-foreground">
                  Requires a special admin code for security. Contact system administrator.
                </p>
              </div>

              <Button className="w-full" asChild>
                <Link href="/">Create Admin Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/auth/signin">Go to Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
