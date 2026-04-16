import type { Metadata } from 'next';
import { Geist, Geist_Mono, Syne } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Algorütm — Estonian Tech Podcast',
  description:
    'Algorütm is an Estonian tech podcast covering software, startups, and the digital world.',
  metadataBase: new URL('https://algorytm.ee'),
  openGraph: {
    title: 'Algorütm — Estonian Tech Podcast',
    description:
      'Algorütm is an Estonian tech podcast covering software, startups, and the digital world.',
    locale: 'et_EE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="et"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0d0f14] text-white">
        <Navigation />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/10 py-8 mt-16">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <span>© {new Date().getFullYear()} Algorütm</span>
            <span>algorytm.ee</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
