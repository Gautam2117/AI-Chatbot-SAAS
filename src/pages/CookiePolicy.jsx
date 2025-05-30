import React from "react";

const CookiePolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full space-y-4">
      <h1 className="text-3xl font-bold text-indigo-700">Cookie Policy</h1>
      <p className="text-gray-700">
        At <strong>Botify</strong>, we use cookies and similar technologies to improve your browsing experience, analyze website traffic, and personalize content and ads. Cookies help us understand user preferences and enhance the functionality of our platform.
      </p>
      <p className="text-gray-700">
        By using our website, you consent to the use of cookies as described in this policy. You can manage or disable cookies through your browser settings at any time. However, please note that some features of our platform may not function optimally without cookies.
      </p>
      <p className="text-gray-700">
        We respect your privacy and are committed to safeguarding your personal data. For detailed information on how we collect, use, and protect your data, please refer to our <a href="/privacy-policy" className="text-indigo-600 underline hover:text-indigo-800">Privacy Policy</a>.
      </p>
      <p className="text-gray-700">
        For further inquiries about our use of cookies, please contact our Data Protection Officer at <a href="mailto:botify.assist@gmail.com" className="text-indigo-600 underline hover:text-indigo-800">botify.assist@gmail.com</a>.
      </p>
    </div>
  </div>
);

export default CookiePolicy;
