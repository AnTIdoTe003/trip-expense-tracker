"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Users, Share2, Plus } from "lucide-react"
import Link from "next/link"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import { ExpenseSummary } from "@/components/expense-summary"

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
    joinedAt: string
  }>
  createdAt: string
}

interface Expense {
  _id: string
  amount: number
  description: string
  category: string
  date: string
  paidBy: string
  splits: Array<{
    userId: string
    amount: number
    settled: boolean
  }>
}

export default function TripDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showExpenseForm, setShowExpenseForm] = useState(false)

  useEffect(() => {
    if (params.tripId) {
      fetchTrip()
      fetchExpenses()
    }
  }, [params.tripId])

  const fetchTrip = async () => {
    try {
      const response = await fetch(`/api/trips/${params.tripId}`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setTrip(data.trip)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to load trip")
      }
    } catch (error) {
      setError("Failed to load trip")
    } finally {
      setLoading(false)
    }
  }

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`/api/trips/${params.tripId}/expenses`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setExpenses(data.expenses)
      }
    } catch (error) {
      console.error("Failed to fetch expenses:", error)
    }
  }

  const copyShareCode = () => {
    if (trip) {
      navigator.clipboard.writeText(trip.shareCode)
      setSuccess("Share code copied to clipboard!")
    }
  }

  const handleExpenseSuccess = () => {
    setShowExpenseForm(false)
    setSuccess("Expense added successfully!")
    fetchExpenses()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading trip details...</p>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-2xl">
          <Alert variant="destructive">
            <AlertDescription>{error || "Trip not found"}</AlertDescription>
          </Alert>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const currentUserMember = trip.members.find((m) => m.userId === user?.id)
  const isAdmin = currentUserMember?.role === "admin"

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const userOwes = expenses.reduce((sum, expense) => {
    const userSplit = expense.splits.find((s) => s.userId === user?.id)
    return sum + (userSplit?.amount || 0)
  }, 0)
  const userPaid = expenses
    .filter((expense) => expense.paidBy === user?.id)
    .reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Alerts */}
        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Trip Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-serif font-bold">{trip.name}</h1>
              {trip.description && <p className="text-muted-foreground mt-2">{trip.description}</p>}
            </div>
            <Badge variant={isAdmin ? "default" : "secondary"}>{currentUserMember?.role}</Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={copyShareCode} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Code: {trip.shareCode}
            </Button>
            <Button onClick={() => setShowExpenseForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">You Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{userPaid.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">You Owe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">₹{userOwes.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {showExpenseForm && (
          <div className="mb-8">
            <ExpenseForm
              tripId={params.tripId as string}
              members={trip.members}
              onSuccess={handleExpenseSuccess}
              onCancel={() => setShowExpenseForm(false)}
            />
          </div>
        )}

        {expenses.length > 0 && (
          <div className="mb-8">
            <ExpenseSummary tripId={params.tripId as string} tripName={trip.name} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Members ({trip.members.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trip.members.map((member) => (
                  <div key={member.userId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge variant={member.role === "admin" ? "default" : "secondary"} className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Expenses ({expenses.length})</CardTitle>
                <CardDescription>Track and manage trip expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseList
                  expenses={expenses}
                  members={trip.members}
                  currentUserId={user?.id || ""}
                  tripId={params.tripId as string}
                  onExpenseUpdate={fetchExpenses}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
