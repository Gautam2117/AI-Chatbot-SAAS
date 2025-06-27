import React from "react";
import Layout from "../components/Layout";

const PrivacyPolicy = () => (
  <Layout
    title="Privacy Policy – Botify AI Chatbot"
    description="Learn how Botify collects, stores, and uses your personal data responsibly. We prioritize data protection and transparency with GDPR and CCPA compliance."
  >
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-6 sm:p-8">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl max-w-4xl w-full space-y-6">
        <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-md">🔒 Privacy Policy</h1>

        <p className="text-lg text-gray-700">
          At <span className="font-bold text-purple-600">Botify</span>, your privacy is our top priority. We collect only the minimal necessary information to deliver and enhance our AI-powered chatbot services.
        </p>

        <p className="text-lg text-gray-700">
          All data is securely stored using <strong>Firebase Firestore</strong> with access control and encryption. We do not sell, rent, or share your personal information with third parties, unless required by law.
        </p>

        <p className="text-lg text-gray-700">
          Our chatbot responses may be powered by third-party AI services like <strong>GPT-based APIs (OpenAI/DeepSeek)</strong>. These services receive only anonymized prompts, never personally identifiable data.
        </p>

        <p className="text-lg text-gray-700">
          We use browser cookies and analytics tools (e.g., Google Analytics) to monitor performance and improve usability. You may opt out or manage preferences via your browser settings.
        </p>

        <p className="text-lg text-gray-700">
          We comply with major data protection frameworks, including the{" "}
          <span className="font-semibold">General Data Protection Regulation (GDPR)</span> for EU users and the{" "}
          <span className="font-semibold">California Consumer Privacy Act (CCPA)</span> for California residents.
        </p>

        <p className="text-lg text-gray-700">
          You have the right to request access to, correction of, or deletion of your data. To exercise these rights or for any questions, contact our Data Protection Officer at{" "}
          <a
            href="mailto:botify.assist@gmail.com"
            className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
          >
            botify.assist@gmail.com
          </a>.
        </p>

        <p className="text-lg text-gray-700">
          For enterprise clients, a signed{" "}
          <span className="font-semibold">Data Processing Agreement (DPA)</span> is available upon request.
        </p>

        <p className="text-center text-sm text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} Botify. All rights reserved.
        </p>
      </div>
    </div>
  </Layout>
);

export default PrivacyPolicy;
