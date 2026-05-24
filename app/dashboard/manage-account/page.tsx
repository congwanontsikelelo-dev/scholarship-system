"use client"

import { ArrowLeft, Camera } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navigation from "@/components/Navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"

const ManageAccount = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    studentId: "",
    school: "",
    course: "",
    yearLevel: "third-year",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [originalData, setOriginalData] = useState<any>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const firstName = localStorage.getItem("userFirstName") || ""
    const lastName = localStorage.getItem("userLastName") || ""
    const email = localStorage.getItem("userEmail") || ""
    const savedProfilePic = localStorage.getItem("profilePicture")

    const initial = {
      firstName,
      lastName,
      email,
      username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    }

    setFormData((prev) => ({
      ...prev,
      ...initial,
    }))

    setOriginalData(initial)

    if (savedProfilePic) {
      setProfilePicture(savedProfilePic)
    }
  }, [])

  const hasChanges = () => {
    if (!originalData) return false
    // required fields must be filled
    if (!formData.firstName || !formData.lastName || !formData.email) return false
    return (
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.email !== originalData.email ||
      profilePicture !== localStorage.getItem('profilePicture')
    )
  }

  const handleSaveChanges = () => {
    // clear previous errors
    setValidationErrors({})

    const errors: Record<string, string> = {}
    if (!formData.firstName) errors.firstName = "First name is required."
    if (!formData.lastName) errors.lastName = "Last name is required."
    if (!formData.email) errors.email = "Email is required."

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Validate password change if attempted
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        setValidationErrors({ currentPassword: 'Please enter your current password to change password' })
        toast({ title: "Validation Error", description: "Please enter your current password to change password", variant: "destructive" })
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setValidationErrors({ newPassword: 'New passwords do not match', confirmPassword: 'New passwords do not match' })
        toast({ title: "Validation Error", description: "New passwords do not match", variant: "destructive" })
        return
      }
      if (formData.newPassword.length < 6) {
        setValidationErrors({ newPassword: 'New password must be at least 6 characters' })
        toast({ title: "Validation Error", description: "New password must be at least 6 characters", variant: "destructive" })
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
    setValidationErrors({})
    const existing = JSON.parse(localStorage.getItem("notifications") || "[]")
    existing.unshift({
      id: `profile-${Date.now()}`,
      title: `Profile Updated`,
      message: `Your profile was updated successfully`,
      time: 'Just now',
      timestamp: Date.now(),
      clickable: false,
      source: 'student',
    })
    localStorage.setItem("notifications", JSON.stringify(existing.slice(0,20)))
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
          localStorage.setItem("profilePicture", result)
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
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 mb-6">
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">Manage Account</span>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Manage Account</h1>
                <p className="text-muted-foreground">Update your profile information and settings</p>
              </div>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            {/* Profile Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
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
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleProfilePictureChange}>
                      <Camera className="h-4 w-4 mr-2" />
                      Edit Profile Picture
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setProfilePicture(null)
                        localStorage.removeItem('profilePicture')
                        toast({ title: 'Profile picture removed' })
                      }}
                    >
                      Delete
                    </Button>
                  </div>
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
                    {validationErrors.firstName && (
                      <p className="text-sm text-destructive mt-1">{validationErrors.firstName}</p>
                    )}
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
                    {validationErrors.lastName && (
                      <p className="text-sm text-destructive mt-1">{validationErrors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Username and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
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
                    {validationErrors.email && (
                      <p className="text-sm text-destructive mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Date of Birth and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                {/* Student ID and School */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">School/University</Label>
                    <Input
                      id="school"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    />
                  </div>
                </div>

                {/* Course and Year Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course">Course/Program</Label>
                    <Input
                      id="course"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearLevel">Year Level</Label>
                    <Select
                      value={formData.yearLevel}
                      onValueChange={(value) => setFormData({ ...formData, yearLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first-year">First Year</SelectItem>
                        <SelectItem value="second-year">Second Year</SelectItem>
                        <SelectItem value="third-year">Third Year</SelectItem>
                        <SelectItem value="fourth-year">Fourth Year</SelectItem>
                        <SelectItem value="honours">Honours</SelectItem>
                        <SelectItem value="masters">Masters</SelectItem>
                        <SelectItem value="doctorate">Doctorate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Password Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
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
                  <Button
                    className="bg-foreground text-background hover:bg-foreground/80"
                    onClick={handleSaveChanges}
                    disabled={!hasChanges()}
                  >
                    Save Changes
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">{/* Placeholder for future content */}</div>
        </div>
      </div>
    </div>
  )
}

export default ManageAccount
