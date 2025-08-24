import { type NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { z } from "zod";

const joinTripSchema = z.object({
  shareCode: z.string().min(1, "Share code is required"),
});

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { shareCode } = joinTripSchema.parse(body);

    const trip = await DatabaseService.findTripByShareCode(shareCode);
    if (!trip) {
      return NextResponse.json(
        { error: "Invalid share code" },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const isAlreadyMember = trip.members.some((member) =>
      member.userId.equals(userId)
    );
    if (isAlreadyMember) {
      return NextResponse.json(
        { error: "You are already a member of this trip" },
        { status: 400 }
      );
    }

    // Add user to trip
    await DatabaseService.addTripMember(trip._id!, {
      userId,
      email: decoded.email,
      name: decoded.name,
      joinedAt: new Date(),
      role: "member",
    });

    return NextResponse.json({ message: "Successfully joined trip", trip });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Join trip error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
