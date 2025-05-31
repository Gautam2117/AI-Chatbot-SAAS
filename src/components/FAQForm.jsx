import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query
} from "firebase/firestore";

const FAQForm = ({ faqs, setFaqs }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.uid) return;
    const faqsCollection = collection(db, "faqs", user.uid, "list");
    const q = query(faqsCollection);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedFaqs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFaqs(fetchedFaqs);
    }, (err) => {
      console.error("❌ Failed to fetch real-time FAQs:", err.message);
    });

    return () => unsubscribe();
  }, [user, setFaqs]);

  const addFAQ = async () => {
    if (!user?.uid) {
      alert("🔒 Please log in to add FAQs.");
      return;
    }

    if (question.trim() && answer.trim()) {
      try {
        const faqsCollection = collection(db, "faqs", user.uid, "list");
        await addDoc(faqsCollection, { q: question, a: answer });
        console.log("✅ FAQ added.");
        setQuestion("");
        setAnswer("");
      } catch (err) {
        console.error("❌ Failed to add FAQ:", err.message);
      }
    }
  };

  const deleteFAQ = async (faqId) => {
    if (!user?.uid) return;
    try {
      const faqDoc = doc(db, "faqs", user.uid, "list", faqId);
      await deleteDoc(faqDoc);
      console.log(`✅ Deleted FAQ ${faqId}`);
    } catch (err) {
      console.error("❌ Failed to delete FAQ:", err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold text-blue-700">📋 Manage FAQs</h2>

      <div className="grid gap-4">
        {faqs.length === 0 ? (
          <p className="text-gray-500">No FAQs yet. Start adding!</p>
        ) : (
          faqs.map((item) => (
            <div key={item.id} className="bg-blue-50 border border-blue-200 rounded p-4 flex justify-between items-center">
              <div>
                <p><strong>Q:</strong> {item.q}</p>
                <p><strong>A:</strong> {item.a}</p>
              </div>
              <button
                onClick={() => deleteFAQ(item.id)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                🗑️ Delete
              </button>
            </div>
          ))
        )}
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
