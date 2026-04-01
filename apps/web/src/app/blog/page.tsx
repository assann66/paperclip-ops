import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { blogPosts } from '@/data/blog-posts';

export const metadata: Metadata = {
  title: 'Insights & Blog | مقالات ورؤى',
  description:
    'AI strategy insights, digital transformation guidance, and thought leadership for business leaders in the MENA region. رؤى واستراتيجيات الذكاء الاصطناعي.',
  openGraph: {
    title: 'Insights & Blog | SAD',
    description:
      'AI strategy insights and thought leadership for business leaders.',
    type: 'website',
  },
};

export default function BlogPage() {
  const enPosts = blogPosts.filter((p) => p.lang === 'en');
  const arPosts = blogPosts.filter((p) => p.lang === 'ar');

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Insights
              </h1>
              <p className="mt-2 text-lg text-muted" dir="rtl" lang="ar">
                مقالات ورؤى
              </p>
              <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
                AI strategy, digital transformation, and practical guidance for
                business leaders.
              </p>
            </div>

            {/* English Posts */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold tracking-tight mb-8">
                Latest Articles
              </h2>
              <div className="grid gap-8">
                {enPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl border border-border bg-background p-8 transition-shadow hover:shadow-lg"
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-muted leading-7">{post.excerpt}</p>
                    <p className="mt-4 text-sm text-muted">{post.date}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Arabic Posts */}
            <div className="mt-16">
              <h2
                className="text-2xl font-bold tracking-tight mb-8"
                dir="rtl"
                lang="ar"
              >
                المقالات بالعربية
              </h2>
              <div className="grid gap-8">
                {arPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl border border-border bg-background p-8 transition-shadow hover:shadow-lg"
                    dir="rtl"
                    lang="ar"
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-muted leading-7">{post.excerpt}</p>
                    <p className="mt-4 text-sm text-muted">{post.date}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
