import { Suspense } from 'react';
import { getEpisodesFromRss } from '@/lib/api/rss';
import { EpisodesFilter } from '@/components/episodes-filter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Episodes — Algorütm',
  description: 'All episodes of the Algorütm Estonian tech podcast.',
};

export default async function EpisodesPage() {
  const episodes = await getEpisodesFromRss().catch(() => null);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight text-brand-blue"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Kõik saated
        </h1>
      </div>

      {episodes === null ? (
        <p className="text-brand-dark/30 text-sm">
          Episodes unavailable — RSS feed not configured.
        </p>
      ) : episodes.length === 0 ? (
        <p className="text-brand-dark/30 text-sm">No episodes published yet.</p>
      ) : (
        <Suspense fallback={null}>
          <EpisodesFilter episodes={episodes} />
        </Suspense>
      )}
    </section>
  );
}
