export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm font-bold tracking-tight">SAD</p>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} SAD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
