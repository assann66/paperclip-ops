'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const SAMPLE_DOCUMENTS = [
  {
    name: 'Q4-2025-Financial-Report.pdf',
    type: 'Financial Report',
    pages: 24,
    size: '2.4 MB',
  },
  {
    name: 'Vendor-Services-Agreement.docx',
    type: 'Legal Contract',
    pages: 12,
    size: '890 KB',
  },
  {
    name: 'Market-Analysis-MENA-2026.pdf',
    type: 'Market Research',
    pages: 38,
    size: '5.1 MB',
  },
];

const ANALYSIS_STEPS = [
  { label: 'Parsing document structure', duration: 800 },
  { label: 'Extracting text and tables', duration: 1200 },
  { label: 'Running AI classification', duration: 1500 },
  { label: 'Identifying key entities', duration: 1000 },
  { label: 'Generating insights', duration: 1400 },
  { label: 'Building summary report', duration: 600 },
];

interface AnalysisResult {
  summary: string;
  keyFindings: string[];
  entities: { label: string; value: string }[];
  sentiment: string;
  riskLevel: string;
  confidence: number;
}

const RESULTS: Record<string, AnalysisResult> = {
  'Q4-2025-Financial-Report.pdf': {
    summary:
      'Q4 2025 financial report showing 23% YoY revenue growth driven by expansion into GCC markets. Operating margins improved by 4.2 percentage points. Cash position remains strong at $14.2M.',
    keyFindings: [
      'Revenue reached $8.7M in Q4, up 23% year-over-year',
      'Gross margin expanded to 68.4% from 64.2%',
      'Customer acquisition cost decreased 15% due to referral program',
      'Three new enterprise contracts signed in Saudi Arabia and UAE',
      'R&D spend increased 30% with focus on AI document processing',
    ],
    entities: [
      { label: 'Total Revenue', value: '$8.7M' },
      { label: 'Gross Margin', value: '68.4%' },
      { label: 'Net Income', value: '$1.9M' },
      { label: 'Cash Position', value: '$14.2M' },
      { label: 'Headcount', value: '47 employees' },
    ],
    sentiment: 'Positive',
    riskLevel: 'Low',
    confidence: 94,
  },
  'Vendor-Services-Agreement.docx': {
    summary:
      'Standard services agreement with 24-month term for managed IT infrastructure. Contains standard liability caps, SLA commitments of 99.9% uptime, and auto-renewal clause. Two areas flagged for legal review.',
    keyFindings: [
      'Contract term: 24 months with auto-renewal',
      'SLA commitment: 99.9% uptime guarantee',
      'Liability cap set at 12 months of service fees',
      'IP ownership clause favors vendor — recommend negotiation',
      'Data residency clause does not specify GCC compliance',
    ],
    entities: [
      { label: 'Contract Term', value: '24 months' },
      { label: 'Monthly Fee', value: '$12,500' },
      { label: 'SLA Target', value: '99.9% uptime' },
      { label: 'Liability Cap', value: '$150,000' },
      { label: 'Notice Period', value: '90 days' },
    ],
    sentiment: 'Neutral',
    riskLevel: 'Medium',
    confidence: 91,
  },
  'Market-Analysis-MENA-2026.pdf': {
    summary:
      'Comprehensive MENA market analysis projecting 34% CAGR for AI/ML services through 2028. Saudi Arabia and UAE lead adoption. Key verticals: financial services, healthcare, and government digital transformation.',
    keyFindings: [
      'MENA AI market projected to reach $8.3B by 2028',
      'Saudi Vision 2030 driving 40% of regional AI investment',
      'Healthcare AI adoption growing fastest at 42% CAGR',
      'Talent shortage remains top barrier — 67% of firms report hiring difficulty',
      'Regulatory frameworks maturing in UAE and Saudi Arabia',
    ],
    entities: [
      { label: 'Market Size (2028)', value: '$8.3B' },
      { label: 'CAGR', value: '34%' },
      { label: 'Top Market', value: 'Saudi Arabia' },
      { label: 'Top Vertical', value: 'Financial Services' },
      { label: 'Reports Analyzed', value: '142 sources' },
    ],
    sentiment: 'Positive',
    riskLevel: 'Low',
    confidence: 88,
  },
};

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-border overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function StepIndicator({
  steps,
  currentStep,
}: {
  steps: { label: string; duration: number }[];
  currentStep: number;
}) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors ${
              i < currentStep
                ? 'bg-green-500 text-white'
                : i === currentStep
                  ? 'bg-primary text-white animate-pulse'
                  : 'bg-border text-muted'
            }`}
          >
            {i < currentStep ? (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          <span className={i <= currentStep ? 'text-foreground' : 'text-muted'}>{step.label}</span>
        </div>
      ))}
    </div>
  );
}

function ResultsView({ result }: { result: AnalysisResult }) {
  const riskColor =
    result.riskLevel === 'Low'
      ? 'text-green-600'
      : result.riskLevel === 'Medium'
        ? 'text-yellow-600'
        : 'text-red-600';

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h3 className="text-lg font-semibold mb-3">Summary</h3>
        <p className="text-muted leading-relaxed">{result.summary}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {result.entities.map((entity, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs text-muted mb-1">{entity.label}</div>
            <div className="text-lg font-semibold">{entity.value}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Key Findings</h3>
        <ul className="space-y-2">
          {result.keyFindings.map((finding, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {finding}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <div>
          <span className="text-muted">Sentiment: </span>
          <span className="font-medium">{result.sentiment}</span>
        </div>
        <div>
          <span className="text-muted">Risk Level: </span>
          <span className={`font-medium ${riskColor}`}>{result.riskLevel}</span>
        </div>
        <div>
          <span className="text-muted">Confidence: </span>
          <span className="font-medium">{result.confidence}%</span>
        </div>
      </div>
    </div>
  );
}

type DemoPhase = 'select' | 'analyzing' | 'results';

export default function DemoPage() {
  const [phase, setPhase] = useState<DemoPhase>('select');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const runAnalysis = useCallback((docName: string) => {
    setSelectedDoc(docName);
    setPhase('analyzing');
    setCurrentStep(0);
    setProgress(0);

    let step = 0;
    const totalDuration = ANALYSIS_STEPS.reduce((sum, s) => sum + s.duration, 0);
    let elapsed = 0;

    const advance = () => {
      if (step < ANALYSIS_STEPS.length) {
        const stepDuration = ANALYSIS_STEPS[step].duration;
        elapsed += stepDuration;
        step++;
        setCurrentStep(step);
        setProgress(Math.round((elapsed / totalDuration) * 100));
        setTimeout(advance, ANALYSIS_STEPS[step - 1].duration);
      } else {
        setPhase('results');
      }
    };

    setTimeout(advance, ANALYSIS_STEPS[0].duration);
  }, []);

  const reset = useCallback(() => {
    setPhase('select');
    setSelectedDoc(null);
    setCurrentStep(0);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (phase === 'analyzing' && currentStep === 0) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 15) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(progressInterval);
    }
  }, [phase, currentStep]);

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            SAD
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link href="/" className="text-muted hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="text-foreground font-semibold">Demo</span>
          </nav>
          <Link
            href="/#contact"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Get in Touch
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                Interactive Demo
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                AI Document <span className="text-primary">Analysis</span>
              </h1>
              <p className="mt-4 text-lg text-muted">
                See how our AI extracts insights, identifies risks, and generates actionable
                summaries from business documents in seconds.
              </p>
            </div>

            {phase === 'select' && (
              <div className="mx-auto max-w-3xl">
                <h2 className="text-lg font-semibold mb-4">Select a sample document to analyze</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {SAMPLE_DOCUMENTS.map((doc) => (
                    <button
                      key={doc.name}
                      onClick={() => runAnalysis(doc.name)}
                      className="group rounded-2xl border border-border bg-card p-6 text-left transition-all hover:shadow-lg hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                        <svg
                          className="h-6 w-6 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                          />
                        </svg>
                      </div>
                      <div className="text-sm font-semibold mb-1 truncate">{doc.name}</div>
                      <div className="text-xs text-muted">
                        {doc.type} &middot; {doc.pages} pages &middot; {doc.size}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {phase === 'analyzing' && selectedDoc && (
              <div className="mx-auto max-w-2xl">
                <div className="rounded-2xl border border-border bg-card p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <svg
                        className="h-5 w-5 text-primary animate-pulse"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold">Analyzing {selectedDoc}</div>
                      <div className="text-xs text-muted">AI processing in progress...</div>
                    </div>
                  </div>
                  <ProgressBar progress={progress} />
                  <div className="mt-6">
                    <StepIndicator steps={ANALYSIS_STEPS} currentStep={currentStep} />
                  </div>
                </div>
              </div>
            )}

            {phase === 'results' && selectedDoc && RESULTS[selectedDoc] && (
              <div className="mx-auto max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold">Analysis Complete</h2>
                    <p className="text-sm text-muted">{selectedDoc}</p>
                  </div>
                  <button
                    onClick={reset}
                    className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-card"
                  >
                    Analyze Another
                  </button>
                </div>
                <div className="rounded-2xl border border-border bg-card p-8">
                  <ResultsView result={RESULTS[selectedDoc]} />
                </div>
                <div className="mt-8 text-center">
                  <p className="text-sm text-muted mb-4">
                    Ready to analyze your own documents with AI?
                  </p>
                  <Link
                    href="/#contact"
                    className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
                  >
                    Start Your Project
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} SAD. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
