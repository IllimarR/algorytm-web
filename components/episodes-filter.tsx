'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EpisodeCard } from '@/components/episode-card';
import { toYearMonth, filterEpisodesByDateRange } from '@/lib/utils/episode-date';
import type { Episode } from '@/lib/types/episode';

const YM_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function validYm(value: string | null, fallback: string): string {
  return value && YM_RE.test(value) ? value : fallback;
}

const MONTHS = [
  'jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni',
  'juuli', 'august', 'september', 'oktoober', 'november', 'detsember',
];

const SELECT_CLASS =
  'bg-white border border-brand-gray text-brand-dark font-mono text-sm px-3 py-1.5 focus:outline-none focus:border-brand-blue/40 cursor-pointer';

interface EpisodesFilterProps {
  episodes: Episode[];
}

export function EpisodesFilter({ episodes }: EpisodesFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Oldest episode month/year as the default "from"
  const sorted = useMemo(
    () => [...episodes].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt)),
    [episodes]
  );

  const defaultFrom = useMemo(
    () =>
      sorted.length > 0
        ? toYearMonth(sorted[0].publishedAt)
        : toYearMonth(new Date().toISOString()),
    [sorted]
  );

  const defaultTo = useMemo(() => toYearMonth(new Date().toISOString()), []);

  const from = validYm(searchParams.get('from'), defaultFrom);
  const to = validYm(searchParams.get('to'), defaultTo);

  // Apply defaults to URL on mount if either param is absent
  useEffect(() => {
    const hasFrom = searchParams.get('from');
    const hasTo = searchParams.get('to');
    if (!hasFrom || !hasTo) {
      const params = new URLSearchParams(searchParams.toString());
      if (!hasFrom) params.set('from', defaultFrom);
      if (!hasTo) params.set('to', defaultTo);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, defaultFrom, defaultTo, router]);

  const [fromYear, fromMonth] = from.split('-').map(Number);
  const [toYear, toMonth] = to.split('-').map(Number);

  const years = useMemo(() => {
    const oldestYear =
      sorted.length > 0
        ? Number(defaultFrom.slice(0, 4))
        : new Date().getFullYear();
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: currentYear - oldestYear + 1 },
      (_, i) => oldestYear + i
    );
  }, [sorted, defaultFrom]);

  /**
   * Updates a date range URL param and navigates to the updated URL.
   *
   * @param key - Which date bound to update ('from' or 'to')
   * @param year - The selected year
   * @param month - The selected month (1-based)
   */
  function updateParam(key: 'from' | 'to', year: number, month: number) {
    const ym = `${year}-${String(month).padStart(2, '0')}`;
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, ym);
    router.replace(`?${params.toString()}`);
  }

  const filtered = filterEpisodesByDateRange(episodes, from, to);

  return (
    <>
      <div className="flex flex-wrap gap-8 mb-8">
        {/* From picker */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono tracking-[0.2em] text-brand-blue/60 uppercase">
            Alates
          </span>
          <div className="flex gap-2">
            <select
              value={fromMonth}
              onChange={(e) => updateParam('from', fromYear, Number(e.target.value))}
              className={SELECT_CLASS}
              aria-label="Alates kuu"
            >
              {MONTHS.map((name, i) => (
                <option key={i + 1} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={fromYear}
              onChange={(e) => updateParam('from', Number(e.target.value), fromMonth)}
              className={SELECT_CLASS}
              aria-label="Alates aasta"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* To picker */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono tracking-[0.2em] text-brand-blue/60 uppercase">
            Kuni
          </span>
          <div className="flex gap-2">
            <select
              value={toMonth}
              onChange={(e) => updateParam('to', toYear, Number(e.target.value))}
              className={SELECT_CLASS}
              aria-label="Kuni kuu"
            >
              {MONTHS.map((name, i) => (
                <option key={i + 1} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={toYear}
              onChange={(e) => updateParam('to', Number(e.target.value), toMonth)}
              className={SELECT_CLASS}
              aria-label="Kuni aasta"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="text-sm text-brand-dark/30 mb-8 font-mono">{filtered.length} saadet</p>

      {filtered.length === 0 ? (
        <p className="text-brand-dark/30 text-sm">Valitud ajavahemikus saateid ei ole.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-gray">
          {filtered.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      )}
    </>
  );
}
