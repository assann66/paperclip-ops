import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@/components/analytics';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = 'https://assann66.github.io/paperclip-ops';

export const metadata: Metadata = {
  title: {
    default: 'SAD - AI Solutions & Consulting | حلول الذكاء الاصطناعي',
    template: '%s | SAD',
  },
  description:
    'AI-powered business solutions, smart integrations, and consulting services to improve operational efficiency and drive growth. حلول ذكاء اصطناعي متقدمة لتحسين كفاءة الأعمال.',
  keywords: [
    'AI solutions',
    'artificial intelligence',
    'consulting',
    'business automation',
    'smart integrations',
    'MENA',
    'GCC',
    'حلول الذكاء الاصطناعي',
    'استشارات',
    'أتمتة الأعمال',
    'تكامل ذكي',
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'SAD - AI Solutions & Consulting',
    title: 'SAD - AI Solutions & Consulting',
    description:
      'AI-powered business solutions, smart integrations, and consulting services for operational efficiency and growth.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'SAD - AI Solutions & Consulting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAD - AI Solutions & Consulting',
    description:
      'AI-powered business solutions, smart integrations, and consulting services for operational efficiency and growth.',
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'SAD',
              description:
                'AI-powered business solutions, smart integrations, and consulting services.',
              url: siteUrl,
              areaServed: ['Middle East', 'North Africa', 'GCC'],
              serviceType: [
                'AI Solutions',
                'Business Consulting',
                'Smart Integrations',
                'Document Analysis',
              ],
              knowsAbout: [
                'Artificial Intelligence',
                'Machine Learning',
                'Business Process Automation',
                'Data Analytics',
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
