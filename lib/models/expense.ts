import type { ObjectId } from "mongodb"

export interface Expense {
  _id?: ObjectId
  tripId: ObjectId
  paidBy: ObjectId
  amount: number
  description: string
  category: string
  date: Date
  splits: ExpenseSplit[]
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseSplit {
  userId: ObjectId
  amount: number
  settled: boolean
}
