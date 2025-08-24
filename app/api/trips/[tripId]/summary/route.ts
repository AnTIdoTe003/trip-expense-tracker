import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { DatabaseService } from "@/lib/database";
import { ObjectId } from "mongodb";

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

    // Verify user is member of trip
    const db = await DatabaseService.getDatabase();
    const trip = await db.collection("trips").findOne({ _id: tripId });
    if (
      !trip ||
      !trip.members.some((member: any) => member.userId.equals(userId))
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get trip expenses
    const expenses = await DatabaseService.getTripExpenses(tripId);

    if (expenses.length === 0) {
      return NextResponse.json(
        { error: "No expenses to summarize" },
        { status: 400 }
      );
    }

    // Prepare data for LLM
    const expenseData = expenses.map((expense) => ({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      paidBy:
        trip.members.find((m: any) => m.userId.equals(expense.paidBy))?.name ||
        "Unknown",
      splits: expense.splits.map((split) => ({
        person:
          trip.members.find((m: any) => m.userId.equals(split.userId))?.name ||
          "Unknown",
        amount: split.amount,
      })),
    }));

    const memberNames = trip.members.map((m: any) => m.name);

    const prompt = `You are a financial assistant helping to summarize trip expenses. Please analyze the following expense data and create a comprehensive summary.

Trip: ${trip.name}
Members: ${memberNames.join(", ")}

Expenses:
${JSON.stringify(expenseData, null, 2)}

Please provide:
1. A summary table showing total expenses by category
2. A breakdown of who paid what
3. A settlement summary showing who owes money to whom
4. Key insights about spending patterns

Format your response as clean, readable text with tables using markdown formatting. Be concise but thorough.`;

    // Call OpenRouter API
    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "Trip Expense Tracker",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      }
    );

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }

    const data = await openRouterResponse.json();
    const summary = data.choices[0]?.message?.content;

    if (!summary) {
      return NextResponse.json(
        { error: "No summary generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summary generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
