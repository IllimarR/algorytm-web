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
 * Fetched once at build time; pages are fully static until the next deploy.
 *
 * @throws {Error} When the feed cannot be fetched or parsed
 */
export async function getEpisodesFromRss(): Promise<Episode[]> {
  const response = await fetch(siteConfig.rssUrl, {
    cache: 'force-cache',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: ${response.status}`);
  }

  const xml = await response.text();
  const feed = await parser.parseString(xml);

  // rss-parser doesn't expose the <itunes:image href="..."/> attribute,
  // so walk the raw XML once and build a guid -> href map.
  const imageByGuid = new Map<string, string>();
  for (const match of xml.matchAll(/<item\b[\s\S]*?<\/item>/g)) {
    const chunk = match[0];
    const guid = chunk.match(/<guid[^>]*>(?:<!\[CDATA\[)?([^<\]]+)/)?.[1]?.trim();
    const href = chunk.match(/<itunes:image\s+href="([^"]+)"/)?.[1];
    if (guid && href) imageByGuid.set(guid, href);
  }

  // Channel-level artwork used as a fallback when an item has none
  const channelImage =
    xml
      .slice(0, xml.indexOf('<item'))
      .match(/<itunes:image\s+href="([^"]+)"/)?.[1] ?? null;

  const total = feed.items.length;

  return feed.items.map((item, index): Episode => {
    const parsedEp = item.itunes?.episode ? parseInt(item.itunes.episode, 10) : NaN;
    const seasonNumber = item.itunes?.season ? parseInt(item.itunes.season, 10) : null;

    // Older items in the feed may not carry <itunes:episode>. Since the feed
    // is newest-first, fall back to position-based numbering so every episode
    // still has a number.
    const episodeNumber = isNaN(parsedEp) ? total - index : parsedEp;

    // Derive a stable ID from the guid, falling back to index
    const id = item.guid ?? String(index);

    const imageUrl = imageByGuid.get(id) ?? channelImage;

    return {
      id,
      title: item.title ?? 'Untitled',
      description: item.itunes?.summary || item.contentSnippet || '',
      shownotes: item.content || '',
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      audioUrl: item.enclosure?.url ?? '',
      duration: parseDuration(item.itunes?.duration ?? ''),
      episodeNumber,
      seasonNumber: isNaN(seasonNumber!) ? null : seasonNumber,
      imageUrl,
      status: 'published',
    };
  });
}

/**
 * Fetches a single episode by guid. Relies on the cached RSS fetch.
 * Returns null when the feed can't be loaded or no episode matches.
 */
export async function getEpisodeById(id: string): Promise<Episode | null> {
  const episodes = await getEpisodesFromRss().catch(() => null);
  if (!episodes) return null;
  return episodes.find((ep) => ep.id === id) ?? null;
}
