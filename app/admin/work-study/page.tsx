"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Edit, Trash2, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import AdminNavigation from "@/components/AdminNavigation"
import Link from "next/link"

const AdminWorkStudy = () => {
  const [programs] = useState([
    {
      id: 1,
      title: "Library Assistant",
      department: "University Library",
      hoursPerWeek: 10,
      payRate: "R 228/hour",
      slots: 3,
      deadline: "April 1, 2025",
    },
    {
      id: 2,
      title: "IT Help Desk Support",
      department: "Information Technology",
      hoursPerWeek: 15,
      payRate: "R 253/hour",
      slots: 2,
      deadline: "April 15, 2025",
    },
  ])

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newProgram, setNewProgram] = useState({
    title: "",
    department: "",
    payRate: "",
    description: "",
    hoursPerWeek: "",
    slots: "",
    deadline: "",
  })

  const [editingProgram, setEditingProgram] = useState<any>(null)
  const [programsList, setProgramsList] = useState(programs)

  const handleCreateProgram = () => {
    if (
      !newProgram.title.trim() ||
      !newProgram.department.trim() ||
      !newProgram.payRate.trim() ||
      !newProgram.description.trim() ||
      !newProgram.hoursPerWeek.trim() ||
      !newProgram.slots.trim() ||
      !newProgram.deadline.trim()
    ) {
      return
    }

    const id = Math.max(...programsList.map((p) => p.id)) + 1
    setProgramsList([
      ...programsList,
      {
        id,
        title: newProgram.title,
        department: newProgram.department,
        hoursPerWeek: Number.parseInt(newProgram.hoursPerWeek),
        payRate: newProgram.payRate,
        slots: Number.parseInt(newProgram.slots),
        deadline: newProgram.deadline,
      },
    ])

    setShowCreateDialog(false)
    setNewProgram({
      title: "",
      department: "",
      payRate: "",
      description: "",
      hoursPerWeek: "",
      slots: "",
      deadline: "",
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
          <span className="text-foreground">Work-Study Management</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Work-Study Management</h1>
            <p className="text-muted-foreground">Manage work-study programs and student applications</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-foreground text-background">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Program
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Work-Study Program</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="programTitle">Program Title</Label>
                    <Input
                      id="programTitle"
                      placeholder="e.g., Library Assistant"
                      value={newProgram.title}
                      onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        placeholder="e.g., University Library"
                        value={newProgram.department}
                        onChange={(e) => setNewProgram({ ...newProgram, department: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="payRate">Pay Rate</Label>
                      <Input
                        id="payRate"
                        placeholder="e.g., R150/hour or Tuition Credit"
                        value={newProgram.payRate}
                        onChange={(e) => setNewProgram({ ...newProgram, payRate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of the role and responsibilities."
                      value={newProgram.description}
                      onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                      className="min-h-20"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="hoursPerWeek">Hours Per Week</Label>
                      <Input
                        id="hoursPerWeek"
                        placeholder="e.g., 10"
                        value={newProgram.hoursPerWeek}
                        onChange={(e) => setNewProgram({ ...newProgram, hoursPerWeek: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="slots">Slots Available</Label>
                      <Input
                        id="slots"
                        placeholder="e.g., 5"
                        value={newProgram.slots}
                        onChange={(e) => setNewProgram({ ...newProgram, slots: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deadline">Application Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newProgram.deadline}
                        onChange={(e) => setNewProgram({ ...newProgram, deadline: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleCreateProgram} className="bg-foreground text-background">
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
        </div>

        <div className="space-y-8">
          {/* Work-Study Programs */}
          <Card>
            <CardHeader>
              <CardTitle>Work-Study Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Hours/Week</TableHead>
                    <TableHead>Pay Rate</TableHead>
                    <TableHead>Slots</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programsList.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell className="font-medium">{program.title}</TableCell>
                      <TableCell>{program.department}</TableCell>
                      <TableCell>{program.hoursPerWeek}</TableCell>
                      <TableCell>{program.payRate}</TableCell>
                      <TableCell>{program.slots}</TableCell>
                      <TableCell>{program.deadline}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{program.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Department</p>
                                    <p className="text-muted-foreground">{program.department}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Pay Rate</p>
                                    <p className="text-muted-foreground">{program.payRate}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Hours Per Week</p>
                                    <p className="text-muted-foreground">{program.hoursPerWeek}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Available Slots</p>
                                    <p className="text-muted-foreground">{program.slots}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Deadline</p>
                                    <p className="text-muted-foreground">{program.deadline}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setEditingProgram({ ...program })}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Work-Study Program</DialogTitle>
                              </DialogHeader>
                              {editingProgram && editingProgram.id === program.id && (
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="editTitle">Program Title</Label>
                                    <Input
                                      id="editTitle"
                                      value={editingProgram.title}
                                      onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="editDepartment">Department</Label>
                                      <Input
                                        id="editDepartment"
                                        value={editingProgram.department}
                                        onChange={(e) =>
                                          setEditingProgram({ ...editingProgram, department: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="editPayRate">Pay Rate</Label>
                                      <Input
                                        id="editPayRate"
                                        value={editingProgram.payRate}
                                        onChange={(e) =>
                                          setEditingProgram({ ...editingProgram, payRate: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <Label htmlFor="editHours">Hours Per Week</Label>
                                      <Input
                                        id="editHours"
                                        value={editingProgram.hoursPerWeek}
                                        onChange={(e) =>
                                          setEditingProgram({
                                            ...editingProgram,
                                            hoursPerWeek: Number.parseInt(e.target.value) || 0,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="editSlots">Slots Available</Label>
                                      <Input
                                        id="editSlots"
                                        value={editingProgram.slots}
                                        onChange={(e) =>
                                          setEditingProgram({
                                            ...editingProgram,
                                            slots: Number.parseInt(e.target.value) || 0,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="editDeadline">Deadline</Label>
                                      <Input
                                        id="editDeadline"
                                        value={editingProgram.deadline}
                                        onChange={(e) =>
                                          setEditingProgram({ ...editingProgram, deadline: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="flex space-x-2 pt-4">
                                    <DialogTrigger asChild>
                                      <Button
                                        onClick={() => {
                                          setProgramsList(
                                            programsList.map((p) => (p.id === editingProgram.id ? editingProgram : p)),
                                          )
                                          setEditingProgram(null)
                                        }}
                                        className="bg-foreground text-background"
                                      >
                                        Save Changes
                                      </Button>
                                    </DialogTrigger>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" onClick={() => setEditingProgram(null)}>
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
                              setProgramsList(programsList.filter((p) => p.id !== program.id))
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
    </div>
  )
}

export default AdminWorkStudy
