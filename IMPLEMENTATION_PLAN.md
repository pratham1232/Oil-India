# Implementation Plan: NWIS Prototype

## Overview
This document outlines the step-by-step implementation plan for the NWIS (National Well Intelligence System) Prototype. The prototype is designed for future integration with OIL eRTMAC and focuses on historical data, real-time monitoring, AI-driven RAG, and risk assessment.

## Phase 1: Project Setup
- Initialize Next.js / Vite web application repository.
- Setup TailwindCSS (if requested) or custom Vanilla CSS design system.
- Configure TypeScript, ESLint, Prettier.
- Setup Prisma/Drizzle ORM for PostgreSQL.
- Initialize Git repository and first commit.

## Phase 2: Database + Seed Data
- Setup local PostgreSQL database (using docker-compose if needed).
- Define schema: Users, Wells, HistoricalEvents, Documents, RiskAlerts, etc.
- Include PostGIS/Geospatial extensions if required.
- Create seed scripts with synthetic "Prototype / Demonstration Data".
- Run migrations and seed the database.

## Phase 3: Dashboard
- Develop the main layout with a modern, dynamic UI.
- Implement authentication UI (demo accounts).
- Create dashboard widgets showing high-level stats.
- Integrate empty/loading/error states for all components.

## Phase 4: Nearby Well Map
- Integrate mapping library (Leaflet, Mapbox, or similar).
- Query and display well locations from the database.
- Implement "nearby wells" spatial calculation and visualization.

## Phase 5: Knowledge Base
- Build document repository UI.
- Display WCR, DDR, Mud Logs metadata.
- Implement full-text search across documents.
- Fallback text: "No relevant historical evidence found in the prototype knowledge base."

## Phase 6: RAG (Retrieval-Augmented Generation)
- Set up Gemini AI integration.
- Implement vector embeddings for historical documents.
- Build vector search functionality (pgvector).
- Create endpoints to feed context to Gemini.
- Implement "Demo Intelligence Mode" fallback if Gemini is unavailable.

## Phase 7: Risk Engine
- Build rule-based / ML-lite risk assessment logic.
- Correlate real-time variables with historical risks.
- Design database schema for risk scores and alert history.

## Phase 8: Live Simulator
- Create a mock real-time data stream (simulating drilling telemetry).
- Update UI components dynamically as simulated data flows.
- Optimize map rendering and bundle size for performance.

## Phase 9: Alerts
- Implement real-time notifications for risk threshold breaches.
- Create an Alert Detail view explaining "why the risk was generated".
- Show linked historical evidence.

## Phase 10: AI Assistant
- Build chat interface for asking questions about wells and operations.
- Connect chat UI to RAG pipeline.
- Implement prompt engineering for oil & gas context.

## Phase 11: Polish
- Refine aesthetics: colors, gradients, micro-animations, glassmorphism.
- Ensure SEO best practices and semantic HTML.
- Review error states and fallback UI.
- Validate "Designed for future integration with OIL eRTMAC." messaging.

## Phase 12: Testing
- End-to-end testing of core workflows: Login, Explore, Map, Search, AI Chat, Simulator, Alerts.
- Test mobile/tablet responsiveness.
- Verify API response times and database queries.
- Run production build locally and fix errors.

## Phase 13: Vercel Deployment Readiness
- Remove unused dependencies.
- Prepare environment variables (`DATABASE_URL`, `GEMINI_API_KEY`).
- Create comprehensive `README.md`.
- Deploy to Vercel and verify functionality on the live URL.
