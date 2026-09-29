// Synthetic demonstration data for the NWIS Prototype
// "Prototype / Demonstration Data" — Designed for future eRTMAC integration.

export interface Well {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: "Active" | "Inactive" | "Monitoring";
  depth: number;       // meters
  operator: string;
  field: string;
  spudDate: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
}

export interface HistoricalEvent {
  id: string;
  wellId: string;
  description: string;
  date: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  type: "Kick" | "Loss of Circulation" | "Stuck Pipe" | "Gas Influx" | "Equipment Failure" | "BOP Activation" | "Wellbore Instability";
}

export interface Document {
  id: string;
  wellId: string;
  type: "WCR" | "DDR" | "Mud Log";
  title: string;
  content: string;
  uploadedAt: string;
}

export interface RiskAlert {
  id: string;
  wellId: string;
  riskScore: number;
  reason: string;
  evidence: string[];
  createdAt: string;
  status: "Active" | "Acknowledged" | "Resolved";
}

export interface DrillingSample {
  timestamp: string;
  depth: number;
  rop: number;         // rate of penetration m/hr
  wob: number;         // weight on bit kN
  rpm: number;
  torque: number;      // kN·m
  mudWeight: number;   // ppg
  ecd: number;         // equivalent circulating density ppg
  pressure: number;    // psi
  temperature: number; // °C
  gasReading: number;  // units ppm
}

// ============================================================
// WELLS
// ============================================================
export const wells: Well[] = [
  {
    id: "well-001",
    name: "Lakwa-77",
    latitude: 26.8467,
    longitude: 94.8950,
    status: "Active",
    depth: 3450,
    operator: "OIL India",
    field: "Lakwa",
    spudDate: "2024-03-15",
    riskLevel: "Medium",
  },
  {
    id: "well-002",
    name: "Rudrasagar-45",
    latitude: 26.9300,
    longitude: 94.7200,
    status: "Active",
    depth: 2890,
    operator: "OIL India",
    field: "Rudrasagar",
    spudDate: "2024-01-22",
    riskLevel: "High",
  },
  {
    id: "well-003",
    name: "Geleki-112",
    latitude: 26.7800,
    longitude: 94.9500,
    status: "Monitoring",
    depth: 4100,
    operator: "OIL India",
    field: "Geleki",
    spudDate: "2023-11-08",
    riskLevel: "Low",
  },
  {
    id: "well-004",
    name: "Jorhat-East-29",
    latitude: 26.7500,
    longitude: 94.2167,
    status: "Active",
    depth: 2200,
    operator: "OIL India",
    field: "Jorhat",
    spudDate: "2024-06-01",
    riskLevel: "Critical",
  },
  {
    id: "well-005",
    name: "Moran-88",
    latitude: 27.1500,
    longitude: 94.8833,
    status: "Active",
    depth: 3780,
    operator: "OIL India",
    field: "Moran",
    spudDate: "2024-02-14",
    riskLevel: "Medium",
  },
  {
    id: "well-006",
    name: "Naharkatiya-56",
    latitude: 27.2833,
    longitude: 95.3500,
    status: "Inactive",
    depth: 2650,
    operator: "OIL India",
    field: "Naharkatiya",
    spudDate: "2023-09-30",
    riskLevel: "Low",
  },
  {
    id: "well-007",
    name: "Digboi-Legacy-14",
    latitude: 27.3833,
    longitude: 95.6167,
    status: "Monitoring",
    depth: 1950,
    operator: "OIL India",
    field: "Digboi",
    spudDate: "2023-07-12",
    riskLevel: "Low",
  },
  {
    id: "well-008",
    name: "Duliajan-Central-33",
    latitude: 27.3667,
    longitude: 95.3167,
    status: "Active",
    depth: 3100,
    operator: "OIL India",
    field: "Duliajan",
    spudDate: "2024-04-18",
    riskLevel: "Medium",
  },
  {
    id: "well-009",
    name: "Tengakhat-21",
    latitude: 27.2333,
    longitude: 95.1833,
    status: "Active",
    depth: 2480,
    operator: "OIL India",
    field: "Tengakhat",
    spudDate: "2024-05-07",
    riskLevel: "High",
  },
  {
    id: "well-010",
    name: "Makum-West-9",
    latitude: 27.3333,
    longitude: 95.4667,
    status: "Inactive",
    depth: 1800,
    operator: "OIL India",
    field: "Makum",
    spudDate: "2023-04-20",
    riskLevel: "Low",
  },
];

// ============================================================
// HISTORICAL EVENTS
// ============================================================
export const historicalEvents: HistoricalEvent[] = [
  {
    id: "evt-001",
    wellId: "well-001",
    description: "Minor gas influx detected at 2,800m while drilling through Barail sandstone. Controlled via mud weight increase from 10.5 to 11.2 ppg.",
    date: "2024-05-20",
    severity: "Medium",
    type: "Gas Influx",
  },
  {
    id: "evt-002",
    wellId: "well-002",
    description: "Complete loss of circulation at 2,450m in fractured Tipam formation. Lost 320 barrels of mud. LCM pill successfully deployed.",
    date: "2024-03-15",
    severity: "High",
    type: "Loss of Circulation",
  },
  {
    id: "evt-003",
    wellId: "well-002",
    description: "Stuck pipe incident at 2,680m due to differential sticking in depleted zone. Freed after 6 hours of working.",
    date: "2024-04-02",
    severity: "High",
    type: "Stuck Pipe",
  },
  {
    id: "evt-004",
    wellId: "well-004",
    description: "Well kick detected at 1,900m. BOP activated. Well successfully killed with 12.8 ppg kill mud.",
    date: "2024-07-10",
    severity: "Critical",
    type: "Kick",
  },
  {
    id: "evt-005",
    wellId: "well-003",
    description: "Wellbore instability observed in shale section at 3,200m. Hole collapse risk mitigated by switching to oil-based mud.",
    date: "2024-01-28",
    severity: "Medium",
    type: "Wellbore Instability",
  },
  {
    id: "evt-006",
    wellId: "well-005",
    description: "BOP stack test failure during routine inspection. Annular preventer replaced within 48 hours.",
    date: "2024-04-15",
    severity: "High",
    type: "Equipment Failure",
  },
  {
    id: "evt-007",
    wellId: "well-001",
    description: "Stuck pipe at 3,100m. Pack-off due to inadequate hole cleaning in deviated section. Freed using back-reaming.",
    date: "2024-06-30",
    severity: "Medium",
    type: "Stuck Pipe",
  },
  {
    id: "evt-008",
    wellId: "well-009",
    description: "Gas kick at 2,200m in Girujan formation. Shut-in pressure reached 850 psi. Controlled via driller's method.",
    date: "2024-06-15",
    severity: "Critical",
    type: "Kick",
  },
  {
    id: "evt-009",
    wellId: "well-008",
    description: "Partial loss of circulation at 2,900m. 80 barrels lost before LCM treatment sealed the loss zone.",
    date: "2024-05-22",
    severity: "Medium",
    type: "Loss of Circulation",
  },
  {
    id: "evt-010",
    wellId: "well-004",
    description: "Top drive motor failure at 1,500m depth. 36-hour NPT while replacement was sourced from Duliajan base.",
    date: "2024-08-05",
    severity: "High",
    type: "Equipment Failure",
  },
  {
    id: "evt-011",
    wellId: "well-005",
    description: "Minor gas show detected at 3,400m. Background gas increased from 0.5% to 3.2%. Monitored and controlled.",
    date: "2024-03-28",
    severity: "Low",
    type: "Gas Influx",
  },
  {
    id: "evt-012",
    wellId: "well-003",
    description: "BOP activation during connection gas event at 3,800m. Controlled shut-in. Circulated out gas safely.",
    date: "2024-02-18",
    severity: "High",
    type: "BOP Activation",
  },
];

// ============================================================
// DOCUMENTS (WCR / DDR / Mud Logs)
// ============================================================
export const documents: Document[] = [
  {
    id: "doc-001",
    wellId: "well-001",
    type: "WCR",
    title: "Lakwa-77 Well Completion Report",
    content: `WELL COMPLETION REPORT — LAKWA-77
Field: Lakwa | Block: Upper Assam Shelf | Operator: OIL India
Total Depth: 3,450m MD | Formation at TD: Barail Group

DRILLING SUMMARY:
- Spud date: 15-Mar-2024
- 17.5" surface hole: 0–450m (Alluvium, Dhekiajuli)
- 12.25" intermediate: 450–2,200m (Tipam, Girujan)
- 8.5" production hole: 2,200–3,450m (Barail Sandstone)

KEY OBSERVATIONS:
- Gas influx at 2,800m required mud weight increase to 11.2 ppg
- Lost circulation at 2,600m controlled with LCM pill (150 bbl)
- Oil shows in Barail sandstone at 3,150–3,280m
- DST-1 at 3,180–3,220m: Flowed 180 BOPD, 0.4 MMscfd gas
- Casing set and cemented at 3,400m

MUD SYSTEM:
- Water-based mud (WBM) 0–2,200m
- Oil-based mud (OBM) 2,200–3,450m
- Maximum mud weight: 11.5 ppg at TD

RECOMMENDATIONS:
- Monitor gas influx zone at 2,800m during production
- Consider wellbore stability analysis for offset wells in Barail section`,
    uploadedAt: "2024-08-15",
  },
  {
    id: "doc-002",
    wellId: "well-002",
    type: "DDR",
    title: "Rudrasagar-45 Daily Drilling Report #47",
    content: `DAILY DRILLING REPORT #47 — RUDRASAGAR-45
Date: 15-Mar-2024 | Report Period: 06:00–06:00
Depth: 2,450m MD | Planned TD: 2,890m

OPERATIONS SUMMARY (24-hr):
06:00–09:00: Drilling 12.25" hole from 2,420m to 2,450m
09:00–09:30: Complete loss of circulation at 2,450m
09:30–14:00: Pumped 150 bbl LCM pill (CaCO3 + Mica blend)
14:00–16:00: Waited on mud. Losses reduced from total to 40 bbl/hr
16:00–20:00: Pumped second LCM pill (200 bbl). Losses stopped.
20:00–06:00: Resumed drilling. Made 2,450–2,480m. ROP 4.2 m/hr

MUD PROPERTIES:
- MW: 10.8 ppg | Vis: 52 sec/qt | PV: 22 | YP: 18
- Total mud volume: 650 bbl (320 bbl lost during event)

BIT DATA:
- Bit #4: 12.25" PDC, 186 hrs, graded 2-2-WT-S-E-I-CT-TD

SAFETY: Zero incidents. JSA completed for LCM operations.

NPT: 7 hours (loss of circulation event)`,
    uploadedAt: "2024-03-16",
  },
  {
    id: "doc-003",
    wellId: "well-004",
    type: "WCR",
    title: "Jorhat-East-29 Well Completion Report",
    content: `WELL COMPLETION REPORT — JORHAT-EAST-29
Field: Jorhat | Block: Upper Assam Shelf | Operator: OIL India
Total Depth: 2,200m MD | Formation at TD: Tipam Group

DRILLING SUMMARY:
- Spud date: 01-Jun-2024
- 17.5" surface hole: 0–350m
- 12.25" intermediate: 350–1,600m
- 8.5" production hole: 1,600–2,200m

CRITICAL INCIDENT:
- Well kick at 1,900m on 10-Jul-2024
- SIDPP: 420 psi, SICP: 580 psi
- Kill mud weight: 12.8 ppg (from 10.2 ppg)
- Well killed using driller's method in 14 hours
- Root cause: Unexpected pore pressure increase in transition zone

POST-INCIDENT ANALYSIS:
- Pore pressure gradient: 0.52 psi/ft (vs predicted 0.46 psi/ft)
- Offset well data from Jorhat-East-22 was insufficient
- Recommend real-time pore pressure monitoring for future wells

COMPLETION:
- 7" liner set at 2,180m
- Perforated at 1,950–2,020m in Tipam sand
- Initial production: 95 BOPD, WC 15%`,
    uploadedAt: "2024-09-01",
  },
  {
    id: "doc-004",
    wellId: "well-003",
    type: "Mud Log",
    title: "Geleki-112 Mud Log Summary",
    content: `MUD LOG SUMMARY — GELEKI-112
Interval: 3,000m – 4,100m (Barail Group)
Date Range: Dec 2023 – Feb 2024

GAS READINGS:
3,000–3,200m: Background gas 0.2–0.5%, C1 dominant
3,200–3,400m: Increased background to 1.2%, C1/C2 ratio declining
  ⚠ Wellbore instability noted at 3,200m (cavings observed)
3,400–3,600m: Trip gas peaks up to 8.5% TG
3,600–3,800m: Connection gas events (5–12% TG per connection)
  ⚠ BOP activation at 3,800m due to connection gas
3,800–4,000m: Background gas 2.5–4.0%, oil shows in cuttings
4,000–4,100m: TD reached. Background gas 1.8%

LITHOLOGY:
- 3,000–3,200m: Grey shale, moderately hard, fissile
- 3,200–3,500m: Interbedded sandstone/shale
- 3,500–3,800m: Fine-grained sandstone, oil staining
- 3,800–4,100m: Siltstone with minor sandstone stringers

DRILLING PARAMETERS AT KEY ZONES:
- ROP: 2.8–8.5 m/hr
- WOB: 8–22 klbs
- RPM: 60–140
- Torque: generally trending up through shale sections`,
    uploadedAt: "2024-03-05",
  },
  {
    id: "doc-005",
    wellId: "well-005",
    type: "DDR",
    title: "Moran-88 Daily Drilling Report #62",
    content: `DAILY DRILLING REPORT #62 — MORAN-88
Date: 28-Mar-2024 | Depth: 3,400m MD

OPERATIONS:
06:00–12:00: Drilling 8.5" hole from 3,370m to 3,400m. ROP 5 m/hr
12:00–13:00: Minor gas show. Background gas up from 0.5% to 3.2%
13:00–15:00: Flow check — no flow observed. Continued drilling
15:00–06:00: Drilled to 3,430m. Gas readings returned to normal

MUD:
- OBM, MW: 11.0 ppg
- Maintained 200 psi overbalance

NOTES:
- Gas show correlates with thin sandstone stringer at 3,395m
- No kick indicators. ECD maintained above pore pressure
- Mudlogger recommended increased monitoring below 3,500m`,
    uploadedAt: "2024-03-29",
  },
  {
    id: "doc-006",
    wellId: "well-009",
    type: "WCR",
    title: "Tengakhat-21 Well Completion Report",
    content: `WELL COMPLETION REPORT — TENGAKHAT-21
Field: Tengakhat | Block: Upper Assam | Operator: OIL India
Total Depth: 2,480m MD

CRITICAL INCIDENT — GAS KICK:
- Date: 15-Jun-2024
- Depth at event: 2,200m
- Formation: Girujan Clay
- Shut-in pressures: SIDPP 380 psi, SICP 620 psi
- Kill mud: 13.1 ppg (from 10.5 ppg)
- Kill method: Driller's method, 18 hours
- Gas type: Methane with H2S traces (12 ppm)

ROOT CAUSE ANALYSIS:
- Abnormal pressure pocket in Girujan shale
- Predicted pore pressure: 10.0 ppg EMW
- Actual pore pressure: 12.5 ppg EMW
- Seismic data did not indicate fault proximity
- Post-incident review suggests minor fault displacement

LESSONS LEARNED:
- Install real-time pore pressure monitoring
- Update geological model for Tengakhat area
- Increase mud weight safety margin in Girujan transition zones`,
    uploadedAt: "2024-08-20",
  },
];

// ============================================================
// RISK ALERTS
// ============================================================
export const riskAlerts: RiskAlert[] = [
  {
    id: "risk-001",
    wellId: "well-004",
    riskScore: 92,
    reason: "Abnormal pore pressure detected. Historical kick event at same well. Current mud weight may be insufficient for deeper section.",
    evidence: [
      "Well kick at 1,900m on 10-Jul-2024 (SIDPP: 420 psi)",
      "Offset well Jorhat-East-22 had similar pressure anomaly",
      "Current ECD trending below predicted pore pressure gradient",
    ],
    createdAt: "2024-09-15T10:30:00Z",
    status: "Active",
  },
  {
    id: "risk-002",
    wellId: "well-002",
    riskScore: 78,
    reason: "Repeated loss of circulation in Tipam formation. Fracture gradient may be lower than modeled.",
    evidence: [
      "Total LOC at 2,450m on 15-Mar-2024 (320 bbl lost)",
      "Stuck pipe incident at 2,680m on 02-Apr-2024",
      "Nearby well Rudrasagar-38 experienced similar LOC in same interval",
    ],
    createdAt: "2024-09-14T14:15:00Z",
    status: "Active",
  },
  {
    id: "risk-003",
    wellId: "well-009",
    riskScore: 85,
    reason: "H2S traces detected during gas kick. Personnel safety risk. Contingency plan activation recommended.",
    evidence: [
      "Gas kick at 2,200m with H2S at 12 ppm",
      "Girujan formation known for unexpected pressure pockets",
      "Offset well Tengakhat-18 also encountered H2S at similar depth",
    ],
    createdAt: "2024-09-13T08:45:00Z",
    status: "Acknowledged",
  },
  {
    id: "risk-004",
    wellId: "well-001",
    riskScore: 55,
    reason: "Moderate stuck pipe risk in deviated section. Inadequate hole cleaning indicators observed.",
    evidence: [
      "Previous stuck pipe at 3,100m on 30-Jun-2024",
      "High ECD fluctuations during connections",
      "Increasing torque trend over last 48 hours",
    ],
    createdAt: "2024-09-12T16:20:00Z",
    status: "Resolved",
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getWellById(id: string): Well | undefined {
  return wells.find((w) => w.id === id);
}

export function getEventsForWell(wellId: string): HistoricalEvent[] {
  return historicalEvents.filter((e) => e.wellId === wellId);
}

export function getDocumentsForWell(wellId: string): Document[] {
  return documents.filter((d) => d.wellId === wellId);
}

export function getAlertsForWell(wellId: string): RiskAlert[] {
  return riskAlerts.filter((a) => a.wellId === wellId);
}

export function getNearbyWells(wellId: string, radiusKm: number = 50): Well[] {
  const target = getWellById(wellId);
  if (!target) return [];
  return wells.filter((w) => {
    if (w.id === wellId) return false;
    const dist = haversineDistance(target.latitude, target.longitude, w.latitude, w.longitude);
    return dist <= radiusKm;
  });
}

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Generate simulated drilling data
export function generateDrillingSamples(wellId: string, count: number = 60): DrillingSample[] {
  const well = getWellById(wellId);
  const baseDepth = well ? well.depth - 200 : 2000;
  const samples: DrillingSample[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const t = new Date(now - (count - i) * 60000);
    const depth = baseDepth + i * (200 / count);
    const anomaly = i > count * 0.7 && i < count * 0.85;

    samples.push({
      timestamp: t.toISOString(),
      depth: Math.round(depth * 10) / 10,
      rop: Math.round((5 + Math.random() * 8 + (anomaly ? -3 : 0)) * 10) / 10,
      wob: Math.round((12 + Math.random() * 10 + (anomaly ? 5 : 0)) * 10) / 10,
      rpm: Math.round(80 + Math.random() * 60 + (anomaly ? -20 : 0)),
      torque: Math.round((8 + Math.random() * 6 + (anomaly ? 4 : 0)) * 10) / 10,
      mudWeight: Math.round((10.5 + Math.random() * 1.5) * 10) / 10,
      ecd: Math.round((11.0 + Math.random() * 1.2 + (anomaly ? -0.8 : 0)) * 10) / 10,
      pressure: Math.round(2800 + Math.random() * 400 + (anomaly ? 600 : 0)),
      temperature: Math.round((85 + Math.random() * 20 + (anomaly ? 15 : 0)) * 10) / 10,
      gasReading: Math.round((0.5 + Math.random() * 2 + (anomaly ? 8 : 0)) * 10) / 10,
    });
  }
  return samples;
}

// RAG knowledge base chunks for vector search simulation
export const knowledgeChunks = documents.map((doc) => ({
  id: doc.id,
  wellId: doc.wellId,
  type: doc.type,
  title: doc.title,
  content: doc.content,
  // Simulated embedding similarity — in production this would be pgvector
}));

export function searchKnowledge(query: string): typeof knowledgeChunks {
  const q = query.toLowerCase();
  const scored = knowledgeChunks.map((chunk) => {
    const content = chunk.content.toLowerCase();
    const title = chunk.title.toLowerCase();
    let score = 0;
    const words = q.split(/\s+/).filter((w) => w.length > 2);
    for (const word of words) {
      if (title.includes(word)) score += 3;
      const matches = content.split(word).length - 1;
      score += matches;
    }
    return { ...chunk, score };
  });
  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);
}

// Compute risk for a well based on its historical events and current parameters
export function computeRisk(wellId: string, currentEcd?: number, currentGas?: number): {
  score: number;
  level: "Low" | "Medium" | "High" | "Critical";
  factors: string[];
} {
  const events = getEventsForWell(wellId);
  const factors: string[] = [];
  let score = 0;

  // Historical event severity scoring
  for (const evt of events) {
    if (evt.severity === "Critical") { score += 25; factors.push(`Critical event: ${evt.type} on ${evt.date}`); }
    else if (evt.severity === "High") { score += 15; factors.push(`High severity: ${evt.type} on ${evt.date}`); }
    else if (evt.severity === "Medium") { score += 8; }
    else { score += 3; }
  }

  // Real-time parameter scoring
  if (currentEcd && currentEcd < 10.5) {
    score += 20;
    factors.push(`Low ECD (${currentEcd} ppg) — potential underbalance`);
  }
  if (currentGas && currentGas > 5) {
    score += 15;
    factors.push(`Elevated gas reading (${currentGas}%) — possible influx`);
  }

  score = Math.min(score, 100);

  let level: "Low" | "Medium" | "High" | "Critical";
  if (score >= 80) level = "Critical";
  else if (score >= 60) level = "High";
  else if (score >= 35) level = "Medium";
  else level = "Low";

  return { score, level, factors };
}
