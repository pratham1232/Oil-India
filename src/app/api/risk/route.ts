import { NextResponse } from "next/server";
import { riskAlerts, computeRisk, getWellById } from "@/lib/data";

export async function GET() {
  return NextResponse.json(riskAlerts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wellId, currentEcd, currentGas } = body;

    if (!wellId || typeof wellId !== "string") {
      return NextResponse.json({ error: "wellId is required" }, { status: 400 });
    }

    const well = getWellById(wellId);
    if (!well) {
      return NextResponse.json({ error: "Well not found" }, { status: 404 });
    }

    const risk = computeRisk(wellId, currentEcd, currentGas);
    return NextResponse.json({
      wellId,
      wellName: well.name,
      ...risk,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
