import Parser from 'rss-parser';
import type { Episode } from '@/lib/types/episode';
import { siteConfig } from '@/lib/config';

type RssItem = {
  guid: string;
  title: string;
  contentSnippet: string;
  content: string;
  pubDate: string;
  enclosure?: { url: string; length: string; type: string };
  itunes: {
    duration: string;
    episode: string;
    season: string;
    image: string;
    summary: string;
  };
};

type RssFeed = {
  items: RssItem[];
};

const parser = new Parser<RssFeed, RssItem>({
  customFields: {
    item: [
      ['itunes:duration', 'itunes.duration'],
      ['itunes:episode', 'itunes.episode'],
      ['itunes:season', 'itunes.season'],
      ['itunes:image', 'itunes.image'],
      ['itunes:summary', 'itunes.summary'],
    ],
  },
});

/**
 * Parses an iTunes duration string to total seconds.
 * Accepts formats: "HH:MM:SS", "MM:SS", or plain seconds as a string.
 */
function parseDuration(duration: string): number {
  if (!duration) return 0;
  const parts = duration.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parseInt(duration, 10) || 0;
}

/**
 * Fetches and parses the Captivate.fm RSS feed, returning published episodes newest first.
 * Results are cached for 1 hour via Next.js fetch cache.
 *
 * @throws {Error} When the feed cannot be fetched or parsed
 */
export async function getEpisodesFromRss(): Promise<Episode[]> {
  // Fetch through Next.js so the response is cached
  const response = await fetch(siteConfig.rssUrl, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: ${response.status}`);
  }

  const xml = await response.text();
  const feed = await parser.parseString(xml);

  return feed.items.map((item, index): Episode => {
    const epNumber = item.itunes?.episode ? parseInt(item.itunes.episode, 10) : null;
    const seasonNumber = item.itunes?.season ? parseInt(item.itunes.season, 10) : null;

    // Derive a stable ID from the guid, falling back to index
    const id = item.guid ?? String(index);

    return {
      id,
      title: item.title ?? 'Untitled',
      description: item.itunes?.summary || item.contentSnippet || '',
      shownotes: item.content || '',
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      audioUrl: item.enclosure?.url ?? '',
      duration: parseDuration(item.itunes?.duration ?? ''),
      episodeNumber: isNaN(epNumber!) ? null : epNumber,
      seasonNumber: isNaN(seasonNumber!) ? null : seasonNumber,
      imageUrl: item.itunes?.image ?? null,
      status: 'published',
    };
  });
}
