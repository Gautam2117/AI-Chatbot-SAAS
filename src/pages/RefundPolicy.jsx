import React from "react";

const RefundPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full space-y-4">
      <h1 className="text-3xl font-bold text-indigo-700">Refund Policy</h1>
      <p className="text-gray-700">
        We offer a 7-day money-back guarantee for new subscriptions. Refunds are processed upon request if you are not fully satisfied with our services.
      </p>
      <p className="text-gray-700">
        To request a refund, contact us at refunds@aichatbot.com with your payment details and reason for refund. Refunds are processed in accordance with local laws and payment regulations.
      </p>
      <p className="text-gray-700">
        No refunds are issued after 7 days from the date of subscription. Please review our pricing and terms carefully before subscribing.
      </p>
      <p className="text-gray-700">
        This policy complies with consumer protection laws in applicable jurisdictions.
      </p>
    </div>
  </div>
);

export default RefundPolicy;
