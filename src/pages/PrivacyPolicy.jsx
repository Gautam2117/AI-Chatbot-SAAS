import React from "react";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full space-y-4">
      <h1 className="text-3xl font-bold text-indigo-700">Privacy Policy</h1>
      <p className="text-gray-700">
        At Botify, we prioritize your privacy and are committed to protecting your personal information. We collect and process only the essential data required to provide and enhance our AI-powered services.
      </p>
      <p className="text-gray-700">
        Your information will never be sold or shared with unauthorized parties. We use your data solely to deliver exceptional service, support, and functionality.
      </p>
      <p className="text-gray-700">
        We strictly adhere to international data protection laws, including the General Data Protection Regulation (GDPR) for EU users and the California Consumer Privacy Act (CCPA) for residents of California.
      </p>
      <p className="text-gray-700">
        You have the right to access, rectify, or delete your personal data at any time. To exercise these rights, please contact our Data Protection Officer at{" "}
        <a href="mailto:botify.assist@gmail.com" className="text-indigo-600 underline">botify.assist@gmail.com</a>.
      </p>
      <p className="text-gray-700">
        For more details about our data handling practices, refer to our Data Processing Agreement (DPA) available upon request.
      </p>
    </div>
  </div>
);

export default PrivacyPolicy;
