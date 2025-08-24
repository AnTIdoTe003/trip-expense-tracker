import { getDatabase } from "./mongodb"
import type { User, UserWithoutPassword } from "./models/user"
import type { Trip, TripMember } from "./models/trip"
import type { Expense } from "./models/expense"
import type { ObjectId } from "mongodb"
import { hashPassword } from "./auth"

export class DatabaseService {
  static async createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<UserWithoutPassword> {
    const db = await getDatabase()
    const hashedPassword = await hashPassword(userData.password)

    const user: Omit<User, "_id"> = {
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(user)
    const { password, ...userWithoutPassword } = { ...user, _id: result.insertedId }
    return userWithoutPassword
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const db = await getDatabase()
    return db.collection<User>("users").findOne({ email })
  }

  static async createTrip(tripData: Omit<Trip, "_id" | "createdAt" | "updatedAt" | "shareCode">): Promise<Trip> {
    const db = await getDatabase()
    const shareCode = Math.random().toString(36).substring(2, 15)

    const trip: Omit<Trip, "_id"> = {
      ...tripData,
      shareCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("trips").insertOne(trip)
    return { ...trip, _id: result.insertedId }
  }

  static async findTripByShareCode(shareCode: string): Promise<Trip | null> {
    const db = await getDatabase()
    return db.collection<Trip>("trips").findOne({ shareCode })
  }

  static async addTripMember(tripId: ObjectId, member: TripMember): Promise<void> {
    const db = await getDatabase()
    await db.collection("trips").updateOne(
      { _id: tripId },
      {
        $push: { members: member },
        $set: { updatedAt: new Date() },
      },
    )
  }

  static async getUserTrips(userId: ObjectId): Promise<Trip[]> {
    const db = await getDatabase()
    return db
      .collection<Trip>("trips")
      .find({
        $or: [{ createdBy: userId }, { "members.userId": userId }],
      })
      .toArray()
  }

  static async createExpense(expenseData: Omit<Expense, "_id" | "createdAt" | "updatedAt">): Promise<Expense> {
    const db = await getDatabase()

    const expense: Omit<Expense, "_id"> = {
      ...expenseData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("expenses").insertOne(expense)
    return { ...expense, _id: result.insertedId }
  }

  static async getTripExpenses(tripId: ObjectId): Promise<Expense[]> {
    const db = await getDatabase()
    return db.collection<Expense>("expenses").find({ tripId }).toArray()
  }

  static async getDatabase() {
    return getDatabase()
  }
}
