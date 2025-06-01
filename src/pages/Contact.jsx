import React from "react";

const Contact = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-100 flex items-center justify-center p-8">
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-3xl w-full space-y-6">
      <h1 className="text-4xl font-extrabold text-purple-700 text-center drop-shadow-lg">📞 Contact Us</h1>
      <div className="space-y-4 text-lg text-gray-800 leading-relaxed">
        <p>
          <span className="font-semibold text-purple-600">📧 Email:</span> <a href="mailto:botify.assist@gmail.com" className="text-indigo-600 hover:underline">botify.assist@gmail.com</a>
        </p>
        <p>
          <span className="font-semibold text-purple-600">📞 Phone:</span> <a href="tel:+919263400564" className="text-indigo-600 hover:underline">+91-9263400564</a>
        </p>
        <p>
          <span className="font-semibold text-purple-600">🏢 Address:</span> Hanuman Nagar, Kankarbagh, Patna, Bihar, India
        </p>
        <p>
          We’re here to assist you! Whether it’s for support, sales, or general inquiries, our dedicated team is ready to help. Expect a response within 24-48 business hours. 📬
        </p>
      </div>
      <div className="text-center">
        <a
          href="mailto:botify.assist@gmail.com"
          className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow hover:bg-purple-700 transition-transform transform hover:scale-105"
        >
          ✉️ Email Us Now
        </a>
      </div>
    </div>
  </div>
);

export default Contact;
