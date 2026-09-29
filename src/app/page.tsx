"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TopHeader, useActiveWell } from "@/components/TopHeader";
import {
  Activity, Layers, MapPin, AlertTriangle, ArrowDown,
  TrendingUp, Gauge, BarChart3, ChevronRight,
} from "lucide-react";
import {
  wells as allWells, getEventsForWell, getAlertsForWell,
  getNearbyWells, computeRisk, generateDrillingSamples,
  type Well, type RiskAlert,
} from "@/lib/data";

export default function OverviewPage() {
  const { activeWellId } = useActiveWell();
  const well = allWells.find((w) => w.id === activeWellId);
  const events = getEventsForWell(activeWellId);
  const alerts = getAlertsForWell(activeWellId);
  const nearby = getNearbyWells(activeWellId, 50);
  const risk = computeRisk(activeWellId);
  const allAlerts = allWells.flatMap((w) => getAlertsForWell(w.id).filter((a) => a.status === "Active"));

  // Generate sample data for parameter preview
  const [samples, setSamples] = useState(generateDrillingSamples(activeWellId, 30));
  useEffect(() => {
    setSamples(generateDrillingSamples(activeWellId, 30));
  }, [activeWellId]);

  const riskColor = risk.level === "Critical" ? "var(--status-critical)" : risk.level === "High" ? "var(--status-high)" : risk.level === "Medium" ? "var(--status-warn)" : "var(--status-ok)";

  const MiniParam = ({ label, values, color, unit }: { label: string; values: number[]; color: string; unit: string }) => {
    const max = Math.max(...values, 1);
    const latest = values[values.length - 1];
    return (
      <div className="card" style={{ padding: "var(--sp-4)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--sp-2)" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
          <span className="mono" style={{ fontSize: "0.95rem", fontWeight: 600, color }}>{latest?.toFixed(1)} <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "var(--text-muted)" }}>{unit}</span></span>
        </div>
        <div className="mini-chart-area">
          {values.slice(-20).map((v, i) => (
            <div key={i} className="bar" style={{
              height: `${Math.max((v / max) * 100, 3)}%`,
              background: i === values.slice(-20).length - 1 ? color : `${color}60`,
            }} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <TopHeader title="Overview" />
      <div className="page-scroll">
        {/* Metric Cards */}
        <div className="grid-5" style={{ marginBottom: "var(--sp-5)" }}>
          <div className="card metric-card">
            <div className="metric-header">
              <span className="metric-label">Active Well</span>
              <div className="metric-icon blue"><Activity size={16} /></div>
            </div>
            <div className="metric-value mono">{well?.name || "—"}</div>
            <div className="metric-secondary">{well?.field} Field • {well?.status}</div>
          </div>

          <div className="card metric-card">
            <div className="metric-header">
              <span className="metric-label">Current MD</span>
              <div className="metric-icon teal"><ArrowDown size={16} /></div>
            </div>
            <div className="metric-value mono">{well?.depth.toLocaleString() || "—"}<span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}> m</span></div>
            <div className="metric-secondary">Measured Depth</div>
          </div>

          <div className="card metric-card">
            <div className="metric-header">
              <span className="metric-label">Nearby Offset Wells</span>
              <div className="metric-icon green"><MapPin size={16} /></div>
            </div>
            <div className="metric-value">{nearby.length}</div>
            <div className="metric-secondary">Within 50 km radius</div>
          </div>

          <div className="card metric-card">
            <div className="metric-header">
              <span className="metric-label">Active Risk Alerts</span>
              <div className="metric-icon red"><AlertTriangle size={16} /></div>
            </div>
            <div className="metric-value" style={{ color: allAlerts.length > 0 ? "var(--status-critical)" : "inherit" }}>{allAlerts.length}</div>
            <div className="metric-secondary">Across all wells</div>
          </div>

          <div className="card metric-card">
            <div className="metric-header">
              <span className="metric-label">Risk Level</span>
              <div className="metric-icon amber"><Gauge size={16} /></div>
            </div>
            <div className="metric-value" style={{ color: riskColor }}>{risk.score}<span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>/100</span></div>
            <div className="metric-secondary">{risk.level} — {risk.factors.length} factor(s)</div>
          </div>
        </div>

        {/* Main content: Map placeholder + Risk panel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "var(--sp-4)", marginBottom: "var(--sp-5)" }}>
          {/* Map Card */}
          <div className="card" style={{ minHeight: 380 }}>
            <div className="card-header">
              <div>
                <div className="card-title">Well Locations</div>
                <div className="card-subtitle">Geospatial view — {allWells.length} wells</div>
              </div>
              <Link href="/map" className="btn btn-ghost btn-sm">Open Map <ChevronRight size={14} /></Link>
            </div>
            <div style={{
              height: 300, borderRadius: "var(--radius)", background: "var(--bg-secondary)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
            }}>
              {/* Simplified inline map representation */}
              <div style={{ position: "absolute", inset: 0, opacity: 0.15, background: "radial-gradient(circle at 40% 45%, var(--accent-blue) 0%, transparent 60%)" }} />
              {allWells.map((w, i) => {
                const x = 10 + ((w.longitude - 94.0) / 2.0) * 80;
                const y = 90 - ((w.latitude - 26.5) / 1.2) * 80;
                const color = w.riskLevel === "Critical" ? "var(--status-critical)" : w.riskLevel === "High" ? "var(--status-high)" : w.riskLevel === "Medium" ? "var(--status-warn)" : "var(--status-ok)";
                const isActive = w.id === activeWellId;
                return (
                  <div key={w.id} style={{
                    position: "absolute", left: `${x}%`, top: `${y}%`,
                    width: isActive ? 14 : 8, height: isActive ? 14 : 8,
                    borderRadius: "50%", background: color,
                    border: isActive ? "3px solid white" : "2px solid rgba(255,255,255,0.3)",
                    boxShadow: isActive ? `0 0 12px ${color}` : "none",
                    zIndex: isActive ? 10 : 1, cursor: "pointer",
                    transition: "all 200ms",
                  }} title={w.name} />
                );
              })}
              <div style={{ position: "absolute", bottom: 12, left: 12, fontSize: "0.65rem", color: "var(--text-muted)" }}>
                Click &quot;Open Map&quot; for interactive Leaflet map
              </div>
            </div>
          </div>

          {/* Right: Risk overview panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div className="card" style={{ flex: 1 }}>
              <div className="card-header">
                <div className="card-title">Current Risk</div>
                <span className="badge" style={{
                  background: `${riskColor}20`, color: riskColor,
                }}>{risk.level}</span>
              </div>

              {/* Risk gauge */}
              <div style={{ textAlign: "center", padding: "var(--sp-4) 0" }}>
                <div style={{
                  width: 90, height: 90, borderRadius: "50%", margin: "0 auto var(--sp-3)",
                  background: `conic-gradient(${riskColor} ${risk.score * 3.6}deg, var(--bg-secondary) 0deg)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ width: 62, height: 62, borderRadius: "50%", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="mono" style={{ fontSize: "1.4rem", fontWeight: 700, color: riskColor }}>{risk.score}</span>
                  </div>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                  Prototype risk model output
                </p>
              </div>

              {risk.factors.length > 0 && (
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--sp-3)", marginTop: "var(--sp-2)" }}>
                  <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "var(--sp-2)" }}>Risk Factors</p>
                  {risk.factors.slice(0, 3).map((f, i) => (
                    <p key={i} style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "4px", paddingLeft: "12px", borderLeft: `2px solid ${riskColor}40` }}>{f}</p>
                  ))}
                </div>
              )}

              <Link href="/risk" className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: "var(--sp-3)" }}>
                View Evidence <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Alerts + Param preview */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-4)", marginBottom: "var(--sp-5)" }}>
          {/* Recent Alerts */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Alerts</div>
              <Link href="/risk" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            {allAlerts.length === 0 ? (
              <div className="empty-state" style={{ padding: "var(--sp-8)" }}>
                <div className="empty-icon"><AlertTriangle size={20} /></div>
                <h3>No Active Alerts</h3>
                <p>All systems operating within normal parameters.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
                {allAlerts.slice(0, 4).map((alert) => {
                  const alertWell = allWells.find((w) => w.id === alert.wellId);
                  return (
                    <Link key={alert.id} href={`/wells/${alert.wellId}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div className={`alert-row ${alert.riskScore >= 80 ? "critical" : alert.riskScore >= 60 ? "high" : "medium"}`}>
                        <AlertTriangle size={15} style={{ flexShrink: 0, color: alert.riskScore >= 80 ? "var(--status-critical)" : "var(--status-high)" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "0.8rem", fontWeight: 600 }}>{alertWell?.name}</p>
                          <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            Score: {alert.riskScore} — {alert.reason.substring(0, 60)}...
                          </p>
                        </div>
                        <span className={`badge ${alert.riskScore >= 80 ? "badge-red" : "badge-orange"}`}>{alert.riskScore}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Parameter preview */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Drilling Parameters</div>
              <Link href="/simulator" className="btn btn-ghost btn-sm">Live Monitor</Link>
            </div>
            <div className="grid-2" style={{ gap: "var(--sp-3)" }}>
              <MiniParam label="ROP" values={samples.map((s) => s.rop)} color="var(--status-ok)" unit="m/hr" />
              <MiniParam label="Torque" values={samples.map((s) => s.torque)} color="var(--status-warn)" unit="kN·m" />
              <MiniParam label="WOB" values={samples.map((s) => s.wob)} color="var(--accent-blue)" unit="kN" />
              <MiniParam label="Pressure" values={samples.map((s) => s.pressure)} color="var(--status-info)" unit="psi" />
            </div>
          </div>
        </div>

        {/* Wells Table */}
        <div className="card" style={{ marginBottom: "var(--sp-5)" }}>
          <div className="card-header">
            <div className="card-title">Wells Directory</div>
            <Link href="/wells" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Well</th>
                  <th>Field</th>
                  <th>Status</th>
                  <th>Depth</th>
                  <th>Risk</th>
                  <th>Events</th>
                  <th>Alerts</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {allWells.map((w) => {
                  const wEvents = getEventsForWell(w.id);
                  const wAlerts = getAlertsForWell(w.id).filter((a) => a.status === "Active");
                  return (
                    <tr key={w.id} className="clickable" onClick={() => window.location.href = `/wells/${w.id}`}>
                      <td style={{ fontWeight: 600 }}>{w.name}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{w.field}</td>
                      <td><span className={`badge ${w.status === "Active" ? "badge-green" : w.status === "Monitoring" ? "badge-amber" : "badge-gray"}`}>{w.status}</span></td>
                      <td className="mono">{w.depth.toLocaleString()}m</td>
                      <td><span className={`badge ${w.riskLevel === "Critical" ? "badge-red" : w.riskLevel === "High" ? "badge-orange" : w.riskLevel === "Medium" ? "badge-amber" : "badge-green"}`}>{w.riskLevel}</span></td>
                      <td className="mono">{wEvents.length}</td>
                      <td>{wAlerts.length > 0 ? <span className="badge badge-red">{wAlerts.length}</span> : <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                      <td><ChevronRight size={14} style={{ color: "var(--text-muted)" }} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="proto-label">
          PROTOTYPE • SYNTHETIC DEMONSTRATION DATA • Designed for future integration with OIL eRTMAC
        </div>
      </div>
    </>
  );
}
