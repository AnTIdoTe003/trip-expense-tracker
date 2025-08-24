import type { ObjectId } from "mongodb"

export interface Trip {
  _id?: ObjectId
  name: string
  description?: string
  createdBy: ObjectId
  shareCode: string
  members: TripMember[]
  createdAt: Date
  updatedAt: Date
}

export interface TripMember {
  userId: ObjectId
  email: string
  name: string
  joinedAt: Date
  role: "admin" | "member"
}
