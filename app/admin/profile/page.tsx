"use client"

import { ArrowLeft, Camera } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AdminNavigation from "@/components/AdminNavigation"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

export default function AdminProfile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [profilePicture, setProfilePicture] = useState<string | null>(null)

  useEffect(() => {
    const firstName = localStorage.getItem("userFirstName") || "Admin"
    const lastName = localStorage.getItem("userLastName") || "User"
    const email = localStorage.getItem("userEmail") || "admin@scholarhub.com"
    const savedProfilePic = localStorage.getItem("adminProfilePicture")

    setFormData((prev) => ({
      ...prev,
      firstName,
      lastName,
      email,
      username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    }))

    if (savedProfilePic) {
      setProfilePicture(savedProfilePic)
    }
  }, [])

  const handleSaveChanges = () => {
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (First Name, Last Name, Username, Email)",
        variant: "destructive",
      })
      return
    }

    // Validate password change if attempted
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        toast({
          title: "Validation Error",
          description: "Please enter your current password to change password",
          variant: "destructive",
        })
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast({
          title: "Validation Error",
          description: "New passwords do not match",
          variant: "destructive",
        })
        return
      }
      if (formData.newPassword.length < 6) {
        toast({
          title: "Validation Error",
          description: "New password must be at least 6 characters",
          variant: "destructive",
        })
        return
      }
    }

    // Save changes
    localStorage.setItem("userFirstName", formData.firstName)
    localStorage.setItem("userLastName", formData.lastName)
    localStorage.setItem("userEmail", formData.email)

    toast({
      title: "Success",
      description: "Profile updated successfully",
    })
  }

  const handleProfilePictureChange = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setProfilePicture(result)
          localStorage.setItem("adminProfilePicture", result)
          toast({
            title: "Success",
            description: "Profile picture updated successfully",
          })
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const initials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <Link href="/admin/dashboard" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">Admin Profile</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Profile</h1>
            <p className="text-muted-foreground">Manage your administrator account settings</p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Administrator Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">A</span>
              </div>
              <span>Administrator Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                {profilePicture ? (
                  <img
                    src={profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-2xl text-muted-foreground">{initials}</div>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleProfilePictureChange}>
                <Camera className="h-4 w-4 mr-2" />
                Edit Profile Picture
              </Button>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            {/* Username and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Security</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password to change password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button className="bg-foreground text-background hover:bg-foreground/80" onClick={handleSaveChanges}>
                Save Changes
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/dashboard">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
