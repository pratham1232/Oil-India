"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { TopHeader } from "@/components/TopHeader";
import {
  ArrowLeft, AlertTriangle, FileText, MapPin, ChevronRight,
  ShieldAlert, Eye,
} from "lucide-react";

interface WellDetail {
  id: string; name: string; field: string; status: string; depth: number;
  riskLevel: string; latitude: number; longitude: number; operator: string; spudDate: string;
  events: Array<{ id: string; description: string; date: string; severity: string; type: string }>;
  documents: Array<{ id: string; type: string; title: string; content: string; uploadedAt: string }>;
  alerts: Array<{ id: string; riskScore: number; reason: string; evidence: string[]; createdAt: string; status: string }>;
  nearbyWells: Array<{ id: string; name: string; field: string; status: string; depth: number; riskLevel: string }>;
}

export default function WellDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [well, setWell] = useState<WellDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState("overview");
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/wells/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Well not found"); return r.json(); })
      .then((d) => { setWell(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [id]);

  if (loading) return (<><TopHeader title="Well Detail" /><div className="page-scroll"><div className="empty-state"><div className="empty-icon pulse"><ShieldAlert size={20} /></div><h3>Loading well data...</h3></div></div></>);
  if (error || !well) return (<><TopHeader title="Well Detail" /><div className="page-scroll"><div className="empty-state"><div className="empty-icon"><AlertTriangle size={20} /></div><h3>Well Not Found</h3><p>{error}</p><Link href="/wells" className="btn btn-primary" style={{ marginTop: "var(--sp-4)" }}><ArrowLeft size={14} /> Back to Wells</Link></div></div></>);

  const riskColor = well.riskLevel === "Critical" ? "var(--status-critical)" : well.riskLevel === "High" ? "var(--status-high)" : well.riskLevel === "Medium" ? "var(--status-warn)" : "var(--status-ok)";
  const doc = well.documents.find((d) => d.id === selectedDoc);
  const activeAlerts = well.alerts.filter((a) => a.status === "Active");

  return (
    <>
      <TopHeader title={well.name} />
      <div className="page-scroll">
        {/* Header */}
        <div style={{ marginBottom: "var(--sp-4)" }}>
          <Link href="/wells" style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "var(--sp-2)" }}>
            <ArrowLeft size={12} /> Back to Wells
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: "1.3rem", marginBottom: "2px" }}>{well.name}</h1>
              <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{well.field} Field • {well.operator} • {well.status}</p>
            </div>
            <span className="badge" style={{ background: `${riskColor}20`, color: riskColor, padding: "4px 14px", fontSize: "0.78rem" }}>
              Risk: {well.riskLevel}
            </span>
          </div>
        </div>

        {/* Stat row */}
        <div className="grid-5" style={{ marginBottom: "var(--sp-4)" }}>
          {[
            { label: "Depth", value: `${well.depth.toLocaleString()}m`, color: "blue" },
            { label: "Events", value: well.events.length.toString(), color: "amber" },
            { label: "Documents", value: well.documents.length.toString(), color: "teal" },
            { label: "Active Alerts", value: activeAlerts.length.toString(), color: "red" },
            { label: "Nearby Wells", value: well.nearbyWells.length.toString(), color: "green" },
          ].map((s) => (
            <div key={s.label} className="card metric-card">
              <span className="metric-label">{s.label}</span>
              <div className="metric-value mono" style={{ fontSize: "1.4rem" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          {["overview", "events", "documents", "alerts", "nearby"].map((t) => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid-2">
            <div className="card">
              <div className="card-title" style={{ marginBottom: "var(--sp-4)" }}>Well Information</div>
              {[
                ["Coordinates", `${well.latitude.toFixed(4)}°N, ${well.longitude.toFixed(4)}°E`],
                ["Spud Date", well.spudDate], ["Operator", well.operator],
                ["Field", well.field], ["Status", well.status],
                ["Total Depth", `${well.depth.toLocaleString()} meters`],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "var(--sp-2) 0", borderBottom: "1px solid var(--border-subtle)", fontSize: "0.82rem" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>{l}</span>
                  <span style={{ fontWeight: 500 }} className={l === "Coordinates" || l === "Total Depth" ? "mono" : ""}>{v}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-title" style={{ marginBottom: "var(--sp-4)" }}>Risk Assessment</div>
              <div style={{ textAlign: "center", padding: "var(--sp-4) 0" }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", margin: "0 auto var(--sp-3)", background: `conic-gradient(${riskColor} ${(well.alerts.length > 0 ? well.alerts[0].riskScore : 30) * 3.6}deg, var(--bg-secondary) 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 62, height: 62, borderRadius: "50%", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="mono" style={{ fontSize: "1.3rem", fontWeight: 700, color: riskColor }}>{well.alerts.length > 0 ? well.alerts[0].riskScore : 30}</span>
                  </div>
                </div>
                <p style={{ fontWeight: 600, color: riskColor, fontSize: "0.85rem" }}>{well.riskLevel} Risk</p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>Prototype risk model output</p>
              </div>
            </div>
          </div>
        )}

        {tab === "events" && (
          <div className="card">
            {well.events.length === 0 ? (<div className="empty-state"><div className="empty-icon"><FileText size={20} /></div><h3>No Historical Events</h3></div>) : (
              well.events.map((evt) => (
                <div key={evt.id} className={`alert-row ${evt.severity.toLowerCase()}`} style={{ flexDirection: "column", alignItems: "stretch", cursor: "default", marginBottom: "var(--sp-3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-2)" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{evt.type}</span>
                    <div style={{ display: "flex", gap: "var(--sp-2)" }}>
                      <span className={`badge ${evt.severity === "Critical" ? "badge-red" : evt.severity === "High" ? "badge-orange" : "badge-amber"}`}>{evt.severity}</span>
                      <span className="mono" style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{evt.date}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{evt.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "documents" && (
          <div style={{ display: "grid", gridTemplateColumns: doc ? "300px 1fr" : "1fr", gap: "var(--sp-4)" }}>
            <div className="card">
              <div className="card-title" style={{ marginBottom: "var(--sp-3)" }}>Documents ({well.documents.length})</div>
              {well.documents.map((d) => (
                <div key={d.id} onClick={() => setSelectedDoc(d.id === selectedDoc ? null : d.id)} className="interactive" style={{
                  padding: "var(--sp-3)", marginBottom: "var(--sp-2)", borderRadius: "var(--radius)",
                  background: d.id === selectedDoc ? "var(--accent-blue-muted)" : "var(--bg-secondary)",
                  border: `1px solid ${d.id === selectedDoc ? "var(--accent-blue)" : "var(--border-subtle)"}`,
                  cursor: "pointer",
                }}>
                  <span style={{ fontWeight: 600, fontSize: "0.82rem" }}>{d.title}</span>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                    <span className={`badge ${d.type === "WCR" ? "badge-blue" : d.type === "DDR" ? "badge-amber" : "badge-purple"}`}>{d.type}</span>
                    <span className="mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{d.uploadedAt}</span>
                  </div>
                </div>
              ))}
            </div>
            {doc && (
              <div className="card fade-in">
                <div className="card-header">
                  <div className="card-title">{doc.title}</div>
                  <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setSelectedDoc(null)}>✕</button>
                </div>
                <span className={`badge ${doc.type === "WCR" ? "badge-blue" : doc.type === "DDR" ? "badge-amber" : "badge-purple"}`}>{doc.type}</span>
                <div className="doc-view" style={{ marginTop: "var(--sp-4)" }}>{doc.content}</div>
              </div>
            )}
          </div>
        )}

        {tab === "alerts" && (
          <div className="card">
            {well.alerts.length === 0 ? (<div className="empty-state"><div className="empty-icon"><ShieldAlert size={20} /></div><h3>No Risk Alerts</h3></div>) : (
              well.alerts.map((alert) => (
                <div key={alert.id} className={`alert-row ${alert.riskScore >= 80 ? "critical" : alert.riskScore >= 60 ? "high" : "medium"}`} style={{ flexDirection: "column", alignItems: "stretch", cursor: "default", marginBottom: "var(--sp-3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-2)" }}>
                    <span className="mono" style={{ fontWeight: 700 }}>Score: {alert.riskScore}/100</span>
                    <span className={`badge ${alert.status === "Active" ? "badge-red" : alert.status === "Acknowledged" ? "badge-amber" : "badge-green"}`}>{alert.status}</span>
                  </div>
                  <div className="risk-bar" style={{ marginBottom: "var(--sp-3)" }}>
                    <div className="risk-bar-fill" style={{ width: `${alert.riskScore}%`, background: alert.riskScore >= 80 ? "var(--status-critical)" : "var(--status-high)" }} />
                  </div>
                  <p style={{ fontSize: "0.82rem", marginBottom: "var(--sp-3)" }}>{alert.reason}</p>
                  <div style={{ background: "var(--bg-secondary)", padding: "var(--sp-3)", borderRadius: "var(--radius)", border: "1px solid var(--border-subtle)" }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "var(--sp-2)" }}>Evidence</p>
                    {alert.evidence.map((e, i) => <p key={i} style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "3px" }}>• {e}</p>)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "nearby" && (
          <div className="card">
            {well.nearbyWells.length === 0 ? (<div className="empty-state"><div className="empty-icon"><MapPin size={20} /></div><h3>No Nearby Wells</h3></div>) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "var(--sp-3)" }}>
                {well.nearbyWells.map((nw) => (
                  <Link key={nw.id} href={`/wells/${nw.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="card interactive" style={{ padding: "var(--sp-4)" }}>
                      <p style={{ fontWeight: 600 }}>{nw.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{nw.field} • {nw.status}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="proto-label" style={{ marginTop: "var(--sp-5)" }}>PROTOTYPE • SYNTHETIC DEMONSTRATION DATA</div>
      </div>
    </>
  );
}
