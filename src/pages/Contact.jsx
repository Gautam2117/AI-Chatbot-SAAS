import React, { useState } from "react";
import Layout from "../components/Layout";

const InfoTile = ({ icon, title, children, href }) => {
  const Wrapper = href ? "a" : "div";
  const extra = href ? { href } : {};
  return (
    <Wrapper
      {...extra}
      className="group block rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl hover:bg-white/15 transition shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
    >
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white shadow-lg">
          {icon}
        </div>
        <div>
          <div className="font-semibold text-white">{title}</div>
          <div className="mt-1 text-sm text-white/80">{children}</div>
        </div>
      </div>
    </Wrapper>
  );
};

const Contact = () => {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  // No backend? We gracefully fall back to a mailto composer with prefilled subject/body.
  const onSubmit = (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const subject = encodeURIComponent(`Botify Inquiry from ${name || "Website"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${mail}\n\nMessage:\n${msg}\n\n— Sent from botify.ai site`
    );
    window.location.href = `mailto:botify.assist@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => setBusy(false), 600); // small reset
  };

  return (
    <Layout
      title="Contact Botify – We're here to help"
      description="Get in touch with Botify for support, sales, or general inquiries. We're ready to assist!"
    >
      <section className="relative py-14 sm:py-20">
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-x-0 -top-10 h-40 bg-gradient-to-r from-fuchsia-500/15 via-indigo-500/15 to-cyan-500/15 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header Card */}
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/10 p-8 sm:p-10 text-center backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white shadow-lg">
              📞
            </div>
            <h1 className="mt-4 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
              Contact Us
            </h1>
            <p className="mt-3 text-white/80">
              We typically respond within <span className="font-medium text-white">24–48 business hours</span>.
              For urgent issues, use email with the word <em>URGENT</em> in the subject.
            </p>
          </div>

          {/* Contact grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoTile icon="✉️" title="Email Support" href="mailto:botify.assist@gmail.com">
              botify.assist@gmail.com
            </InfoTile>

            <InfoTile icon="📱" title="Call / WhatsApp" href="tel:+919263400564">
              +91&nbsp;92634&nbsp;00564
            </InfoTile>

            <InfoTile icon="📍" title="Office">
              Hanuman Nagar, Kankarbagh, Patna, Bihar, India
            </InfoTile>
          </div>

          {/* Form + Map/Note */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Form */}
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
              <h2 className="text-xl font-bold text-white">Send us a message</h2>
              <p className="text-sm text-white/70 mt-1">
                Prefer email?{" "}
                <a href="mailto:botify.assist@gmail.com" className="underline hover:text-white">
                  botify.assist@gmail.com
                </a>
              </p>
              <form className="mt-5 space-y-4" onSubmit={onSubmit}>
                <div>
                  <label className="block text-xs text-white/70 mb-1">Your Name</label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 outline-none focus:border-fuchsia-400/40"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/70 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 outline-none focus:border-fuchsia-400/40"
                    placeholder="you@company.com"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/70 mb-1">Message</label>
                  <textarea
                    rows={5}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 outline-none focus:border-fuchsia-400/40"
                    placeholder="Tell us a bit about what you need…"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-5 py-2.5 text-white font-medium shadow-lg hover:from-fuchsia-400 hover:to-indigo-500 disabled:opacity-60 transition"
                >
                  {busy ? "Opening mail…" : "Send Message"}
                </button>
              </form>
            </div>

            {/* Helpful info / Map placeholder */}
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
              <h2 className="text-xl font-bold text-white">Response Times & Support</h2>
              <ul className="mt-3 space-y-2 text-white/80 text-sm">
                <li>• Sales & general: 24–48 business hours</li>
                <li>• Billing: within 1 business day</li>
                <li>• Urgent incidents: as soon as possible</li>
              </ul>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-white font-medium">Looking for quick answers?</div>
                <div className="text-white/70 text-sm mt-1">
                  Check your Dashboard → FAQ Manager to train the bot on your content. Most setup
                  questions are answered there.
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-white font-medium">Office</div>
                <div className="text-white/70 text-sm mt-1">
                  Hanuman Nagar, Kankarbagh, Patna, Bihar, India
                </div>
                {/* If you later add a real map, drop it here */}
                <div className="mt-3 h-40 w-full rounded-xl bg-gradient-to-br from-fuchsia-500/10 via-indigo-500/10 to-cyan-500/10 flex items-center justify-center text-white/60 text-xs">
                  Map placeholder
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-6 py-3 text-white shadow-lg hover:from-fuchsia-400 hover:to-indigo-500 transition"
            >
              🚀 Try Botify for Free
            </a>
            <div className="mt-3 text-sm text-white/70">
              Or write to{" "}
              <a href="mailto:botify.assist@gmail.com" className="underline hover:text-white">
                botify.assist@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
