import React from "react";

const ShippingPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full space-y-4">
      <h1 className="text-3xl font-bold text-indigo-700">Shipping & Delivery Policy</h1>
      <p className="text-gray-700">
        Botify is a SaaS platform offering digital services. Upon successful payment, customers are granted access to our services within 1 hour through a confirmation email and platform login credentials.
      </p>
      <p className="text-gray-700">
        As a provider of digital products, no physical delivery is applicable. Customers will receive onboarding instructions and access details via email. For any queries or assistance, please contact us at{" "}
        <a href="mailto:botify.assist@gmail.com" className="text-indigo-600 underline">botify.assist@gmail.com</a>.
      </p>
      <p className="text-gray-700">
        This policy ensures prompt activation and delivery of our digital services, providing you with a seamless experience.
      </p>
    </div>
  </div>
);

export default ShippingPolicy;
