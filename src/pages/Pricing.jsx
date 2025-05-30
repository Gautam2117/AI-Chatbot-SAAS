import React from "react";

const Pricing = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700 text-center">Our Pricing Plans</h1>
      <p className="text-center text-gray-600 max-w-lg mx-auto">
        Choose the plan that fits your business needs. Get started with a flexible and scalable AI chatbot solution designed to grow with you.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 bg-indigo-50 hover:shadow-lg transition transform hover:scale-105">
          <h2 className="text-xl font-bold text-indigo-600 text-center">Pro Plan</h2>
          <ul className="text-gray-700 space-y-2 mt-4">
            <li>✔️ 5,000 tokens/day</li>
            <li>✔️ Priority customer support</li>
          </ul>
          <p className="font-bold text-indigo-700 text-center mt-4 text-lg">₹99/month</p>
          <div className="flex justify-center mt-4">
            <a href="/#pricing" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">Select Pro</a>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-indigo-50 hover:shadow-lg transition transform hover:scale-105">
          <h2 className="text-xl font-bold text-indigo-600 text-center">Unlimited Plan</h2>
          <ul className="text-gray-700 space-y-2 mt-4">
            <li>✔️ Unlimited tokens/day</li>
            <li>✔️ Premium support</li>
          </ul>
          <p className="font-bold text-indigo-700 text-center mt-4 text-lg">₹249/month</p>
          <div className="flex justify-center mt-4">
            <a href="/#pricing" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">Select Unlimited</a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Pricing;
