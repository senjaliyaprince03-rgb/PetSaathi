const browserMutationMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function isLoopbackHostname(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]"
  );
}

/**
 * Optional deployment allowlist (comma-separated) for preview URLs, proxies or
 * split origins that legitimately serve the app. Empty by default.
 */
export function configuredTrustedOrigins(): string[] {
  return (process.env.TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      try {
        return new URL(value).origin;
      } catch {
        return "";
      }
    })
    .filter(Boolean);
}

function candidateOrigins(requestUrl: string, headers?: Headers): string[] {
  const candidates = new Set<string>();
  try {
    candidates.add(new URL(requestUrl).origin);
  } catch {
    // requestUrl is always middleware-generated; ignore parse failures.
  }

  if (headers) {
    const host = headers.get("host");
    if (host) {
      try {
        const proto = new URL(requestUrl).protocol.replace(":", "");
        candidates.add(new URL(`${proto}://${host}`).origin);
      } catch {
        // Ignore malformed host headers.
      }
    }

    // Forwarded headers are client-spoofable unless a trusted proxy is
    // declared, so they are only honored behind an explicit opt-in.
    if (process.env.TRUST_PROXY_HEADERS === "1") {
      const forwardedHost = headers.get("x-forwarded-host")?.split(",")[0]?.trim();
      if (forwardedHost) {
        const forwardedProto =
          headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
          new URL(requestUrl).protocol.replace(":", "");
        try {
          candidates.add(new URL(`${forwardedProto}://${forwardedHost}`).origin);
        } catch {
          // Ignore malformed forwarded headers.
        }
      }
    }
  }

  return [...candidates];
}

/**
 * CSRF origin trust for browser mutations. Accepts when Origin matches:
 *   1. the request origin (request.url) or the real Host-derived origin
 *      (x-forwarded-host/proto aware, so proxies and host rewrites work),
 *   2. an explicitly configured TRUSTED_ORIGINS entry,
 *   3. a loopback alias (localhost/127.0.0.1/[::1]) on the same port when
 *      NOT running in production.
 * Everything else — including missing or forged origins — is rejected.
 */
export function isTrustedBrowserMutation(
  method: string,
  requestUrl: string,
  origin: string | null,
  headers?: Headers,
) {
  if (!browserMutationMethods.has(method.toUpperCase())) return true;
  if (!origin) return false;

  let supplied: URL;
  try {
    supplied = new URL(origin);
  } catch {
    return false;
  }

  for (const candidate of candidateOrigins(requestUrl, headers)) {
    if (candidate === supplied.origin) return true;
  }

  if (configuredTrustedOrigins().includes(supplied.origin)) return true;

  if (process.env.NODE_ENV !== "production") {
    try {
      const requestOrigin = new URL(requestUrl);
      if (
        supplied.protocol === requestOrigin.protocol &&
        supplied.port === requestOrigin.port &&
        isLoopbackHostname(supplied.hostname) &&
        isLoopbackHostname(requestOrigin.hostname)
      ) {
        return true;
      }
    } catch {
      return false;
    }
  }

  return false;
}
