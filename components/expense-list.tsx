"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { EditExpenseForm } from "./edit-expense-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

interface Member {
  userId: string
  name: string
  email: string
}

interface ExpenseListProps {
  expenses: Expense[]
  members: Member[]
  currentUserId: string
  tripId: string
  onExpenseUpdate: () => void
}

export function ExpenseList({ expenses, members, currentUserId, tripId, onExpenseUpdate }: ExpenseListProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [, setDeletingExpense] = useState<string | null>(null)
  const getMemberName = (userId: string) => {
    const member = members.find((m) => m.userId === userId)
    return member?.name || "Unknown"
  }

  const getMemberInitials = (userId: string) => {
    const name = getMemberName(userId)
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getUserSplit = (expense: Expense) => {
    const split = expense.splits.find((s) => s.userId === currentUserId)
    return split?.amount || 0
  }

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const response = await fetch(`/api/trips/${tripId}/expenses/${expenseId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        onExpenseUpdate()
      } else {
        const data = await response.json()
        console.error("Failed to delete expense:", data.error)
      }
    } catch (error) {
      console.error("Failed to delete expense:", error)
    } finally {
      setDeletingExpense(null)
    }
  }

  const handleEditSuccess = () => {
    setEditingExpense(null)
    onExpenseUpdate()
  }

  const canEditExpense = (expense: Expense) => {
    return expense.paidBy === currentUserId
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">No expenses added yet</p>
        </CardContent>
      </Card>
    )
  }

  if (editingExpense) {
    return (
      <EditExpenseForm
        tripId={tripId}
        expense={editingExpense}
        members={members}
        onSuccess={handleEditSuccess}
        onCancel={() => setEditingExpense(null)}
      />
    )
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <Card key={expense._id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{expense.description}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{expense.category}</Badge>
                  <span className="text-sm text-muted-foreground">{formatDate(expense.date)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-2xl font-bold">₹{expense.amount.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">You owe: ₹{getUserSplit(expense).toFixed(2)}</div>
                </div>
                {canEditExpense(expense) && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingExpense(expense)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{expense.description}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteExpense(expense._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Paid by:</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{getMemberInitials(expense.paidBy)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{getMemberName(expense.paidBy)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">Split between:</span>
                <div className="flex -space-x-1">
                  {expense.splits.map((split) => (
                    <Avatar key={split.userId} className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs">{getMemberInitials(split.userId)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
