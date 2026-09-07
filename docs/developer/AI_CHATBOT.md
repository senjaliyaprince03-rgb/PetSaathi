# PetSaathi AI Chatbot & Knowledge Base Runbook

## Overview
PetSaathi integrates NVIDIA AI Router (i/router.mjs) alongside an Indian pet-care specialized Retrieval-Augmented Generation (RAG) system (src/lib/ai/retriever.ts) and 15 curated knowledge base articles (content/pet-care-kb/*.md).

## System Architecture

`
User Prompt (English / Hindi / Hinglish)
           │
           ▼
[ /api/ai/chat ] (Rate limit: 20 req/min, RBAC: CUSTOMER / ADMIN)
           │
           ▼
[ src/lib/ai/retriever.ts ] (Top-K=3 matching across 15 Indian KB files)
           │
           ▼
[ ai/router.mjs ] (Strict NVIDIA AI router: task: "fast", capability-based)
           │
           ▼
[ NVIDIA NIM API ] (meta/llama-3.2-11b-vision-instruct / llama-3.3-70b-instruct)
           │
           ▼
Audit & Governance Logging (i/audit.mjs, /api/ai/metrics, /api/ai/health)
`

## Knowledge Base Scope (15 Modules)

1. indian-dog-breeds.md — Rajapalayam, Mudhol, Chippiparai, Indian Pariah/Indie care & climate fit.
2. indian-cat-breeds.md — Persian, Indian Billi, humidity, grooming & fur-ball management.
3. summer-heatstroke-management.md — 45°C+ peak heat protocols, paw tar-burns, hydration.
4. monsoon-paw-care.md — Pododermatitis, fungal puddles, blow-drying, tick surges.
5. 	ick-fever-season.md — Babesiosis, Ehrlichiosis, platelet tracking, Doxycycline advisory.
6. society-rwa-guidelines.md — AWBI circulars, Article 51A(g), pet lift rights, dispute de-escalation.
7. local-walk-safety.md — Street dog pack territorial management, leashing, night walk safety.
8. 
utrition-indian-context.md — Safe home-cooked foods (curd, boiled pumpkin), toxic foods (onion, garlic, grapes, raw dough).
9. accination-schedule-india.md — DHPPiL, Rabies 90-day cycle, Kennel Cough booster timelines.
10. common-emergencies-india.md — Snakebite (Russell's viper/Cobra), rat poison ingestion, 24/7 ICU triage.
11. puppy-care-first-three-months.md — Deworming schedules, socialisation before full vaccinations, teething.
12. senior-dog-care-india.md — Slippery marble/vitrified tile interventions, arthritis supplements, heat walk adjustments.
13. dog-friendly-parks-walk-routes-india.md — Cubbon Park (BLR), Carter Road (BOM), Riverfront (AMD), ARAI (PNQ).
14. 	ick-flea-prevention-india.md — Fluralaner (Bravecto), Spot-ons, Fipronil vs Permethrin (cat toxicity warning).
15. hindi-hinglish-pet-care-faq.md — Everyday queries (ulti/dast, khana na khana, garmi se bachao, stray dogs).

## Benchmark Verification Results

- **Expanded Test Suite**: 30 diverse queries across 10 specialized categories.
- **Grounding Top-K Retrieval Accuracy**: 30/30 (100.0%)
- **Response Quality & Domain Grounding**: 30/30 (100.0%)
- **Combined Benchmark Pass Rate**: 30/30 (100.0%) vs >= 90.0% target.

## Governance & Telemetry Endpoints

- GET /api/ai/health: Circuit breaker states, provider health, latency snapshot.
- GET /api/ai/metrics: Request count, token usage, error rates, p95 latency.
- GET /api/ai/governance: Rate limits, active concurrency slots, budget usage.
- GET /api/ai/rag: RAG hit rate and fallback telemetry.
