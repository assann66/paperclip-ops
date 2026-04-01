import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          SAD
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="#services" className="text-muted hover:text-foreground transition-colors">
            Services
          </Link>
          <Link href="#about" className="text-muted hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="#contact" className="text-muted hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>
        <Link
          href="#contact"
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Get in Touch
        </Link>
      </div>
    </header>
  );
}
