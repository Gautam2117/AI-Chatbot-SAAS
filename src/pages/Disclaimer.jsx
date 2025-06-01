import React from "react";

const Disclaimer = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-8">
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-3xl w-full space-y-6">
      <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-lg">⚠️ Disclaimer</h1>
      <div className="space-y-4 text-lg text-gray-800 leading-relaxed">
        <p>
          The information provided on this platform is intended solely for general informational purposes. While we strive to ensure accuracy and reliability, we make no guarantees regarding the completeness, timeliness, or accuracy of the content.
        </p>
        <p>
          Usage of any content or information provided on this platform is at your own risk. <strong>Botify</strong> is not liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use of our platform.
        </p>
        <p>
          For business-specific guidance or professional recommendations, we strongly advise users to consult with qualified experts or advisors before making decisions.
        </p>
        <p>
          For any queries or concerns related to the information provided, please contact us at{" "}
          <a
            href="mailto:botify.assist@gmail.com"
            className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
          >
            botify.assist@gmail.com
          </a>.
        </p>
      </div>
      <div className="text-center">
        <a
          href="mailto:botify.assist@gmail.com"
          className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow hover:bg-purple-700 transition-transform transform hover:scale-105"
        >
          📬 Contact Us
        </a>
      </div>
    </div>
  </div>
);

export default Disclaimer;
