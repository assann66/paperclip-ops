'use client';

import { useState, useCallback } from 'react';
import { UploadArea } from '@/components/upload-area';
import { ResultsDisplay } from '@/components/results-display';

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

export default function DashboardPage() {
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const handleResult = useCallback((result: AnalysisResult) => {
    setResults((prev) => [result, ...prev]);
  }, []);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted mt-1">Upload documents for AI-powered analysis</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted">Documents Analyzed</p>
          <p className="text-2xl font-bold mt-1">{results.length}</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted">Active Tools</p>
          <p className="text-2xl font-bold mt-1">1</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted">API Status</p>
          <p className="text-2xl font-bold text-success mt-1">Online</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
        <UploadArea onResult={handleResult} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Results</h2>
        <ResultsDisplay results={results} />
      </div>
    </div>
  );
}
