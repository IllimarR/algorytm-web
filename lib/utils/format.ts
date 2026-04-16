/**
 * Formats episode duration from seconds to a human-readable string.
 * e.g. 3725 → "1h 2min"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}

/**
 * Formats an ISO date string to a localized date.
 * e.g. "2024-03-15T00:00:00Z" → "15 Mar 2024"
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
