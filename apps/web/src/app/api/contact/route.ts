import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    if (!name || !email || !company || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const submission = {
      id: crypto.randomUUID(),
      name,
      email,
      company,
      message,
      submittedAt: new Date().toISOString(),
    };

    // Store submissions in a JSON file (production should use a database)
    const dataDir = join(process.cwd(), '.data');
    const filePath = join(dataDir, 'contact-submissions.json');

    await mkdir(dataDir, { recursive: true });

    let submissions: unknown[] = [];
    try {
      const { readFile } = await import('fs/promises');
      const existing = await readFile(filePath, 'utf-8');
      submissions = JSON.parse(existing);
    } catch {
      // File doesn't exist yet
    }

    submissions.push(submission);
    await writeFile(filePath, JSON.stringify(submissions, null, 2));

    return NextResponse.json({ success: true, id: submission.id });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
