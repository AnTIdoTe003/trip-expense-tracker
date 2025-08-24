"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Member {
  userId: string
  name: string
  email: string
}

interface ExpenseFormProps {
  tripId: string
  members: Member[]
  onSuccess: () => void
  onCancel: () => void
}

const expenseCategories = [
  "Food & Dining",
  "Transportation",
  "Accommodation",
  "Entertainment",
  "Shopping",
  "Activities",
  "Other",
]

export function ExpenseForm({ tripId, members, onSuccess, onCancel }: ExpenseFormProps) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [splitWith, setSplitWith] = useState<string[]>([])
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal")
  const [customSplits, setCustomSplits] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleMemberToggle = (memberId: string, checked: boolean) => {
    if (checked) {
      setSplitWith([...splitWith, memberId])
      if (splitType === "custom") {
        setCustomSplits({ ...customSplits, [memberId]: 0 })
      }
    } else {
      setSplitWith(splitWith.filter((id) => id !== memberId))
      if (splitType === "custom") {
        const newCustomSplits = { ...customSplits }
        delete newCustomSplits[memberId]
        setCustomSplits(newCustomSplits)
      }
    }
  }

  const handleCustomSplitChange = (memberId: string, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    setCustomSplits({ ...customSplits, [memberId]: numValue })
  }

  const getTotalCustomSplit = () => {
    return Object.values(customSplits).reduce((sum, amount) => sum + amount, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const numAmount = Number.parseFloat(amount)
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error("Please enter a valid amount")
      }

      if (splitWith.length === 0) {
        throw new Error("Please select at least one person to split with")
      }

      if (splitType === "custom") {
        const totalCustom = getTotalCustomSplit()
        if (Math.abs(totalCustom - numAmount) > 0.01) {
          throw new Error(`Custom splits must add up to $${numAmount.toFixed(2)}`)
        }
      }

      const response = await fetch(`/api/trips/${tripId}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: numAmount,
          description,
          category,
          date,
          splitWith,
          splitType,
          customSplits: splitType === "custom" ? customSplits : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create expense")
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create expense")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this expense for?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Split with</Label>
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.userId} className="flex items-center space-x-2">
                  <Checkbox
                    id={member.userId}
                    checked={splitWith.includes(member.userId)}
                    onCheckedChange={(checked) => handleMemberToggle(member.userId, checked as boolean)}
                  />
                  <Label htmlFor={member.userId} className="flex-1">
                    {member.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {splitWith.length > 0 && (
            <div className="space-y-4">
              <Label>Split Type</Label>
              <RadioGroup value={splitType} onValueChange={(value) => setSplitType(value as "equal" | "custom")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="equal" id="equal" />
                  <Label htmlFor="equal">Split equally</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom amounts</Label>
                </div>
              </RadioGroup>

              {splitType === "equal" && (
                <div className="text-sm text-muted-foreground">
                  Each person will pay: ${amount ? (Number.parseFloat(amount) / splitWith.length).toFixed(2) : "0.00"}
                </div>
              )}

              {splitType === "custom" && (
                <div className="space-y-2">
                  <Label>Custom amounts</Label>
                  {splitWith.map((memberId) => {
                    const member = members.find((m) => m.userId === memberId)
                    return (
                      <div key={memberId} className="flex items-center space-x-2">
                        <Label className="w-24 text-sm">{member?.name}:</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={customSplits[memberId] || ""}
                          onChange={(e) => handleCustomSplitChange(memberId, e.target.value)}
                          placeholder="0.00"
                          className="w-24"
                        />
                      </div>
                    )
                  })}
                  <div className="text-sm text-muted-foreground">
                    Total: ${getTotalCustomSplit().toFixed(2)} / ${amount || "0.00"}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Expense"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
