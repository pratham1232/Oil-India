"use client";

import { useState } from "react";
import Link from "next/link";
import { TopHeader, useActiveWell } from "@/components/TopHeader";
import {
  ShieldAlert, AlertTriangle, Droplets, Anchor, Gauge, Wrench, ChevronRight,
  TrendingUp, Eye,
} from "lucide-react";
import {
  wells, riskAlerts, computeRisk, getEventsForWell,
  getAlertsForWell, historicalEvents, type RiskAlert,
} from "@/lib/data";

const riskCategories = [
  { key: "Loss of Circulation", label: "Mud Loss", icon: Droplets, color: "var(--status-high)" },
  { key: "Stuck Pipe", label: "Stuck Pipe", icon: Anchor, color: "var(--status-warn)" },
  { key: "Kick", label: "Kick / Overpressure", icon: AlertTriangle, color: "var(--status-critical)" },
  { key: "Gas Influx", label: "Gas Influx", icon: Gauge, color: "var(--status-high)" },
  { key: "Equipment Failure", label: "Equipment Issue", icon: Wrench, color: "var(--status-warn)" },
];

export default function RiskPage() {
  const { activeWellId } = useActiveWell();
  const [calcWell, setCalcWell] = useState(activeWellId);
  const [calcEcd, setCalcEcd] = useState("10.2");
  const [calcGas, setCalcGas] = useState("6.5");
  const [calcResult, setCalcResult] = useState<{ score: number; level: string; factors: string[] } | null>(null);
  const [calculating, setCalculating] = useState(false);

  const activeAlerts = riskAlerts.filter((a) => a.status === "Active");

  const handleCalc = async () => {
    setCalculating(true);
    const res = await fetch("/api/risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wellId: calcWell, currentEcd: parseFloat(calcEcd), currentGas: parseFloat(calcGas) }),
    });
    const data = await res.json();
    setCalcResult(data);
    setCalculating(false);
  };

  const getRiskColor = (score: number) =>
    score >= 80 ? "var(--status-critical)" : score >= 60 ? "var(--status-high)" : score >= 35 ? "var(--status-warn)" : "var(--status-ok)";

  return (
    <>
      <TopHeader title="Risk Intelligence" />
      <div className="page-scroll">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--sp-5)" }}>
          <div>
            <h1 style={{ fontSize: "1.3rem", marginBottom: "2px" }}>Risk Intelligence</h1>
            <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>Historical and predictive drilling risk analysis</p>
          </div>
          <span className="badge badge-red" style={{ padding: "4px 12px" }}>{activeAlerts.length} Active Alert{activeAlerts.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Risk Category Cards */}
        <div className="grid-5" style={{ marginBottom: "var(--sp-5)" }}>
          {riskCategories.map((cat) => {
            const Icon = cat.icon;
            const count = historicalEvents.filter((e) => e.type === cat.key).length;
            const relAlerts = riskAlerts.filter((a) => a.reason.toLowerCase().includes(cat.key.toLowerCase()));
            return (
              <div key={cat.key} className="card" style={{ padding: "var(--sp-4)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", marginBottom: "var(--sp-3)" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "var(--radius)", background: `${cat.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={14} style={{ color: cat.color }} />
                  </div>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{cat.label}</span>
                </div>
                <div className="mono" style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "4px" }}>{count}</div>
                <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>historical events</p>
                {relAlerts.length > 0 && (
                  <span className="badge badge-red" style={{ marginTop: "var(--sp-2)" }}>{relAlerts.length} alert</span>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "var(--sp-4)", marginBottom: "var(--sp-5)" }}>
          {/* Alert List */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">All Risk Alerts</div>
            </div>
            {riskAlerts.length === 0 ? (
              <div className="empty-state"><div className="empty-icon"><ShieldAlert size={20} /></div><h3>No Alerts</h3></div>
            ) : (
              riskAlerts.map((alert) => {
                const alertWell = wells.find((w) => w.id === alert.wellId);
                const color = getRiskColor(alert.riskScore);
                return (
                  <div key={alert.id} className={`alert-row ${alert.riskScore >= 80 ? "critical" : alert.riskScore >= 60 ? "high" : "medium"}`} style={{ flexDirection: "column", alignItems: "stretch", marginBottom: "var(--sp-3)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-2)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                        <AlertTriangle size={14} style={{ color }} />
                        <Link href={`/wells/${alert.wellId}`} style={{ fontWeight: 600, fontSize: "0.85rem" }}>{alertWell?.name}</Link>
                        <span className="mono" style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>Score: {alert.riskScore}</span>
                      </div>
                      <span className={`badge ${alert.status === "Active" ? "badge-red" : alert.status === "Acknowledged" ? "badge-amber" : "badge-green"}`}>{alert.status}</span>
                    </div>
                    <div className="risk-bar" style={{ marginBottom: "var(--sp-2)" }}>
                      <div className="risk-bar-fill" style={{ width: `${alert.riskScore}%`, background: color }} />
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "var(--sp-3)" }}>{alert.reason}</p>

                    {/* WHY THIS RISK WAS FLAGGED */}
                    <div style={{ background: "var(--bg-secondary)", padding: "var(--sp-3)", borderRadius: "var(--radius)", border: "1px solid var(--border-subtle)" }}>
                      <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "var(--sp-2)" }}>Why This Risk Was Flagged</p>
                      {alert.evidence.map((e, i) => (
                        <p key={i} style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "3px", paddingLeft: "10px", borderLeft: `2px solid ${color}40` }}>
                          {e}
                        </p>
                      ))}
                    </div>
                    <p className="mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "var(--sp-2)" }}>
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Risk Calculator */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Risk Calculator</div>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginBottom: "var(--sp-4)" }}>
                Compute risk scores based on current drilling parameters and historical evidence.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Target Well</label>
                  <select className="input" value={calcWell} onChange={(e) => setCalcWell(e.target.value)}>
                    {wells.filter((w) => w.status !== "Inactive").map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div className="grid-2" style={{ gap: "var(--sp-3)" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>ECD (ppg)</label>
                    <input className="input mono" type="number" step="0.1" value={calcEcd} onChange={(e) => setCalcEcd(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Gas (%)</label>
                    <input className="input mono" type="number" step="0.1" value={calcGas} onChange={(e) => setCalcGas(e.target.value)} />
                  </div>
                </div>
                <button className="btn btn-primary" onClick={handleCalc} disabled={calculating} style={{ width: "100%", justifyContent: "center" }}>
                  {calculating ? "Computing..." : "Calculate Risk"}
                </button>
              </div>
              {calcResult && (
                <div className="fade-in" style={{ marginTop: "var(--sp-4)", textAlign: "center", borderTop: "1px solid var(--border)", paddingTop: "var(--sp-4)" }}>
                  <div className="mono" style={{ fontSize: "2.5rem", fontWeight: 700, color: getRiskColor(calcResult.score) }}>{calcResult.score}</div>
                  <span className={`badge ${calcResult.level === "Critical" ? "badge-red" : calcResult.level === "High" ? "badge-orange" : calcResult.level === "Medium" ? "badge-amber" : "badge-green"}`}>
                    {calcResult.level} Risk
                  </span>
                  {calcResult.factors.length > 0 && (
                    <div style={{ marginTop: "var(--sp-3)", textAlign: "left" }}>
                      <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "var(--sp-2)" }}>Contributing Factors</p>
                      {calcResult.factors.map((f, i) => (
                        <p key={i} style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "3px" }}>• {f}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Historical Comparison Table */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Historical Comparison</div>
              </div>
              <div style={{ maxHeight: 300, overflowY: "auto" }}>
                <table className="data-table">
                  <thead><tr><th>Well</th><th>Event</th><th>Severity</th></tr></thead>
                  <tbody>
                    {historicalEvents.slice(0, 8).map((evt) => {
                      const w = wells.find((w) => w.id === evt.wellId);
                      return (
                        <tr key={evt.id} className="clickable" onClick={() => window.location.href = `/wells/${evt.wellId}`}>
                          <td style={{ fontSize: "0.78rem", fontWeight: 500 }}>{w?.name}</td>
                          <td style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{evt.type}</td>
                          <td><span className={`badge ${evt.severity === "Critical" ? "badge-red" : evt.severity === "High" ? "badge-orange" : "badge-amber"}`}>{evt.severity}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="proto-label">PROTOTYPE • SYNTHETIC DEMONSTRATION DATA</div>
      </div>
    </>
  );
}
