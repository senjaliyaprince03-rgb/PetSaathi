const browserMutationMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function isTrustedBrowserMutation(method: string, requestUrl: string, origin: string | null) {
  if (!browserMutationMethods.has(method.toUpperCase())) return true;
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(requestUrl).host;
  } catch {
    return false;
  }
}
