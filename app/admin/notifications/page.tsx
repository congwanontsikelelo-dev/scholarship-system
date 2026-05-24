"use client"

import { ArrowLeft, Inbox, FileText, CheckCircle, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import AdminNavigation from "@/components/AdminNavigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([])
  const [, setTick] = useState(0)

  const formatRelativeTime = (input: any) => {
    let ts: number | null = null
    if (typeof input === "number") ts = input
    else if (typeof input === "string") {
      const asNum = Number(input)
      if (!Number.isNaN(asNum)) ts = asNum
      else {
        const parsed = Date.parse(input)
        if (!Number.isNaN(parsed)) ts = parsed
      }
    } else if (input instanceof Date) ts = input.getTime()

    if (!ts && typeof input === "object" && input !== null) {
      if (typeof input.timestamp === "number") ts = input.timestamp
      else if (typeof input.createdAt === "number") ts = input.createdAt
      else if (typeof input.timestamp === "string") {
        const n = Number(input.timestamp)
        if (!Number.isNaN(n)) ts = n
        else {
          const p = Date.parse(input.timestamp)
          if (!Number.isNaN(p)) ts = p
        }
      }
    }

    if (!ts) {
      if (input && typeof input === "object" && typeof input.time === "string") return input.time
      if (typeof input === "string") return input
      return "just now"
    }

    const diff = Date.now() - ts
    const sec = Math.floor(diff / 1000)
    if (sec < 60) return `${sec}s`
    const min = Math.floor(sec / 60)
    if (min < 60) return `${min}m`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr}h`
    const days = Math.floor(hr / 24)
    if (days < 7) return `${days}d`
    const d = new Date(ts)
    return d.toLocaleDateString()
  }

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("notifications")
        const persisted = raw ? JSON.parse(raw) : []
        // Admin notifications should be about:
        // 1. Receiving applications from students
        // 2. Admin approving or rejecting applications
        if (Array.isArray(persisted) && persisted.length > 0) {
          const filtered = persisted.filter((n: any) => {
            if (!n) return false
            // Application submissions from students
            if (n.title?.includes('Application Submitted') && n.message?.includes('submitted')) return true
            // Admin actions (approve/reject)
            if (n.title?.includes('Application Approved') || n.title?.includes('Application Rejected')) return true
            // System notifications about applications
            if (n.source === 'system' && n.applicationId) return true
            return false
          })
          setNotifications(filtered)
        } else {
          setNotifications([])
        }
      } catch (err) {
        setNotifications([])
      }
    }

    load()

    const handler = (e: any) => {
      const key = e?.detail?.key
      if (!key) return
      if (key === "notifications" || key === "applications") {
        load()
      }
    }

    const storageHandler = (e: StorageEvent) => {
      if (!e) return
      const key = e.key
      if (!key) return
      if (key === "notifications" || key === "applications") load()
    }

    window.addEventListener("localStorageUpdated", handler)
    window.addEventListener("storage", storageHandler)
    return () => {
      window.removeEventListener("localStorageUpdated", handler)
      window.removeEventListener("storage", storageHandler)
    }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60 * 1000)
    return () => clearInterval(id)
  }, [])

  const clearAll = () => {
    localStorage.setItem('notifications', JSON.stringify([]))
    setNotifications([])
    window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
  }

  const getIcon = (title: string) => {
    if (title?.includes('Approved')) return <CheckCircle className="h-5 w-5 text-success" />
    if (title?.includes('Rejected')) return <XCircle className="h-5 w-5 text-destructive" />
    return <FileText className="h-5 w-5 text-primary" />
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <AdminNavigation />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-2 mb-6">
            <Link href="/admin/dashboard" className="text-muted-foreground hover:text-foreground">
              Admin
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">Notifications</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">Application submissions and admin actions</p>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive">
                  Clear all
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Inbox className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No admin notifications yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Notifications will appear when students submit applications or when you approve/reject them</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className="hover-blend">
                  <CardContent className="flex items-start space-x-4 p-6">
                    {getIcon(notification.title)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{notification.title}</h3>
                          <p className="text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                        <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                          {formatRelativeTime(notification.timestamp ?? notification.createdAt ?? notification.time ?? notification)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminNotificationsPage
