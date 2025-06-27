import React from "react";
import Layout from "../components/Layout";

const Terms = () => (
  <Layout
    title="Terms & Conditions – Botify AI"
    description="Read the full terms and conditions for using Botify, our AI-powered chatbot platform, including responsibilities, liabilities, governing law, and dispute resolution."
  >
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-6 sm:p-8">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl max-w-4xl w-full space-y-6">
        <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-lg">
          📜 Terms & Conditions
        </h1>

        <p className="text-lg text-gray-700">
          By accessing and using the <strong>Botify AI chatbot platform</strong>, you agree to abide by these Terms & Conditions, including compliance with all relevant laws and regulations.
        </p>

        <p className="text-lg text-gray-700">
          Users are solely responsible for the data they provide and agree not to use the platform for any unlawful, offensive, or harmful purposes. Botify reserves the right to suspend accounts in violation of this clause.
        </p>

        <p className="text-lg text-gray-700">
          We may <span className="font-semibold text-indigo-600">modify or update</span> these terms periodically. Continued use of Botify after such updates constitutes acceptance of the revised terms.
        </p>

        <p className="text-lg text-gray-700">
          <strong>⚖️ Limitation of Liability:</strong> The Botify platform is offered "as-is" and "as-available." We disclaim any liability for losses or damages, whether direct or indirect, resulting from use of the platform.
        </p>

        <p className="text-lg text-gray-700">
          <strong>🌍 Governing Law:</strong> These terms shall be governed by the laws of India. Any conflict or dispute will be subject to Indian jurisdiction.
        </p>

        <p className="text-lg text-gray-700">
          <strong>🤝 Dispute Resolution:</strong> All disputes shall be settled through binding arbitration under the Arbitration and Conciliation Act, 1996. The venue for arbitration will be Patna, Bihar.
        </p>

        <p className="text-lg text-gray-700">
          If you have any questions or need clarification, contact our support team at{" "}
          <a
            href="mailto:botify.assist@gmail.com"
            className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
          >
            botify.assist@gmail.com
          </a>.
        </p>

        <p className="text-center text-sm text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} Botify. All rights reserved.
        </p>
      </div>
    </div>
  </Layout>
);

export default Terms;
