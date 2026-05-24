"use client"

import { useState } from "react"
import { Menu, X, BookOpen, Briefcase, FileText, LayoutDashboard, Bell, User, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { useState } from "react"
import { Menu, X, BookOpen, Briefcase, FileText, LayoutDashboard, Bell, User, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const AdminNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg hidden sm:inline">SFAPS Admin</span>
              <span className="font-semibold text-lg sm:hidden">SFAPS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="flex items-center space-x-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link href="/admin/scholarships">
              <Button variant="ghost" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Scholarships</span>
              </Button>
            </Link>
            <Link href="/admin/work-study">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4" />
                <span>Work-Study</span>
              </Button>
            </Link>
            <Link href="/admin/applications">
              <Button variant="ghost" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Applications</span>
              </Button>
            </Link>
            <Link href="/admin/profile">
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/scholarships">
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Scholarships
              </Button>
            </Link>
            <Link href="/admin/work-study">
              <Button variant="ghost" className="w-full justify-start">
                <Briefcase className="h-4 w-4 mr-2" />
                Work-Study
              </Button>
            </Link>
            <Link href="/admin/applications">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Applications
              </Button>
            </Link>
            <Link href="/admin/profile">
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Logout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default AdminNavigation
