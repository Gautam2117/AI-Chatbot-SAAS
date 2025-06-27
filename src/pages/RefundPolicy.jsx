import React from "react";
import Layout from "../components/Layout";

const RefundPolicy = () => (
  <Layout
    title="Refund Policy – Botify AI Chatbot"
    description="Botify offers a 7-day no-questions-asked refund policy on all subscription plans. Learn how to request a refund securely."
  >
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-6 sm:p-8">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl max-w-4xl w-full space-y-6">
        <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-md">💸 Refund Policy</h1>

        <p className="text-lg text-gray-700">
          At <span className="font-bold text-purple-700">Botify</span>, we want you to be completely satisfied with our AI chatbot service. If you're not happy with your subscription, we offer a{" "}
          <span className="font-bold text-purple-600">100% refund</span> within the first{" "}
          <span className="font-bold">7 calendar days</span> of purchase—no questions asked.
        </p>

        <p className="text-lg text-gray-700">
          To initiate a refund, please send an email to{" "}
          <a
            href="mailto:botify.assist@gmail.com"
            className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
          >
            botify.assist@gmail.com
          </a>{" "}
          with your:
        </p>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          <li>Full Name</li>
          <li>Registered Email Address</li>
          <li>Transaction ID</li>
          <li>Reason for Refund</li>
        </ul>

        <p className="text-lg text-gray-700">
          Refund requests are reviewed and approved within{" "}
          <span className="font-semibold text-indigo-700">2 business days</span>. Once approved, your refund will be processed and credited to your original payment method within{" "}
          <span className="font-bold text-indigo-700">5–7 business days</span>.
        </p>

        <p className="text-lg text-red-600 font-semibold">
          🚫 Please note: Refunds requested after 7 calendar days will not be processed. No partial refunds will be issued for unused subscription time.
        </p>

        <p className="text-lg text-gray-700">
          For any questions, reach out to our support team using the email above. We're here to help. 🙌
        </p>

        <p className="text-center text-sm text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} Botify. All rights reserved.
        </p>
      </div>
    </div>
  </Layout>
);

export default RefundPolicy;
