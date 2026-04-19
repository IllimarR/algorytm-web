import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getEpisodeById, getEpisodesFromRss } from '@/lib/api/rss';
import { getMessages, isLocale, locales, type Locale } from '@/lib/i18n/messages';
import { formatDate, formatDuration } from '@/lib/utils/format';
import { prepareShownotes } from '@/lib/utils/linkify';
import type { Metadata } from 'next';

interface Params {
  locale: string;
  id: string;
}

export async function generateStaticParams() {
  const episodes = await getEpisodesFromRss().catch(() => []);
  return locales.flatMap((locale) =>
    episodes.map((episode) => ({ locale, id: episode.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};
  const episode = await getEpisodeById(id);
  if (!episode) return {};
  return {
    title: `${episode.title} — Algorütm`,
    description: episode.description.slice(0, 160),
  };
}

export default async function EpisodeDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale: Locale = locale;
  const episode = await getEpisodeById(id);
  if (!episode) notFound();

  const m = getMessages(typedLocale);

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href={`/${typedLocale}/episodes`}
        className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.15em] text-brand-dark/40 uppercase hover:text-brand-blue transition-colors mb-8"
      >
        <span aria-hidden="true">←</span>
        {m.episode.backToEpisodes}
      </Link>

      <header className="mb-10 flex flex-col sm:flex-row gap-6 items-start">
        {episode.imageUrl && (
          <Image
            src={episode.imageUrl}
            alt=""
            width={200}
            height={200}
            className="w-32 sm:w-40 h-auto rounded border border-brand-gray flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            {episode.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-brand-dark/40 font-mono">
            <span>{formatDate(episode.publishedAt, typedLocale)}</span>
            <span className="text-brand-dark/20">·</span>
            <span>{formatDuration(episode.duration, typedLocale)}</span>
            {episode.episodeNumber !== null && (
              <>
                <span className="text-brand-dark/20">·</span>
                <span>#{episode.episodeNumber}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {episode.audioUrl && (
        <div className="mb-10">
          <audio
            controls
            preload="metadata"
            src={episode.audioUrl}
            className="w-full"
          >
            <a href={episode.audioUrl}>Download audio</a>
          </audio>
        </div>
      )}

      {episode.shownotes && (
        <section>
          <h2
            className="text-xs font-bold tracking-[0.2em] text-brand-dark/40 uppercase mb-4"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            {m.episode.shownotes}
          </h2>
          <div
            className="shownotes text-brand-dark/80 leading-relaxed [&_p]:mb-4 [&_a]:text-brand-blue [&_a]:underline hover:[&_a]:text-brand-blue-dark [&_a]:break-all [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_strong]:font-bold [&_em]:italic [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_hr]:my-8 [&_hr]:border-0 [&_hr]:h-px [&_hr]:bg-gradient-to-r [&_hr]:from-brand-blue [&_hr]:via-brand-blue/20 [&_hr]:to-transparent"
            dangerouslySetInnerHTML={{ __html: prepareShownotes(episode.shownotes) }}
          />
        </section>
      )}
    </article>
  );
}
