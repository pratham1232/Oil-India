import { NextResponse } from "next/server";
import { wells, getEventsForWell, getAlertsForWell, getNearbyWells } from "@/lib/data";

export async function GET() {
  const enrichedWells = wells.map((w) => ({
    ...w,
    eventsCount: getEventsForWell(w.id).length,
    activeAlerts: getAlertsForWell(w.id).filter((a) => a.status === "Active").length,
    nearbyCount: getNearbyWells(w.id, 50).length,
  }));
  return NextResponse.json(enrichedWells);
}
