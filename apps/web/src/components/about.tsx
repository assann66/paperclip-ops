export function About() {
  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">About Us</h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              We are an AI consultancy on a mission to make artificial intelligence practical and
              accessible for businesses of all sizes. Our team combines deep technical expertise
              with real-world business understanding to deliver solutions that create measurable
              impact.
            </p>
            <p className="mt-4 text-lg leading-8 text-muted" dir="rtl" lang="ar">
              نحن شركة استشارات ذكاء اصطناعي تهدف إلى جعل الذكاء الاصطناعي عمليًا ومتاحًا للشركات
              بمختلف أحجامها. نجمع بين الخبرة التقنية العميقة والفهم الواقعي للأعمال لتقديم حلول ذات
              تأثير قابل للقياس.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-8">
              <div>
                <p className="text-3xl font-bold text-primary">AI-First</p>
                <p className="mt-1 text-sm text-muted">Every solution built with AI at the core</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">Bilingual</p>
                <p className="mt-1 text-sm text-muted">Arabic & English fluency</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-10">
            <h3 className="text-xl font-semibold">Our Approach</h3>
            <ul className="mt-6 space-y-4">
              {[
                'Understand your business challenges and goals',
                'Identify high-impact AI opportunities',
                'Build and integrate custom solutions',
                'Measure results and optimize continuously',
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-muted leading-8">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
