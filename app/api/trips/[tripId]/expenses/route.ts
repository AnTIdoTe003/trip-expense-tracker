import { type NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { z } from "zod";

const createExpenseSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().transform((str) => new Date(str)),
  splitWith: z.array(z.string()).min(1, "Must split with at least one person"),
  splitType: z.enum(["equal", "custom"]),
  customSplits: z.record(z.number()).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    const userId = new ObjectId(decoded.userId);
    const tripId = new ObjectId(params.tripId);

    // Verify user is member of trip
    const db = await DatabaseService.getDatabase();
    const trip = await db.collection("trips").findOne({ _id: tripId });
    if (
      !trip ||
      !trip.members.some((member: any) => member.userId.equals(userId))
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const expenses = await DatabaseService.getTripExpenses(tripId);
    return NextResponse.json({ expenses });
  } catch (error) {
    console.error("Get expenses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    const userId = new ObjectId(decoded.userId);
    const tripId = new ObjectId(params.tripId);

    // Verify user is member of trip
    const db = await DatabaseService.getDatabase();
    const trip = await db.collection("trips").findOne({ _id: tripId });
    if (
      !trip ||
      !trip.members.some((member: any) => member.userId.equals(userId))
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const {
      amount,
      description,
      category,
      date,
      splitWith,
      splitType,
      customSplits,
    } = createExpenseSchema.parse(body);

    // Calculate splits
    let splits;
    if (splitType === "equal") {
      const splitAmount = amount / splitWith.length;
      splits = splitWith.map((memberId) => ({
        userId: new ObjectId(memberId),
        amount: splitAmount,
        settled: false,
      }));
    } else {
      // Custom splits
      splits = splitWith.map((memberId) => ({
        userId: new ObjectId(memberId),
        amount: customSplits?.[memberId] || 0,
        settled: false,
      }));
    }

    const expense = await DatabaseService.createExpense({
      tripId,
      paidBy: userId,
      amount,
      description,
      category,
      date,
      splits,
    });

    return NextResponse.json({ expense });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Create expense error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
