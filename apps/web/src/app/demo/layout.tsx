import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Document Analysis Demo',
  description:
    'Try our interactive AI document analysis demo. See how AI extracts insights, identifies risks, and generates actionable summaries from business documents.',
  openGraph: {
    title: 'AI Document Analysis Demo | SAD',
    description:
      'Interactive demo: AI-powered document analysis that extracts insights, identifies risks, and generates summaries in seconds.',
    url: 'https://assann66.github.io/paperclip-ops/demo',
  },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
