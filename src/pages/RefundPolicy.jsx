import React from "react";

const RefundPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-8">
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full space-y-6">
      <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-lg">
        💸 Refund Policy
      </h1>

      <p className="text-lg text-gray-700">
        At <span className="font-bold text-purple-700">Botify</span>, we strive to ensure that our customers are fully satisfied with our AI chatbot services. If for any reason you're not happy, we offer a <span className="font-bold text-purple-600">100% refund</span> on all subscription plans within the first <span className="font-bold">7 calendar days</span> of the original purchase.
      </p>

      <p className="text-lg text-gray-700">
        To request a refund, you must email us at{" "}
        <a
          href="mailto:botify.assist@gmail.com"
          className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
        >
          botify.assist@gmail.com
        </a>{" "}
        with your full name, registered email address, transaction ID, and reason for cancellation. Once we receive your request, our team will review and approve it (if valid) within <span className="font-semibold text-indigo-700">2 business days</span>.
      </p>

      <p className="text-lg text-gray-700">
        After approval, the refund will be processed and the amount will be credited back to the original payment method within <span className="font-bold text-indigo-700">5–7 business days</span>.
      </p>

      <p className="text-lg text-red-600 font-semibold">
        Note: Refunds will not be issued for requests made after 7 calendar days from the date of purchase. No partial refunds are provided for unused portions of the subscription.
      </p>

      <p className="text-lg text-gray-700">
        For any questions, feel free to contact our support team using the email above.
      </p>

      <p className="text-center text-sm text-gray-500 mt-4">
        &copy; {new Date().getFullYear()} Botify. All rights reserved.
      </p>
    </div>
  </div>
);

export default RefundPolicy;
