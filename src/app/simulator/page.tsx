"use client";

import { useState, useEffect, useCallback } from "react";
import { TopHeader, useActiveWell } from "@/components/TopHeader";
import {
  Play, Pause, Square, RotateCcw, AlertTriangle,
  ArrowDown, TrendingUp, Gauge, Thermometer, Wind,
} from "lucide-react";
import { wells, type DrillingSample } from "@/lib/data";

export default function SimulatorPage() {
  const { activeWellId } = useActiveWell();
  const [wellId, setWellId] = useState(activeWellId);
  const [samples, setSamples] = useState<DrillingSample[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [idx, setIdx] = useState(0);
  const [alerts, setAlerts] = useState<string[]>([]);

  const well = wells.find((w) => w.id === wellId);

  const loadData = useCallback(async () => {
    setLoading(true);
    setAlerts([]);
    setIdx(0);
    setRunning(false);
    const res = await fetch(`/api/simulator?wellId=${wellId}&count=60`);
    const d = await res.json();
    setSamples(d.samples || []);
    setLoading(false);
  }, [wellId]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (!running || samples.length === 0) return;
    const iv = setInterval(() => {
      setIdx((prev) => {
        if (prev >= samples.length - 1) { setRunning(false); return prev; }
        const s = samples[prev + 1];
        if (s.gasReading > 5) setAlerts((a) => [...a, `⚠ High gas: ${s.gasReading}% at ${s.depth.toFixed(0)}m`]);
        if (s.pressure > 3400) setAlerts((a) => [...a, `🔴 Abnormal pressure: ${s.pressure} psi at ${s.depth.toFixed(0)}m`]);
        if (s.ecd < 10.5) setAlerts((a) => [...a, `⚠ Low ECD: ${s.ecd} ppg — possible underbalance`]);
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(iv);
  }, [running, samples]);

  const cur = samples[idx];
  const visible = samples.slice(0, idx + 1);

  const ParamTile = ({ label, value, unit, icon: Icon, warn }: { label: string; value: string; unit: string; icon: typeof Gauge; warn?: boolean }) => (
    <div className="card" style={{ padding: "var(--sp-4)", borderColor: warn ? "var(--status-critical)40" : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", marginBottom: "var(--sp-2)" }}>
        <Icon size={14} style={{ color: warn ? "var(--status-critical)" : "var(--text-tertiary)" }} />
        <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      </div>
      <div className="mono" style={{ fontSize: "1.5rem", fontWeight: 700, color: warn ? "var(--status-critical)" : "var(--text-white)" }}>
        {value} <span style={{ fontSize: "0.7rem", fontWeight: 400, color: "var(--text-muted)" }}>{unit}</span>
      </div>
    </div>
  );

  const Chart = ({ label, values, color, unit }: { label: string; values: number[]; color: string; unit: string }) => {
    const max = Math.max(...values, 1);
    const latest = values[values.length - 1];
    return (
      <div className="card" style={{ padding: "var(--sp-4)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-2)" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase" }}>{label}</span>
          <span className="mono" style={{ fontSize: "0.85rem", fontWeight: 600, color }}>{latest?.toFixed(1)} {unit}</span>
        </div>
        <div className="mini-chart-area" style={{ height: 70 }}>
          {values.slice(-30).map((v, i) => (
            <div key={i} className="bar" style={{ height: `${Math.max((v / max) * 100, 2)}%`, background: i === values.slice(-30).length - 1 ? color : `${color}60` }} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <TopHeader title="Live Monitor" />
      <div className="page-scroll">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--sp-4)" }}>
          <div>
            <h1 style={{ fontSize: "1.3rem", marginBottom: "2px" }}>Live Drilling Simulation</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
              <span className="badge badge-amber">Synthetic Data • Not Connected to eRTMAC</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: running ? "var(--status-ok)" : "var(--text-muted)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: running ? "var(--status-ok)" : "var(--text-muted)" }} />
                {running ? "LIVE" : "PAUSED"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--sp-2)", alignItems: "center" }}>
            <select className="input" style={{ width: 180 }} value={wellId} onChange={(e) => setWellId(e.target.value)}>
              {wells.filter((w) => w.status === "Active").map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
            {!running ? (
              <button className="btn btn-primary btn-sm" onClick={() => setRunning(true)} disabled={loading || samples.length === 0}>
                <Play size={14} /> Start
              </button>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={() => setRunning(false)}>
                <Pause size={14} /> Pause
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={loadData} disabled={loading}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {cur && (
          <>
            {/* Live tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "var(--sp-3)", marginBottom: "var(--sp-4)" }}>
              <ParamTile label="Depth" value={cur.depth.toFixed(0)} unit="m" icon={ArrowDown} />
              <ParamTile label="ROP" value={cur.rop.toFixed(1)} unit="m/hr" icon={TrendingUp} />
              <ParamTile label="WOB" value={cur.wob.toFixed(1)} unit="kN" icon={Gauge} />
              <ParamTile label="ECD" value={cur.ecd.toFixed(1)} unit="ppg" icon={Gauge} warn={cur.ecd < 10.5} />
              <ParamTile label="Pressure" value={cur.pressure.toString()} unit="psi" icon={Gauge} warn={cur.pressure > 3400} />
              <ParamTile label="Gas" value={cur.gasReading.toFixed(1)} unit="%" icon={Wind} warn={cur.gasReading > 5} />
            </div>

            {/* Progress */}
            <div className="card" style={{ padding: "var(--sp-3) var(--sp-4)", marginBottom: "var(--sp-4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-tertiary)", marginBottom: "var(--sp-2)" }}>
                <span className="mono">{idx + 1} / {samples.length} samples</span>
                <span className="mono">{well?.name} • {well?.depth.toLocaleString()}m TD</span>
              </div>
              <div className="risk-bar"><div className="risk-bar-fill" style={{ width: `${((idx + 1) / samples.length) * 100}%`, background: "linear-gradient(90deg, var(--accent-blue), var(--accent-teal))" }} /></div>
            </div>

            {/* Charts */}
            <div className="grid-3" style={{ marginBottom: "var(--sp-4)" }}>
              <Chart label="ROP" values={visible.map((s) => s.rop)} color="var(--status-ok)" unit="m/hr" />
              <Chart label="Pressure" values={visible.map((s) => s.pressure)} color="var(--status-info)" unit="psi" />
              <Chart label="Gas Reading" values={visible.map((s) => s.gasReading)} color="var(--status-critical)" unit="%" />
            </div>
            <div className="grid-3" style={{ marginBottom: "var(--sp-5)" }}>
              <Chart label="ECD" values={visible.map((s) => s.ecd)} color="var(--accent-blue)" unit="ppg" />
              <Chart label="Torque" values={visible.map((s) => s.torque)} color="var(--status-warn)" unit="kN·m" />
              <Chart label="Temperature" values={visible.map((s) => s.temperature)} color="var(--status-high)" unit="°C" />
            </div>

            {/* Alerts */}
            <div className="card" style={{ marginBottom: "var(--sp-5)" }}>
              <div className="card-header">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                  <AlertTriangle size={16} style={{ color: "var(--status-critical)" }} />
                  <span className="card-title">Simulation Alerts</span>
                  {alerts.length > 0 && <span className="badge badge-red">{alerts.length}</span>}
                </div>
              </div>
              {alerts.length === 0 ? (
                <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>No anomalies detected. Start the simulation to monitor for alerts.</p>
              ) : (
                <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {alerts.map((a, i) => (
                    <div key={i} className="fade-in" style={{ padding: "var(--sp-2) var(--sp-3)", background: "var(--status-critical-muted)", borderRadius: "var(--radius-sm)", fontSize: "0.78rem" }}>
                      {a}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {loading && (
          <div className="empty-state"><div className="empty-icon"><Gauge size={20} /></div><h3>Loading simulation data...</h3></div>
        )}

        <div className="proto-label">PROTOTYPE • SYNTHETIC DEMONSTRATION DATA</div>
      </div>
    </>
  );
}
