export function Contact() {
  return (
    <section id="contact" className="bg-card py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Let&apos;s Work Together
          </h2>
          <p className="mt-4 text-lg text-muted">
            Ready to transform your business with AI? Get in touch and
            let&apos;s discuss how we can help.
          </p>
        </div>
        <form
          className="mx-auto mt-12 max-w-xl space-y-6"
          action="#"
          method="POST"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium"
              >
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
              <label
                htmlFor="email"
                className="block text-sm font-medium"
              >
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
            <label
              htmlFor="subject"
              className="block text-sm font-medium"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="How can we help?"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              placeholder="Tell us about your project..."
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
