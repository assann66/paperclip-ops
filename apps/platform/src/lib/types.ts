export interface AnalysisResultData {
  summary: string;
  keyFindings: string[];
  actionItems?: string[];
  riskAssessment?: string;
  suggestedNextSteps?: string[];
  documentType?: string;
  confidence: number;
}

export interface AnalysisResult {
  id: string;
  type: string;
  status: string;
  result: AnalysisResultData | null;
  createdAt: string;
}
