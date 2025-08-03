import React from "react";
import Layout from "../components/Layout";

const CookiePolicy = () => (
  <Layout
    title="Cookie Policy – Botify"
    description="How Botify uses cookies to enhance your experience and improve our services."
  >
    <section className="relative py-14 sm:py-20">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-40 bg-gradient-to-r from-fuchsia-500/15 via-indigo-500/15 to-cyan-500/15 blur-3xl" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header card */}
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 sm:p-10 text-center backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white shadow-lg">
            🍪
          </div>
          <h1 className="mt-4 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Cookie Policy
          </h1>
          <p className="mt-3 text-white/80">
            We use cookies and similar technologies to keep Botify fast, secure, and delightful.
          </p>
        </div>

        {/* Content card */}
        <article className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] text-white/90">
          <div className="prose prose-invert prose-indigo max-w-none">
            <h2 className="!mb-3">What are cookies?</h2>
            <p>
              Cookies are small text files placed on your device to help websites function, remember
              preferences, and analyze usage. Some cookies are essential; others are optional and
              help us improve your experience.
            </p>

            <h2 className="!mt-8 !mb-3">How we use cookies</h2>
            <ul>
              <li><strong>Essential:</strong> Authentication, security, session integrity.</li>
              <li><strong>Preferences:</strong> UI theme, language, product settings.</li>
              <li><strong>Analytics:</strong> Feature performance, error diagnostics, usage patterns.</li>
              <li><strong>Marketing (optional):</strong> Measuring campaign effectiveness.</li>
            </ul>

            <h2 className="!mt-8 !mb-3">Managing your preferences</h2>
            <p>
              You can manage or disable cookies via your browser settings. Note that turning off
              certain cookies may impact functionality (e.g., staying signed in).
            </p>

            <h2 className="!mt-8 !mb-3">Third-party cookies</h2>
            <p>
              We may use privacy-focused analytics or payment providers that set their own cookies.
              These providers are contractually bound to process data responsibly.
            </p>

            <h2 className="!mt-8 !mb-3">More information</h2>
            <p>
              For details on how we handle personal data, see our{" "}
              <a href="/privacy-policy" className="underline decoration-indigo-300 hover:text-white">
                Privacy Policy
              </a>
              . If you have questions or requests (including data rights), contact us at{" "}
              <a
                href="mailto:botify.assist@gmail.com"
                className="underline decoration-indigo-300 hover:text-white"
              >
                botify.assist@gmail.com
              </a>.
            </p>

            <h2 className="!mt-8 !mb-3">Updates to this policy</h2>
            <p>
              We may update this Cookie Policy to reflect changes in law or our services. The
              “Last updated” date will be revised accordingly.
            </p>

            <p className="mt-8 text-sm text-white/60">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Inline actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <a
              href="/privacy-policy"
              className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-4 py-2 text-white hover:bg-white/15 transition border border-white/10"
            >
              🔐 View Privacy Policy
            </a>
            <a
              href="mailto:botify.assist@gmail.com"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-4 py-2 text-white shadow-lg hover:from-fuchsia-400 hover:to-indigo-500 transition"
            >
              📬 Contact DPO
            </a>
          </div>
        </article>
      </div>
    </section>
  </Layout>
);

export default CookiePolicy;
