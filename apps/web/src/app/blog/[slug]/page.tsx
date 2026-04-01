import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { blogPosts, getPostBySlug, getAllSlugs } from '@/data/blog-posts';

const siteUrl = 'https://assann66.github.io/paperclip-ops';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      locale: post.lang === 'ar' ? 'ar_SA' : 'en_US',
      url: `${siteUrl}/blog/${post.slug}`,
      siteName: 'SAD - AI Solutions & Consulting',
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`${siteUrl}/og-image.png`],
    },
  };
}

function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.trim() === '') {
      elements.push(<br key={key++} />);
      continue;
    }

    // Process bold markdown
    const parts: React.ReactNode[] = [];
    const boldRegex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      parts.push(
        <strong key={`b-${key}-${match.index}`}>{match[1]}</strong>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    // List items
    if (line.startsWith('- ')) {
      elements.push(
        <li key={key++} className="ml-6 list-disc text-muted leading-8">
          {parts}
        </li>
      );
    } else {
      elements.push(
        <p key={key++} className="text-foreground leading-8">
          {parts}
        </p>
      );
    }
  }

  return elements;
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const isRtl = post.lang === 'ar';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: post.lang === 'ar' ? 'ar' : 'en',
    url: `${siteUrl}/blog/${post.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'SAD - AI Solutions & Consulting',
      url: siteUrl,
    },
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1">
        <article
          className="py-24"
          dir={isRtl ? 'rtl' : 'ltr'}
          lang={post.lang}
        >
          <div className="mx-auto max-w-3xl px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
              dir="ltr"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              Back to Insights
            </Link>

            <header className="mb-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-4 text-muted">{post.date}</p>
            </header>

            <div className="space-y-2">{renderContent(post.content)}</div>

            <div className="mt-16 pt-8 border-t border-border">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
                dir="ltr"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
                All Insights
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
