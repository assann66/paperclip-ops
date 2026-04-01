export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            AI Solutions for <span className="text-primary">Modern Business</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted">
            We help businesses improve operational efficiency, accelerate growth, and achieve
            seamless digital integration through intelligent AI solutions and expert consulting.
          </p>
          <p className="mt-2 text-lg leading-8 text-muted" dir="rtl" lang="ar">
            حلول ذكاء اصطناعي متقدمة لتحسين كفاءة الأعمال وتسريع النمو
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              Start a Project
            </a>
            <a
              href="#services"
              className="rounded-full border border-border px-8 py-3 text-sm font-semibold transition-colors hover:bg-card"
            >
              Our Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
