// src/pages/Disclaimer.jsx
import React from "react";
import Layout from "../components/Layout";

const Disclaimer = () => (
  <Layout
    title="Disclaimer – Botify"
    description="Official disclaimer for Botify covering content usage, limitations of liability, and user responsibilities."
  >
    <section className="relative py-14 sm:py-20">
      {/* Ambient gradient glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-40 bg-gradient-to-r from-fuchsia-500/15 via-indigo-500/15 to-cyan-500/15 blur-3xl" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header card */}
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 sm:p-10 text-center backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 text-white shadow-lg">
            ⚠️
          </div>
          <h1 className="mt-4 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Disclaimer
          </h1>
          <p className="mt-3 text-white/80">
            Please read this disclaimer carefully before using Botify.
          </p>
        </div>

        {/* Content card */}
        <article className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] text-white/90">
          <div className="prose prose-invert prose-indigo max-w-none">
            <h2 className="!mb-3">General Information</h2>
            <p>
              The information provided by <strong>Botify</strong> is for general informational
              purposes only. While we strive for accuracy and reliability, we make no
              representation or warranty—express or implied—regarding the accuracy, adequacy,
              validity, availability, or completeness of any content on the platform.
            </p>

            <h2 className="!mt-8 !mb-3">No Professional Advice</h2>
            <p>
              Botify’s outputs (including AI-generated responses) are not a substitute for
              professional advice. For specific matters (legal, financial, medical, technical, or
              otherwise), consult a qualified professional before acting on any information.
            </p>

            <h2 className="!mt-8 !mb-3">Limitation of Liability</h2>
            <p>
              Under no circumstance shall <strong>Botify</strong> be liable for any loss or damage
              of any kind incurred as a result of the use of the site or reliance on any
              information provided. Your use of the platform is solely at your own risk.
            </p>

            <h2 className="!mt-8 !mb-3">Third-Party Links & Services</h2>
            <p>
              The platform may contain links to third-party websites or services. We do not warrant,
              endorse, or assume responsibility for the accuracy or reliability of any information
              offered by third parties. Accessing third-party content is at your discretion.
            </p>

            <h2 className="!mt-8 !mb-3">User Responsibilities</h2>
            <ul>
              <li>Use Botify in compliance with applicable laws and regulations.</li>
              <li>Do not submit sensitive personal data unless strictly necessary.</li>
              <li>Verify critical information before taking action.</li>
            </ul>

            <h2 className="!mt-8 !mb-3">Contact</h2>
            <p>
              Questions about this disclaimer? Reach us at{" "}
              <a
                href="mailto:botify.assist@gmail.com"
                className="underline decoration-indigo-300 hover:text-white"
              >
                botify.assist@gmail.com
              </a>.
            </p>

            <p className="mt-8 text-sm text-white/60">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

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
              📬 Contact Us
            </a>
          </div>
        </article>
      </div>
    </section>
  </Layout>
);

export default Disclaimer;
