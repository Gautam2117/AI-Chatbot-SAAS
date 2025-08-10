import React from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { path: "/pricing", label: "Pricing" },
  { path: "/contact", label: "Contact" },
  { path: "/privacy-policy", label: "Privacy Policy" },
  { path: "/terms", label: "Terms & Conditions" },
  { path: "/refund-policy", label: "Refund Policy" },
  { path: "/shipping-policy", label: "Shipping & Delivery" },
];

const Footer = () => {
  const { pathname } = useLocation();

  return (
    <footer className="relative mt-20">
      {/* subtle gradient glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gradient-to-r from-fuchsia-500/10 via-indigo-500/10 to-cyan-500/10 blur-2xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-10 backdrop-blur-lg shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          <div className="grid gap-10 md:grid-cols-3">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white shadow-lg">
                  🤖
                </div>
                <h2 className="text-lg font-bold text-white/95">Botify</h2>
              </div>
              <p className="mt-3 text-sm text-white/70">
                Your 24/7 AI-powered customer assistant—smart, fast, and reliable.
              </p>

              {/* Social row (emoji for now) */}
              <div className="mt-4 flex items-center gap-3 text-white/80">
                <a href="mailto:botify.assist@gmail.com" className="hover:text-white transition">✉️</a>
                <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-white transition">𝕏</a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition">🐙</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition">in</a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-sm font-semibold text-white/90">Quick Links</h3>
              <ul className="mt-3 grid gap-2">
                {links.map(({ path, label }) =>
                  pathname === path ? null : (
                    <li key={path}>
                      <Link
                        to={path}
                        className="text-sm text-white/75 hover:text-white transition"
                      >
                        {label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Contact + mini newsletter (no backend) */}
            <div>
              <h3 className="text-sm font-semibold text-white/90">Get in touch</h3>
              <p className="mt-3 text-sm text-white/75">
                📧{" "}
                <a href="mailto:botify.assist@gmail.com" className="underline hover:text-white">
                  botify.assist@gmail.com
                </a>
              </p>
              <p className="mt-1 text-sm text-white/75">
                📍 Hanuman Nagar, Kankarbagh, Patna, India
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thanks! We’ll keep you posted.");
                }}
                className="mt-4 flex gap-2"
              >
                <input
                  type="email"
                  placeholder="Email for updates"
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40"
                  required
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:from-fuchsia-400 hover:to-indigo-500 transition"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Trust row */}
          <div className="mt-10 border-t border-white/10 pt-4 text-center text-[0.8rem] text-white/70 animate-fadeIn">
            🇮🇳 Made in India • 🛡 GDPR-ready • 🔒 Data encrypted at rest/in transit
          </div>

          {/* Copyright */}
          <div className="mt-4 border-t border-white/10 pt-4 text-center text-xs text-white/60">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-white/80">Botify</span>. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
