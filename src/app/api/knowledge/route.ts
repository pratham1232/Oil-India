import { NextResponse } from "next/server";
import { searchKnowledge, documents } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json(documents);
  }

  const results = searchKnowledge(query);

  if (results.length === 0) {
    return NextResponse.json({
      results: [],
      message: "No relevant historical evidence found in the prototype knowledge base.",
    });
  }

  return NextResponse.json({ results });
}
