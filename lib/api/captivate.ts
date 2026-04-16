import type { Episode } from '@/lib/types/episode';

const API_BASE = 'https://api.captivate.fm';

/**
 * Authenticates with Captivate.fm and returns a JWT token.
 * Called server-side only — credentials never leave the server.
 *
 * @throws {Error} When API credentials are missing or authentication fails
 */
async function getAuthToken(): Promise<string> {
  const username = process.env.CAPTIVATE_API_USER;
  const apiKey = process.env.CAPTIVATE_API_KEY;

  if (!username || !apiKey) {
    throw new Error('Missing CAPTIVATE_API_USER or CAPTIVATE_API_KEY environment variables');
  }

  const response = await fetch(`${API_BASE}/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, token: apiKey }),
  });

  if (!response.ok) {
    throw new Error(`Captivate.fm authentication failed: ${response.status}`);
  }

  const data = (await response.json()) as { user: { token: string } };
  return data.user.token;
}

/**
 * Fetches all published episodes for the configured show, ordered newest first.
 * Results are cached for 1 hour via Next.js fetch cache.
 *
 * @throws {Error} When show ID is missing, auth fails, or the API request fails
 */
export async function getEpisodes(): Promise<Episode[]> {
  const showId = process.env.CAPTIVATE_SHOW_ID;

  if (!showId) {
    throw new Error('Missing CAPTIVATE_SHOW_ID environment variable');
  }

  const token = await getAuthToken();

  const response = await fetch(`${API_BASE}/shows/${showId}/episodes`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch episodes: ${response.status}`);
  }

  const data = (await response.json()) as { episodes: RawEpisode[] };

  return data.episodes
    .filter((ep) => ep.status === 'published')
    .map(normalizeEpisode);
}

/**
 * Fetches a single episode by ID.
 * Cached for 1 hour — episode content rarely changes after publishing.
 *
 * @throws {Error} When the episode is not found or the API request fails
 */
export async function getEpisode(id: string): Promise<Episode> {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE}/episodes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Episode not found: ${id}`);
    }
    throw new Error(`Failed to fetch episode ${id}: ${response.status}`);
  }

  const data = (await response.json()) as { episode: RawEpisode };
  return normalizeEpisode(data.episode);
}

// Raw shape returned by Captivate.fm API
interface RawEpisode {
  id: string;
  title: string;
  description: string;
  shownotes: string;
  published_at: string;
  media_url: string;
  duration: string; // Captivate returns duration as a string (seconds)
  episode_number: number | null;
  episode_season: number | null;
  artwork_url: string | null;
  status: string;
}

function normalizeEpisode(raw: RawEpisode): Episode {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    shownotes: raw.shownotes,
    publishedAt: raw.published_at,
    audioUrl: raw.media_url,
    duration: parseInt(raw.duration, 10),
    episodeNumber: raw.episode_number,
    seasonNumber: raw.episode_season,
    imageUrl: raw.artwork_url,
    status: raw.status as Episode['status'],
  };
}
