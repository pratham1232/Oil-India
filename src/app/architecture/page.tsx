"use client";

import { TopHeader } from "@/components/TopHeader";
import {
  FileText, Cpu, Database, Brain, Radio, LayoutDashboard,
  ArrowDown, Layers, Zap,
} from "lucide-react";

const archSteps = [
  {
    icon: FileText,
    title: "Historical Data",
    sub: "WCR • DDR • Mud Logs • Well Records",
    desc: "Raw historical drilling documents from offset wells, including well completion reports, daily drilling reports, and geological mud logs.",
    color: "var(--accent-blue)",
  },
  {
    icon: Cpu,
    title: "Document Intelligence",
    sub: "PDF Extraction • OCR • NLP",
    desc: "Automated processing pipeline that extracts structured knowledge from unstructured drilling documents using NLP and entity recognition.",
    color: "var(--accent-teal)",
  },
  {
    icon: Layers,
    title: "Structured Knowledge",
    sub: "Well Records • Events • Formations • Depths",
    desc: "Normalized, queryable knowledge base of historical drilling events, formations, depth intervals, and mitigation practices.",
    color: "var(--status-info)",
  },
  {
    icon: Database,
    title: "Knowledge Database",
    sub: "PostgreSQL • Vector Retrieval • Geospatial",
    desc: "Persistent storage layer using PostgreSQL with pgvector for semantic search and PostGIS for geospatial offset-well queries.",
    color: "var(--status-ok)",
  },
  {
    icon: Brain,
    title: "Intelligence Engines",
    sub: "RAG • Gemini • Predictive Risk Model",
    desc: "Retrieval-Augmented Generation pipeline using Google Gemini for contextual AI responses, combined with a rule-based risk scoring model.",
    color: "var(--status-warn)",
  },
  {
    icon: Radio,
    title: "Operational Monitoring",
    sub: "Drilling Simulation • Risk Zones • Alerts",
    desc: "Real-time monitoring layer that correlates live drilling parameters with historical risk zones and generates alerts when approaching known hazards.",
    color: "var(--status-high)",
  },
  {
    icon: LayoutDashboard,
    title: "Engineering Dashboard",
    sub: "Nearby Wells • Historical Evidence • Decision Support",
    desc: "Unified interface providing drilling engineers with geospatial intelligence, historical context, risk assessments, and AI-assisted decision support.",
    color: "var(--status-critical)",
  },
];

const techStack = [
  { category: "Frontend", items: ["Next.js 16 (App Router)", "TypeScript", "Leaflet.js Maps", "Vanilla CSS Design System", "Lucide Icons"] },
  { category: "Backend", items: ["Next.js API Routes", "Prisma ORM", "Node.js Runtime"] },
  { category: "Database", items: ["PostgreSQL 16", "pgvector (semantic search)", "PostGIS (geospatial)"] },
  { category: "AI / ML", items: ["Google Gemini 2.0 Flash", "RAG Pipeline", "Rule-based Risk Engine", "Text-based Knowledge Retrieval"] },
  { category: "Infrastructure", items: ["Vercel (deployment)", "Docker (local DB)", "Environment-based configuration"] },
];

export default function ArchitecturePage() {
  return (
    <>
      <TopHeader title="System Architecture" />
      <div className="page-scroll">
        <div style={{ marginBottom: "var(--sp-6)" }}>
          <h1 style={{ fontSize: "1.3rem", marginBottom: "2px" }}>System Architecture</h1>
          <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
            eRTMAC-NWIS — Institutional Memory. Intelligent Drilling Decisions.
          </p>
        </div>

        {/* Pipeline Diagram */}
        <div className="card" style={{ marginBottom: "var(--sp-5)", padding: "var(--sp-6)" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "var(--sp-5)" }}>Data Pipeline</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 700, margin: "0 auto" }}>
            {archSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title}>
                  <div style={{ display: "flex", gap: "var(--sp-4)", alignItems: "flex-start" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "var(--radius-lg)",
                      background: `${step.color}15`, border: `1px solid ${step.color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon size={20} style={{ color: step.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "0.9rem", marginBottom: "2px" }}>{step.title}</h3>
                      <p className="mono" style={{ fontSize: "0.72rem", color: step.color, marginBottom: "var(--sp-1)" }}>{step.sub}</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", lineHeight: 1.5 }}>{step.desc}</p>
                    </div>
                  </div>
                  {i < archSteps.length - 1 && (
                    <div style={{ display: "flex", justifyContent: "center", padding: "var(--sp-2) 0", marginLeft: 20 }}>
                      <ArrowDown size={16} style={{ color: "var(--text-muted)" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="card" style={{ marginBottom: "var(--sp-5)" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "var(--sp-4)" }}>Technology Stack</h2>
          <div className="grid-5" style={{ gap: "var(--sp-4)" }}>
            {techStack.map((group) => (
              <div key={group.category}>
                <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--sp-3)" }}>{group.category}</p>
                {group.items.map((item) => (
                  <p key={item} style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "var(--sp-1)", paddingLeft: "var(--sp-3)", borderLeft: "2px solid var(--border)" }}>
                    {item}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Future Integration */}
        <div className="card" style={{ marginBottom: "var(--sp-5)", borderColor: "var(--accent-teal)30" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", marginBottom: "var(--sp-4)" }}>
            <Zap size={18} style={{ color: "var(--accent-teal)" }} />
            <h2 style={{ fontSize: "1rem" }}>Future Integration</h2>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "var(--sp-4)", lineHeight: 1.6 }}>
            Designed for future integration with OIL&apos;s existing eRTMAC environment, subject to data access, security, interface, and operational validation.
          </p>
          <div className="grid-2" style={{ gap: "var(--sp-3)" }}>
            {[
              "Live WITSML data feeds replacing simulated telemetry",
              "Real-time pore pressure monitoring from MWD/LWD tools",
              "eRTMAC alert ingestion and correlation with NWIS risk engine",
              "Automated WCR/DDR parsing via Document Intelligence pipeline",
              "pgvector-based semantic search replacing keyword matching",
              "Multi-well real-time monitoring with geofenced alerts",
            ].map((item) => (
              <div key={item} style={{ display: "flex", gap: "var(--sp-2)", alignItems: "flex-start" }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent-teal)", marginTop: 7, flexShrink: 0 }} />
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="proto-label">PROTOTYPE • SYNTHETIC DEMONSTRATION DATA • Designed for future integration with OIL eRTMAC</div>
      </div>
    </>
  );
}
