'use client';

interface AnalysisResult {
  id: string;
  type: string;
  status: string;
  result: {
    summary: string;
    keyFindings: string[];
    confidence: number;
  } | null;
  createdAt: string;
}

interface ResultsDisplayProps {
  results: AnalysisResult[];
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <p>No analysis results yet. Upload a document to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div key={result.id} className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {result.type}
              </span>
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
            <span className="text-xs text-muted">
              {new Date(result.createdAt).toLocaleString()}
            </span>
          </div>
          {result.result && (
            <>
              <p className="font-medium mb-3">{result.result.summary}</p>
              <ul className="space-y-1.5">
                {result.result.keyFindings.map((finding, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <span className="text-primary mt-0.5">-</span>
                    {finding}
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-xs text-muted">
                Confidence: {(result.result.confidence * 100).toFixed(0)}%
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
