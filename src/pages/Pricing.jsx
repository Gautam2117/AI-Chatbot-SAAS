import React from "react";

const Pricing = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-8">
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full space-y-8">
      <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-lg">
        💎 Our Pricing Plans
      </h1>
      <p className="text-center text-lg text-gray-700 max-w-2xl mx-auto">
        Choose the plan that perfectly fits your business needs. Scale effortlessly with our flexible, AI-driven chatbot solutions designed to grow with you.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border-2 border-purple-500 rounded-2xl p-8 bg-purple-50 hover:shadow-2xl transition transform hover:scale-105">
          <h2 className="text-2xl font-bold text-purple-600 text-center">Pro Plan</h2>
          <ul className="text-gray-800 space-y-3 mt-6 text-base">
            <li>✨ 5,000 tokens/day</li>
            <li>⚡ Priority customer support</li>
          </ul>
          <p className="font-bold text-purple-700 text-center mt-6 text-xl">₹99/month</p>
          <div className="flex justify-center mt-6">
            <a
              href="/#pricing"
              className="bg-purple-600 text-white font-semibold px-5 py-3 rounded-full hover:bg-purple-700 shadow-md transition-transform transform hover:scale-105"
            >
              🚀 Select Pro
            </a>
          </div>
        </div>

        <div className="border-2 border-pink-500 rounded-2xl p-8 bg-pink-50 hover:shadow-2xl transition transform hover:scale-105">
          <h2 className="text-2xl font-bold text-pink-600 text-center">Unlimited Plan</h2>
          <ul className="text-gray-800 space-y-3 mt-6 text-base">
            <li>🔥 Unlimited tokens/day</li>
            <li>💎 Premium priority support</li>
          </ul>
          <p className="font-bold text-pink-700 text-center mt-6 text-xl">₹249/month</p>
          <div className="flex justify-center mt-6">
            <a
              href="/#pricing"
              className="bg-pink-600 text-white font-semibold px-5 py-3 rounded-full hover:bg-pink-700 shadow-md transition-transform transform hover:scale-105"
            >
              🚀 Select Unlimited
            </a>
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-gray-600">
        💡 Have questions or need a custom plan?{" "}
        <a
          href="/contact"
          className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
        >
          Contact our team
        </a>.
      </p>
    </div>
  </div>
);

export default Pricing;
