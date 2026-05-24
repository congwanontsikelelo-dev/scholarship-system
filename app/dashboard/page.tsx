"use client"

import { FileText, GraduationCap, Calendar, Search, Filter, Eye, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navigation from "@/components/Navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { scholarshipsData } from "@/data/scholarships"

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedField, setSelectedField] = useState("")
  const [userName, setUserName] = useState("Student")

  useEffect(() => {
    try {
      const userData = localStorage.getItem("userData")
      if (userData) {
        const parsed = JSON.parse(userData)
        if (parsed.firstName) setUserName(parsed.firstName)
      }
    } catch (e) {}
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const scholarships = scholarshipsData.filter((s) => {
    if (!s.deadline) return true
    const d = new Date(s.deadline)
    return d >= today
  })

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (scholarship.field && scholarship.field.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = !selectedType || selectedType === "all-types" || scholarship.type === selectedType
    const matchesField = !selectedField || selectedField === "all-fields" || scholarship.field === selectedField

    return matchesSearch && matchesType && matchesField
  })

  // Get unique fields for filter
  const uniqueFields = Array.from(new Set(scholarships.map(s => s.field).filter(Boolean)))

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Navigation />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 leading-tight">
                <span className="block">SFAPS Portal</span>
              </h1>
              <p className="text-muted-foreground">Welcome back, {userName}!</p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search & Filter Scholarships and Bursaries</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, description, or field..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">All Types</SelectItem>
                      <SelectItem value="Bursary">Bursary</SelectItem>
                      <SelectItem value="Merit-based">Merit-based</SelectItem>
                      <SelectItem value="Fellowship">Fellowship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={selectedField} onValueChange={setSelectedField}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-fields">All Fields</SelectItem>
                      {uniqueFields.map(field => (
                        <SelectItem key={field} value={field!}>{field}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Display filter results */}
              {((selectedType && selectedType !== "all-types") ||
                (selectedField && selectedField !== "all-fields") ||
                searchTerm) && (
                <div className="mt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {searchTerm && (
                      <Badge variant="secondary" className="ml-2">
                        Search: {searchTerm}
                      </Badge>
                    )}
                    {selectedType && selectedType !== "all-types" && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedType}
                      </Badge>
                    )}
                    {selectedField && selectedField !== "all-fields" && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedField}
                      </Badge>
                    )}
                  </div>

                  {/* Results */}
                  <div className="space-y-3">
                    {filteredScholarships.map((scholarship) => (
                      <div
                        key={scholarship.id}
                        className="border border-border rounded-lg p-4 hover-blend"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{scholarship.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{scholarship.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="outline">{scholarship.type}</Badge>
                              {scholarship.field && <Badge variant="secondary">{scholarship.field}</Badge>}
                              <span className="text-sm font-medium text-success">{scholarship.amount}</span>
                              <span className="text-sm text-muted-foreground">Deadline: {scholarship.deadline}</span>
                            </div>
                          </div>
                          <Link href={`/dashboard/scholarships/${scholarship.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    {filteredScholarships.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No scholarships found matching your criteria.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Scholarship Programs */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Scholarship & Bursary Programs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <p className="text-sm text-muted-foreground">{scholarships.length} active programs available</p>
                <Link href="/dashboard/scholarships">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Eye className="h-4 w-4 mr-2" />
                    View Programs
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Application History */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Application History</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href="/dashboard/applications">
                  <Button variant="outline" className="w-full bg-transparent">
                    View History
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-warning" />
                  <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href="/dashboard/deadlines">
                  <Button variant="outline" className="w-full bg-transparent">
                    View All Deadlines
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{scholarships.length}</div>
                <p className="text-sm text-muted-foreground">Active Scholarships</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-success">
                  R {Math.round(scholarships.reduce((acc, s) => acc + (parseInt(s.amount.replace(/[^0-9]/g, "")) || 0), 0) / 1000)}k
                </div>
                <p className="text-sm text-muted-foreground">Total Funding</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-info">{uniqueFields.length}</div>
                <p className="text-sm text-muted-foreground">Study Fields</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-warning">
                  {scholarships.filter(s => {
                    if (!s.deadline) return false
                    const d = new Date(s.deadline)
                    const diff = d.getTime() - today.getTime()
                    return diff > 0 && diff <= 30 * 24 * 60 * 60 * 1000
                  }).length}
                </div>
                <p className="text-sm text-muted-foreground">Closing Soon (30 days)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
