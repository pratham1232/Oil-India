"use client";

import { useState, useRef, useEffect } from "react";
import { TopHeader } from "@/components/TopHeader";
import { Bot, Send, BookOpen, FileText } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  mode?: string;
  sourceDocs?: Array<{ id: string; title: string; type: string }>;
}

const suggestions = [
  "What happened near 2850 m?",
  "Which nearby wells experienced mud losses?",
  "Risk assessment for Jorhat-East-29",
  "Stuck pipe incidents and prevention",
  "Tell me about Tengakhat-21",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `## NWIS Engineering Assistant

I can help you analyze drilling data, assess risks, and explore historical well records from the prototype knowledge base.

**Try asking:**
- "What happened near 2850 m?"
- "Which nearby wells experienced mud losses?"
- "Risk assessment for Jorhat-East-29"
- "Stuck pipe incidents and prevention"

---
*Demo Intelligence Mode — Prototype / Demonstration Data*`,
      mode: "Demo Intelligence",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((p) => [...p, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((p) => [...p, { role: "assistant", content: data.response, mode: data.mode, sourceDocs: data.sourceDocs }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "Error processing request. Please try again.", mode: "Error" }]);
    }
    setLoading(false);
  };

  const renderContent = (content: string) => content.split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i}>{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={i}>{line.slice(4)}</h3>;
    if (line.startsWith("---")) return <hr key={i} />;
    if (line.startsWith("- ")) return <li key={i}>{line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('<strong>').map((p, j) => j % 2 === 0 ? p.replace('</strong>', '') : <strong key={j}>{p.replace('</strong>', '')}</strong>)}</li>;
    if (line.startsWith("*") && line.endsWith("*")) return <p key={i} style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontStyle: "italic", marginTop: "var(--sp-2)" }}>{line.slice(1, -1)}</p>;
    if (line.trim() === "") return <br key={i} />;
    return <p key={i}>{line}</p>;
  });

  return (
    <>
      <TopHeader title="AI Assistant" />
      <div className="page-scroll" style={{ display: "flex", gap: "var(--sp-4)", height: "calc(100vh - var(--header-h) - 48px)" }}>
        {/* Chat */}
        <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
              <Bot size={18} style={{ color: "var(--accent-blue)" }} />
              <span className="card-title">Engineering Assistant</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--status-ok)" }} />
              <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                {messages[messages.length - 1]?.mode || "Demo Intelligence"}
              </span>
            </div>
          </div>

          <div className="chat-messages" style={{ flex: 1, overflow: "auto" }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`chat-msg ${msg.role === "user" ? "user" : "bot"}`}>
                  {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
                </div>
                {msg.sourceDocs && msg.sourceDocs.length > 0 && (
                  <div style={{ marginLeft: "var(--sp-4)", marginTop: "var(--sp-2)", display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                    {msg.sourceDocs.map((d) => (
                      <span key={d.id} className={`badge ${d.type === "WCR" ? "badge-blue" : d.type === "DDR" ? "badge-amber" : "badge-purple"}`} style={{ fontSize: "0.65rem" }}>
                        <FileText size={10} /> {d.title.substring(0, 25)}...
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="chat-msg bot" style={{ display: "flex", gap: "6px", padding: "var(--sp-4)" }}>
                {[0, 1, 2].map((i) => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-blue)", animation: `pulse 1.2s ease ${i * 0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap", padding: "var(--sp-3) 0", borderTop: "1px solid var(--border)" }}>
              {suggestions.map((q) => (
                <button key={q} className="btn btn-ghost btn-sm" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          )}

          <div className="chat-input-row">
            <input
              className="input input-lg"
              placeholder="Ask about wells, risks, historical events..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="btn btn-primary" onClick={() => send()} disabled={loading || !input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Evidence sidebar */}
        <div style={{ width: 300, display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
          <div className="card" style={{ flex: 1 }}>
            <div className="card-header">
              <span className="card-title">Evidence Panel</span>
            </div>
            {messages.filter((m) => m.sourceDocs && m.sourceDocs.length > 0).length === 0 ? (
              <div className="empty-state" style={{ padding: "var(--sp-8)" }}>
                <div className="empty-icon"><BookOpen size={18} /></div>
                <p style={{ fontSize: "0.78rem" }}>Source documents will appear here when the assistant references historical evidence.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
                {messages.filter((m) => m.sourceDocs).flatMap((m) => m.sourceDocs || []).filter((d, i, arr) => arr.findIndex((x) => x.id === d.id) === i).map((d) => (
                  <div key={d.id} style={{ padding: "var(--sp-3)", background: "var(--bg-secondary)", borderRadius: "var(--radius)", border: "1px solid var(--border-subtle)" }}>
                    <span className={`badge ${d.type === "WCR" ? "badge-blue" : d.type === "DDR" ? "badge-amber" : "badge-purple"}`} style={{ marginBottom: "var(--sp-2)" }}>{d.type}</span>
                    <p style={{ fontSize: "0.78rem", fontWeight: 500 }}>{d.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: "var(--sp-2)" }}>Mode</p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              {messages.some((m) => m.mode === "Gemini RAG") ? "Gemini RAG — responses use retrieved documents as context" : "Demo Intelligence — pre-computed responses from the knowledge base"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
