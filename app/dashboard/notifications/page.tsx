"use client"

import { ArrowLeft, CheckCircle, Clock, Bell, Inbox } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Navigation from "@/components/Navigation"

const Notifications = () => {
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
        const userEmail = localStorage.getItem('userEmail')
        let persisted: any[] = []

        if (userEmail) {
          const { getUserItem } = require('@/lib/userStorage') as any
          const raw = getUserItem(userEmail, 'notifications')
          if (raw) persisted = JSON.parse(raw)
        }

        if (!persisted || persisted.length === 0) {
          const raw = localStorage.getItem("notifications")
          persisted = raw ? JSON.parse(raw) : []
        }

        if (Array.isArray(persisted)) {
          // Only keep account creation and application-related notifications
          const filtered = persisted.filter((n: any) => {
            if (!n) return false
            // Keep account created
            if (String(n.id).startsWith('signup-') || n.title === 'Account Created') return true
            // Keep application submissions
            if (n.title?.includes('Application Submitted') || n.title?.includes('Application') || n.applicationId) return true
            // Keep payment plan notifications
            if (n.title?.includes('Payment Plan')) return true
            // Keep deadline reminders
            if (n.title?.includes('Deadline')) return true
            // Keep approval/rejection feedback
            if (n.title?.includes('Approved') || n.title?.includes('Rejected') || n.title?.includes('Review')) return true
            return false
          })

          const normalized = filtered.map((n: any) => {
            try {
              if (!n || typeof n !== 'object') return n
              if (typeof n.timestamp === 'number' && !Number.isNaN(n.timestamp)) return n
              if (typeof n.id === 'string') {
                const parts = n.id.split('-')
                const last = parts[parts.length - 1]
                const asNum = Number(last)
                if (!Number.isNaN(asNum) && asNum > 0) return { ...n, timestamp: asNum }
              }
              return { ...n, timestamp: Date.now() }
            } catch (e) { return n }
          })

          setNotifications(normalized)
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
      if (key === "notifications" || key === "applications" || key === "documents") {
        load()
      }
    }

    const storageHandler = (e: StorageEvent) => {
      if (!e) return
      const key = e.key
      if (!key) return
      if (key === "notifications" || key === "applications" || key === "documents") load()
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
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      const { setUserItem } = require('@/lib/userStorage') as any
      setUserItem(userEmail, 'notifications', JSON.stringify([]))
    }
    localStorage.setItem("notifications", JSON.stringify([]))
    setNotifications([])
    window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } }))
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Navigation />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">Notifications</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-muted-foreground">Stay updated with your applications and account</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
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

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Inbox className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No notifications yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Notifications will appear here when you apply for scholarships or receive updates</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => {
                const IconComponent = notification.title?.includes('Account') ? CheckCircle :
                  notification.title?.includes('Deadline') ? Clock : CheckCircle
                const iconColor = notification.title?.includes('Account') ? 'text-success' :
                  notification.title?.includes('Deadline') ? 'text-warning' : 'text-primary'

                return (
                  <Card key={notification.id} className="hover-blend">
                    <CardContent className="flex items-start space-x-4 p-6">
                      <IconComponent className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
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
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications
