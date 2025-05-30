import React from "react";

const Disclaimer = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full space-y-4">
      <h1 className="text-3xl font-bold text-indigo-700">Disclaimer</h1>
      <p className="text-gray-700">
        The information provided on this platform is intended for general informational purposes only. While we make every effort to ensure accuracy and reliability, we do not guarantee the completeness, timeliness, or accuracy of the information.
      </p>
      <p className="text-gray-700">
        The use of any content or information provided on this platform is at your own risk. <strong>Botify</strong> shall not be held responsible or liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use of our platform.
      </p>
      <p className="text-gray-700">
        For specific business advice or professional recommendations, we strongly encourage users to consult with qualified experts or advisors before making decisions.
      </p>
      <p className="text-gray-700">
        For any queries or concerns related to the information provided, please contact us at <a href="mailto:botify.assist@gmail.com" className="text-indigo-600 underline hover:text-indigo-800">botify.assist@gmail.com</a>.
      </p>
    </div>
  </div>
);

export default Disclaimer;
