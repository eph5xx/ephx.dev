/**
 * Star count of a public GitHub repo, or null if GitHub can't be reached or
 * refuses (it allows 60 unauthenticated requests per hour per IP).
 */
export async function fetchStars(
  repo: string,
  init?: RequestInit
): Promise<number | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      ...init,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const { stargazers_count: stars } = (await response.json()) as {
      stargazers_count?: unknown;
    };
    return typeof stars === "number" ? stars : null;
  } catch {
    return null;
  }
}
