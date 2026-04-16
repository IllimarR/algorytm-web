import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
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

const raleway = localFont({
  src: [
    { path: '../public/font/Raleway-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/font/Raleway-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../public/font/Raleway-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/font/Raleway-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../public/font/Raleway-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../public/font/Raleway-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: '../public/font/Raleway-Black.ttf', weight: '900', style: 'normal' },
  ],
  variable: '--font-raleway',
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
      className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-brand-dark">
        <Navigation />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-brand-gray py-8 mt-16">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-brand-dark/40">
            <span>© {new Date().getFullYear()} Algorütm</span>
            <span>algorytm.ee</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
