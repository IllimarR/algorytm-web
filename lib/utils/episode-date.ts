import type { Episode } from '@/lib/types/episode';

/**
 * Extracts the YYYY-MM portion from an ISO date string.
 * e.g. "2024-03-15T12:00:00Z" → "2024-03"
 */
export function toYearMonth(isoString: string): string {
  return isoString.slice(0, 7);
}

/**
 * Filters episodes whose publishedAt falls within [from, to] inclusive.
 * Both from and to must be YYYY-MM strings.
 */
export function filterEpisodesByDateRange(
  episodes: Episode[],
  from: string,
  to: string
): Episode[] {
  return episodes.filter((ep) => {
    const ym = toYearMonth(ep.publishedAt);
    return ym >= from && ym <= to;
  });
}
