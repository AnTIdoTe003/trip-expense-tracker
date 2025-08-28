import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { DatabaseService } from "@/lib/database";
import { ObjectId } from "mongodb";
import {
  formatForWhatsApp,
  truncateForWhatsApp,
} from "@/lib/whatsapp-formatter";

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
    let userId: ObjectId;
    if (typeof decoded.userId === "string") {
      userId = new ObjectId(decoded.userId);
    } else if (decoded.userId?.buffer) {
      userId = new ObjectId(Buffer.from(Object.values(decoded.userId.buffer)));
    } else {
      throw new Error("Invalid userId in token");
    }

    const tripId = new ObjectId(params.tripId);
    const { summary } = await request.json();

    if (!summary) {
      return NextResponse.json(
        { error: "Summary is required" },
        { status: 400 }
      );
    }

    // Verify user is member of trip
    const db = await DatabaseService.getDatabase();
    const trip = await db.collection("trips").findOne({ _id: tripId });
    if (
      !trip ||
      !trip.members.some((member: any) => member.userId.equals(userId))
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Format the summary for WhatsApp
    let formattedMessage = formatForWhatsApp(summary, trip.name);

    // Truncate if too long for WhatsApp
    formattedMessage = truncateForWhatsApp(formattedMessage);

    // Create WhatsApp share URL
    const encodedMessage = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    return NextResponse.json({
      whatsappUrl,
      message: formattedMessage,
      success: true,
    });
  } catch (error) {
    console.error("WhatsApp share error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
