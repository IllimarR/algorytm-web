import Link from 'next/link';
import type { Episode } from '@/lib/types/episode';
import { formatDuration, formatDate } from '@/lib/utils/format';
import type { Locale } from '@/lib/i18n/messages';

interface EpisodeCardProps {
  episode: Episode;
  locale: Locale;
}

export function EpisodeCard({ episode, locale }: EpisodeCardProps) {
  const epNumber = episode.episodeNumber;

  return (
    <Link
      href={`/${locale}/episodes/${episode.id}`}
      className="group relative flex flex-col gap-4 p-6 border border-brand-gray bg-white hover:border-brand-blue/40 hover:shadow-sm transition-all duration-200"
    >
      {/* Episode number — large editorial anchor */}
      {epNumber !== null && (
        <span
          className="absolute top-4 right-5 text-5xl font-bold text-brand-blue/10 group-hover:text-brand-blue/20 transition-colors select-none leading-none"
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

      <div className="flex items-center gap-4 text-xs text-brand-dark/40 font-mono mt-auto pt-2 border-t border-brand-gray">
        <span>{formatDate(episode.publishedAt, locale)}</span>
        <span className="text-brand-dark/20">·</span>
        <span>{formatDuration(episode.duration, locale)}</span>
      </div>
    </Link>
  );
}
