"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TopHeader, useActiveWell } from "@/components/TopHeader";
import { MapPin, Filter, ChevronRight, Crosshair, Layers } from "lucide-react";
import { wells, getNearbyWells, getEventsForWell, haversineDistance, type Well } from "@/lib/data";

export default function MapPage() {
  const { activeWellId } = useActiveWell();
  const activeWell = wells.find((w) => w.id === activeWellId);
  const [radius, setRadius] = useState(50);
  const [riskFilter, setRiskFilter] = useState("All");
  const [selectedWell, setSelectedWell] = useState<Well | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  const nearbyWells = getNearbyWells(activeWellId, radius);
  const filteredWells = riskFilter === "All" ? nearbyWells : nearbyWells.filter((w) => w.riskLevel === riskFilter);

  useEffect(() => {
    if (!mapRef.current || mapReady || leafletMapRef.current) return;

    import("leaflet").then((L) => {
      if (!mapRef.current || leafletMapRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(link);
      }

      const center = activeWell
        ? [activeWell.latitude, activeWell.longitude] as [number, number]
        : [27.0, 95.0] as [number, number];

      const map = L.map(mapRef.current, { zoomControl: false }).setView(center, 9);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org">OSM</a>',
        maxZoom: 19,
        className: 'map-tiles-dark'
      }).addTo(map);

      const colorMap: Record<string, string> = {
        Critical: "#ef4444", High: "#f97316", Medium: "#f59e0b", Low: "#22c55e",
      };

      // Active well marker
      if (activeWell) {
        const activeIcon = L.divIcon({
          className: "",
          html: `<div style="width:20px;height:20px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 16px rgba(59,130,246,0.6);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        L.marker([activeWell.latitude, activeWell.longitude], { icon: activeIcon }).addTo(map)
          .bindPopup(`<div style="font-family:Inter,sans-serif;min-width:180px;"><h3 style="margin:0 0 4px;font-size:13px;">${activeWell.name}</h3><p style="margin:0;color:#666;font-size:11px;">Active Well • ${activeWell.field}</p><hr style="margin:6px 0;border:none;border-top:1px solid #eee;"><p style="margin:2px 0;font-size:11px;"><b>Depth:</b> ${activeWell.depth.toLocaleString()}m</p></div>`);

        // Radius circle
        L.circle([activeWell.latitude, activeWell.longitude], {
          radius: radius * 1000,
          color: "#3b82f620",
          fillColor: "#3b82f608",
          weight: 1,
        }).addTo(map);
      }

      // Nearby wells
      wells.forEach((w) => {
        if (w.id === activeWellId) return;
        const color = colorMap[w.riskLevel] || "#94a3b8";
        const evts = getEventsForWell(w.id);
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.5);box-shadow:0 0 8px ${color}50;cursor:pointer;"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });
        const dist = activeWell ? haversineDistance(activeWell.latitude, activeWell.longitude, w.latitude, w.longitude).toFixed(1) : "—";
        L.marker([w.latitude, w.longitude], { icon }).addTo(map)
          .bindPopup(`<div style="font-family:Inter,sans-serif;min-width:190px;"><h3 style="margin:0 0 4px;font-size:13px;">${w.name}</h3><p style="margin:0;color:#666;font-size:11px;">${w.field} • ${dist} km</p><hr style="margin:6px 0;border:none;border-top:1px solid #eee;"><p style="margin:2px 0;font-size:11px;"><b>Depth:</b> ${w.depth.toLocaleString()}m</p><p style="margin:2px 0;font-size:11px;"><b>Risk:</b> <span style="color:${color};font-weight:700;">${w.riskLevel}</span></p><p style="margin:2px 0;font-size:11px;"><b>Events:</b> ${evts.length}</p><a href="/wells/${w.id}" style="display:block;margin-top:6px;font-size:11px;color:#3b82f6;">View Details →</a></div>`)
          .on("click", () => setSelectedWell(w));
      });

      leafletMapRef.current = map;
      setMapReady(true);
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        setMapReady(false);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TopHeader title="Nearby Wells" />
      <div className="page-scroll">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--sp-4)" }}>
          <div>
            <h1 style={{ fontSize: "1.3rem", marginBottom: "2px" }}>Nearby Well Map</h1>
            <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
              Geospatial intelligence — {filteredWells.length} offset wells within {radius} km of {activeWell?.name}
            </p>
          </div>
          <div style={{ display: "flex", gap: "var(--sp-2)" }}>
            {[10, 25, 50].map((r) => (
              <button key={r} className={`btn btn-sm ${radius === r ? "btn-primary" : "btn-ghost"}`} onClick={() => setRadius(r)}>
                {r} km
              </button>
            ))}
            <select className="input" style={{ width: 120 }} value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="All">All Risk</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selectedWell ? "1fr 340px" : "1fr", gap: "var(--sp-4)", marginBottom: "var(--sp-5)" }}>
          {/* Map */}
          <div className="map-wrapper" style={{ position: "relative" }}>
            <div ref={mapRef} style={{ height: 520, width: "100%" }} />
            {/* Legend */}
            <div className="map-legend">
              <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--text-tertiary)", marginBottom: "6px", textTransform: "uppercase" }}>Risk Level</p>
              {[
                { label: "Critical", color: "#ef4444" },
                { label: "High", color: "#f97316" },
                { label: "Medium", color: "#f59e0b" },
                { label: "Low", color: "#22c55e" },
                { label: "Active Well", color: "#3b82f6" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected well drawer */}
          {selectedWell && (
            <div className="card fade-in" style={{ alignSelf: "flex-start" }}>
              <div className="card-header">
                <div className="card-title">{selectedWell.name}</div>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setSelectedWell(null)}>✕</button>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginBottom: "var(--sp-4)" }}>{selectedWell.field} Field</p>

              {[
                ["Distance", activeWell ? `${haversineDistance(activeWell.latitude, activeWell.longitude, selectedWell.latitude, selectedWell.longitude).toFixed(1)} km` : "—"],
                ["Status", selectedWell.status],
                ["Depth", `${selectedWell.depth.toLocaleString()} m`],
                ["Risk", selectedWell.riskLevel],
                ["Coordinates", `${selectedWell.latitude.toFixed(4)}°N, ${selectedWell.longitude.toFixed(4)}°E`],
                ["Events", `${getEventsForWell(selectedWell.id).length} recorded`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border-subtle)", fontSize: "0.8rem" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>{label}</span>
                  <span style={{ fontWeight: 500 }} className={label === "Depth" || label === "Distance" ? "mono" : ""}>{value}</span>
                </div>
              ))}

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)", marginTop: "var(--sp-4)" }}>
                <Link href={`/wells/${selectedWell.id}`} className="btn btn-primary btn-sm" style={{ justifyContent: "center" }}>
                  View Full Profile <ChevronRight size={14} />
                </Link>
                <Link href={`/assistant`} className="btn btn-ghost btn-sm" style={{ justifyContent: "center" }}>
                  Ask AI About This Well
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Offset Well List */}
        <div className="card" style={{ marginBottom: "var(--sp-5)" }}>
          <div className="card-header">
            <div className="card-title">Offset Well List ({filteredWells.length})</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Well</th>
                <th>Distance</th>
                <th>Field</th>
                <th>Depth</th>
                <th>Risk</th>
                <th>Events</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredWells.map((w) => {
                const dist = activeWell ? haversineDistance(activeWell.latitude, activeWell.longitude, w.latitude, w.longitude).toFixed(1) : "—";
                const evts = getEventsForWell(w.id);
                return (
                  <tr key={w.id} className="clickable" onClick={() => setSelectedWell(w)}>
                    <td style={{ fontWeight: 600 }}>{w.name}</td>
                    <td className="mono">{dist} km</td>
                    <td style={{ color: "var(--text-secondary)" }}>{w.field}</td>
                    <td className="mono">{w.depth.toLocaleString()}m</td>
                    <td><span className={`badge ${w.riskLevel === "Critical" ? "badge-red" : w.riskLevel === "High" ? "badge-orange" : w.riskLevel === "Medium" ? "badge-amber" : "badge-green"}`}>{w.riskLevel}</span></td>
                    <td className="mono">{evts.length}</td>
                    <td><ChevronRight size={14} style={{ color: "var(--text-muted)" }} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="proto-label">PROTOTYPE • SYNTHETIC DEMONSTRATION DATA</div>
      </div>
    </>
  );
}
