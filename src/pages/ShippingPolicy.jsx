import React from "react";

const ShippingPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-8">
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full space-y-6">
      <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-lg">
        🚀 Shipping & Delivery Policy
      </h1>
      <p className="text-lg text-gray-700">
        <strong>Botify</strong> is a SaaS platform offering digital services. Upon successful payment, customers are granted access to our services within <span className="font-semibold text-purple-600">1 hour</span> through a confirmation email and platform login credentials.
      </p>
      <p className="text-lg text-gray-700">
        As a provider of <span className="font-semibold">digital products</span>, no physical delivery is applicable. Customers will receive onboarding instructions and access details via email. For any queries or assistance, please contact us at{" "}
        <a
          href="mailto:botify.assist@gmail.com"
          className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
        >
          botify.assist@gmail.com
        </a>.
      </p>
      <p className="text-lg text-gray-700">
        This policy ensures <span className="font-semibold text-green-600">prompt activation and delivery</span> of our digital services, providing you with a seamless and efficient experience.
      </p>
      <p className="text-center text-sm text-gray-500 mt-4">
        &copy; {new Date().getFullYear()} Botify. All rights reserved.
      </p>
    </div>
  </div>
);

export default ShippingPolicy;
