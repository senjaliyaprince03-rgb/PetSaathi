# Horizontal Scaling Readiness — PetSaathi

> **Status**: Production-ready for horizontal scaling  
> **Last Updated**: September 2026

## Architecture Overview

PetSaathi is designed as a **stateless, horizontally-scalable** Next.js application. Any instance can serve any request — there is no server-side session affinity requirement.

```
                    ┌──────────────┐
                    │   NGINX /    │
                    │   AWS ALB    │
                    │ (L7 LB)     │
                    └──────┬───────┘
               ┌───────────┼───────────┐
               ▼           ▼           ▼
          ┌─────────┐ ┌─────────┐ ┌─────────┐
          │ Next.js │ │ Next.js │ │ Next.js │
          │ Node 1  │ │ Node 2  │ │ Node N  │
          └────┬────┘ └────┬────┘ └────┬────┘
               │           │           │
               └───────────┼───────────┘
                           ▼
                    ┌──────────────┐
                    │ MongoDB Atlas│
                    │  (Replica    │
                    │   Set / M10+)│
                    └──────────────┘
```

## Stateless Design Checklist

| Concern | Status | Details |
|---------|--------|---------|
| **Sessions** | ✅ Stateless | JWT via NextAuth — signed JWE tokens stored client-side. No server session store. |
| **Auth State** | ✅ Stateless | JWT `iat`/`exp`/`jti` claims validated at edge. No shared session DB. |
| **Caching** | ⚠️ Process-local | `src/lib/cache.ts` uses in-memory `Map`. Acceptable at 2-5 nodes; for 10+ nodes, migrate to Redis/Upstash (deps already installed). |
| **File Uploads** | ✅ Stateless | No local file storage; uploads go directly to cloud storage. |
| **Transactions** | ✅ DB-level | All concurrency control via MongoDB transactions + Compare-and-Swap. No distributed locks needed. |
| **Rate Limiting** | ✅ Shared | `@upstash/ratelimit` uses Upstash Redis — shared across all instances. |
| **Background Jobs** | ✅ Stateless | No long-running in-process workers. Webhook processing is idempotent and stateless. |

## Session Handling — JWT Architecture

```
Client                         Any Server Node              MongoDB
  │                                  │                         │
  │──── Request + JWT Cookie ───────►│                         │
  │                                  │── Verify JWE ──────►   │
  │                                  │   (A256GCM)             │
  │                                  │                         │
  │                                  │── Fetch user if ────►   │
  │                                  │   needed (by userId)    │
  │◄──── Response ──────────────────│                         │
```

- **Signing**: `A256GCM` direct-encrypted JWE via `NEXTAUTH_SECRET`
- **Cookie**: `__Secure-next-auth.session-token` with `Secure`, `HttpOnly`, `SameSite=Lax`
- **Rotation**: Automatic token refresh on each request within expiry window
- **No sticky sessions required** — any node can validate any JWT

## Database Connection Pooling

### MongoDB Atlas Configuration

```env
# Connection string with pooling parameters
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/petsaathi?retryWrites=true&w=majority&maxPoolSize=20&minPoolSize=5&maxIdleTimeMS=30000&connectTimeoutMS=10000&serverSelectionTimeoutMS=5000"
```

| Parameter | Recommended | Rationale |
|-----------|-------------|-----------|
| `maxPoolSize` | 20 per node | 5 nodes × 20 = 100 connections (Atlas M10 supports 1500) |
| `minPoolSize` | 5 | Keep warm connections to avoid cold-start latency |
| `maxIdleTimeMS` | 30000 | Release idle connections after 30s |
| `retryWrites` | true | Automatic retry on transient network errors |
| `w` | majority | Write concern for data durability |

### Prisma Client Singleton

Prisma is instantiated as a singleton (`src/lib/db.ts`) with `globalThis` caching in development. In production, each Node process maintains one `PrismaClient` instance.

## Load Balancer Configuration

### NGINX (Self-Hosted / VPS)

```nginx
upstream petsaathi {
    least_conn;
    server node1:3000 max_fails=3 fail_timeout=30s;
    server node2:3000 max_fails=3 fail_timeout=30s;
    server node3:3000 max_fails=3 fail_timeout=30s;
}

server {
    listen 443 ssl http2;
    server_name api.petsaathi.com;

    ssl_certificate     /etc/ssl/petsaathi/fullchain.pem;
    ssl_certificate_key /etc/ssl/petsaathi/privkey.pem;

    # Security headers (also set in Next.js middleware)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;

    location / {
        proxy_pass http://petsaathi;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        proxy_read_timeout 60s;

        # Health check
        proxy_next_upstream error timeout http_502 http_503;
    }

    location /api/health {
        proxy_pass http://petsaathi;
        access_log off;
    }
}
```

### AWS ALB (Cloud)

```yaml
# Target Group settings
HealthCheckPath: /api/health
HealthCheckIntervalSeconds: 30
HealthyThresholdCount: 2
UnhealthyThresholdCount: 3
DeregistrationDelay: 30

# Listener Rules
- Priority: 1
  Conditions:
    - PathPattern: /*
  Actions:
    - Type: forward
      TargetGroupArn: !Ref PetSaathiTG

# Sticky sessions NOT needed (stateless JWT)
Stickiness:
  Enabled: false
```

## Scaling Strategy

### Phase 1 — Vertical (Current: 1-2 nodes)
- Single Next.js instance on 2-4 vCPU VM
- MongoDB Atlas M10 (1500 connections)
- In-memory cache is sufficient

### Phase 2 — Horizontal (3-5 nodes)
- Deploy behind NGINX or ALB with `least_conn`
- In-memory cache per node is acceptable (60s TTL sitter cache)
- Monitor cache hit ratios — cache divergence is bounded by TTL

### Phase 3 — Scale-Out (5+ nodes)
- Migrate `src/lib/cache.ts` to Redis/Upstash (dependencies already in `package.json`)
- Swap `MemoryCache` for `@upstash/redis` — the `getOrSetCache` API stays the same
- Add read replicas to MongoDB Atlas for read-heavy queries
- Consider edge deployment via Vercel for static/ISR pages

## Environment Variables for Multi-Node

```env
# Required for all nodes (identical across instances)
NEXTAUTH_SECRET=<shared-secret>
NEXTAUTH_URL=https://api.petsaathi.com   # LB URL, not individual node
DATABASE_URL=<shared-mongodb-atlas-url>

# Optional: Redis for shared cache (Phase 3)
UPSTASH_REDIS_REST_URL=<url>
UPSTASH_REDIS_REST_TOKEN=<token>
```

## Monitoring Scaling Health

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| Response latency p95 | Sentry Performance | > 500ms |
| MongoDB connections | Atlas Dashboard | > 80% of pool |
| Node CPU utilization | PM2 / CloudWatch | > 80% sustained |
| Error rate | Sentry | > 1% of requests |
| Cache hit ratio | Custom metric | < 70% (investigate TTLs) |

## Verified Scaling Properties

- ✅ **No server-side sessions** — JWT is self-contained
- ✅ **No local file storage** — all cloud-based
- ✅ **Idempotent webhooks** — safe to receive on any node
- ✅ **DB-level concurrency** — MongoDB transactions, not in-process locks
- ✅ **Stateless rate limiting** — Upstash Redis (shared)
- ✅ **Load test validated** — 4/4 scenarios pass < 300ms p95 under concurrent load
