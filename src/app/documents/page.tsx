"use client";

import { useState } from "react";
import { TopHeader } from "@/components/TopHeader";
import { FileText, Search, Upload, Eye, ChevronRight } from "lucide-react";
import { documents, wells } from "@/lib/data";

export default function DocumentsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const filtered = documents.filter((d) => {
    if (filter !== "All" && d.type !== filter) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const doc = documents.find((d) => d.id === selectedDoc);

  return (
    <>
      <TopHeader title="Documents" />
      <div className="page-scroll">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--sp-5)" }}>
          <div>
            <h1 style={{ fontSize: "1.3rem", marginBottom: "2px" }}>Document Intelligence</h1>
            <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>Historical WCR, DDR, and Mud Log repository — {documents.length} documents</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "var(--sp-3)", marginBottom: "var(--sp-4)", alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "var(--sp-2)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "var(--sp-2) var(--sp-3)" }}>
            <Search size={14} style={{ color: "var(--text-muted)" }} />
            <input style={{ background: "none", border: "none", color: "var(--text-primary)", fontFamily: "inherit", fontSize: "0.82rem", outline: "none", width: "100%" }}
              placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {["All", "WCR", "DDR", "Mud Log"].map((f) => (
            <button key={f} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`} onClick={() => setFilter(f)}>
              {f} ({f === "All" ? documents.length : documents.filter((d) => d.type === f).length})
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selectedDoc ? "1fr 1fr" : "1fr", gap: "var(--sp-4)" }}>
          {/* Document table */}
          <div className="card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Well</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const well = wells.find((w) => w.id === d.wellId);
                  return (
                    <tr key={d.id} className="clickable" onClick={() => setSelectedDoc(d.id === selectedDoc ? null : d.id)}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                          <FileText size={14} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
                          <span style={{ fontWeight: 500, fontSize: "0.82rem" }}>{d.title}</span>
                        </div>
                      </td>
                      <td><span className={`badge ${d.type === "WCR" ? "badge-blue" : d.type === "DDR" ? "badge-amber" : "badge-purple"}`}>{d.type}</span></td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{well?.name}</td>
                      <td className="mono" style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>{d.uploadedAt}</td>
                      <td><span className="badge badge-green">Processed</span></td>
                      <td><Eye size={14} style={{ color: "var(--text-muted)" }} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Document viewer */}
          {doc && (
            <div className="card fade-in" style={{ alignSelf: "flex-start", position: "sticky", top: 0 }}>
              <div className="card-header">
                <div className="card-title">{doc.title}</div>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setSelectedDoc(null)}>✕</button>
              </div>

              <div style={{ display: "flex", gap: "var(--sp-2)", marginBottom: "var(--sp-4)" }}>
                <span className={`badge ${doc.type === "WCR" ? "badge-blue" : doc.type === "DDR" ? "badge-amber" : "badge-purple"}`}>{doc.type}</span>
                <span className="badge badge-green">Processed</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-3)", marginBottom: "var(--sp-4)" }}>
                {[
                  ["Well", wells.find((w) => w.id === doc.wellId)?.name || doc.wellId],
                  ["Date", doc.uploadedAt],
                  ["Type", doc.type],
                  ["Status", "Pre-processed text"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "2px" }}>{label}</p>
                    <p style={{ fontSize: "0.8rem" }}>{value}</p>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "var(--sp-2)" }}>Document Content</p>
              <div className="doc-view">{doc.content}</div>

              <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "var(--sp-3)", fontStyle: "italic" }}>
                This document contains pre-processed demonstration text, not OCR-extracted content.
              </p>
            </div>
          )}
        </div>

        <div className="proto-label" style={{ marginTop: "var(--sp-5)" }}>PROTOTYPE • SYNTHETIC DEMONSTRATION DATA</div>
      </div>
    </>
  );
}
