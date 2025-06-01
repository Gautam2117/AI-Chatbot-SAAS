import React from "react";

const CookiePolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-8">
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-3xl w-full space-y-6">
      <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-lg">🍪 Cookie Policy</h1>
      <div className="space-y-4 text-lg text-gray-800 leading-relaxed">
        <p>
          At <strong>Botify</strong>, we use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content and ads. These cookies help us understand user preferences and improve platform functionality.
        </p>
        <p>
          By using our website, you consent to the use of cookies as outlined in this policy. You can manage or disable cookies via your browser settings at any time. However, please note that certain features of our platform may not work optimally without cookies.
        </p>
        <p>
          We respect your privacy and are dedicated to safeguarding your personal data. For more information on how we collect, use, and protect your data, please review our{" "}
          <a
            href="/privacy-policy"
            className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
          >
            Privacy Policy
          </a>.
        </p>
        <p>
          For further inquiries about our cookie usage, please contact our Data Protection Officer at{" "}
          <a
            href="mailto:botify.assist@gmail.com"
            className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
          >
            botify.assist@gmail.com
          </a>.
        </p>
      </div>
      <div className="text-center">
        <a
          href="mailto:botify.assist@gmail.com"
          className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow hover:bg-purple-700 transition-transform transform hover:scale-105"
        >
          📬 Contact Our Data Protection Officer
        </a>
      </div>
    </div>
  </div>
);

export default CookiePolicy;
