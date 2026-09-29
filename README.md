# Oil-India
# NWIS — National Well Intelligence System (Vercel)

> **Prototype / Demonstration Data**
> Designed for future integration with OIL eRTMAC.

## Project Overview

NWIS is an AI-driven drilling intelligence prototype that combines historical well data, real-time monitoring simulation, RAG-powered knowledge retrieval, and automated risk assessment into a cohesive, production-quality dashboard.

A judge can independently:
- Log in (demo account)
- Explore wells on an interactive map
- View detailed well profiles with historical events
- Search the knowledge base (WCR, DDR, Mud Logs)
- Ask questions to the AI assistant (RAG pipeline)
- Run a live drilling simulation
- Trigger and inspect risk alerts with linked evidence
- Understand why each risk was generated

## Architecture

```
HISTORICAL DOCUMENTS
WCR / DDR / Mud Logs
        ↓
DOCUMENT INTELLIGENCE
        ↓
KNOWLEDGE EXTRACTION
        ↓
POSTGRESQL + VECTOR SEARCH + GEOSPATIAL DATA
        ↓
RAG + GEMINI + RISK ENGINE
        ↓
REAL-TIME MONITOR
        ↓
NWIS DASHBOARD
```

### Data Flow
1. **Synthetic Data Layer** (`src/lib/data.ts`) — 10 wells, 12 historical events, 6 documents (WCR/DDR/Mud Logs), 4 risk alerts
2. **API Routes** (`src/app/api/`) — REST endpoints for wells, knowledge search, risk calculation, simulation, AI assistant
3. **RAG Pipeline** — Retrieves relevant documents, builds context, feeds to Gemini (or Demo Intelligence fallback)
4. **Risk Engine** — Scores wells based on historical events + real-time parameters
5. **Frontend** — Next.js App Router with glassmorphism UI, interactive map, real-time charts

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS (glassmorphism, dark mode) |
| Database | PostgreSQL + pgvector (via Prisma ORM) |
| Maps | Leaflet.js with CartoDB dark tiles |
| AI/LLM | Google Gemini 2.0 Flash |
| RAG | Custom text-based retrieval + Gemini context injection |
| Deployment | Vercel |

## Database Setup

### Option 1: Docker (Recommended for local dev)
```bash
docker-compose up -d
```
This starts PostgreSQL 16 with pgvector on port 5432.

### Option 2: External PostgreSQL
Point `DATABASE_URL` in `.env` to any PostgreSQL instance.

### Run Migrations
```bash
npx prisma migrate dev --name init
npx prisma generate
```

> **Note:** The prototype currently uses an in-memory synthetic data layer (`src/lib/data.ts`) for portability. The Prisma schema is ready for full database integration.

## Environment Variables

Create a `.env` file in the project root:

```env
# Database (matches docker-compose.yml)
DATABASE_URL="postgresql://postgres:password@localhost:5432/nwis?schema=public"

# Gemini API Key (optional — falls back to Demo Intelligence Mode)
GEMINI_API_KEY="your-gemini-api-key-here"
```

> ⚠️ **Security:** Never commit `.env` to version control. Never expose `DATABASE_URL` or `GEMINI_API_KEY` in client-side code.

## Local Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vercel Deployment

1. Push your repository to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` — your production PostgreSQL connection string
   - `GEMINI_API_KEY` — your Google AI API key
4. Deploy

The app uses Next.js App Router and is fully compatible with Vercel's serverless architecture.

## Demo Accounts

| Email | Role |
|-------|------|
| admin@nwis-demo.com | Administrator |

> Authentication is simulated for the prototype. No actual credentials are validated.

## Demo Workflow

1. **Dashboard** → View overall well statistics, active alerts, risk overview
2. **Wells** → Browse all 10 wells, filter by status, click for details
3. **Well Detail** → Inspect events, documents (WCR/DDR/Mud Logs), alerts with evidence, nearby wells
4. **Nearby Well Map** → Interactive dark-themed map with color-coded risk markers
5. **Knowledge Base** → Full-text search across historical documents
6. **Risk Engine** → Calculate risk scores with custom ECD/gas parameters, view all alerts
7. **Live Simulator** → Run real-time drilling telemetry simulation, watch anomaly alerts trigger
8. **AI Assistant** → Ask natural language questions about wells and operations

## Synthetic Data Disclaimer

> ⚠️ **All data in this prototype is synthetic demonstration data.**
>
> Well names, coordinates, events, and documents are fabricated for demonstration purposes. They do not represent real wells or actual drilling operations.
>
> The well locations are set in the Upper Assam basin region (India) to provide realistic geospatial context for the OIL India scenario.

## Gemini Setup

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add it to `.env` as `GEMINI_API_KEY`
4. The AI Assistant will automatically use Gemini RAG mode

**Without a Gemini key:** The system falls back to **Demo Intelligence Mode**, which provides pre-computed intelligent responses based on the knowledge base.

## Known Limitations

- **Database:** Currently uses in-memory synthetic data; Prisma schema is ready for PostgreSQL migration
- **Vector Search:** Text-based keyword matching simulates pgvector embeddings
- **Authentication:** Simulated — no actual user validation
- **Real-time Data:** Simulated via generated telemetry samples (not actual sensor data)
- **Scale:** Optimized for 10 prototype wells; production would need pagination/virtualization
- **H2S Monitoring:** Mentioned in data but no dedicated H2S dashboard module

## Future eRTMAC Integration

> **Designed for future integration with OIL eRTMAC.**

Planned integration points:
- Live WITSML data feeds replacing simulated telemetry
- Real-time pore pressure monitoring from MWD/LWD tools
- eRTMAC alert ingestion and correlation with NWIS risk engine
- Automated WCR/DDR parsing via Document Intelligence pipeline
- pgvector-based semantic search replacing keyword matching
- Multi-well real-time monitoring with geofenced alerts

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── assistant/route.ts   # AI chat with RAG + Gemini
│   │   ├── knowledge/route.ts   # Document search
│   │   ├── risk/route.ts        # Risk calculation + alerts
│   │   ├── simulator/route.ts   # Drilling telemetry generation
│   │   └── wells/
│   │       ├── route.ts         # List all wells
│   │       └── [id]/route.ts    # Well detail
│   ├── assistant/page.tsx       # AI Assistant chat
│   ├── knowledge/page.tsx       # Knowledge base search
│   ├── map/page.tsx             # Interactive well map
│   ├── risk/page.tsx            # Risk engine + calculator
│   ├── simulator/page.tsx       # Live drilling simulator
│   ├── wells/
│   │   ├── page.tsx             # Wells directory
│   │   └── [id]/page.tsx        # Well detail view
│   ├── globals.css              # Design system
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Dashboard
├── components/
│   └── Sidebar.tsx              # Navigation sidebar
└── lib/
    └── data.ts                  # Synthetic data + helpers
```

## License

Prototype — Hackathon Project
