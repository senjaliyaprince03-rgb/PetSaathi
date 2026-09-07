# PetSaathi Secrets & Credentials Architecture

## 1. Overview
PetSaathi enforces strict zero-hardcoded-secrets policy across the entire repository. All credentials, database URIs, API tokens, and webhook secrets are loaded via environment variables and validated at runtime using Zod schemas (`src/lib/env.ts`).

## 2. Secrets Audit Summary
- **Source Code Scan**: Verified clean. No API keys (`nvapi-`, `rzp_live_`), database passwords, or JWT secrets are hardcoded in application logic.
- **Git Tracking**: `.env` and `.env.*` files are explicitly ignored in `.gitignore`. Only `.env.example` and `.env.schema` are permitted.
- **Fail-Closed Runtime**: `src/lib/env.ts` enforces that if `NODE_ENV=production`, test overrides like `AUTH_DEV_FIXED_OTP` immediately abort the process on startup.

## 3. Recommended Secrets Managers & Integration Patterns

### Option A: Doppler (Recommended for Next.js / Serverless / Containerized Node.js)
Doppler provides automated secret injection, secret rotation, and environment separation (`dev`, `staging`, `production`).

#### Local Dev Workflow:
```bash
# Install Doppler CLI
npm install -g @dopplerhq/cli

# Login and setup
doppler login
doppler setup

# Run application with injected environment
doppler run -- npm run dev
```

#### Production / Docker Integration:
```dockerfile
# In Dockerfile
RUN (curl -Ls https://cli.doppler.com/install.sh || wget -qO- https://cli.doppler.com/install.sh) | sh
ENTRYPOINT ["doppler", "run", "--"]
CMD ["node", "server.js"]
```

### Option B: AWS Secrets Manager (for AWS ECS / EKS Deployments)
For AWS deployments, secrets are fetched at container startup using IAM task roles without storing long-lived credentials.

#### Node.js Fetch Pattern (`src/lib/secrets.ts`):
```typescript
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: process.env.AWS_REGION || "ap-south-1" });

export async function loadProductionSecrets(secretName: string = "petsaathi/prod") {
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT",
      })
    );
    if (response.SecretString) {
      const secrets = JSON.parse(response.SecretString);
      for (const [key, value] of Object.entries(secrets)) {
        process.env[key] = value as string;
      }
    }
  } catch (error) {
    console.error("[SecretsManager] Failed to fetch secrets from AWS:", error);
    throw error;
  }
}
```

### Option C: HashiCorp Vault
For Kubernetes installations, use the Vault Agent Sidecar Injector to mount secrets at `/vault/secrets/config.env` and source them before starting the Node.js process.
