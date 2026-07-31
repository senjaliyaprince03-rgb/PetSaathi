const browserMutationMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function isTrustedBrowserMutation(method: string, requestUrl: string, origin: string | null) {
  if (!browserMutationMethods.has(method.toUpperCase())) return true;
  if (!origin) return false;
  try {
    const requestOrigin = new URL(requestUrl);
    const suppliedOrigin = new URL(origin);
    if (suppliedOrigin.origin === requestOrigin.origin) return true;

    return (
      process.env.NODE_ENV !== "production" &&
      suppliedOrigin.protocol === requestOrigin.protocol &&
      suppliedOrigin.port === requestOrigin.port &&
      isLoopbackHostname(suppliedOrigin.hostname) &&
      isLoopbackHostname(requestOrigin.hostname)
    );
  } catch {
    return false;
  }
}

function isLoopbackHostname(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]"
  );
}
