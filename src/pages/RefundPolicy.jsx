import React from "react";

const RefundPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full space-y-4">
      <h1 className="text-3xl font-bold text-indigo-700">Refund Policy</h1>
      <p className="text-gray-700">
        We offer a 7-day money-back guarantee for new subscriptions. If you are not fully satisfied with our services, you may request a refund within 7 days of your initial subscription.
      </p>
      <p className="text-gray-700">
        To request a refund, please contact us at{" "}
        <a href="mailto:botify.assist@gmail.com" className="text-indigo-600 underline">botify.assist@gmail.com</a>{" "}
        with your payment details and the reason for the refund request. Refunds will be processed in compliance with local laws and payment regulations.
      </p>
      <p className="text-gray-700">
        Please note that no refunds will be issued after 7 days from the date of subscription. We encourage you to review our pricing and terms carefully before making a purchase.
      </p>
      <p className="text-gray-700">
        This policy adheres to applicable consumer protection laws in your jurisdiction.
      </p>
    </div>
  </div>
);

export default RefundPolicy;
