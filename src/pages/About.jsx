import React from "react";
import Layout from "../components/Layout"; // reusable layout wrapper

const About = () => (
  <Layout
    title="About Botify – AI-Powered Customer Engagement Platform"
    description="Discover the story and mission behind Botify – your all-in-one AI chatbot solution built to automate customer support, capture leads, and scale engagement effortlessly."
  >
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 flex items-center justify-center px-6 py-12">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-3xl w-full space-y-6">
        <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-md">
          ✨ About Botify
        </h1>

        <p className="text-lg text-gray-800 leading-relaxed">
          <span className="font-semibold text-purple-600">Botify</span> is your AI-powered customer service assistant, transforming how businesses interact with their customers—automatically, intelligently, and 24/7.
        </p>

        <p className="text-lg text-gray-800 leading-relaxed">
          We are on a mission to make powerful AI support accessible to everyone—from startups and solo entrepreneurs to global brands. Our chatbot platform helps you engage leads, answer FAQs, and delight customers using the latest in GPT-based natural language AI.
        </p>

        <p className="text-lg text-gray-800 leading-relaxed">
          <span className="font-semibold text-purple-600">Botify</span> is built with privacy, performance, and scalability at its core. We use Firebase for secure authentication and Firestore for scalable real-time data handling. No user data is ever sold, and we maintain GDPR-compliant practices by default.
        </p>

        <p className="text-lg text-gray-800 leading-relaxed">
          Our story began with one goal: to empower businesses to focus on growth while AI handles the repetitive tasks. Whether you're automating your helpdesk or capturing leads via embedded widgets—<span className="text-purple-600 font-medium">Botify has your back</span>.
        </p>

        <div className="text-center">
          <a
            href="/signup"
            className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow hover:bg-purple-700 transition-transform transform hover:scale-105"
          >
            🚀 Try Botify for Free
          </a>
        </div>

        <div className="pt-6 border-t border-gray-300 text-center text-sm text-gray-600">
          Have questions?{" "}
          <a
            href="mailto:botify.assist@gmail.com"
            className="text-purple-600 hover:underline"
          >
            Contact our team
          </a>
        </div>
      </div>
    </div>
  </Layout>
);

export default About;
