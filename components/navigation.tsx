import Link from 'next/link';
import Image from 'next/image';

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-gray bg-white/95 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
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

        <div className="flex items-center gap-6">
          <Link
            href="/episodes"
            className="text-sm text-brand-dark/60 hover:text-brand-blue transition-colors"
          >
            Episodes
          </Link>
        </div>
      </nav>
    </header>
  );
}
