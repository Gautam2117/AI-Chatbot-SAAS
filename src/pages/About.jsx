import React from "react";

const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-8">
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-3xl w-full space-y-6">
      <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-lg">✨ About Botify</h1>
      <p className="text-lg text-gray-800 leading-relaxed">
        Welcome to <span className="font-semibold text-purple-600">Botify</span>—where customer engagement meets innovation. Our cutting-edge, AI-powered SaaS platform is transforming how businesses worldwide connect with their customers.
      </p>
      <p className="text-lg text-gray-800 leading-relaxed">
        At <span className="font-semibold text-purple-600">Botify</span>, we prioritize <span className="font-semibold">privacy</span>, <span className="font-semibold">security</span>, and <span className="font-semibold">scalability</span>. Our solutions empower businesses to automate support, deliver personalized experiences, and ensure data integrity with compliance to global standards.
      </p>
      <p className="text-lg text-gray-800 leading-relaxed">
        Whether you’re a small clinic, an e-commerce store, or a consulting firm, <span className="font-semibold text-purple-600">Botify</span> helps you scale effortlessly. Capture leads, resolve queries, and engage in real-time—all from a platform that seamlessly integrates into your workflows.
      </p>
      <p className="text-lg text-gray-800 leading-relaxed">
        Ready to elevate your customer experience and supercharge your growth? Let <span className="font-semibold text-purple-600">Botify</span> be your trusted partner on this journey. 🚀
      </p>
      <div className="text-center">
        <a
          href="mailto:botify.assist@gmail.com"
          className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow hover:bg-purple-700 transition-transform transform hover:scale-105"
        >
          📬 Contact Us
        </a>
      </div>
    </div>
  </div>
);

export default About;
