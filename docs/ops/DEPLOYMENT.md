# Production Deployment Architecture & Release Strategy

> **Target Audience**: DevOps / Tech Lead / Release Engineers  
> **Release Pattern**: Blue-Green / Zero-Downtime Rolling Deployment  
> **Environment Tier**: Production (`api.petsaathi.com`, `app.petsaathi.com`)  
> **Classification**: Operations Runbook (Task 5.3 & Task 8.2)

---

## 1. Zero-Downtime Blue-Green Architecture

PetSaathi utilizes a **Blue-Green release topology** orchestrated via AWS Application Load Balancer / NGINX reverse proxy upstream:

```
                    ┌──────────────────────────┐
                    │      AWS Route 53 /      │
                    │   Cloudflare Anycast     │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │   Application LB (L7)    │
                    │      Weighted Target     │
                    └──────┬────────────┬──────┘
                           │            │
             100% Traffic  │            │ 0% Traffic (Canary/Warmup)
                           ▼            ▼
                    ┌────────────┐┌────────────┐
                    │ Blue Group ││Green Group │
                    │  (Active)  ││ (Inactive) │
                    │   v1.4.2   ││   v1.5.0   │
                    └──────┬─────┘└─────┬──────┘
                           │            │
                           └──────┬─────┘
                                  ▼
                    ┌──────────────────────────┐
                    │  MongoDB Atlas Cluster   │
                    │  (Backward Compatible)   │
                    └──────────────────────────┘
```

### Canary Switchover Mechanics:
1. Deploy new version to **Green** target group.
2. Run health probes (`GET /api/health`) on Green instances until 5 consecutive 200s are achieved.
3. Route 5% synthetic canary traffic to Green for 5 minutes.
4. Monitor Sentry real-time stream: if error rate < 0.1%, shift 100% traffic to Green.
5. Retain Blue instances running in idle standby for 30 minutes to enable instantaneous 0-second rollback if needed.

---

## 2. Production Pre-Flight Checklist

Before approving any production deployment, every item must be checked and signed off:

- [ ] **CI Pipeline Passed**: All unit tests (192+), integration tests, and Playwright E2E suites passing on `main` branch.
- [ ] **Staging Deploy Succeeded**: Staging environment deployed and running healthy at `https://staging.petsaathi.com`.
- [ ] **E2E Simulator Passed**: `npm run test:simulate` executed cleanly on staging with 4.76s walk completion.
- [ ] **Security Scans Clear**: `npm audit --audit-level=high` returned 0 high/critical vulnerabilities.
- [ ] **Database Migrations Verified**: `npm run migrate` tested and verified non-destructive on staging.
- [ ] **Rollback Plan Confirmed**: Previous Docker tag / Git SHA verified ready for instant revert.
- [ ] **On-Call Notification**: Active on-call SRE paged in `#prod-deployments` Slack channel.

---

## 3. Step-by-Step Production Release Execution

### Step 1: Execute Pending Migrations
```bash
# Connect with least-privilege migrator credential
npm run migrate
npm run mongodb:indexes
```

### Step 2: Build & Push Production Container Image
```bash
RELEASE_TAG="v$(node -p "require('./package.json').version")-$(git rev-parse --short HEAD)"

docker build \
  --build-arg NODE_ENV=production \
  -t 123456789012.dkr.ecr.ap-south-1.amazonaws.com/petsaathi:$RELEASE_TAG .

docker push 123456789012.dkr.ecr.ap-south-1.amazonaws.com/petsaathi:$RELEASE_TAG
```

### Step 3: Deploy to Inactive Target Group
Update Green service task definition and await container readiness:
```bash
aws ecs update-service \
  --cluster petsaathi-prod \
  --service petsaathi-green \
  --task-definition petsaathi-app:$RELEASE_TAG \
  --desired-count 4
```

### Step 4: Verify Green Target Health
```bash
curl -f https://green-internal.petsaathi.com/api/health
# Expected: {"status":"ok","db":"connected", ...}
```

### Step 5: Shift ALB Traffic
```bash
aws elbv2 modify-listener \
  --listener-arn <PROD_LISTENER_ARN> \
  --default-actions Type=forward,ForwardConfig='{TargetGroups=[{TargetGroupArn=<GREEN_TG_ARN>,Weight=100},{TargetGroupArn=<BLUE_TG_ARN>,Weight=0}]}'
```

### Step 6: Post-Deployment Smoke Check
```bash
npm run doctor:production
```
