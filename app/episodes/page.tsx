import { getEpisodes } from '@/lib/api/captivate';
import { EpisodeCard } from '@/components/episode-card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Episodes — Algorütm',
  description: 'All episodes of the Algorütm Estonian tech podcast.',
};

export default async function EpisodesPage() {
  const episodes = await getEpisodes().catch(() => null);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <p className="text-xs font-mono tracking-[0.2em] text-brand-amber uppercase mb-3">
          Archive
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          All Episodes
        </h1>
      </div>

      {episodes === null ? (
        <p className="text-white/30 text-sm">Episodes unavailable — API not configured.</p>
      ) : episodes.length === 0 ? (
        <p className="text-white/30 text-sm">No episodes published yet.</p>
      ) : (
        <>
          <p className="text-sm text-white/30 mb-8 font-mono">
            {episodes.length} episode{episodes.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {episodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
