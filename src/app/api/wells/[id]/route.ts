import { NextResponse } from "next/server";
import { getWellById, getEventsForWell, getDocumentsForWell, getAlertsForWell, getNearbyWells } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const well = getWellById(id);
  if (!well) {
    return NextResponse.json({ error: "Well not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...well,
    events: getEventsForWell(id),
    documents: getDocumentsForWell(id),
    alerts: getAlertsForWell(id),
    nearbyWells: getNearbyWells(id, 50),
  });
}
