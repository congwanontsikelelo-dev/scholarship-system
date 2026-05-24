"use client"

import { GraduationCap, Menu, X, Bell, User, Home, BookOpen, Briefcase, ClipboardList, Calendar, FileText, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="border-b border-border bg-background w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden sm:inline">SFAPS Portal</span>
            <span className="font-bold text-lg sm:hidden">SFAPS</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link href="/dashboard"><Button variant="ghost"><Home className="h-4 w-4 mr-2" />Dashboard</Button></Link>
            <Link href="/dashboard/scholarships"><Button variant="ghost"><BookOpen className="h-4 w-4 mr-2" />Scholarships</Button></Link>
            <Link href="/dashboard/work-study"><Button variant="ghost"><Briefcase className="h-4 w-4 mr-2" />Work-Study</Button></Link>
            <Link href="/dashboard/applications"><Button variant="ghost"><ClipboardList className="h-4 w-4 mr-2" />Applications</Button></Link>
            <Link href="/dashboard/deadlines"><Button variant="ghost"><Calendar className="h-4 w-4 mr-2" />Deadlines</Button></Link>
            <Link href="/dashboard/documents"><Button variant="ghost"><FileText className="h-4 w-4 mr-2" />Documents</Button></Link>
            <Link href="/dashboard/payment-plans"><Button variant="ghost"><CreditCard className="h-4 w-4 mr-2" />Payments</Button></Link>
            <Link href="/dashboard/notifications"><Button variant="ghost"><Bell className="h-4 w-4 mr-2" />Alerts</Button></Link>
            <Link href="/dashboard/manage-account"><Button variant="ghost"><User className="h-4 w-4 mr-2" />Account</Button></Link>
            <Link href="/auth/signin"><Button variant="outline">Sign Out</Button></Link>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {['Dashboard','Scholarships','Work-Study','Applications','Deadlines','Documents','Payments','Alerts','Account'].map((item) => (
              <Link key={item} href={`/dashboard/${item.toLowerCase().replace(' ', '-')}`} className="block">
                <Button variant="ghost" className="w-full justify-start">{item}</Button>
              </Link>
            ))}
            <Link href="/auth/signin" className="block"><Button variant="outline" className="w-full justify-start bg-transparent">Sign Out</Button></Link>
          </div>
        )}
      </div>
    </nav>
  )
}
