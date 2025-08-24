"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
}

export function ExpenseList({ expenses, members, currentUserId }: ExpenseListProps) {
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

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">No expenses added yet</p>
        </CardContent>
      </Card>
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
              <div className="text-right">
                <div className="text-2xl font-bold">₹{expense.amount.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">You owe: ₹{getUserSplit(expense).toFixed(2)}</div>
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
