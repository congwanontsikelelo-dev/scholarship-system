"use client"

import { ArrowLeft, Clock, Users, Calendar, MapPin, GraduationCap, Briefcase, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/Navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function WorkStudy() {
  const router = useRouter()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const programs = [
    {
      id: 1,
      title: "Library Assistant",
      department: "University Library",
      university: "University of Cape Town",
      description: "Assist librarians with shelving, cataloging, and providing student support at the main library.",
      hourlyRate: 85,
      deadline: "2025-07-31",
      hoursPerWeek: 10,
      slotsLeft: 3,
      totalSlots: 8,
      location: "Upper Campus, Main Library",
      requirements: ["Currently enrolled UCT student", "Good academic standing", "Available weekdays 9am-1pm"],
      type: "On-campus",
    },
    {
      id: 2,
      title: "IT Help Desk Support",
      department: "Information Technology Services",
      university: "University of the Witwatersrand",
      description: "Provide first-line technical support to students and staff, troubleshoot common IT issues, and manage service tickets.",
      hourlyRate: 95,
      deadline: "2025-08-15",
      hoursPerWeek: 15,
      slotsLeft: 2,
      totalSlots: 6,
      location: "Wits Science Stadium",
      requirements: ["Currently enrolled Wits student", "Basic IT knowledge", "Good communication skills"],
      type: "On-campus",
    },
    {
      id: 3,
      title: "Research Assistant - Engineering",
      department: "Faculty of Engineering",
      university: "Stellenbosch University",
      description: "Assist professors and postgraduates with lab experiments, data collection, literature reviews, and research documentation.",
      hourlyRate: 110,
      deadline: "2025-08-30",
      hoursPerWeek: 12,
      slotsLeft: 1,
      totalSlots: 4,
      location: "Stellenbosch Engineering Campus",
      requirements: ["Engineering student (2nd year+)", "Minimum 65% average", "Available afternoons"],
      type: "On-campus",
    },
    {
      id: 4,
      title: "Peer Tutor - Mathematics",
      department: "Student Academic Support",
      university: "University of Pretoria",
      description: "Provide one-on-one and group tutoring sessions for first and second year Mathematics students.",
      hourlyRate: 90,
      deadline: "2025-07-15",
      hoursPerWeek: 8,
      slotsLeft: 5,
      totalSlots: 10,
      location: "UP Student Centre",
      requirements: ["Mathematics major or strong math background", "Minimum 70% in math modules", "Patience and good communication"],
      type: "On-campus",
    },
    {
      id: 5,
      title: "Student Ambassador",
      department: "Marketing & Communications",
      university: "University of KwaZulu-Natal",
      description: "Represent the university at open days, career fairs, and school visits. Assist with campus tours and student queries.",
      hourlyRate: 80,
      deadline: "2025-09-01",
      hoursPerWeek: 6,
      slotsLeft: 4,
      totalSlots: 12,
      location: "Various UKZN Campuses",
      requirements: ["Currently enrolled UKZN student", "Outgoing personality", "Reliable transport"],
      type: "On-campus",
    },
    {
      id: 6,
      title: "Lab Assistant - Chemistry",
      department: "Chemistry Department",
      university: "Rhodes University",
      description: "Prepare lab materials, assist with equipment setup, maintain safety standards, and support undergraduate practical sessions.",
      hourlyRate: 100,
      deadline: "2025-08-20",
      hoursPerWeek: 10,
      slotsLeft: 2,
      totalSlots: 5,
      location: "Rhodes Science Complex",
      requirements: ["Chemistry or related major", "Lab safety training preferred", "Attention to detail"],
      type: "On-campus",
    },
  ].filter(p => {
    if (!p.deadline) return true
    const d = new Date(p.deadline)
    return d >= today
  })

  const handleApply = (programId: number) => {
    router.push(`/dashboard/apply/work-study/${programId}`)
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Navigation />

      <div className="flex-1 overflow-y-auto">
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
                <h1 className="text-3xl font-bold">Work-Study Programs</h1>
                <p className="text-muted-foreground">Earn income while gaining valuable work experience at your university</p>
              </div>

              <div className="mb-6">
                <Badge variant="secondary" className="mr-2">{programs.length} Active Programs</Badge>
                <Badge variant="outline">Updated {today.toLocaleDateString()}</Badge>
              </div>

              {/* Available Programs */}
              <div className="mb-8 space-y-6">
                {programs.map((program) => (
                  <Card key={program.id} className="hover-blend">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-xl">{program.title}</CardTitle>
                            <Badge variant="outline">{program.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{program.department}</p>
                          <div className="flex items-center space-x-1 text-sm text-primary">
                            <GraduationCap className="h-4 w-4" />
                            <span>{program.university}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-success">R{program.hourlyRate}/hr</p>
                        </div>
                      </div>
                      <p className="text-sm mt-3">{program.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Deadline</p>
                            <p className="text-xs font-medium">{program.deadline}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Hours/Week</p>
                            <p className="text-xs font-medium">{program.hoursPerWeek} hrs</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Slots Available</p>
                            <p className="text-xs font-medium">{program.slotsLeft} of {program.totalSlots}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{program.location}</span>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Requirements:</p>
                        <div className="flex flex-wrap gap-1">
                          {program.requirements.map((req, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{req}</Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => handleApply(program.id)}
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About Work-Study</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Work-Study programs allow you to earn income while studying, helping you cover tuition and living expenses.</p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <DollarSign className="h-4 w-4 mt-0.5 text-success" />
                      <span>Competitive hourly rates</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Clock className="h-4 w-4 mt-0.5 text-primary" />
                      <span>Flexible hours around your class schedule</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Briefcase className="h-4 w-4 mt-0.5 text-info" />
                      <span>Gain real workplace experience</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
