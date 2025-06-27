import React from "react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const footerLinks = [
    { path: "/pricing", label: "Pricing" },
    { path: "/contact", label: "Contact" },
    { path: "/privacy-policy", label: "Privacy Policy" },
    { path: "/terms", label: "Terms & Conditions" },
    { path: "/refund-policy", label: "Refund Policy" },
    { path: "/shipping-policy", label: "Shipping & Delivery" },
  ];

  return (
    <footer className="bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100 text-gray-700 border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold text-purple-700 mb-3">Botify</h2>
          <p>Your 24/7 AI-powered customer service assistant. Smart. Fast. Reliable.</p>
        </div>

        <div>
          <h3 className="font-semibold text-purple-600 mb-2">Quick Links</h3>
          <ul className="space-y-2">
            {footerLinks.map(
              ({ path, label }) =>
                currentPath !== path && (
                  <li key={path}>
                    <Link to={path} className="hover:underline">
                      {label}
                    </Link>
                  </li>
                )
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-purple-600 mb-2">Get in Touch</h3>
          <p className="mb-1">
            📧{" "}
            <a href="mailto:botify.assist@gmail.com" className="underline">
              botify.assist@gmail.com
            </a>
          </p>
          <p>📍 Hanuman Nagar, Kankarbagh, Patna, India</p>
        </div>
      </div>

      <div className="text-center text-sm py-4 bg-white border-t text-gray-500">
        &copy; {new Date().getFullYear()} Botify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
