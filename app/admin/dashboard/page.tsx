"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus, GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import AdminNavigation from "@/components/AdminNavigation"

const AdminDashboard = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "NSFAS Applications Open 2026",
      content: "National Student Financial Aid Scheme applications for the 2026 academic year are now open for all qualifying South African students.",
      applicationPeriod: "Aug 1, 2025 - Jan 31, 2026",
      requirement1: "South African citizen with household income below R350,000",
      requirement2: "Registered or accepted at a public university or TVET college",
    },
    {
      id: 2,
      title: "Funza Lushaka Teaching Bursary",
      content: "Applications for the Funza Lushaka teaching bursary are open for students pursuing Bachelor of Education or PGCE qualifications.",
      applicationPeriod: "Jan 10, 2025 - Jan 15, 2026",
      requirement1: "Commitment to teach at a public school for equal years funded",
      requirement2: "Minimum academic requirements as per institution",
    },
  ])

  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    applicationPeriod: "",
    requirement1: "",
    requirement2: "",
  })

  const handleEditAnnouncement = (announcement: any) => {
    setEditingAnnouncement(announcement)
  }

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id))
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been successfully deleted.",
    })
  }

  const handleSaveEdit = () => {
    if (
      !editingAnnouncement?.title?.trim() ||
      !editingAnnouncement?.content?.trim() ||
      !editingAnnouncement?.applicationPeriod?.trim() ||
      !editingAnnouncement?.requirement1?.trim() ||
      !editingAnnouncement?.requirement2?.trim()
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields before saving.",
        variant: "destructive",
      })
      return
    }

    setAnnouncements(announcements.map((a) => (a.id === editingAnnouncement.id ? editingAnnouncement : a)))
    setEditingAnnouncement(null)
    toast({
      title: "Changes Saved",
      description: "Announcement has been updated successfully.",
    })
  }

  const handleCreateAnnouncement = () => {
    if (
      !newAnnouncement.title.trim() ||
      !newAnnouncement.content.trim() ||
      !newAnnouncement.applicationPeriod.trim() ||
      !newAnnouncement.requirement1.trim() ||
      !newAnnouncement.requirement2.trim()
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields before creating the announcement.",
        variant: "destructive",
      })
      return
    }

    const id = Math.max(...announcements.map((a) => a.id), 0) + 1
    const created = { ...newAnnouncement, id }
    setAnnouncements([...announcements, created])
    setNewAnnouncement({
      title: "",
      content: "",
      applicationPeriod: "",
      requirement1: "",
      requirement2: "",
    })
    setShowCreateDialog(false)
    toast({
      title: "Announcement Created",
      description: "New announcement has been created successfully.",
    })

    try {
      const usersRaw = localStorage.getItem('users')
      const notification = {
        id: `announce-${Date.now()}`,
        title: created.title,
        message: created.content,
        time: 'Just now',
        timestamp: Date.now(),
        clickable: true,
        source: 'admin',
      }

      if (usersRaw) {
        const users = JSON.parse(usersRaw)
        if (Array.isArray(users) && users.length > 0) {
          users.forEach((u: any) => {
            try {
              const { getUserItem, setUserItem } = require('@/lib/userStorage') as any
              const raw = getUserItem(u.email, 'notifications') || '[]'
              const parsed = JSON.parse(raw)
              parsed.unshift({ ...notification, id: `announce-${u.email}-${Date.now()}`, timestamp: Date.now() })
              setUserItem(u.email, 'notifications', JSON.stringify(parsed.slice(0, 20)))
            } catch (e) {}
          })
          window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
          return
        }
      }

      const global = JSON.parse(localStorage.getItem('notifications') || '[]')
      global.unshift(notification)
      localStorage.setItem('notifications', JSON.stringify(global.slice(0, 50)))
      window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
    } catch (e) {
      console.error('Failed to create student notifications for announcement', e)
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <AdminNavigation />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Student Financial & Alternative Payment System</h1>
                <p className="text-muted-foreground">Manage announcements and system overview</p>
              </div>
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-foreground text-background">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter announcement title"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">
                      Content <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Enter announcement content"
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                      className="min-h-20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="applicationPeriod">
                      Application Period <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="applicationPeriod"
                      placeholder="e.g., Jan 1, 2025 - Mar 31, 2026"
                      value={newAnnouncement.applicationPeriod}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, applicationPeriod: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="requirement1">
                      Requirement 1 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="requirement1"
                      placeholder="Enter first requirement"
                      value={newAnnouncement.requirement1}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, requirement1: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="requirement2">
                      Requirement 2 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="requirement2"
                      placeholder="Enter second requirement"
                      value={newAnnouncement.requirement2}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, requirement2: e.target.value })}
                    />
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleCreateAnnouncement} className="bg-foreground text-background">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-semibold">{announcement.title}</h3>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => handleEditAnnouncement(announcement)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Announcement</DialogTitle>
                              </DialogHeader>
                              {editingAnnouncement && (
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="editTitle">
                                      Title <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                      id="editTitle"
                                      value={editingAnnouncement.title}
                                      onChange={(e) =>
                                        setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="editContent">
                                      Content <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                      id="editContent"
                                      value={editingAnnouncement.content}
                                      onChange={(e) =>
                                        setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })
                                      }
                                      className="min-h-20"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="editApplicationPeriod">
                                      Application Period <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                      id="editApplicationPeriod"
                                      value={editingAnnouncement.applicationPeriod}
                                      onChange={(e) =>
                                        setEditingAnnouncement({
                                          ...editingAnnouncement,
                                          applicationPeriod: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="editRequirement1">
                                      Requirement 1 <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                      id="editRequirement1"
                                      value={editingAnnouncement.requirement1}
                                      onChange={(e) =>
                                        setEditingAnnouncement({ ...editingAnnouncement, requirement1: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="editRequirement2">
                                      Requirement 2 <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                      id="editRequirement2"
                                      value={editingAnnouncement.requirement2}
                                      onChange={(e) =>
                                        setEditingAnnouncement({ ...editingAnnouncement, requirement2: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="flex space-x-2 pt-4">
                                    <DialogTrigger asChild>
                                      <Button onClick={handleSaveEdit} className="bg-foreground text-background">
                                        Save Changes
                                      </Button>
                                    </DialogTrigger>
                                    <Button variant="outline" onClick={() => setEditingAnnouncement(null)}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center space-x-2">
                                  <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                                    <Trash2 className="h-5 w-5 text-destructive" />
                                  </div>
                                  <span>Confirm Deletion</span>
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-base">
                                  Are you sure you want to permanently delete this announcement?
                                  <br />
                                  <br />
                                  <strong>"{announcement.title}"</strong>
                                  <br />
                                  <br />
                                  This action cannot be undone and the announcement will be removed from all users' views.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Yes, Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{announcement.content}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Application Period</span>
                          <p className="text-muted-foreground">{announcement.applicationPeriod}</p>
                        </div>
                        <div>
                          <span className="font-medium">Requirement 1</span>
                          <p className="text-muted-foreground">{announcement.requirement1}</p>
                        </div>
                        <div>
                          <span className="font-medium">Requirement 2</span>
                          <p className="text-muted-foreground">{announcement.requirement2}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - removed notifications, kept empty for future use */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Manage scholarship announcements, review student applications, and oversee the SFAPS platform.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
