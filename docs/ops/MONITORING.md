# PetSaathi Production Monitoring & Observability Runbook

## Health Checks & Liveness
- **Endpoint**: `GET /api/health`
- **Response Format**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-09-05T02:00:00.000Z",
    "db": "connected",
    "uptimeSeconds": 1425,
    "version": "0.1.0",
    "latencyMs": 4
  }
  ```
- **Alert Trigger**: If `db` is "disconnected" or HTTP status != 200 for > 60s -> P1 Incident.

## Key Performance Indicators (KPIs)
Computed continuously via `src/lib/observability/business-metrics.ts`:
1. **Bookings Created / Hour**: Core demand metric.
2. **Completed vs Cancelled Ratio**: Platform fulfillment efficiency.
3. **Payment Success Rate**: Target >= 95.0%.
4. **Chatbot Fallback Rate**: Target <= 10.0%.
5. **P95 Sitter Query Latency**: Target <= 300ms.
