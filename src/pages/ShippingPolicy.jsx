import React from "react";

const ShippingPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full space-y-4">
      <h1 className="text-3xl font-bold text-indigo-700">Shipping & Delivery Policy</h1>
      <p className="text-gray-700">
        Botify is a SaaS platform providing digital services. Upon successful payment, service access is granted within 1 hour via email and platform login.
      </p>
      <p className="text-gray-700">
        For digital products, no physical delivery is required. Customers receive confirmation and onboarding instructions via email. Contact botify.assist@gmail.com for queries.
      </p>
      <p className="text-gray-700">
        This policy ensures prompt service activation and delivery.
      </p>
    </div>
  </div>
);

export default ShippingPolicy;
