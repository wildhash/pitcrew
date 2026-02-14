import { NextResponse } from "next/server";
import { archestraClient } from "@/lib/archestra/client";

export async function GET() {
  try {
    const templates = await archestraClient.listRaceTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching race templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch race templates" },
      { status: 500 }
    );
  }
}
