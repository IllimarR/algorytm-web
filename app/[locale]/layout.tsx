import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import '../globals.css';
import { Navigation } from '@/components/navigation';
import { siteConfig } from '@/lib/config';
import { getMessages, isLocale, locales, type Locale } from '@/lib/i18n/messages';

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
    { path: '../../public/font/Raleway-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/font/Raleway-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../../public/font/Raleway-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/font/Raleway-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/font/Raleway-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../../public/font/Raleway-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: '../../public/font/Raleway-Black.ttf', weight: '900', style: 'normal' },
  ],
  variable: '--font-raleway',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return {
    title: m.metadata.siteTitle,
    description: m.metadata.siteDescription,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      title: m.metadata.siteTitle,
      description: m.metadata.siteDescription,
      locale: m.metadata.ogLocale,
      type: 'website',
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale: Locale = locale;

  return (
    <html
      lang={typedLocale}
      className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-brand-dark">
        <Navigation locale={typedLocale} />
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
