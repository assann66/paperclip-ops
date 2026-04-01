const engagements = [
  {
    title: 'AI Strategy & Roadmap',
    titleAr: 'استراتيجية وخارطة طريق الذكاء الاصطناعي',
    description:
      'We assess your current capabilities, identify high-impact AI opportunities, and build a phased roadmap aligned with your business goals — from quick wins to long-term transformation.',
    icon: 'M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6',
  },
  {
    title: 'System Integration',
    titleAr: 'تكامل الأنظمة',
    description:
      'We connect AI capabilities to your existing tech stack — CRMs, ERPs, data warehouses, and internal tools — so intelligence flows where your teams already work.',
    icon: 'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.421 48.421 0 0 1-4.185-.428.636.636 0 0 1-.544-.576 48.142 48.142 0 0 1 .061-7.756.64.64 0 0 1 .577-.544 47.647 47.647 0 0 1 4.09-.197h.643a48.118 48.118 0 0 1 4.09.197.64.64 0 0 1 .577.544c.274 2.56.34 5.143.061 7.756a.636.636 0 0 1-.544.576 48.421 48.421 0 0 1-4.185.428.64.64 0 0 1-.657-.643v0Z M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959',
  },
  {
    title: 'Custom AI Solutions',
    titleAr: 'حلول ذكاء اصطناعي مخصصة',
    description:
      'From intelligent document processing to predictive analytics and conversational AI — we design, build, and deploy custom models tailored to your specific business challenges.',
    icon: 'M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5',
  },
];

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '3x', label: 'Avg. Efficiency Gain' },
  { value: '95%', label: 'Client Retention' },
];

export function Consulting() {
  return (
    <section id="consulting" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Consulting Services</h2>
          <p className="mt-4 text-lg text-muted">
            Partner with our team to unlock the full potential of AI for your organization
          </p>
          <p className="mt-2 text-base text-muted" dir="rtl" lang="ar">
            شريكك في تحقيق أقصى استفادة من الذكاء الاصطناعي لمؤسستك
          </p>
        </div>

        {/* Who we work with */}
        <div className="mt-16 rounded-2xl border border-border bg-card p-8 sm:p-12">
          <h3 className="text-xl font-semibold">Who We Work With</h3>
          <p className="mt-3 text-muted leading-7">
            We partner with mid-market companies and enterprise teams looking to adopt AI
            strategically — not just experiment with it. Whether you are starting your AI journey or
            scaling existing capabilities, we meet you where you are and help you move faster with
            confidence.
          </p>
        </div>

        {/* Engagement types */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {engagements.map((engagement) => (
            <div
              key={engagement.title}
              className="rounded-2xl border border-border bg-background p-8 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-primary"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={engagement.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">{engagement.title}</h3>
              <p className="mt-1 text-sm text-muted" dir="rtl" lang="ar">
                {engagement.titleAr}
              </p>
              <p className="mt-3 text-muted leading-7">{engagement.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="#contact"
            className="inline-block rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            Book a Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
