import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { getMessages, type Locale } from '@/lib/i18n/messages';
import { LanguageSwitcher } from '@/components/language-switcher';
import { siteConfig } from '@/lib/config';

interface NavigationProps {
  locale: Locale;
}

export function Navigation({ locale }: NavigationProps) {
  const m = getMessages(locale);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          <Image
            src="/media/logo/Algorütm_Logo icon round.svg"
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
            aria-hidden="true"
          />
          <span
            className="font-bold text-lg tracking-tight text-brand-blue"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Algorütm
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <a
            href={siteConfig.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={m.footer.youtubeLabel}
            className="text-brand-dark/50 hover:text-[#FF0000] transition-colors"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current"
            >
              <path d="M23.498 6.186a2.997 2.997 0 0 0-2.11-2.12C19.36 3.5 12 3.5 12 3.5s-7.36 0-9.388.566A2.997 2.997 0 0 0 .502 6.186C0 8.22 0 12 0 12s0 3.78.502 5.814a2.997 2.997 0 0 0 2.11 2.12C4.64 20.5 12 20.5 12 20.5s7.36 0 9.388-.566a2.997 2.997 0 0 0 2.11-2.12C24 15.78 24 12 24 12s0-3.78-.502-5.814ZM9.75 15.568V8.432L15.818 12 9.75 15.568Z" />
            </svg>
          </a>
          <Suspense fallback={<span className="w-[44px] h-4" aria-hidden="true" />}>
            <LanguageSwitcher current={locale} />
          </Suspense>
        </div>
      </nav>
      <div className="h-px bg-gradient-to-r from-brand-blue via-brand-blue/20 to-transparent" />
    </header>
  );
}
