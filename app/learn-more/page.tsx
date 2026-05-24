"use client"

import { ArrowLeft, GraduationCap, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LearnMore() {
  const features = [
    {
      icon: GraduationCap,
      title: "Scholarship and Bursaries Opportunities",
      description:
        "Discover a wide range of scholarships and bursaries tailored to your academic achievements, interests, and financial needs. Our platform simplifies the application process.",
      color: "text-primary",
    },
    {
      icon: Briefcase,
      title: "Work-Study Programs",
      description:
        "Gain valuable work experience and earn income or tuition credits through flexible on-campus work-study programs.",
      color: "text-success",
    },
    {
      icon: Briefcase,
      title: "Alternative Payment Solutions",
      description:
        "Explore innovative ways to manage your tuition and fees, including micro-loans and flexible installment plans designed for students.",
      color: "text-purple",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Student Financial & Alternative Payment System</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Learn More About Our System</h1>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-card rounded-lg p-8 text-center shadow-sm">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join our platform today and take the first step towards securing your financial future in education.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">Sign Up Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
