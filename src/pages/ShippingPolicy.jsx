import React from "react";
import Layout from "../components/Layout";

const ShippingPolicy = () => (
  <Layout
    title="Shipping & Delivery Policy – Botify AI"
    description="As a SaaS provider, Botify delivers services digitally. Learn how our activation and onboarding works post-payment."
  >
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-6 sm:p-8">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl max-w-4xl w-full space-y-6">
        <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-md">
          🚀 Shipping & Delivery Policy
        </h1>

        <p className="text-lg text-gray-700">
          <span className="font-bold text-purple-700">Botify</span> is a Software-as-a-Service (SaaS) platform offering fully digital services. Upon successful payment, users will receive immediate access to their subscription dashboard within{" "}
          <span className="font-semibold text-purple-600">1 hour</span> via a confirmation email and activated user login.
        </p>

        <p className="text-lg text-gray-700">
          As there is <span className="font-semibold">no physical product</span>, no shipping or physical delivery is applicable. All onboarding materials, product access, and chatbot deployment tools are delivered digitally via email and dashboard access.
        </p>

        <p className="text-lg text-gray-700">
          Should there be any issues or delays in activation, please contact our support team at{" "}
          <a
            href="mailto:botify.assist@gmail.com"
            className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
          >
            botify.assist@gmail.com
          </a>. We’re committed to resolving any onboarding concerns within{" "}
          <span className="font-semibold text-indigo-600">24 business hours</span>.
        </p>

        <p className="text-lg text-gray-700">
          This policy ensures <span className="font-semibold text-green-600">instant access</span> and a smooth user experience when subscribing to Botify.
        </p>

        <p className="text-center text-sm text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} Botify. All rights reserved.
        </p>
      </div>
    </div>
  </Layout>
);

export default ShippingPolicy;
