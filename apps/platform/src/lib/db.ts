// Database schema types for the AI Business Solutions Platform.
// Production: connect to PostgreSQL via Supabase/Neon.
// Currently using in-memory stubs for development.

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: Date;
}

export interface AnalysisResult {
  id: string;
  documentId: string;
  userId: string;
  type: 'summary' | 'extraction' | 'classification';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result: Record<string, unknown> | null;
  createdAt: Date;
  completedAt: Date | null;
}

// In-memory store for development
const analysisResults: AnalysisResult[] = [];

export function getAnalysisResults(userId: string): AnalysisResult[] {
  return analysisResults.filter((r) => r.userId === userId);
}

export function addAnalysisResult(
  result: Omit<AnalysisResult, 'id' | 'createdAt'>,
): AnalysisResult {
  const record: AnalysisResult = {
    ...result,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  };
  analysisResults.push(record);
  return record;
}
