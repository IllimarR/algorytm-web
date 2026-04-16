import Link from 'next/link';
import { getEpisodes } from '@/lib/api/captivate';
import { EpisodeCard } from '@/components/episode-card';

export default async function HomePage() {
  const episodes = await getEpisodes().catch(() => null);
  const latestEpisodes = episodes?.slice(0, 4) ?? [];

  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="max-w-2xl">
          <p className="text-xs font-mono tracking-[0.2em] text-brand-amber uppercase mb-6">
            Estonian Tech Podcast
          </p>
          <h1
            className="text-5xl sm:text-7xl font-bold leading-[0.95] tracking-tight mb-8"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Algo
            <span className="text-brand-amber">rütm</span>
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-lg">
            Conversations about software, startups, and technology — in Estonian.
          </p>

          <div className="flex items-center gap-4 mt-10">
            <Link
              href="/episodes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-amber text-[#0d0f14] text-sm font-bold hover:bg-brand-amber/90 transition-colors"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              All Episodes
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="mt-16 h-px bg-gradient-to-r from-brand-blue via-brand-blue/20 to-transparent" />
      </section>

      {/* Latest episodes */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2
            className="text-sm font-bold tracking-[0.15em] text-white/40 uppercase"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Latest Episodes
          </h2>
          {latestEpisodes.length > 0 && (
            <Link
              href="/episodes"
              className="text-xs text-white/40 hover:text-brand-amber transition-colors"
            >
              View all →
            </Link>
          )}
        </div>

        {episodes === null ? (
          <p className="text-white/30 text-sm">Episodes unavailable — API not configured.</p>
        ) : latestEpisodes.length === 0 ? (
          <p className="text-white/30 text-sm">No episodes published yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
            {latestEpisodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
