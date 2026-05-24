"use client"

import { ArrowLeft, Calendar, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/Navigation"
import Link from "next/link"
import { scholarshipsData } from "@/data/scholarships"

const Deadlines = () => {
  const today = new Date()

  const upcomingDeadlines = scholarshipsData
    .map((scholarship) => ({
      ...scholarship,
      deadlineDate: new Date(scholarship.deadline),
    }))
    .filter((scholarship) => scholarship.deadlineDate > today)
    .sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime())

  const getDaysUntilDeadline = (deadline: Date) => {
    const diff = deadline.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 7) return "text-destructive"
    if (daysLeft <= 14) return "text-warning"
    return "text-success"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Upcoming Deadlines</h1>
            <p className="text-muted-foreground">Important dates for scholarship and bursary applications</p>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {upcomingDeadlines.map((scholarship) => {
            const daysLeft = getDaysUntilDeadline(scholarship.deadlineDate)
            return (
              <Card key={scholarship.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">{scholarship.name}</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">{scholarship.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Application Closes</p>
                          <p className="text-sm text-muted-foreground">{scholarship.deadline}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Time Remaining</p>
                          <p className={`text-sm font-semibold ${getUrgencyColor(daysLeft)}`}>
                            {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Amount</p>
                          <p className="text-sm font-semibold text-success">{scholarship.amount}</p>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">Eligibility:</p>
                        <p className="text-sm text-muted-foreground">{scholarship.eligibility}</p>
                      </div>

                      {daysLeft <= 7 && (
                        <div className="mt-4 flex items-center space-x-2 text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Urgent: Deadline approaching soon!</span>
                        </div>
                      )}
                    </div>
                    <Link href={`/dashboard/scholarships/${scholarship.id}`}>
                      <Button size="sm" className="ml-4">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {upcomingDeadlines.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Upcoming Deadlines</h3>
                <p className="text-muted-foreground">All current application periods have closed.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Deadlines
