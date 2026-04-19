import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEpisodesFromRss } from '@/lib/api/rss';
import { EpisodeCard } from '@/components/episode-card';
import { getMessages, isLocale } from '@/lib/i18n/messages';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const m = getMessages(locale);
  const episodes = await getEpisodesFromRss().catch(() => null);
  const latestEpisodes = episodes?.slice(0, 4) ?? [];

  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="max-w-2xl">
          <p className="text-xs font-mono tracking-[0.2em] text-brand-blue/60 uppercase mb-6">
            {m.home.tagline}
          </p>
          <h1
            className="text-5xl sm:text-7xl font-bold leading-[0.95] tracking-tight mb-8 text-brand-blue"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Algorütm
          </h1>
          <p className="text-lg text-brand-dark/60 leading-relaxed max-w-lg">
            {m.home.hero}
          </p>

          <div className="flex items-center gap-4 mt-10">
            <Link
              href={`/${locale}/episodes`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white text-sm font-bold hover:bg-brand-blue-dark transition-colors"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              {m.home.moreEpisodes}
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
            className="text-sm font-bold tracking-[0.15em] text-brand-dark/40 uppercase"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            {m.home.latestEpisodes}
          </h2>
          {latestEpisodes.length > 0 && (
            <Link
              href={`/${locale}/episodes`}
              className="text-xs text-brand-dark/40 hover:text-brand-blue transition-colors"
            >
              {m.home.moreEpisodes} →
            </Link>
          )}
        </div>

        {episodes === null ? (
          <p className="text-brand-dark/30 text-sm">{m.home.unavailable}</p>
        ) : latestEpisodes.length === 0 ? (
          <p className="text-brand-dark/30 text-sm">{m.home.noEpisodes}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-brand-gray">
            {latestEpisodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
