export interface Episode {
  id: string;
  title: string;
  description: string;
  shownotes: string;
  publishedAt: string;
  audioUrl: string;
  duration: number; // in seconds
  episodeNumber: number | null;
  seasonNumber: number | null;
  imageUrl: string | null;
  status: 'published' | 'draft' | 'scheduled';
}

