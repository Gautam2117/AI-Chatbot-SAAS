import React from "react";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full space-y-4">
      <h1 className="text-3xl font-bold text-indigo-700">Privacy Policy</h1>
      <p className="text-gray-700">
        We prioritize your privacy and ensure that your data is collected and processed responsibly. Our platform only collects essential data for service optimization and strictly adheres to data protection regulations.
      </p>
      <p className="text-gray-700">
        Your information will never be sold or shared with unauthorized parties. Data usage is solely for enhancing service quality and providing essential features.
      </p>
      <p className="text-gray-700">
        We comply with international data protection laws, including the General Data Protection Regulation (GDPR) for EU users and the California Consumer Privacy Act (CCPA) for California residents.
      </p>
      <p className="text-gray-700">
        You have the right to access, rectify, or delete your personal data at any time. To exercise these rights, please contact our Data Protection Officer at privacy@aichatbot.com.
      </p>
      <p className="text-gray-700">
        For more information on our data handling practices, refer to our Data Processing Agreement (DPA) available upon request.
      </p>
    </div>
  </div>
);

export default PrivacyPolicy;
