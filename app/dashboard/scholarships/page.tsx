"use client"

import { ArrowLeft, Users, Calendar, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/Navigation"
import Link from "next/link"
import { scholarshipsData } from "@/data/scholarships"

export default function Scholarships() {
  const scholarships = scholarshipsData.filter((s) => {
    try {
      if (!s.deadline) return true
      const d = new Date(s.deadline)
      return d >= new Date(new Date().toDateString()) // compare by date only
    } catch (e) {
      return true
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Scholarship Programs</h1>
              <p className="text-muted-foreground">Discover scholarships that match your profile</p>
            </div>

            <div className="space-y-6">
              {scholarships.map((scholarship) => (
                <Card key={scholarship.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{scholarship.title}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{scholarship.eligibility}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-success">{scholarship.amount}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Type</p>
                        <p className="text-sm">{scholarship.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Deadline</p>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-destructive" />
                          <span className="text-sm text-destructive">{scholarship.deadline}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Published</p>
                        <p className="text-sm text-muted-foreground">{(scholarship as any).publishedDate || ''}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/dashboard/scholarships/${scholarship.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/dashboard/apply/${scholarship.id}`}>
                        <Button size="sm" className="bg-background text-foreground border border-border hover:bg-muted">
                          Apply Now
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">{/* Placeholder for future content */}</div>
        </div>
      </div>
    </div>
  )
}
