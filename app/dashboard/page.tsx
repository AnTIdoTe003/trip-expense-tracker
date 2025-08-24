"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Share2, LogOut } from "lucide-react"
import Link from "next/link"

interface Trip {
  _id: string
  name: string
  description?: string
  shareCode: string
  members: Array<{
    userId: string
    email: string
    name: string
    role: "admin" | "member"
  }>
  createdAt: string
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Create trip form
  const [tripName, setTripName] = useState("")
  const [tripDescription, setTripDescription] = useState("")
  const [createLoading, setCreateLoading] = useState(false)

  // Join trip form
  const [shareCode, setShareCode] = useState("")
  const [joinLoading, setJoinLoading] = useState(false)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trips", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setTrips(data.trips)
      }
    } catch (error) {
      console.error("Failed to fetch trips:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCreateLoading(true)

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: tripName,
          description: tripDescription,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create trip")
      }

      setSuccess("Trip created successfully!")
      setTripName("")
      setTripDescription("")
      setCreateDialogOpen(false)
      fetchTrips()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create trip")
    } finally {
      setCreateLoading(false)
    }
  }

  const handleJoinTrip = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setJoinLoading(true)

    try {
      const response = await fetch("/api/trips/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ shareCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to join trip")
      }

      setSuccess("Successfully joined trip!")
      setShareCode("")
      setJoinDialogOpen(false)
      fetchTrips()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join trip")
    } finally {
      setJoinLoading(false)
    }
  }

  const copyShareCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setSuccess("Share code copied to clipboard!")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading your trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold">Trip Expense Tracker</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Create New Trip</DialogTitle>
                <DialogDescription>Create a new trip to start tracking expenses with your group.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTrip} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tripName">Trip Name</Label>
                  <Input
                    id="tripName"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    placeholder="e.g., Weekend in Paris"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tripDescription">Description (Optional)</Label>
                  <Textarea
                    id="tripDescription"
                    value={tripDescription}
                    onChange={(e) => setTripDescription(e.target.value)}
                    placeholder="Brief description of your trip..."
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createLoading}>
                  {createLoading ? "Creating..." : "Create Trip"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Join Trip
              </Button>
            </DialogTrigger>
            <DialogContent  className="bg-white">
              <DialogHeader>
                <DialogTitle>Join Existing Trip</DialogTitle>
                <DialogDescription>Enter the share code provided by the trip organizer.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleJoinTrip} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shareCode">Share Code</Label>
                  <Input
                    id="shareCode"
                    value={shareCode}
                    onChange={(e) => setShareCode(e.target.value)}
                    placeholder="Enter share code"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={joinLoading}>
                  {joinLoading ? "Joining..." : "Join Trip"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No trips yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first trip or join an existing one to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card key={trip._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{trip.name}</CardTitle>
                      {trip.description && <CardDescription className="mt-1">{trip.description}</CardDescription>}
                    </div>
                    <Badge
                      variant={
                        trip.members.find((m) => m.userId === user?.id)?.role === "admin" ? "default" : "secondary"
                      }
                    >
                      {trip.members.find((m) => m.userId === user?.id)?.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      {trip.members.length} member{trip.members.length !== 1 ? "s" : ""}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Share Code:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyShareCode(trip.shareCode)}
                        className="h-auto p-1"
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        {trip.shareCode}
                      </Button>
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/trips/${trip._id}`}>View Trip</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
