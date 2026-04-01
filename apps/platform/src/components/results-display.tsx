'use client';

import { useState } from 'react';
import type { AnalysisResult, AnalysisResultData } from '@/lib/types';

interface ResultsDisplayProps {
  results: AnalysisResult[];
}

function DownloadPdfButton({ result }: { result: AnalysisResultData }) {
  const handleDownload = () => {
    const text = formatResultAsText(result);
    // Open a print-friendly window for PDF export
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html><head><title>Document Analysis</title>
<style>
  body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; padding: 20px; color: #1a1a1a; line-height: 1.6; }
  h1 { font-size: 20px; border-bottom: 2px solid #333; padding-bottom: 8px; }
  h2 { font-size: 16px; margin-top: 24px; color: #444; }
  ul { padding-left: 20px; }
  li { margin-bottom: 4px; }
  .meta { font-size: 12px; color: #888; margin-top: 32px; border-top: 1px solid #ddd; padding-top: 8px; }
  @media print { body { margin: 0; } }
</style></head><body>
<h1>Document Analysis Report</h1>
${result.documentType ? `<p><strong>Type:</strong> ${result.documentType}</p>` : ''}
<h2>Executive Summary</h2><p>${result.summary}</p>
<h2>Key Findings</h2><ul>${result.keyFindings.map(f => `<li>${f}</li>`).join('')}</ul>
${result.actionItems?.length ? `<h2>Action Items</h2><ul>${result.actionItems.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
${result.riskAssessment ? `<h2>Risk Assessment</h2><p>${result.riskAssessment}</p>` : ''}
${result.suggestedNextSteps?.length ? `<h2>Suggested Next Steps</h2><ul>${result.suggestedNextSteps.map(s => `<li>${s}</li>`).join('')}</ul>` : ''}
<div class="meta">Confidence: ${(result.confidence * 100).toFixed(0)}% &middot; Generated ${new Date().toLocaleString()}</div>
</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border hover:bg-primary/5 transition-colors"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      PDF
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border hover:bg-primary/5 transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function formatResultAsText(result: AnalysisResultData): string {
  const lines: string[] = [];
  lines.push('EXECUTIVE SUMMARY');
  lines.push(result.summary);
  lines.push('');
  lines.push('KEY FINDINGS');
  result.keyFindings.forEach((f, i) => lines.push(`${i + 1}. ${f}`));
  if (result.actionItems?.length) {
    lines.push('');
    lines.push('ACTION ITEMS');
    result.actionItems.forEach((a, i) => lines.push(`${i + 1}. ${a}`));
  }
  if (result.riskAssessment) {
    lines.push('');
    lines.push('RISK ASSESSMENT');
    lines.push(result.riskAssessment);
  }
  if (result.suggestedNextSteps?.length) {
    lines.push('');
    lines.push('SUGGESTED NEXT STEPS');
    result.suggestedNextSteps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  }
  return lines.join('\n');
}

const TYPE_LABELS: Record<string, string> = {
  contract: 'Contract',
  report: 'Report',
  memo: 'Memo',
  proposal: 'Proposal',
  financial: 'Financial',
  technical: 'Technical',
  legal: 'Legal',
  other: 'Document',
};

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <p>No analysis results yet. Upload a document to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result) => (
        <div key={result.id} className="border border-border rounded-lg bg-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              {result.result?.documentType && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {TYPE_LABELS[result.result.documentType] || result.result.documentType}
                </span>
              )}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  result.status === 'completed'
                    ? 'bg-success/10 text-success'
                    : 'bg-muted/10 text-muted'
                }`}
              >
                {result.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {result.result && <DownloadPdfButton result={result.result} />}
              {result.result && <CopyButton text={formatResultAsText(result.result)} />}
              <span className="text-xs text-muted">
                {new Date(result.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {result.result && (
            <div className="px-6 py-5 space-y-5">
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Executive Summary</h3>
                <p className="text-sm leading-relaxed">{result.result.summary}</p>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Key Findings</h3>
                <ul className="space-y-1.5">
                  {result.result.keyFindings.map((finding, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5 font-medium">{i + 1}.</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </section>

              {result.result.actionItems && result.result.actionItems.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Action Items</h3>
                  <ul className="space-y-1.5">
                    {result.result.actionItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5">&#x2610;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {result.result.riskAssessment && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Risk Assessment</h3>
                  <p className="text-sm leading-relaxed">{result.result.riskAssessment}</p>
                </section>
              )}

              {result.result.suggestedNextSteps && result.result.suggestedNextSteps.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Suggested Next Steps</h3>
                  <ul className="space-y-1.5">
                    {result.result.suggestedNextSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5">&#x2192;</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="pt-3 border-t border-border text-xs text-muted">
                Confidence: {(result.result.confidence * 100).toFixed(0)}%
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
