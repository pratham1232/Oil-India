"use client";

import { useState, useEffect } from "react";
import { TopHeader } from "@/components/TopHeader";
import { Search, BookOpen, FileText, ChevronRight } from "lucide-react";

interface DocResult {
  id: string; wellId: string; type: string; title: string; content: string;
}

const suggestedQueries = [
  "Mud losses near current well",
  "Stuck pipe incidents",
  "Kick events",
  "Events between 2800–2900 m",
  "Historical mitigation practices",
];

export default function KnowledgePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DocResult[]>([]);
  const [allDocs, setAllDocs] = useState<DocResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocResult | null>(null);

  useEffect(() => {
    fetch("/api/knowledge").then((r) => r.json()).then((d) => { setAllDocs(d); setResults(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSearch = async (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) { setResults(allDocs); setNoResults(false); return; }
    setSearching(true); setNoResults(false);
    if (q) setQuery(q);
    try {
      const res = await fetch(`/api/knowledge?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.message) { setResults([]); setNoResults(true); }
      else { setResults(data.results || data); setNoResults(false); }
    } catch { setNoResults(true); }
    setSearching(false);
  };

  return (
    <>
      <TopHeader title="Knowledge Base" />
      <div className="page-scroll">
        <div style={{ marginBottom: "var(--sp-5)" }}>
          <h1 style={{ fontSize: "1.3rem", marginBottom: "2px" }}>Knowledge Base</h1>
          <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>Search historical drilling events, wells, formations, and mitigation practices</p>
        </div>

        {/* Search */}
        <div className="card" style={{ marginBottom: "var(--sp-5)", padding: "var(--sp-5)" }}>
          <div style={{ display: "flex", gap: "var(--sp-3)", marginBottom: "var(--sp-3)" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "var(--sp-2)", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "var(--sp-3) var(--sp-4)" }}>
              <Search size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                style={{ background: "none", border: "none", color: "var(--text-primary)", fontFamily: "inherit", fontSize: "0.9rem", outline: "none", width: "100%" }}
                placeholder="Search historical drilling events, wells, formations, and mitigation practices..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button className="btn btn-primary" onClick={() => handleSearch()} disabled={searching}>
              {searching ? "Searching..." : "Search"}
            </button>
          </div>
          <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
            {suggestedQueries.map((q) => (
              <button key={q} className="btn btn-ghost btn-sm" onClick={() => handleSearch(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid-2">{[1, 2, 3, 4].map((i) => <div key={i} className="skeleton" style={{ height: 160 }} />)}</div>
        ) : noResults ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon"><BookOpen size={20} /></div>
              <h3>No Results Found</h3>
              <p>No relevant historical evidence found in the prototype knowledge base.</p>
              <button className="btn btn-ghost" style={{ marginTop: "var(--sp-4)" }} onClick={() => { setQuery(""); setResults(allDocs); setNoResults(false); }}>Clear Search</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: selectedDoc ? "1fr 1fr" : "1fr", gap: "var(--sp-4)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
              <p style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>{results.length} document(s) found</p>
              {results.map((doc) => (
                <div key={doc.id} className="card interactive" onClick={() => setSelectedDoc(doc.id === selectedDoc?.id ? null : doc)} style={{ borderColor: selectedDoc?.id === doc.id ? "var(--accent-blue)" : undefined }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--sp-2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                      <FileText size={16} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{doc.title}</span>
                    </div>
                    <span className={`badge ${doc.type === "WCR" ? "badge-blue" : doc.type === "DDR" ? "badge-amber" : "badge-purple"}`}>{doc.type}</span>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", lineHeight: 1.5 }}>{doc.content.substring(0, 180)}...</p>
                  <p className="mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "var(--sp-2)" }}>Well: {doc.wellId}</p>
                </div>
              ))}
            </div>
            {selectedDoc && (
              <div className="card fade-in" style={{ alignSelf: "flex-start", position: "sticky", top: 0 }}>
                <div className="card-header">
                  <div className="card-title">{selectedDoc.title}</div>
                  <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setSelectedDoc(null)}>✕</button>
                </div>
                <span className={`badge ${selectedDoc.type === "WCR" ? "badge-blue" : selectedDoc.type === "DDR" ? "badge-amber" : "badge-purple"}`}>{selectedDoc.type}</span>
                <div className="doc-view" style={{ marginTop: "var(--sp-4)" }}>{selectedDoc.content}</div>
              </div>
            )}
          </div>
        )}

        <div className="proto-label" style={{ marginTop: "var(--sp-5)" }}>PROTOTYPE • SYNTHETIC DEMONSTRATION DATA</div>
      </div>
    </>
  );
}
