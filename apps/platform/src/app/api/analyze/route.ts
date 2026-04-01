import Anthropic from '@anthropic-ai/sdk';
import { getCurrentUser } from '@/lib/auth';
import { addAnalysisResult } from '@/lib/db';

const ALLOWED_TYPES = [
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/json',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

async function extractText(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    // For PDF: extract readable text from the raw bytes.
    // This handles simple text-based PDFs. For complex PDFs with
    // scanned images, a dedicated OCR service would be needed.
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const raw = new TextDecoder('utf-8', { fatal: false }).decode(bytes);

    // Extract text between BT/ET (Begin Text / End Text) operators
    const textChunks: string[] = [];
    const btEtRegex = /BT\s([\s\S]*?)ET/g;
    let match;
    while ((match = btEtRegex.exec(raw)) !== null) {
      const block = match[1];
      // Extract parenthesized strings (Tj/TJ operators)
      const tjRegex = /\(([^)]*)\)/g;
      let tjMatch;
      while ((tjMatch = tjRegex.exec(block)) !== null) {
        const decoded = tjMatch[1]
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\\\/g, '\\')
          .replace(/\\\(/g, '(')
          .replace(/\\\)/g, ')');
        if (decoded.trim()) textChunks.push(decoded);
      }
    }

    if (textChunks.length > 0) {
      return textChunks.join(' ');
    }

    // Fallback: return any printable text found in the file
    return raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s{3,}/g, '\n').trim();
  }
  // Text-based formats
  return await file.text();
}

function getAnalysisPrompt(text: string, filename: string): string {
  return `You are a professional document analyst. Analyze the following document and provide a structured analysis.

Document: "${filename}"

<document>
${text.slice(0, 50000)}
</document>

Respond with ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "executiveSummary": "A concise 2-3 sentence summary of the document's purpose and key message.",
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
  "actionItems": ["Action 1", "Action 2"],
  "riskAssessment": "Brief assessment of any risks, concerns, or gaps identified. Write 'No significant risks identified.' if none.",
  "suggestedNextSteps": ["Step 1", "Step 2"],
  "documentType": "contract|report|memo|proposal|financial|technical|legal|other",
  "confidenceScore": 0.95
}`;
}

export async function POST(request: Request) {
  const user = getCurrentUser();

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json(
      { error: `Unsupported file type: ${file.type}` },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json(
      { error: 'File too large. Maximum size is 10 MB.' },
      { status: 400 },
    );
  }

  let text: string;
  try {
    text = await extractText(file);
  } catch {
    return Response.json(
      { error: 'Failed to extract text from file. Please try a different format.' },
      { status: 422 },
    );
  }

  if (!text.trim()) {
    return Response.json(
      { error: 'No readable text found in the file.' },
      { status: 422 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.MATON_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'AI analysis is not configured. Set ANTHROPIC_API_KEY in environment.' },
      { status: 503 },
    );
  }

  const client = new Anthropic({ apiKey });

  let analysis;
  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        { role: 'user', content: getAnalysisPrompt(text, file.name) },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }
    analysis = JSON.parse(content.text);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return Response.json(
      { error: `AI analysis failed: ${msg}` },
      { status: 502 },
    );
  }

  const result = addAnalysisResult({
    documentId: crypto.randomUUID(),
    userId: user.id,
    type: 'summary',
    status: 'completed',
    result: {
      summary: analysis.executiveSummary,
      keyFindings: analysis.keyFindings,
      actionItems: analysis.actionItems,
      riskAssessment: analysis.riskAssessment,
      suggestedNextSteps: analysis.suggestedNextSteps,
      documentType: analysis.documentType,
      confidence: analysis.confidenceScore ?? 0.9,
    },
    completedAt: new Date(),
  });

  return Response.json(result, { status: 201 });
}

export async function GET() {
  return Response.json({
    endpoint: '/api/analyze',
    methods: ['POST'],
    description: 'Upload a file for AI-powered analysis via Claude',
    acceptedTypes: ALLOWED_TYPES,
    maxSizeBytes: MAX_FILE_SIZE,
  });
}
