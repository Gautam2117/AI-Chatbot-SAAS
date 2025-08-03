import React from "react";
import Layout from "../components/Layout";

const Stat = ({ k, v }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md text-center">
    <div className="text-2xl font-extrabold text-white">{k}</div>
    <div className="text-xs text-white/70">{v}</div>
  </div>
);

const Feature = ({ emoji, title, desc }) => (
  <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md hover:bg-white/10 transition">
    <div className="mb-2 text-2xl">{emoji}</div>
    <h3 className="text-white font-semibold">{title}</h3>
    <p className="mt-1 text-sm text-white/75">{desc}</p>
  </div>
);

const About = () => (
  <Layout
    title="About Botify – AI-Powered Customer Engagement Platform"
    description="The story and mission behind Botify—an AI chatbot platform to automate support, capture leads, and scale engagement."
  >
    <section className="relative py-14 sm:py-20">
      {/* subtle page glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-40 bg-gradient-to-r from-fuchsia-500/15 via-indigo-500/15 to-cyan-500/15 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero Card */}
        <div className="rounded-3xl border border-white/10 bg-white/10 p-7 sm:p-10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white shadow-lg">
              🤖
            </div>

            <h1 className="mt-4 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
              About Botify
            </h1>

            <p className="mt-4 text-white/80 text-lg">
              Botify is your AI-powered customer assistant—automating conversations,
              capturing leads, and resolving FAQs <span className="whitespace-nowrap">24/7</span>.
              Built for founders and enterprises that want delightful support at scale.
            </p>

            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/75">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              Realtime, secure, and privacy-first.
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat k="24/7" v="Always-On Support" />
            <Stat k="ms" v="Realtime Responses" />
            <Stat k="GDPR" v="Privacy by Default" />
            <Stat k="∞" v="Scales with You" />
          </div>
        </div>

        {/* Mission */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white">Our Mission</h2>
            <p className="mt-3 text-white/75">
              We’re making advanced conversational AI accessible to everyone—from solo builders
              to global brands. Botify helps you engage visitors, answer questions, and free your
              team to focus on work that matters.
            </p>
            <p className="mt-3 text-white/75">
              Under the hood, we use Firebase Authentication and Firestore for secure, scalable
              data—no data selling, GDPR-aligned by design.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white">What You Get</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Feature
                emoji="⚡"
                title="Instant Answers"
                desc="Streamed, helpful responses powered by state-of-the-art LLMs."
              />
              <Feature
                emoji="🧠"
                title="FAQ Brain"
                desc="Train the bot on your FAQs to keep replies on-brand and accurate."
              />
              <Feature
                emoji="🔐"
                title="Secure & Private"
                desc="Auth + rules to protect your data. Your customers’ trust is sacred."
              />
              <Feature
                emoji="🧩"
                title="Drop-in Widget"
                desc="Embed a script tag and you’re live in minutes—no heavy setup."
              />
            </div>
          </div>
        </div>

        {/* Values strip */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="grid gap-4 text-center sm:grid-cols-3">
            <div>
              <div className="text-white font-semibold">Privacy First</div>
              <div className="text-xs text-white/70 mt-1">
                No selling data. Clear retention. User-centric controls.
              </div>
            </div>
            <div>
              <div className="text-white font-semibold">Performance Obsessed</div>
              <div className="text-xs text-white/70 mt-1">
                Realtime streams, resilient infra, and graceful fallbacks.
              </div>
            </div>
            <div>
              <div className="text-white font-semibold">Human in the Loop</div>
              <div className="text-xs text-white/70 mt-1">
                Escalate seamlessly when a human touch is needed.
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-6 py-3 text-white shadow-lg hover:from-fuchsia-400 hover:to-indigo-500 transition"
          >
            🚀 Try Botify for Free
          </a>
          <div className="mt-4 text-sm text-white/70">
            Questions?{" "}
            <a href="mailto:botify.assist@gmail.com" className="underline hover:text-white">
              Contact our team
            </a>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
