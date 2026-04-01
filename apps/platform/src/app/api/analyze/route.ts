import { getCurrentUser } from '@/lib/auth';
import { addAnalysisResult } from '@/lib/db';

export async function POST(request: Request) {
  const user = getCurrentUser();

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 });
  }

  const allowedTypes = ['application/pdf', 'text/plain', 'text/csv', 'application/json'];
  if (!allowedTypes.includes(file.type)) {
    return Response.json(
      {
        error: `Unsupported file type: ${file.type}. Accepted: ${allowedTypes.join(', ')}`,
      },
      { status: 400 },
    );
  }

  // Stub: create a pending analysis result.
  // Production: send file to Claude API for processing.
  const result = addAnalysisResult({
    documentId: crypto.randomUUID(),
    userId: user.id,
    type: 'summary',
    status: 'completed',
    result: {
      summary: `Analysis of "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`,
      keyFindings: [
        'This is a stub response from the development API.',
        'In production, this will use Claude API for document analysis.',
        'Supported analyses: summary, extraction, classification.',
      ],
      confidence: 0.95,
    },
    completedAt: new Date(),
  });

  return Response.json(result, { status: 201 });
}

export async function GET() {
  return Response.json({
    endpoint: '/api/analyze',
    methods: ['POST'],
    description: 'Upload a file for AI-powered analysis',
    acceptedTypes: ['application/pdf', 'text/plain', 'text/csv', 'application/json'],
  });
}
