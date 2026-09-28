/** A timeout is an unknown provider outcome; callers must reconcile writes before retrying. */
export async function providerDeadline<T>(operation: Promise<T>, timeoutMs = 10_000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([operation, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("provider_outcome_unknown")), timeoutMs);
    })]);
  } finally { if (timer) clearTimeout(timer); }
}
