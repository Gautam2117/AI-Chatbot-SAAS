import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { path: "/pricing", label: "Pricing" },
    { path: "/contact", label: "Contact" },
    { path: "/privacy-policy", label: "Privacy" },
    { path: "/terms", label: "Terms" },
  ];

  return (
    <header className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold tracking-wide hover:opacity-90 transition-all">
          🤖 Botify
        </Link>

        <nav className="space-x-6 hidden md:flex">
          {navLinks.map(
            ({ path, label }) =>
              currentPath !== path && (
                <Link key={path} to={path} className="hover:underline hover:text-gray-200">
                  {label}
                </Link>
              )
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
