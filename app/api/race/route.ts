import { NextRequest, NextResponse } from "next/server";
import { archestraClient } from "@/lib/archestra/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, parameters } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }

    const result = await archestraClient.executeRace(templateId, parameters || {});
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error executing race:", error);
    return NextResponse.json(
      { error: "Failed to execute race" },
      { status: 500 }
    );
  }
}
