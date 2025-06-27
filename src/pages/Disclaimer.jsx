import React from "react";
import Layout from "../components/Layout";

const Disclaimer = () => (
  <Layout
    title="Disclaimer – Botify"
    description="Read the official disclaimer for Botify regarding the usage of content, liability limitations, and user responsibilities."
  >
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-6 sm:p-8">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl max-w-3xl w-full space-y-6">
        <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-md">⚠️ Disclaimer</h1>

        <div className="space-y-4 text-lg text-gray-800 leading-relaxed">
          <p>
            The information provided by <span className="font-semibold text-purple-600">Botify</span> is for general informational purposes only. All content is provided in good faith; however, we make no representation or warranty of any kind—express or implied—regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
          </p>

          <p>
            Under no circumstance shall <span className="font-semibold">Botify</span> be held liable for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided. Your use of the platform and your reliance on any information is solely at your own risk.
          </p>

          <p>
            The platform may include links to external websites or third-party content. We do not warrant, endorse, or assume responsibility for the accuracy or reliability of any information offered by third-party sites linked through the platform.
          </p>

          <p>
            If you require specific advice (e.g., legal, technical, or financial), you should consult an appropriately qualified professional. The content on this site is not a substitute for professional guidance.
          </p>

          <p>
            For questions or concerns regarding this disclaimer, please contact us at{" "}
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
  </Layout>
);

export default Disclaimer;
