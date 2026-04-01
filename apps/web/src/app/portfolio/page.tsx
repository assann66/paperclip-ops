import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Portfolio | مشاريعنا | SAD',
  description:
    'Live AI projects and case studies by SAD AI Solutions. See our work in investment intelligence, document analysis, and more.',
  openGraph: {
    title: 'Portfolio | SAD AI Solutions',
    description:
      'Live AI projects and case studies — from investment intelligence to document analysis.',
    type: 'website',
  },
};

const projects = [
  {
    title: 'Saudi VC Intelligence Platform',
    titleAr: 'منصة استخبارات رأس المال المخاطر السعودي',
    description:
      'AI-powered investment analysis platform built for Saudi venture capital. Aggregates deal flow, analyzes market signals, and surfaces high-potential opportunities across the Kingdom\'s startup ecosystem.',
    metrics: [
      { label: 'Data Sources', value: '50+' },
      { label: 'Analysis Time', value: '<30s' },
      { label: 'Accuracy', value: '94%' },
    ],
    techStack: ['Next.js', 'TypeScript', 'AI/ML', 'Real-time Data'],
    liveUrl: 'https://assann66.github.io/saudi-vc-intelligence/',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
  },
  {
    title: 'AI Document Analysis Demo',
    titleAr: 'عرض تحليل المستندات بالذكاء الاصطناعي',
    description:
      'Interactive client-side AI demonstration that analyzes documents in real-time. Extracts entities, assesses sentiment, identifies risk factors, and generates structured insights — all running directly in the browser.',
    metrics: [
      { label: 'Processing', value: 'Client-side' },
      { label: 'Doc Types', value: '3+' },
      { label: 'Latency', value: '<2s' },
    ],
    techStack: ['React', 'TypeScript', 'Browser AI', 'Next.js'],
    liveUrl: 'https://assann66.github.io/paperclip-ops/demo',
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
  },
];

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Our Work
              </h1>
              <p className="mt-2 text-lg text-muted" dir="rtl" lang="ar">
                مشاريعنا
              </p>
              <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
                Live AI projects we&apos;ve built. Each one solves a real
                business problem — explore the demos and see what&apos;s
                possible.
              </p>
            </div>
          </div>
        </section>

        {/* Project Cards */}
        <section className="bg-card py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="rounded-2xl border border-border bg-background p-8 sm:p-10 transition-shadow hover:shadow-lg"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
                    {/* Left: Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-6 w-6 text-primary"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d={project.icon}
                            />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{project.title}</h2>
                          <p
                            className="text-sm text-muted"
                            dir="rtl"
                            lang="ar"
                          >
                            {project.titleAr}
                          </p>
                        </div>
                      </div>

                      <p className="text-muted leading-7 mb-6">
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                      >
                        View Live Demo
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </a>
                    </div>

                    {/* Right: Metrics */}
                    <div className="mt-8 lg:mt-0 grid grid-cols-3 gap-4 lg:w-64 lg:flex-shrink-0">
                      {project.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-xl border border-border bg-card p-4 text-center"
                        >
                          <p className="text-2xl font-bold text-primary">
                            {metric.value}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Want Something Like This?
              </h2>
              <p className="mt-2 text-lg text-muted" dir="rtl" lang="ar">
                هل تريد شيئاً مشابهاً؟
              </p>
              <p className="mt-4 text-lg text-muted">
                We build custom AI solutions for businesses across the MENA
                region. Let&apos;s discuss how AI can transform your operations.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/#contact"
                  className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                >
                  Book a Consultation
                </Link>
                <Link
                  href="/#consulting"
                  className="rounded-full border border-border px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card"
                >
                  View Our Services
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
