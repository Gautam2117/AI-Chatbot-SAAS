import React from "react";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-8">
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full space-y-6">
      <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-lg">
        🔒 Privacy Policy
      </h1>
      <p className="text-lg text-gray-700">
        At <span className="font-bold text-purple-600">Botify</span>, we prioritize your privacy and are committed to protecting your personal information. We collect and process only the essential data required to provide and enhance our AI-powered services.
      </p>
      <p className="text-lg text-gray-700">
        Your information will <span className="font-bold text-purple-600">never</span> be sold or shared with unauthorized parties. We use your data solely to deliver exceptional service, support, and functionality.
      </p>
      <p className="text-lg text-gray-700">
        We strictly adhere to international data protection laws, including the <span className="font-semibold">General Data Protection Regulation (GDPR)</span> for EU users and the <span className="font-semibold">California Consumer Privacy Act (CCPA)</span> for residents of California.
      </p>
      <p className="text-lg text-gray-700">
        You have the right to access, rectify, or delete your personal data at any time. To exercise these rights, please contact our Data Protection Officer at{" "}
        <a
          href="mailto:botify.assist@gmail.com"
          className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
        >
          botify.assist@gmail.com
        </a>.
      </p>
      <p className="text-lg text-gray-700">
        For more details about our data handling practices, refer to our <span className="font-semibold">Data Processing Agreement (DPA)</span> available upon request.
      </p>
      <p className="text-center text-sm text-gray-500 mt-4">
        &copy; {new Date().getFullYear()} Botify. All rights reserved.
      </p>
    </div>
  </div>
);

export default PrivacyPolicy;
