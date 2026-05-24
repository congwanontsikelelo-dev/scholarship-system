"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import AdminNavigation from "@/components/AdminNavigation"
import Link from "next/link"
import { scholarshipsData } from "@/data/scholarships"

const AdminScholarships = () => {
  const [scholarships, setScholarships] = useState(scholarshipsData)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingScholarship, setEditingScholarship] = useState<any>(null)
  const [newScholarship, setNewScholarship] = useState({
    name: "",
    type: "",
    amount: "",
    eligibility: "",
    deadline: "",
    documentRequirements: "",
    description: "",
    importantDates: "",
  })

  const handleAddScholarship = () => {
    if (
      !newScholarship.name.trim() ||
      !newScholarship.type.trim() ||
      !newScholarship.amount.trim() ||
      !newScholarship.eligibility.trim() ||
      !newScholarship.deadline.trim() ||
      !newScholarship.documentRequirements.trim() ||
      !newScholarship.description.trim() ||
      !newScholarship.importantDates.trim()
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields before saving.",
        variant: "destructive",
      })
      return
    }

    const id = Math.max(...scholarships.map((s) => s.id)) + 1
    const scholarship = {
      id,
      name: newScholarship.name,
      type: newScholarship.type,
      amount: newScholarship.amount,
      eligibility: newScholarship.eligibility,
      deadline: newScholarship.deadline,
      description: newScholarship.description,
      requirements: newScholarship.documentRequirements.split("\n").filter((r) => r.trim()),
      status: "Active",
      publishedDate: new Date().toLocaleDateString(),
    }
    setScholarships([...scholarships, scholarship])
    setNewScholarship({
      name: "",
      type: "",
      amount: "",
      eligibility: "",
      deadline: "",
      documentRequirements: "",
      description: "",
      importantDates: "",
    })
    setShowAddDialog(false)
    toast({
      title: "Scholarship Added",
      description: "The scholarship has been successfully created.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <Link href="/admin/dashboard" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">Scholarship Programs</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Scholarship Programs</h1>
            <p className="text-muted-foreground">Manage scholarship programs and applications</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-foreground text-background">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Scholarship
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Scholarship</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Scholarship Name</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      placeholder="Enter scholarship name"
                      value={newScholarship.name}
                      onChange={(e) => setNewScholarship({ ...newScholarship, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Scholarship Type</label>
                    <select
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      value={newScholarship.type}
                      onChange={(e) => setNewScholarship({ ...newScholarship, type: e.target.value })}
                    >
                      <option value="">Select type</option>
                      <option value="Merit-based">Merit-based</option>
                      <option value="Community Service">Community Service</option>
                      <option value="Field-specific">Field-specific</option>
                      <option value="Bursary">Bursary</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Amount</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      placeholder="e.g., R50,000 per year"
                      value={newScholarship.amount}
                      onChange={(e) => setNewScholarship({ ...newScholarship, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Eligibility Criteria</label>
                    <textarea
                      className="w-full mt-1 px-3 py-2 border rounded-md min-h-20"
                      placeholder="Describe eligibility requirements"
                      value={newScholarship.eligibility}
                      onChange={(e) => setNewScholarship({ ...newScholarship, eligibility: e.target.value })}
                    ></textarea>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Application Deadline</label>
                    <input
                      type="text"
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      placeholder="e.g., March 31, 2025"
                      value={newScholarship.deadline}
                      onChange={(e) => setNewScholarship({ ...newScholarship, deadline: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Document Requirements</label>
                    <textarea
                      className="w-full mt-1 px-3 py-2 border rounded-md min-h-20"
                      placeholder="List required documents (e.g., Academic transcripts, ID document, etc.)"
                      value={newScholarship.documentRequirements}
                      onChange={(e) => setNewScholarship({ ...newScholarship, documentRequirements: e.target.value })}
                    ></textarea>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Scholarship Description</label>
                    <textarea
                      className="w-full mt-1 px-3 py-2 border rounded-md min-h-32"
                      placeholder="Provide a detailed description of the scholarship"
                      value={newScholarship.description}
                      onChange={(e) => setNewScholarship({ ...newScholarship, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Important Dates</label>
                    <textarea
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      placeholder="List important dates (e.g., Application opens, Interview dates, Award announcement)"
                      value={newScholarship.importantDates}
                      onChange={(e) => setNewScholarship({ ...newScholarship, importantDates: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleAddScholarship} className="bg-foreground text-background">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* All Scholarships */}
        <Card>
          <CardHeader>
            <CardTitle>All Scholarships</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scholarship Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Student Eligibility</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scholarships.map((scholarship) => (
                  <TableRow key={scholarship.id}>
                    <TableCell className="font-medium">{scholarship.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{scholarship.type}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">{scholarship.eligibility}</div>
                    </TableCell>
                    <TableCell>{scholarship.deadline}</TableCell>
                    <TableCell>{scholarship.publishedDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{scholarship.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium">Scholarship Name</p>
                                <p className="text-muted-foreground">{scholarship.name}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Scholarship Type</p>
                                <p className="text-muted-foreground">{scholarship.type}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Amount</p>
                                <p className="text-muted-foreground">{scholarship.amount}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Eligibility Criteria</p>
                                <p className="text-muted-foreground">{scholarship.eligibility}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Application Deadline</p>
                                <p className="text-muted-foreground">{scholarship.deadline}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Document Requirements</p>
                                <p className="text-muted-foreground">{scholarship.requirements?.join(", ") || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Scholarship Description</p>
                                <p className="text-muted-foreground">{scholarship.description}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setEditingScholarship({ ...scholarship })}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Scholarship</DialogTitle>
                            </DialogHeader>
                            {editingScholarship && editingScholarship.id === scholarship.id && (
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Scholarship Name</label>
                                  <input
                                    type="text"
                                    className="w-full mt-1 px-3 py-2 border rounded-md"
                                    value={editingScholarship.name}
                                    onChange={(e) =>
                                      setEditingScholarship({ ...editingScholarship, name: e.target.value })
                                    }
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Scholarship Type</label>
                                  <select
                                    className="w-full mt-1 px-3 py-2 border rounded-md"
                                    value={editingScholarship.type}
                                    onChange={(e) =>
                                      setEditingScholarship({ ...editingScholarship, type: e.target.value })
                                    }
                                  >
                                    <option value="Merit-based">Merit-based</option>
                                    <option value="Community Service">Community Service</option>
                                    <option value="Field-specific">Field-specific</option>
                                    <option value="Bursary">Bursary</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Amount</label>
                                  <input
                                    type="text"
                                    className="w-full mt-1 px-3 py-2 border rounded-md"
                                    value={editingScholarship.amount}
                                    onChange={(e) =>
                                      setEditingScholarship({ ...editingScholarship, amount: e.target.value })
                                    }
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Eligibility Criteria</label>
                                  <textarea
                                    className="w-full mt-1 px-3 py-2 border rounded-md min-h-20"
                                    value={editingScholarship.eligibility}
                                    onChange={(e) =>
                                      setEditingScholarship({ ...editingScholarship, eligibility: e.target.value })
                                    }
                                  ></textarea>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Application Deadline</label>
                                  <input
                                    type="text"
                                    className="w-full mt-1 px-3 py-2 border rounded-md"
                                    value={editingScholarship.deadline}
                                    onChange={(e) =>
                                      setEditingScholarship({ ...editingScholarship, deadline: e.target.value })
                                    }
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Document Requirements</label>
                                  <textarea
                                    className="w-full mt-1 px-3 py-2 border rounded-md min-h-20"
                                    value={editingScholarship.requirements?.join("\n") || ""}
                                    onChange={(e) =>
                                      setEditingScholarship({
                                        ...editingScholarship,
                                        requirements: e.target.value.split("\n").filter((r: string) => r.trim()),
                                      })
                                    }
                                  ></textarea>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Scholarship Description</label>
                                  <textarea
                                    className="w-full mt-1 px-3 py-2 border rounded-md min-h-32"
                                    value={editingScholarship.description}
                                    onChange={(e) =>
                                      setEditingScholarship({ ...editingScholarship, description: e.target.value })
                                    }
                                  ></textarea>
                                </div>
                                <div className="flex space-x-2 pt-4">
                                  <DialogTrigger asChild>
                                    <Button
                                      onClick={() => {
                                        setScholarships(
                                          scholarships.map((s) =>
                                            s.id === editingScholarship.id ? editingScholarship : s,
                                          ),
                                        )
                                        toast({
                                          title: "Scholarship Updated",
                                          description: "Changes have been saved successfully.",
                                        })
                                        setEditingScholarship(null)
                                      }}
                                      className="bg-foreground text-background"
                                    >
                                      Save Changes
                                    </Button>
                                  </DialogTrigger>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" onClick={() => setEditingScholarship(null)}>
                                      Cancel
                                    </Button>
                                  </DialogTrigger>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newScholarships = scholarships.filter((s) => s.id !== scholarship.id)
                            setScholarships(newScholarships)
                            toast({
                              title: "Scholarship Deleted",
                              description: "The scholarship has been removed.",
                            })
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminScholarships
