import React from "react";
import Layout from "../components/Layout";

const CookiePolicy = () => (
  <Layout
    title="Cookie Policy – Botify"
    description="Learn how Botify uses cookies to enhance your experience, personalize content, and improve our services. Manage your cookie preferences anytime."
  >
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-6 sm:p-8">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl max-w-3xl w-full space-y-6">
        <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-md">🍪 Cookie Policy</h1>

        <div className="space-y-4 text-lg text-gray-800 leading-relaxed">
          <p>
            At <span className="font-semibold text-purple-600">Botify</span>, we use cookies and similar tracking technologies to improve your browsing experience, provide personalized content, analyze traffic, and understand how users interact with our platform.
          </p>

          <p>
            Cookies allow us to remember your preferences, enhance performance, and measure the effectiveness of our features and campaigns. Some cookies are essential for the operation of our services, while others are optional.
          </p>

          <p>
            By continuing to use our website, you consent to our use of cookies as described in this policy. You may manage or disable cookies through your browser settings. However, please be aware that disabling cookies may affect the functionality of certain features.
          </p>

          <p>
            For more details about how we collect and use personal data, please review our{" "}
            <a
              href="/privacy-policy"
              className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
            >
              Privacy Policy
            </a>.
          </p>

          <p>
            If you have questions about our cookie practices or wish to contact our Data Protection Officer, please email{" "}
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
  </Layout>
);

export default CookiePolicy;
