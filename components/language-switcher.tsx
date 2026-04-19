'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n/messages';

interface LanguageSwitcherProps {
  current: Locale;
}

export function LanguageSwitcher({ current }: LanguageSwitcherProps) {
  const pathname = usePathname() ?? '/';
  const searchParams = useSearchParams();
  // Strip the leading /xx locale segment (keeps the rest of the path)
  const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '';
  const query = searchParams?.toString();
  const suffix = query ? `?${query}` : '';

  function persistLocale(locale: Locale) {
    document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      {locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1">
          {i > 0 && <span className="text-brand-dark/20">|</span>}
          <Link
            href={`/${loc}${rest}${suffix}`}
            onClick={() => persistLocale(loc)}
            className={
              loc === current
                ? 'font-bold text-brand-blue'
                : 'text-brand-dark/40 hover:text-brand-blue transition-colors'
            }
            aria-current={loc === current ? 'true' : undefined}
          >
            {loc.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
