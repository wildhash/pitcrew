import { NextResponse } from "next/server";
import { archestraClient } from "@/lib/archestra/client";

export async function GET() {
  try {
    const servers = await archestraClient.listMCPServers();
    return NextResponse.json(servers);
  } catch (error) {
    console.error("Error fetching MCP servers:", error);
    return NextResponse.json(
      { error: "Failed to fetch MCP servers" },
      { status: 500 }
    );
  }
}
