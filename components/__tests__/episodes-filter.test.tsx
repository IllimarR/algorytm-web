import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EpisodesFilter } from '../episodes-filter';
import type { Episode } from '@/lib/types/episode';

// Mock next/navigation
const mockReplace = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => mockSearchParams),
  useRouter: vi.fn(() => ({ replace: mockReplace })),
}));

// Mock EpisodeCard to keep tests simple
vi.mock('../episode-card', () => ({
  EpisodeCard: ({ episode }: { episode: Episode }) => (
    <div data-testid="episode-card">{episode.title}</div>
  ),
}));

const makeEp = (publishedAt: string, title: string): Episode => ({
  id: title,
  title,
  description: '',
  shownotes: '',
  publishedAt,
  audioUrl: '',
  duration: 0,
  episodeNumber: null,
  seasonNumber: null,
  imageUrl: null,
  status: 'published',
});

const episodes: Episode[] = [
  makeEp('2023-01-10T00:00:00Z', 'Jan 2023 episode'),
  makeEp('2023-06-15T00:00:00Z', 'Jun 2023 episode'),
  makeEp('2024-03-20T00:00:00Z', 'Mar 2024 episode'),
];

describe('EpisodesFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.delete('from');
    mockSearchParams.delete('to');
  });

  it('renders "Alates" and "Kuni" labels', () => {
    render(<EpisodesFilter episodes={episodes} />);
    expect(screen.getByText('Alates')).toBeInTheDocument();
    expect(screen.getByText('Kuni')).toBeInTheDocument();
  });

  it('shows all episodes when Kõik range is applied via params', () => {
    mockSearchParams.set('from', '2023-01');
    mockSearchParams.set('to', '2024-12');
    render(<EpisodesFilter episodes={episodes} />);
    expect(screen.getAllByTestId('episode-card')).toHaveLength(3);
  });

  it('shows episode count', () => {
    mockSearchParams.set('from', '2023-01');
    mockSearchParams.set('to', '2024-12');
    render(<EpisodesFilter episodes={episodes} />);
    expect(screen.getByText('3 saadet')).toBeInTheDocument();
  });

  it('filters episodes when from and to params are set', () => {
    mockSearchParams.set('from', '2023-06');
    mockSearchParams.set('to', '2023-06');
    render(<EpisodesFilter episodes={episodes} />);
    expect(screen.getAllByTestId('episode-card')).toHaveLength(1);
    expect(screen.getByText('Jun 2023 episode')).toBeInTheDocument();
    expect(screen.getByText('1 saadet')).toBeInTheDocument();
  });

  it('calls router.replace on mount to write default params (current year) when none are present', () => {
    const currentYear = new Date().getFullYear();
    render(<EpisodesFilter episodes={episodes} />);
    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`from=${currentYear}-01&to=\\d{4}-\\d{2}`))
    );
  });

  it('calls router.replace when "from" year select changes', () => {
    mockSearchParams.set('from', '2023-01');
    mockSearchParams.set('to', '2024-03');
    render(<EpisodesFilter episodes={episodes} />);
    const fromYearSelect = screen.getByRole('combobox', { name: 'Alates aasta' });
    fireEvent.change(fromYearSelect, { target: { value: '2024' } });
    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining('from=2024-01')
    );
  });

  it('calls router.replace when "to" month select changes', () => {
    mockSearchParams.set('from', '2023-01');
    mockSearchParams.set('to', '2024-03');
    render(<EpisodesFilter episodes={episodes} />);
    const toMonthSelect = screen.getByRole('combobox', { name: 'Kuni kuu' });
    fireEvent.change(toMonthSelect, { target: { value: '11' } });
    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining('to=2024-11')
    );
  });
});
