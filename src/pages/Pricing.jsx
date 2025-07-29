import React from "react";
import Layout from "../components/Layout";

const Pricing = () => (
  <Layout
    title="Pricing – Botify AI Chatbot Plans"
    description="Explore Botify's affordable AI chatbot pricing plans – Free, Pro, and Pro Max. Scale customer support with smart automation and flexible usage."
  >
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-6 sm:p-8">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl max-w-6xl w-full space-y-10">
        <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-md">💎 Our Pricing Plans</h1>

        <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto">
          Whether you're just getting started or scaling fast, Botify has a plan for you.
          Enjoy daily token limits, priority support, and advanced tools to grow smarter.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="border-2 border-gray-400 rounded-2xl p-8 bg-gray-50 hover:shadow-2xl transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold text-gray-700 text-center">Free Plan</h2>
            <ul className="text-gray-800 space-y-3 mt-6 text-base">
              <li>🎉 1,000 tokens/day</li>
              <li>🔐 Secure data encryption</li>
              <li>📈 Basic analytics</li>
              <li>🛠️ Community support</li>
            </ul>
            <p className="font-bold text-gray-800 text-center mt-6 text-xl">₹0/month</p>
            <div className="flex justify-center mt-6">
              <a
                href="/#pricing"
                className="bg-gray-600 text-white font-semibold px-5 py-3 rounded-full hover:bg-gray-700 shadow-md transition-transform transform hover:scale-105"
              >
                🆓 Start Free
              </a>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-purple-500 rounded-2xl p-8 bg-purple-50 hover:shadow-2xl transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold text-purple-600 text-center">Pro Plan</h2>
            <ul className="text-gray-800 space-y-3 mt-6 text-base">
              <li>⚡ 10,000 tokens/day</li>
              <li>📊 Usage dashboard access</li>
              <li>🔒 Enhanced security</li>
              <li>📞 Priority customer support</li>
            </ul>
            <p className="font-bold text-purple-700 text-center mt-6 text-xl">₹149/month</p>
            <div className="flex justify-center mt-6">
              <a
                href="/#pricing"
                className="bg-purple-600 text-white font-semibold px-5 py-3 rounded-full hover:bg-purple-700 shadow-md transition-transform transform hover:scale-105"
              >
                🚀 Go Pro
              </a>
            </div>
          </div>

          {/* Pro Max Plan */}
          <div className="border-2 border-pink-500 rounded-2xl p-8 bg-pink-50 hover:shadow-2xl transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold text-pink-600 text-center">Pro Max</h2>
            <ul className="text-gray-800 space-y-3 mt-6 text-base">
              <li>🔥 66,000 tokens/day (~2M/month cap)</li>
              <li>💎 Premium support</li>
              <li>👨‍💻 Priority onboarding</li>
              <li>🧪 Early access to new features</li>
            </ul>
            <p className="font-bold text-pink-700 text-center mt-6 text-xl">₹399/month</p>
            <div className="flex justify-center mt-6">
              <a
                href="/#pricing"
                className="bg-pink-600 text-white font-semibold px-5 py-3 rounded-full hover:bg-pink-700 shadow-md transition-transform transform hover:scale-105"
              >
                🚀 Choose Pro Max
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          💡 Need a custom plan or have questions?{" "}
          <a
            href="/contact"
            className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
          >
            Contact our team
          </a>.
        </p>
      </div>
    </div>
  </Layout>
);

export default Pricing;
