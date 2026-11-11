/**
 * Video count from a catalog stats.json, or null if it can't be reached or
 * the response has no numeric `videos` field.
 */
export async function fetchVideoCount(
  url: string,
  init?: RequestInit
): Promise<number | null> {
  try {
    const response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const { videos } = (await response.json()) as { videos?: unknown };
    return typeof videos === "number" ? videos : null;
  } catch {
    return null;
  }
}
