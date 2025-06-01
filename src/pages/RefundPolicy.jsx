import React from "react";

const RefundPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-8">
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full space-y-6">
      <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-lg">
        💸 Refund Policy
      </h1>
      <p className="text-lg text-gray-700">
        We offer a <span className="font-bold text-purple-600">7-day money-back guarantee</span> for new subscriptions. If you are not fully satisfied with our services, you may request a refund within 7 days of your initial subscription.
      </p>
      <p className="text-lg text-gray-700">
        To request a refund, please contact us at{" "}
        <a
          href="mailto:botify.assist@gmail.com"
          className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
        >
          botify.assist@gmail.com
        </a>{" "}
        with your payment details and the reason for the refund request. Refunds will be processed in compliance with local laws and payment regulations.
      </p>
      <p className="text-lg text-gray-700">
        Please note that <span className="font-bold text-red-600">no refunds</span> will be issued after 7 days from the date of subscription. We encourage you to review our pricing and terms carefully before making a purchase.
      </p>
      <p className="text-lg text-gray-700">
        This policy adheres to applicable <span className="font-semibold">consumer protection laws</span> in your jurisdiction.
      </p>
      <p className="text-center text-sm text-gray-500 mt-4">
        &copy; {new Date().getFullYear()} Botify. All rights reserved.
      </p>
    </div>
  </div>
);

export default RefundPolicy;
