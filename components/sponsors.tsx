import Image from 'next/image';
import { siteConfig } from '@/lib/config';
import { getMessages, type Locale } from '@/lib/i18n/messages';

interface SponsorsProps {
  locale: Locale;
}

export function Sponsors({ locale }: SponsorsProps) {
  const m = getMessages(locale);

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
      <span className="text-xs font-mono tracking-[0.15em] text-brand-dark/40 uppercase">
        {m.footer.supportedBy}
      </span>
      <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {siteConfig.sponsors.map((sponsor) => (
          <li key={sponsor.name}>
            <a
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={sponsor.name}
              className="block text-brand-dark/50 hover:text-brand-dark transition-colors"
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={96}
                height={20}
                className="h-5 w-auto object-contain"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
