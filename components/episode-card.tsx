import Link from 'next/link';
import type { Episode } from '@/lib/types/episode';
import { formatDuration, formatDate } from '@/lib/utils/format';
import { getMessages, type Locale } from '@/lib/i18n/messages';

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

interface EpisodeCardProps {
  episode: Episode;
  locale: Locale;
}

export function EpisodeCard({ episode, locale }: EpisodeCardProps) {
  const epNumber = episode.episodeNumber;
  const m = getMessages(locale);
  const isNew = Date.now() - new Date(episode.publishedAt).getTime() < FOURTEEN_DAYS_MS;

  return (
    <Link
      href={`/${locale}/episodes/${episode.id}`}
      className="group relative flex flex-col gap-4 p-6 bg-white border-y border-brand-blue/10 transition-colors duration-150 hover:border-brand-blue/30 hover:bg-brand-blue/[0.02] focus-visible:outline-none focus-visible:border-brand-blue/40 focus-visible:bg-brand-blue/[0.02] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-brand-blue/0 before:via-brand-blue/60 before:to-brand-blue/0 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 focus-visible:before:opacity-100"
    >
      {/* Episode number — large editorial anchor */}
      {epNumber !== null && (
        <span
          className="absolute top-4 right-5 text-5xl font-bold text-brand-blue/10 group-hover:text-brand-blue/30 transition-colors select-none leading-none"
          style={{ fontFamily: 'var(--font-raleway)' }}
          aria-hidden="true"
        >
          {String(epNumber).padStart(2, '0')}
        </span>
      )}

      <div className="flex flex-col gap-2 pr-12">
        <h2
          className="text-lg font-bold leading-snug text-brand-dark group-hover:text-brand-blue transition-colors"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          {episode.title}
        </h2>

        <p className="text-sm text-brand-dark/55 line-clamp-2">{episode.description}</p>
      </div>

      <div className="flex items-center justify-between gap-4 text-xs text-brand-dark/40 font-mono mt-auto pt-2">
        <div className="flex items-center gap-3">
          {isNew && (
            <>
              <span className="inline-flex items-center gap-1.5 text-brand-blue uppercase tracking-[0.15em]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                {m.card.newBadge}
              </span>
              <span className="text-brand-dark/20">·</span>
            </>
          )}
          <span>{formatDate(episode.publishedAt, locale)}</span>
          <span className="text-brand-dark/20">·</span>
          <span>{formatDuration(episode.duration, locale)}</span>
        </div>
        <span
          aria-hidden="true"
          className="text-brand-blue/40 transition-all duration-200 group-hover:text-brand-blue group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </Link>
  );
}
