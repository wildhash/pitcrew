import { NextRequest, NextResponse } from "next/server";
import { archestraClient } from "@/lib/archestra/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { injectionType, payload } = body;

    if (!injectionType || !payload) {
      return NextResponse.json(
        { error: "Injection type and payload are required" },
        { status: 400 }
      );
    }

    const result = await archestraClient.executeAttackLap(injectionType, payload);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error executing attack lap:", error);
    return NextResponse.json(
      { error: "Failed to execute attack lap" },
      { status: 500 }
    );
  }
}
