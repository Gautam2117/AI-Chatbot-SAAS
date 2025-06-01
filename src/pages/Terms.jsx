import React from "react";

const Terms = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-8">
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full space-y-6">
      <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-lg">
        📜 Terms & Conditions
      </h1>
      <p className="text-lg text-gray-700">
        By accessing and using our <strong>AI chatbot platform</strong>, you agree to comply with these Terms & Conditions, including adherence to all applicable laws and regulations.
      </p>
      <p className="text-lg text-gray-700">
        Users are solely responsible for ensuring the accuracy and legality of the data they provide and for not using the platform for any unlawful, harmful, or abusive purposes.
      </p>
      <p className="text-lg text-gray-700">
        We reserve the right to <span className="font-semibold text-indigo-600">update or modify</span> these terms at any time. Continued use of our services following any changes constitutes your acceptance of the revised terms.
      </p>
      <p className="text-lg text-gray-700">
        <strong>⚖️ Limitation of Liability:</strong> Our platform is provided on an "as is" and "as available" basis, without warranties of any kind. We shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of our services.
      </p>
      <p className="text-lg text-gray-700">
        <strong>🌍 Governing Law:</strong> These terms are governed by and construed in accordance with the laws of the jurisdiction where our company is registered.
      </p>
      <p className="text-lg text-gray-700">
        <strong>🤝 Dispute Resolution:</strong> Any disputes arising out of or in connection with these terms shall be resolved through arbitration in the applicable jurisdiction, in accordance with the governing law.
      </p>
      <p className="text-center text-sm text-gray-500 mt-4">
        &copy; {new Date().getFullYear()} Botify. All rights reserved.
      </p>
    </div>
  </div>
);

export default Terms;
