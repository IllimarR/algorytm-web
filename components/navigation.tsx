import Link from 'next/link';
import Image from 'next/image';

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0d0f14]/90 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/media/logo/Algorütm_Logo white.png"
            alt="Algorütm"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <span
            className="font-bold text-lg tracking-tight"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Algorütm
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/episodes"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Episodes
          </Link>
        </div>
      </nav>
    </header>
  );
}
