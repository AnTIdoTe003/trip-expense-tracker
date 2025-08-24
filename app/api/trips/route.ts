import { type NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { z } from "zod";

const createTripSchema = z.object({
  name: z.string().min(1, "Trip name is required"),
  description: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    // handle both string and buffer formats
    let userId: ObjectId;
    if (typeof decoded.userId === "string") {
      userId = new ObjectId(decoded.userId);
    } else if (decoded.userId?.buffer) {
      userId = new ObjectId(Buffer.from(Object.values(decoded.userId.buffer)));
    } else {
      throw new Error("Invalid userId in token");
    }

    const trips = await DatabaseService.getUserTrips(userId);

    return NextResponse.json({ trips });
  } catch (error) {
    console.error("Get trips error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    const userId = new ObjectId(decoded.userId);

    const body = await request.json();
    const { name, description } = createTripSchema.parse(body);

    const trip = await DatabaseService.createTrip({
      name,
      description,
      createdBy: userId,
      members: [
        {
          userId,
          email: decoded.email,
          name: decoded.name,
          joinedAt: new Date(),
          role: "admin",
        },
      ],
    });

    return NextResponse.json({ trip });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Create trip error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
