import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { path: "/pricing", label: "Pricing" },
  { path: "/contact", label: "Contact" },
  { path: "/privacy-policy", label: "Privacy" },
  { path: "/terms", label: "Terms" },
];

const Header = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Glow bar behind header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[-1] h-28 bg-gradient-to-r from-fuchsia-500/15 via-indigo-500/15 to-cyan-500/15 blur-2xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="my-4 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-lg shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            {/* Brand */}
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white shadow-lg">
                🤖
              </div>
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-xl font-extrabold text-transparent tracking-tight">
                Botify
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map(({ path, label }) =>
                pathname === path ? null : (
                  <Link
                    key={path}
                    to={path}
                    className="text-sm text-white/80 hover:text-white transition"
                  >
                    {label}
                  </Link>
                )
              )}
              <Link
                to="/login"
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/90 hover:bg-white/20 transition"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:from-fuchsia-400 hover:to-indigo-500 transition"
              >
                Get started
              </Link>
            </nav>

            {/* Mobile toggle */}
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white/90 hover:bg-white/20 transition"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>

          {/* Mobile panel */}
          {open && (
            <div className="md:hidden border-t border-white/10 px-4 pb-4 sm:px-6">
              <div className="mt-3 grid gap-2">
                {navLinks.map(({ path, label }) =>
                  pathname === path ? null : (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-2 text-white/90 hover:bg-white/10 transition"
                    >
                      {label}
                    </Link>
                  )
                )}
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-center text-white/90 hover:bg-white/20 transition"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-3 py-2 text-center font-medium text-white shadow hover:from-fuchsia-400 hover:to-indigo-500 transition"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
