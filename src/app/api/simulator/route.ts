import { NextResponse } from "next/server";
import { generateDrillingSamples, getWellById } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wellId = searchParams.get("wellId") || "well-001";
  const count = parseInt(searchParams.get("count") || "60", 10);

  const well = getWellById(wellId);
  if (!well) {
    return NextResponse.json({ error: "Well not found" }, { status: 404 });
  }

  const samples = generateDrillingSamples(wellId, Math.min(count, 200));
  return NextResponse.json({
    wellId,
    wellName: well.name,
    samples,
  });
}
