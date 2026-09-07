# PetSaathi Deployment Guide

This document covers production deployment, infrastructure requirements, and operational procedures.

## Table of Contents

1. [Infrastructure Requirements](#infrastructure-requirements)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Deployment Steps](#deployment-steps)
5. [Health Checks](#health-checks)
6. [Monitoring](#monitoring)
7. [Scaling](#scaling)
8. [Disaster Recovery](#disaster-recovery)
9. [Troubleshooting](#troubleshooting)

---

## Infrastructure Requirements

### Compute

**Next.js Application**:
- **Recommended**: Vercel (native Next.js hosting)
- **Alternative**: AWS ECS, Google Cloud Run, DigitalOcean App Platform
- **Minimum**: 2 vCPUs, 4GB RAM per instance
- **Scaling**: Horizontal auto-scaling based on CPU/memory

### Database

**MongoDB Atlas**:
- **Tier**: M10 or higher (production workloads)
- **Region**: Mumbai (ap-south-1) for India traffic
- **Replica set**: 3-node minimum for high availability
- **Backups**: Continuous backups enabled (7-day retention)

### Storage

**GridFS** (MongoDB):
- Used for uploaded files (pet images, verification documents)
- Auto-sharded for horizontal scaling

### Caching/Rate Limiting

**Upstash Redis**:
- **Purpose**: Distributed rate limiting across instances
- **Region**: Mumbai (ap-south-1)
- **Plan**: Pay-as-you-go (starts at $0.20/month)

### Email/SMS

**Email**: Gmail SMTP (transactional OTP)
**SMS**: Generic webhook (configure your provider)

### External Services

| Service | Purpose | Required | Fallback |
|---------|---------|----------|----------|
| Razorpay | Payments | ✅ Yes | None |
| Google OAuth | Social login | ❌ Optional | Phone OTP |
| ClearTax | GST e-invoicing | ❌ Optional | Mock adapter |
| MyGate | Society access | ❌ Optional | Mock adapter |
| DigiLocker | Document verification | ❌ Optional | Mock adapter |
| Sentry | Error tracking | ❌ Optional | Console logs |
| NVIDIA AI | LLM inference | ❌ Optional | Feature disabled |

---

## Environment Variables

### Critical Variables (Must Be Set)

```bash
# Authentication
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
NEXTAUTH_URL="https://petsaathi.com"

# Database
MONGODB_URI="mongodb+srv://USER:PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority"

# Payments
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxxxxxx"
RAZORPAY_KEY_SECRET="<secret>"
RAZORPAY_WEBHOOK_SECRET="<secret>"

# Cron jobs
CRON_SECRET="<generate with: openssl rand -base64 32>"

# Upload security
UPLOAD_SIGNING_SECRET="<generate with: openssl rand -base64 32>"
SCANNER_CALLBACK_SECRET="<generate with: openssl rand -base64 32>"

# Email (OTP delivery)
SMTP_USER="your-email@gmail.com"
SMTP_PASS="<app password>"

# Rate limiting
UPSTASH_REDIS_REST_URL="https://your-db.upstash.io"
UPSTASH_REDIS_REST_TOKEN="<token>"
```

### Optional Variables

See `.env.example` for complete list.

---

## Database Setup

### 1. Create MongoDB Atlas Cluster

```bash
# 1. Sign up at https://cloud.mongodb.com
# 2. Create new cluster (M10+ for production)
# 3. Choose Mumbai (ap-south-1) region
# 4. Enable backup (continuous backups)
# 5. Whitelist application IP addresses
```

### 2. Run Prisma Migrations

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Verify migration
npm run prisma:studio
```

### 3. Seed Initial Data (Optional)

```bash
npm run db:seed
```

Creates:
- Default service types
- Admin user (if configured)

---

## Deployment Steps

### Option 1: Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Link project
vercel link

# 4. Set environment variables
vercel env add NEXTAUTH_SECRET production
vercel env add MONGODB_URI production
# ... (repeat for all required variables)

# 5. Deploy
vercel --prod
```

**Post-deployment**:
1. Configure custom domain in Vercel dashboard
2. Enable automatic deployments from `main` branch
3. Set up preview deployments for pull requests

### Option 2: Docker

```dockerfile
# Dockerfile (example)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build
docker build -t petsaathi:latest .

# Run
docker run -p 3000:3000 --env-file .env.production petsaathi:latest
```

### Option 3: AWS ECS

```bash
# 1. Build and push to ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.ap-south-1.amazonaws.com
docker build -t petsaathi .
docker tag petsaathi:latest <account>.dkr.ecr.ap-south-1.amazonaws.com/petsaathi:latest
docker push <account>.dkr.ecr.ap-south-1.amazonaws.com/petsaathi:latest

# 2. Create ECS task definition
# 3. Create ECS service with ALB
# 4. Configure auto-scaling (target CPU: 70%)
```

---

## Health Checks

### Endpoints

**Liveness**: `GET /api/health`
- Returns 200 if application is running
- Does not check external dependencies

**Readiness**: `GET /api/ready`
- Returns 200 if application can serve traffic
- Checks:
  - MongoDB connection
  - Redis connection (if configured)

**Usage in Kubernetes**:

```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /api/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

---

## Monitoring

### Application Metrics

**Sentry** (Error Tracking):

```bash
# Set environment variables
SENTRY_DSN="https://<key>@sentry.io/<project>"
NEXT_PUBLIC_SENTRY_DSN="https://<key>@sentry.io/<project>"
SENTRY_AUTH_TOKEN="<token>"
SENTRY_ORG="<org>"
SENTRY_PROJECT="<project>"
```

**Custom Metrics** (via logs):

```typescript
import { logger } from '@/lib/logger';

logger.info("Payment captured", {
  requestId,
  bookingId,
  amountPaise,
  duration: Date.now() - startTime,
});
```

**Log Aggregation**:

- Structured JSON logs compatible with Datadog, New Relic, CloudWatch
- Filter secrets automatically (see `src/lib/logger.ts`)

### Database Monitoring

**MongoDB Atlas Performance Advisor**:
- Slow query analysis
- Index recommendations
- Schema anti-patterns

**Alerts**:
- CPU > 80% for 5 minutes
- Disk utilization > 90%
- Replication lag > 10 seconds

### Uptime Monitoring

**Options**:
- UptimeRobot (free)
- Pingdom
- AWS CloudWatch Synthetics

**Endpoints to monitor**:
- `https://petsaathi.com/` (200 OK)
- `https://petsaathi.com/api/health` (200 OK)

---

## Scaling

### Horizontal Scaling (Application)

**Vercel**: Auto-scales based on traffic (no configuration needed)

**Kubernetes**:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: petsaathi
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: petsaathi
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Database Scaling (MongoDB)

**Vertical scaling**:
- M10 → M20 → M30 (increases vCPUs and RAM)
- Zero downtime upgrades

**Horizontal scaling**:
- Add read replicas for read-heavy workloads
- Enable sharding for 1TB+ datasets

### Caching Strategy

**Static assets**: Next.js automatic static optimization
**API responses**: Not cached (real-time booking data)
**Rate limiting**: Upstash Redis (shared state across instances)

---

## Disaster Recovery

### Backups

**MongoDB Atlas**:
- Continuous backups (oplog-based)
- Point-in-time recovery (7-day retention)
- Manual snapshots before major changes

**GridFS uploads**:
- Backed up as part of MongoDB backups
- Alternative: Sync to S3 with AWS DataSync

### Restore Procedure

```bash
# 1. Stop application (prevent writes during restore)
vercel env rm NEXTAUTH_SECRET production  # Force traffic to maintenance page

# 2. Restore MongoDB from Atlas snapshot
# (Use Atlas UI: Clusters → Backups → Restore)

# 3. Verify data integrity
npm run prisma:studio

# 4. Restart application
vercel env add NEXTAUTH_SECRET production
vercel --prod
```

### RTO/RPO Targets

- **RTO** (Recovery Time Objective): 1 hour
- **RPO** (Recovery Point Objective): 15 minutes (oplog granularity)

---

## Troubleshooting

### Application Won't Start

**Error**: `PrismaClientInitializationError`

**Solution**:
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist
- Test connection: `npm run prisma:studio`

### 401 Unauthorized on Cron Jobs

**Error**: `/api/jobs/notifications` returns 401

**Solution**:
- Verify `CRON_SECRET` is set in environment
- Check cron scheduler sends `Authorization: Bearer <secret>` header

### Rate Limit Errors

**Error**: `429 Too Many Requests`

**Solution**:
- Verify Upstash Redis is reachable
- Check `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Increase rate limits in `src/lib/rate-limit.ts` if needed

### Payment Webhook Failures

**Error**: Razorpay webhooks return 401

**Solution**:
- Verify `RAZORPAY_WEBHOOK_SECRET` matches Razorpay dashboard
- Check webhook URL is publicly accessible (no firewall blocking)
- Inspect webhook logs in Razorpay dashboard

### Slow Database Queries

**Symptoms**: API endpoints timing out

**Solution**:
1. Check MongoDB Atlas Performance Advisor
2. Verify indexes exist for high-volume queries (see `docs/MONGODB_OPTIMIZATION.md`)
3. Enable slow query log: `db.setProfilingLevel(1, { slowms: 100 })`

---

## Security Hardening

### Pre-Deployment Checklist

- [ ] All secrets rotated from development values
- [ ] `AUTH_DEV_FIXED_OTP` removed (development only)
- [ ] HTTPS enabled (TLS 1.3)
- [ ] Rate limiting configured
- [ ] CORS restricted to known origins
- [ ] Error messages sanitized (no stack traces to clients)
- [ ] Sentry DSN configured for error tracking
- [ ] Database backups enabled

### Post-Deployment Checklist

- [ ] Health checks returning 200
- [ ] Cron jobs running (check logs)
- [ ] Payment webhooks receiving events
- [ ] Email OTP delivery working
- [ ] MongoDB Atlas alerts configured
- [ ] Uptime monitoring enabled

---

## Support

**Documentation**: `docs/`
**Architecture**: `docs/ARCHITECTURE.md`
**Security**: `docs/SECURITY.md`

**Production Issues**: Create incident in Sentry or contact ops team.
