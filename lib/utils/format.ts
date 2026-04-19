import type { Locale } from '@/lib/i18n/messages';

/**
 * Formats episode duration from seconds to a human-readable string.
 * et: 3725 → "1t 2min"
 * en: 3725 → "1h 2min"
 */
export function formatDuration(seconds: number, locale: Locale = 'et'): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const hUnit = locale === 'et' ? 't' : 'h';

  if (hours > 0) {
    return `${hours}${hUnit} ${minutes}min`;
  }
  return `${minutes}min`;
}

/**
 * Formats an ISO date string to a localized date.
 * et: "2024-03-15T00:00:00Z" → "15. märts 2024"
 * en: "2024-03-15T00:00:00Z" → "15 Mar 2024"
 */
export function formatDate(isoString: string, locale: Locale = 'et'): string {
  const tag = locale === 'et' ? 'et-EE' : 'en-GB';
  return new Date(isoString).toLocaleDateString(tag, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
