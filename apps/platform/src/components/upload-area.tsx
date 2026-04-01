'use client';

import { useState, useCallback } from 'react';

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

interface UploadAreaProps {
  onResult: (result: AnalysisResult) => void;
}

export function UploadArea({ onResult }: UploadAreaProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/analyze', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Analysis failed');
          return;
        }
        onResult(data);
      } catch {
        setError('Failed to connect to the analysis API.');
      } finally {
        setUploading(false);
      }
    },
    [onResult],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
        dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      }`}
    >
      <svg
        className="w-12 h-12 mx-auto text-muted mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      {uploading ? (
        <p className="text-muted">Analyzing document...</p>
      ) : (
        <>
          <p className="text-lg font-medium mb-2">
            Drop a file here, or{' '}
            <label className="text-primary cursor-pointer hover:underline">
              browse
              <input
                type="file"
                className="hidden"
                accept=".pdf,.txt,.csv,.json"
                onChange={handleChange}
              />
            </label>
          </p>
          <p className="text-sm text-muted">Supports PDF, TXT, CSV, and JSON files</p>
        </>
      )}
      {error && <p className="mt-4 text-sm text-danger">{error}</p>}
    </div>
  );
}
