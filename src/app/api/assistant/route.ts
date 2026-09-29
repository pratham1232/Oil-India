import { NextResponse } from "next/server";
import { searchKnowledge, getWellById, wells, computeRisk, getEventsForWell } from "@/lib/data";

// Demo Intelligence Mode — used when Gemini API is unavailable
function demoIntelligenceResponse(query: string): string {
  const q = query.toLowerCase();
  const relevantDocs = searchKnowledge(query);

  let contextSummary = "";
  if (relevantDocs.length > 0) {
    contextSummary = relevantDocs
      .slice(0, 3)
      .map((d) => `📄 ${d.title}:\n${d.content.substring(0, 300)}...`)
      .join("\n\n");
  }

  // Well-specific queries
  for (const well of wells) {
    if (q.includes(well.name.toLowerCase()) || q.includes(well.id)) {
      const events = getEventsForWell(well.id);
      const risk = computeRisk(well.id);
      return `## ${well.name} — Intelligence Summary

**Field:** ${well.field} | **Status:** ${well.status} | **Depth:** ${well.depth}m
**Current Risk Level:** ${risk.level} (Score: ${risk.score}/100)

### Historical Events (${events.length} recorded):
${events.map((e) => `- **${e.date}** [${e.severity}] ${e.type}: ${e.description}`).join("\n")}

### Risk Factors:
${risk.factors.map((f) => `- ${f}`).join("\n") || "- No significant risk factors identified"}

${contextSummary ? `### Related Documents:\n${contextSummary}` : ""}

---
⚠️ *Demo Intelligence Mode — Prototype / Demonstration Data. Designed for future eRTMAC integration.*`;
    }
  }

  // Topic queries
  if (q.includes("kick") || q.includes("well control")) {
    return `## Well Kick Analysis — Knowledge Base Summary

Based on the prototype knowledge base, **2 kick events** have been recorded:

1. **Jorhat-East-29** (10-Jul-2024): Kick at 1,900m. SIDPP 420 psi. Kill mud 12.8 ppg. Caused by unexpected pore pressure increase in transition zone.

2. **Tengakhat-21** (15-Jun-2024): Gas kick at 2,200m in Girujan formation. SIDPP 380 psi. H2S traces detected (12 ppm). Kill mud 13.1 ppg.

### Common Factors:
- Both occurred in transition zones with unpredicted pore pressures
- Actual pore pressures exceeded predictions by 0.06–0.12 psi/ft
- Girujan and Tipam formations are high-risk intervals

### Recommendations:
- Implement real-time pore pressure monitoring
- Increase mud weight safety margins in transition zones
- Update geological models with actual pressure data

---
⚠️ *Demo Intelligence Mode — Prototype / Demonstration Data.*`;
  }

  if (q.includes("loss") || q.includes("circulation") || q.includes("loc")) {
    return `## Loss of Circulation Analysis

The prototype knowledge base contains **2 LOC events**:

1. **Rudrasagar-45** (15-Mar-2024): Total LOC at 2,450m in fractured Tipam formation. 320 bbl lost. LCM pill deployed successfully.

2. **Duliajan-Central-33** (22-May-2024): Partial LOC at 2,900m. 80 bbl lost. LCM treatment sealed the zone.

### Key Insights:
- Tipam formation is most susceptible to losses
- CaCO3 + Mica LCM blends have been effective
- Average NPT per LOC event: 5–7 hours

---
⚠️ *Demo Intelligence Mode — Prototype / Demonstration Data.*`;
  }

  if (q.includes("stuck") || q.includes("pipe")) {
    return `## Stuck Pipe Analysis

**2 stuck pipe incidents** in the knowledge base:

1. **Rudrasagar-45** (02-Apr-2024): Differential sticking at 2,680m in depleted zone. Freed after 6 hours.

2. **Lakwa-77** (30-Jun-2024): Pack-off at 3,100m due to inadequate hole cleaning in deviated section. Freed using back-reaming.

### Prevention Recommendations:
- Maintain adequate hole cleaning practices in deviated sections
- Monitor ECD and torque trends for early indicators
- Use wiper trips in problematic zones

---
⚠️ *Demo Intelligence Mode — Prototype / Demonstration Data.*`;
  }

  // General fallback
  if (relevantDocs.length > 0) {
    return `## Search Results

Found ${relevantDocs.length} relevant document(s) in the knowledge base:

${contextSummary}

---
⚠️ *Demo Intelligence Mode — Prototype / Demonstration Data. Designed for future eRTMAC integration.*`;
  }

  return `No relevant historical evidence found in the prototype knowledge base.

Try asking about:
- Specific wells (e.g., "Tell me about Lakwa-77")
- Event types (e.g., "well kicks", "loss of circulation", "stuck pipe")
- Risk analysis (e.g., "risk assessment for Jorhat-East-29")

---
⚠️ *Demo Intelligence Mode — Prototype / Demonstration Data.*`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    // Try Gemini first if API key is available and valid
    if (geminiKey && !geminiKey.includes("your-actual-api-key")) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // RAG: retrieve relevant context
        const relevantDocs = searchKnowledge(message);
        const context = relevantDocs
          .slice(0, 3)
          .map((d) => d.content)
          .join("\n\n---\n\n");

        const prompt = `You are an AI drilling intelligence assistant for the NWIS (National Well Intelligence System) prototype, designed for future integration with OIL eRTMAC.

You help drilling engineers analyze historical well data, assess risks, and make informed decisions.

CONTEXT FROM KNOWLEDGE BASE:
${context || "No specific documents found for this query."}

AVAILABLE WELLS: ${wells.map((w) => `${w.name} (${w.field}, ${w.status}, Risk: ${w.riskLevel})`).join("; ")}

USER QUESTION: ${message}

Provide a detailed, technical response. Use markdown formatting. Always note this is prototype demonstration data at the end.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return NextResponse.json({
          response: responseText,
          mode: "Gemini RAG",
          sourceDocs: relevantDocs.slice(0, 3).map((d) => ({ id: d.id, title: d.title, type: d.type })),
        });
      } catch (geminiError) {
        console.error("Gemini API error, falling back to Demo mode:", geminiError);
      }
    }

    // Fallback: Demo Intelligence Mode
    const response = demoIntelligenceResponse(message);
    return NextResponse.json({
      response,
      mode: "Demo Intelligence",
      sourceDocs: searchKnowledge(message).slice(0, 3).map((d) => ({ id: d.id, title: d.title, type: d.type })),
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
