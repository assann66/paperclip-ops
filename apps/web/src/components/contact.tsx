'use client';

import { useState } from 'react';

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const message = formData.get('message') as string;

    const subject = encodeURIComponent(`Consultation Request from ${name} — ${company}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${message}`,
    );

    window.open(`mailto:contact@sad.sa?subject=${subject}&body=${body}`);
    setStatus('success');
    form.reset();
  }

  if (status === 'success') {
    return (
      <section id="contact" className="bg-card py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-8 w-8 text-green-600"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Thank You!</h2>
            <p className="mt-4 text-lg text-muted">
              Your email client should have opened with your inquiry. Send the email and we&apos;ll
              get back to you within 1-2 business days.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-8 inline-block rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="bg-card py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Book a Consultation</h2>
          <p className="mt-4 text-lg text-muted">
            Ready to transform your business with AI? Tell us about your needs and we&apos;ll be in
            touch to schedule a consultation.
          </p>
        </div>
        <form className="mx-auto mt-12 max-w-xl space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="you@company.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              required
              className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Your company name"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              How can we help?
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              placeholder="Tell us about your project, goals, and any specific challenges you're facing..."
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            Book a Consultation
          </button>
        </form>
      </div>
    </section>
  );
}
