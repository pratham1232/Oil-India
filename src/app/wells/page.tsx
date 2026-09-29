"use client";

import { useState } from "react";
import Link from "next/link";
import { TopHeader } from "@/components/TopHeader";
import { ChevronRight, MapPin } from "lucide-react";
import { wells, getEventsForWell, getAlertsForWell } from "@/lib/data";

export default function WellsPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? wells : wells.filter((w) => w.status === filter);

  return (
    <>
      <TopHeader title="Wells" />
      <div className="page-scroll">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--sp-4)" }}>
          <div>
            <h1 style={{ fontSize: "1.3rem", marginBottom: "2px" }}>Wells Directory</h1>
            <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>Browse and inspect all wells in the prototype knowledge base</p>
          </div>
          <div className="tabs" style={{ border: "none", marginBottom: 0 }}>
            {["All", "Active", "Monitoring", "Inactive"].map((f) => (
              <button key={f} className={`tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f} ({f === "All" ? wells.length : wells.filter((w) => w.status === f).length})
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--sp-4)", marginBottom: "var(--sp-5)" }}>
          {filtered.map((well) => {
            const evts = getEventsForWell(well.id);
            const alerts = getAlertsForWell(well.id).filter((a) => a.status === "Active");
            return (
              <Link key={well.id} href={`/wells/${well.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="card interactive">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--sp-3)" }}>
                    <div>
                      <h3 style={{ fontSize: "1rem", marginBottom: "2px" }}>{well.name}</h3>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{well.field} Field • {well.operator}</p>
                    </div>
                    <span className={`badge ${well.riskLevel === "Critical" ? "badge-red" : well.riskLevel === "High" ? "badge-orange" : well.riskLevel === "Medium" ? "badge-amber" : "badge-green"}`}>
                      {well.riskLevel}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-3)", marginBottom: "var(--sp-3)" }}>
                    {[
                      ["Status", well.status],
                      ["Depth", `${well.depth.toLocaleString()}m`],
                      ["Events", evts.length.toString()],
                      ["Alerts", alerts.length > 0 ? alerts.length.toString() : "None"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                        <p className={label === "Depth" ? "mono" : ""} style={{ fontSize: "0.85rem", fontWeight: 500, color: label === "Alerts" && alerts.length > 0 ? "var(--status-critical)" : "var(--text-primary)" }}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-1)", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                    <MapPin size={11} /> <span className="mono">{well.latitude.toFixed(4)}°N, {well.longitude.toFixed(4)}°E</span>
                    <span style={{ marginLeft: "auto" }}><ChevronRight size={14} /></span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="proto-label">PROTOTYPE • SYNTHETIC DEMONSTRATION DATA</div>
      </div>
    </>
  );
}
