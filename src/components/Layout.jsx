import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";

/**
 * Layout adds:
 * - Soft grid + radial glows background
 * - Centered content container
 */
const Layout = ({ children, title, description }) => (
  <>
    <Helmet>
      <title>{title || "Botify – AI Chatbot SaaS"}</title>
      <meta
        name="description"
        content={description || "Botify: AI-powered customer service platform."}
      />
    </Helmet>

    {/* Background canvas */}
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b0b12]">
      {/* radial glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[70rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-fuchsia-500/15 via-indigo-500/15 to-cyan-500/15 blur-3xl" />
      {/* grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]"
      />

      <Header />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {children}
      </main>

      <Footer />
    </div>
  </>
);

export default Layout;
