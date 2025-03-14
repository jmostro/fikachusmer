import { NextResponse } from "next/server";
import { logActivity, getLogs } from "@/lib/database";

export async function POST(req: Request) {
  const { player, activity } = await req.json();
  logActivity(player, activity);
  return NextResponse.json({ message: "Logged!" });
}

export async function GET() {
  const logs = getLogs();
  return NextResponse.json(logs);
}
