import dns from "node:dns";

const DEFAULT_DNS_SERVERS = ["8.8.8.8", "8.8.4.4"];

/**
 * Prepare a Prisma-only direct Atlas URI for Windows runtimes whose native
 * SRV resolver rejects the cluster record. The original SRV URI remains the
 * source of truth for the native MongoDB client and deployment secrets.
 */
export async function preparePrismaEnvironment(environment = process.env) {
  if (environment.MONGODB_PRISMA_URI?.trim()) return environment;

  const sourceValue = environment.MONGODB_URI?.trim();
  const shouldPrepare = process.platform === "win32" || environment.MONGODB_DNS_SERVERS;
  if (!shouldPrepare || !sourceValue?.startsWith("mongodb+srv://")) return environment;

  let source;
  try {
    source = new URL(sourceValue);
  } catch {
    return environment;
  }

  const servers = environment.MONGODB_DNS_SERVERS
    ?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);
  try {
    dns.setServers(servers?.length ? servers : DEFAULT_DNS_SERVERS);
    const records = await dns.promises.resolveSrv(`_mongodb._tcp.${source.hostname}`);
    if (!records.length) return environment;

    let txtRecords = [];
    try {
      txtRecords = await dns.promises.resolveTxt(source.hostname);
    } catch {
      // TXT metadata is optional; Atlas hosts are still usable without it.
    }

    const options = new URLSearchParams(source.search);
    for (const record of txtRecords.flat()) {
      for (const pair of record.split("&")) {
        const separator = pair.indexOf("=");
        if (separator <= 0) continue;
        const key = pair.slice(0, separator);
        const value = pair.slice(separator + 1);
        if (key && value && !options.has(key)) options.set(key, value);
      }
    }
    if (!options.has("tls") && !options.has("ssl")) options.set("tls", "true");

    const username = decodeURIComponent(source.username);
    const password = decodeURIComponent(source.password);
    const credentials = source.username
      ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`
      : "";
    const hosts = records
      .sort((left, right) => left.priority - right.priority)
      .map((record) => `${record.name.replace(/\.$/, "")}:${record.port}`)
      .join(",");
    environment.MONGODB_PRISMA_URI = `mongodb://${credentials}${hosts}${source.pathname}?${options.toString()}`;
  } catch {
    // Leave Prisma on the original URI so deployment and non-Windows hosts
    // retain normal Atlas SRV behavior when DNS is temporarily unavailable.
  }

  return environment;
}
