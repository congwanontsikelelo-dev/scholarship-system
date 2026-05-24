"use client"

import Navigation from "@/components/Navigation"
import { useParams } from "next/navigation"
import { applicationsData } from "@/data/scholarships"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ApplicationDetail() {
  const params = useParams()
  const id = Number(params.id)
  const app = applicationsData.find((a) => a.id === id)

  if (!app) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">Application not found.</CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Application Detail</h1>
          <Link href="/dashboard/applications">
            <Button variant="ghost">Back</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{app.scholarshipName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm">Student: {app.studentName}</p>
                <p className="text-sm">School: {app.school}</p>
                <p className="text-sm">Course: {app.course}</p>
                <p className="text-sm">Year Level: {app.yearLevel}</p>
              </div>
              <div>
                <p className="text-sm">Status: {app.status}</p>
                <p className="text-sm">Submitted Documents:</p>
                <ul className="list-disc list-inside">
                  {app.submittedDocuments?.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
