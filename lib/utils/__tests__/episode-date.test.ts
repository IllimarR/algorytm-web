import { describe, it, expect } from 'vitest';
import { toYearMonth, filterEpisodesByDateRange } from '../episode-date';
import type { Episode } from '@/lib/types/episode';

const makeEp = (publishedAt: string, id = publishedAt): Episode => ({
  id,
  title: 'Test',
  description: '',
  shownotes: '',
  publishedAt,
  audioUrl: '',
  duration: 0,
  episodeNumber: null,
  seasonNumber: null,
  imageUrl: null,
  status: 'published',
});

describe('toYearMonth', () => {
  it('extracts YYYY-MM from an ISO date string', () => {
    expect(toYearMonth('2024-03-15T12:00:00Z')).toBe('2024-03');
  });

  it('works when the string is already YYYY-MM-DD', () => {
    expect(toYearMonth('2023-11-01')).toBe('2023-11');
  });
});

describe('filterEpisodesByDateRange', () => {
  const episodes = [
    makeEp('2023-01-10T00:00:00Z'),
    makeEp('2023-06-15T00:00:00Z'),
    makeEp('2024-03-20T00:00:00Z'),
    makeEp('2024-11-05T00:00:00Z'),
  ];

  it('returns episodes within the range (inclusive)', () => {
    const result = filterEpisodesByDateRange(episodes, '2023-06', '2024-03');
    expect(result.map((e) => e.id)).toEqual([
      '2023-06-15T00:00:00Z',
      '2024-03-20T00:00:00Z',
    ]);
  });

  it('includes episodes on the boundary months', () => {
    const result = filterEpisodesByDateRange(episodes, '2023-01', '2023-01');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2023-01-10T00:00:00Z');
  });

  it('returns empty array when nothing matches', () => {
    const result = filterEpisodesByDateRange(episodes, '2022-01', '2022-12');
    expect(result).toHaveLength(0);
  });

  it('returns all episodes when range covers everything', () => {
    const result = filterEpisodesByDateRange(episodes, '2023-01', '2024-11');
    expect(result).toHaveLength(4);
  });
});
