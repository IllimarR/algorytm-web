import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getEpisodesFromRss } from '@/lib/api/rss';
import { EpisodesFilter } from '@/components/episodes-filter';
import { getMessages, isLocale } from '@/lib/i18n/messages';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return {
    title: m.metadata.episodesTitle,
    description: m.metadata.episodesDescription,
  };
}

export default async function EpisodesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const m = getMessages(locale);
  const episodes = await getEpisodesFromRss().catch(() => null);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight text-brand-blue"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          {m.episodes.title}
        </h1>
      </div>

      {episodes === null ? (
        <p className="text-brand-dark/30 text-sm">{m.episodes.unavailable}</p>
      ) : episodes.length === 0 ? (
        <p className="text-brand-dark/30 text-sm">{m.episodes.noEpisodes}</p>
      ) : (
        <Suspense fallback={null}>
          <EpisodesFilter episodes={episodes} locale={locale} />
        </Suspense>
      )}
    </section>
  );
}
