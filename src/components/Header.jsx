import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-extrabold tracking-wide hover:opacity-90 transition-all">
        🤖 Botify
      </Link>
      <nav className="space-x-6 hidden md:flex">
        <Link to="/pricing" className="hover:underline hover:text-gray-200">Pricing</Link>
        <Link to="/contact" className="hover:underline hover:text-gray-200">Contact</Link>
        <Link to="/privacy-policy" className="hover:underline hover:text-gray-200">Privacy</Link>
        <Link to="/terms" className="hover:underline hover:text-gray-200">Terms</Link>
      </nav>
      <Link
        to="/login"
        className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition"
      >
        Login
      </Link>
    </div>
  </header>
);

export default Header;
