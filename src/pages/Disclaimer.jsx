import React from "react";

const Disclaimer = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full space-y-4">
      <h1 className="text-3xl font-bold text-indigo-700">Disclaimer</h1>
      <p className="text-gray-700">
        The information provided on this platform is for general informational purposes only. While we strive for accuracy, we make no guarantees of completeness, reliability, or accuracy.
      </p>
      <p className="text-gray-700">
        The use of any information provided on this platform is solely at your own risk. We are not liable for any losses or damages arising from the use of our service.
      </p>
      <p className="text-gray-700">
        Always consult a professional advisor for specific guidance related to your business.
      </p>
    </div>
  </div>
);

export default Disclaimer;
