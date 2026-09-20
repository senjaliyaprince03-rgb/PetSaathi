/**
 * Utility to safely validate and sanitize redirect destination URLs (returnTo).
 * Prevents Open Redirect vulnerabilities (CWE-601), protocol-relative redirects,
 * javascript: execution, backslash bypasses, and redirect loops.
 */
export function sanitizeReturnTo(url: unknown, fallback: string | null = null): string | null {
  if (typeof url !== "string") {
    return fallback;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return fallback;
  }

  // Reject CRLF injection and null bytes
  if (/[\r\n\0]/.test(trimmed)) {
    return fallback;
  }

  // Must strictly start with a single leading slash
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return fallback;
  }

  // Reject backslashes in path portion (browsers/proxies may normalize \ to /)
  const pathPart = (trimmed.split("?")[0] ?? "").split("#")[0] ?? "";
  if (pathPart.includes("\\")) {
    return fallback;
  }

  // Check decoded variant to guard against double-encoding bypasses (%2f%2f, %5c)
  try {
    const decoded = decodeURIComponent(trimmed);
    const decodedPath = (decoded.split("?")[0] ?? "").split("#")[0] ?? "";
    if (
      !decoded.startsWith("/") ||
      decoded.startsWith("//") ||
      decoded.startsWith("/\\") ||
      decodedPath.includes("\\") ||
      /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(decoded)
    ) {
      return fallback;
    }
  } catch {
    // Malformed URI encoding
    return fallback;
  }

  // Disallow common dangerous schemes even if encoded or formatted weirdly
  if (/^\/[/\\]/.test(trimmed) || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return fallback;
  }

  // Prevent redirect loops to login or signout
  const cleanPath = pathPart.toLowerCase();
  if (cleanPath === "/login" || cleanPath.startsWith("/login/") || cleanPath === "/api/auth/signout") {
    return fallback;
  }

  return trimmed;
}
