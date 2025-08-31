import { type NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { z } from "zod";

const updateExpenseSchema = z.object({
  amount: z.number().positive("Amount must be positive").optional(),
  description: z.string().min(1, "Description is required").optional(),
  category: z.string().min(1, "Category is required").optional(),
  date: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  splitWith: z
    .array(z.string())
    .min(1, "Must split with at least one person")
    .optional(),
  splitType: z.enum(["equal", "custom"]).optional(),
  customSplits: z.record(z.number()).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { tripId: string; expenseId: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    let userId: ObjectId;
    if (typeof decoded.userId === "string") {
      userId = new ObjectId(decoded.userId);
    } else if (decoded.userId?.buffer) {
      userId = new ObjectId(Buffer.from(Object.values(decoded.userId.buffer)));
    } else {
      throw new Error("Invalid userId in token");
    }

    const tripId = new ObjectId(params.tripId);
    const expenseId = new ObjectId(params.expenseId);

    // Verify user is member of trip and can edit this expense
    const db = await DatabaseService.getDatabase();
    const trip = await db.collection("trips").findOne({ _id: tripId });
    if (
      !trip ||
      !trip.members.some((member: any) => member.userId.equals(userId))
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if expense exists and user can edit it (only the person who paid can edit)
    const expense = await db.collection("expenses").findOne({
      _id: expenseId,
      tripId: tripId,
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    if (!expense.paidBy.equals(userId)) {
      return NextResponse.json(
        { error: "You can only edit expenses you paid for" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updateData = updateExpenseSchema.parse(body);

    // If splits are being updated, recalculate them
    let splits = expense.splits;
    if (updateData.splitWith && updateData.amount) {
      if (updateData.splitType === "equal") {
        const splitAmount = updateData.amount / updateData.splitWith.length;
        splits = updateData.splitWith.map((memberId) => ({
          userId: new ObjectId(memberId),
          amount: splitAmount,
          settled: false,
        }));
      } else if (updateData.customSplits) {
        splits = updateData.splitWith.map((memberId) => ({
          userId: new ObjectId(memberId),
          amount: updateData.customSplits?.[memberId] || 0,
          settled: false,
        }));
      }
    }

    const updatedExpense = await db.collection("expenses").findOneAndUpdate(
      { _id: expenseId },
      {
        $set: {
          ...(updateData.amount && { amount: updateData.amount }),
          ...(updateData.description && {
            description: updateData.description,
          }),
          ...(updateData.category && { category: updateData.category }),
          ...(updateData.date && { date: updateData.date }),
          ...(updateData.splitWith && { splits }),
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    return NextResponse.json({ expense: updatedExpense.value });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Update expense error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tripId: string; expenseId: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    let userId: ObjectId;
    if (typeof decoded.userId === "string") {
      userId = new ObjectId(decoded.userId);
    } else if (decoded.userId?.buffer) {
      userId = new ObjectId(Buffer.from(Object.values(decoded.userId.buffer)));
    } else {
      throw new Error("Invalid userId in token");
    }

    const tripId = new ObjectId(params.tripId);
    const expenseId = new ObjectId(params.expenseId);

    // Verify user is member of trip
    const db = await DatabaseService.getDatabase();
    const trip = await db.collection("trips").findOne({ _id: tripId });
    if (
      !trip ||
      !trip.members.some((member: any) => member.userId.equals(userId))
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if expense exists and user can delete it (only the person who paid can delete)
    const expense = await db.collection("expenses").findOne({
      _id: expenseId,
      tripId: tripId,
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    if (!expense.paidBy.equals(userId)) {
      return NextResponse.json(
        { error: "You can only delete expenses you paid for" },
        { status: 403 }
      );
    }

    await db.collection("expenses").deleteOne({ _id: expenseId });

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
