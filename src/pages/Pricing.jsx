import React from "react";

const Pricing = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-6 bg-indigo-50 hover:shadow-lg">
          <h2 className="text-xl font-bold text-indigo-600">Pro Plan</h2>
          <p className="text-gray-700">✔️ 5,000 tokens/day</p>
          <p className="text-gray-700">✔️ Priority customer support</p>
          <p className="font-bold text-indigo-700">₹99/month</p>
        </div>
        <div className="border rounded-lg p-6 bg-indigo-50 hover:shadow-lg">
          <h2 className="text-xl font-bold text-indigo-600">Unlimited Plan</h2>
          <p className="text-gray-700">✔️ Unlimited tokens/day</p>
          <p className="text-gray-700">✔️ Premium support</p>
          <p className="font-bold text-indigo-700">₹249/month</p>
        </div>
      </div>
    </div>
  </div>
);

export default Pricing;
