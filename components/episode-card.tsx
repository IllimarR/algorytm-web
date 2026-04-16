import Link from 'next/link';
import type { Episode } from '@/lib/types/episode';
import { formatDuration, formatDate } from '@/lib/utils/format';

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const epNumber = episode.episodeNumber;

  return (
    <Link
      href={`/episodes/${episode.id}`}
      className="group relative flex flex-col gap-4 p-6 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-blue/50 transition-all duration-300"
    >
      {/* Episode number — large editorial anchor */}
      {epNumber !== null && (
        <span
          className="absolute top-4 right-5 text-5xl font-bold text-brand-amber/20 group-hover:text-brand-amber/40 transition-colors select-none leading-none"
          style={{ fontFamily: 'var(--font-raleway)' }}
          aria-hidden="true"
        >
          {String(epNumber).padStart(2, '0')}
        </span>
      )}

      <div className="flex flex-col gap-2 pr-12">
        <h2
          className="text-lg font-bold leading-snug group-hover:text-brand-amber transition-colors"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          {episode.title}
        </h2>

        <p className="text-sm text-white/50 line-clamp-2">{episode.description}</p>
      </div>

      <div className="flex items-center gap-4 text-xs text-white/40 font-mono mt-auto pt-2 border-t border-white/5">
        <span>{formatDate(episode.publishedAt)}</span>
        <span className="text-white/20">·</span>
        <span>{formatDuration(episode.duration)}</span>
      </div>
    </Link>
  );
}
