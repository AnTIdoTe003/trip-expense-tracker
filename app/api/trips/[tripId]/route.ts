import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

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

    const db = await getDatabase();
    const trip = await db.collection("trips").findOne({ _id: tripId });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Check if user is a member of this trip
    const isMember = trip.members.some((member: any) =>
      member.userId.equals(userId)
    );
    if (!isMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ trip });
  } catch (error) {
    console.error("Get trip error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
