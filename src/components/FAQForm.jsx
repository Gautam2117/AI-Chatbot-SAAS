import React, { useState } from "react";

const FAQForm = ({ faqs, setFaqs }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const addFAQ = () => {
    if (question.trim() && answer.trim()) {
      setFaqs([...faqs, { q: question, a: answer }]);
      setQuestion("");
      setAnswer("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold text-blue-700">📋 Manage FAQs</h2>

      <div className="grid gap-4">
        {faqs.map((item, idx) => (
          <div key={idx} className="bg-blue-50 border border-blue-200 rounded p-4">
            <p><strong>Q:</strong> {item.q}</p>
            <p><strong>A:</strong> {item.a}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="text"
          className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input
          type="text"
          className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
          placeholder="Enter answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button
          onClick={addFAQ}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add FAQ
        </button>
      </div>
    </div>
  );
};

export default FAQForm;
