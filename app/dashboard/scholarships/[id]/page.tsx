"use client"

import { ArrowLeft, Users, Calendar, FileText } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/Navigation"
import Link from "next/link"
import { useParams } from "next/navigation"
import { scholarshipsData } from "@/data/scholarships"

export default function ScholarshipDetail() {
  const params = useParams()
  const id = params.id as string

  // Look up scholarship from the central mock data
  const idNum = parseInt(id || "", 10)
  const scholarship = scholarshipsData.find((s) => s.id === idNum) || scholarshipsData[0]
  const deadlinePassed = scholarship.deadline ? new Date(scholarship.deadline) < new Date() : false

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/scholarships">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Scholarships
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-4">{scholarship.title}</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Scholarship Type</p>
                      <p className="text-sm text-muted-foreground">{scholarship.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-sm font-medium">Student Eligibility</p>
                      <p className="text-sm text-muted-foreground">{scholarship.eligibility}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="text-sm font-medium">Application Deadline</p>
                      <p className="text-sm text-destructive">{format(new Date(scholarship.deadline), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-success">{scholarship.amount}</p>
              </div>
            </div>

            {/* Academic Year */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Year</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{scholarship.publishedDate || '—'}</p>
              </CardContent>
            </Card>

            {/* Eligibility Criteria */}
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                {typeof scholarship.eligibility === "string" ? (
                  <p className="text-muted-foreground">{scholarship.eligibility}</p>
                ) : Array.isArray((scholarship as any).eligibilityCriteria) ? (
                  <ul className="space-y-2">
                    {(scholarship as any).eligibilityCriteria.map((criteria: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No eligibility details provided.</p>
                )}
              </CardContent>
            </Card>

            {/* Scholarship Description */}
            <Card>
              <CardHeader>
                <CardTitle>Scholarship Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{scholarship.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Document Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                {scholarship.requirements && scholarship.requirements.length ? (
                  <ul className="space-y-3">
                    {scholarship.requirements.map((requirement: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No document requirements listed.</p>
                )}
              </CardContent>
            </Card>

            {/* Important Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Important Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Application Deadline:</span>
                  <span className="text-sm text-destructive">{scholarship.deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Academic Year:</span>
                  <span className="text-sm">{scholarship.publishedDate || '—'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Apply Button */}
              <div className="flex flex-col space-y-3">
                <Link href={`/dashboard/apply/${id}`}>
                  <Button disabled={deadlinePassed} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {deadlinePassed ? 'Application Closed' : 'Apply for this Scholarship'}
                  </Button>
                </Link>
                <Link href="/dashboard/scholarships" className="w-full">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Scholarships
                  </Button>
                </Link>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
