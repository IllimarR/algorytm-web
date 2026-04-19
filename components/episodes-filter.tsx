'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EpisodeCard } from '@/components/episode-card';
import { toYearMonth, filterEpisodesByDateRange } from '@/lib/utils/episode-date';
import { getMessages, months, type Locale } from '@/lib/i18n/messages';
import type { Episode } from '@/lib/types/episode';

const YM_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function validYm(value: string | null, fallback: string): string {
  return value && YM_RE.test(value) ? value : fallback;
}

const SELECT_CLASS =
  'bg-white border border-brand-gray text-brand-dark font-mono text-sm px-3 py-1.5 focus:outline-none focus:border-brand-blue/40 cursor-pointer';

interface EpisodesFilterProps {
  episodes: Episode[];
  locale: Locale;
}

export function EpisodesFilter({ episodes, locale }: EpisodesFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const m = getMessages(locale);
  const monthNames = months[locale];

  const sorted = useMemo(
    () => [...episodes].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt)),
    [episodes]
  );

  // Oldest month in the feed — anchors the "Kõik" preset and the year picker.
  const oldestFrom = useMemo(
    () =>
      sorted.length > 0
        ? toYearMonth(sorted[0].publishedAt)
        : toYearMonth(new Date().toISOString()),
    [sorted]
  );

  const nowYm = useMemo(() => toYearMonth(new Date().toISOString()), []);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Default view when no params are present: current year through this month.
  const defaultFrom = `${currentYear}-01`;
  const defaultTo = nowYm;

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
    const oldestYear = Number(oldestFrom.slice(0, 4));
    return Array.from(
      { length: currentYear - oldestYear + 1 },
      (_, i) => oldestYear + i
    );
  }, [oldestFrom, currentYear]);

  function updateParam(key: 'from' | 'to', year: number, month: number) {
    const ym = `${year}-${String(month).padStart(2, '0')}`;
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, ym);
    router.replace(`?${params.toString()}`);
  }

  const quickSelects: { key: string; label: string; from: string; to: string }[] = [
    {
      key: 'current-year',
      label: m.filter.yearLabel(currentYear),
      from: `${currentYear}-01`,
      to: nowYm,
    },
    {
      key: 'last-year',
      label: m.filter.yearLabel(currentYear - 1),
      from: `${currentYear - 1}-01`,
      to: `${currentYear - 1}-12`,
    },
    {
      key: 'two-years-ago',
      label: m.filter.yearLabel(currentYear - 2),
      from: `${currentYear - 2}-01`,
      to: `${currentYear - 2}-12`,
    },
    { key: 'all', label: m.filter.all, from: oldestFrom, to: nowYm },
  ];

  function applyRange(newFrom: string, newTo: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('from', newFrom);
    params.set('to', newTo);
    router.replace(`?${params.toString()}`);
  }

  const filtered = filterEpisodesByDateRange(episodes, from, to);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {quickSelects.map((preset) => {
          const active = from === preset.from && to === preset.to;
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => applyRange(preset.from, preset.to)}
              className={`border px-3 py-1.5 font-mono text-sm transition-colors ${
                active
                  ? 'border-brand-blue bg-brand-blue text-white'
                  : 'border-brand-gray bg-white text-brand-dark hover:border-brand-blue/40'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-8 mb-8">
        {/* From picker */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono tracking-[0.2em] text-brand-blue/60 uppercase">
            {m.filter.from}
          </span>
          <div className="flex gap-2">
            <select
              value={fromMonth}
              onChange={(e) => updateParam('from', fromYear, Number(e.target.value))}
              className={SELECT_CLASS}
              aria-label={m.filter.fromMonth}
            >
              {monthNames.map((name, i) => (
                <option key={i + 1} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={fromYear}
              onChange={(e) => updateParam('from', Number(e.target.value), fromMonth)}
              className={SELECT_CLASS}
              aria-label={m.filter.fromYear}
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
            {m.filter.to}
          </span>
          <div className="flex gap-2">
            <select
              value={toMonth}
              onChange={(e) => updateParam('to', toYear, Number(e.target.value))}
              className={SELECT_CLASS}
              aria-label={m.filter.toMonth}
            >
              {monthNames.map((name, i) => (
                <option key={i + 1} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={toYear}
              onChange={(e) => updateParam('to', Number(e.target.value), toMonth)}
              className={SELECT_CLASS}
              aria-label={m.filter.toYear}
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

      <p className="text-sm text-brand-dark/30 mb-8 font-mono">
        {filtered.length} {m.filter.countSuffix}
      </p>

      {filtered.length === 0 ? (
        <p className="text-brand-dark/30 text-sm">{m.filter.emptyState}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} locale={locale} />
          ))}
        </div>
      )}
    </>
  );
}
