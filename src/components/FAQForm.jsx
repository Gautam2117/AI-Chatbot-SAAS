import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";

const FAQForm = ({ faqs, setFaqs }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editId, setEditId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.uid) return;
    const faqsCollection = collection(db, "faqs", user.uid, "list");
    const q = query(faqsCollection);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedFaqs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFaqs(fetchedFaqs);
      },
      (err) => {
        console.error("❌ Failed to fetch real-time FAQs:", err.message);
      }
    );

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

  const startEdit = (faq) => {
    setEditId(faq.id);
    setEditQuestion(faq.q);
    setEditAnswer(faq.a);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  const saveEdit = async () => {
    if (!user?.uid || !editId || !editQuestion.trim() || !editAnswer.trim()) {
      alert("Invalid edit inputs or user not logged in.");
      return;
    }

    try {
      const faqDoc = doc(db, "faqs", user.uid, "list", editId);
      await updateDoc(faqDoc, { q: editQuestion, a: editAnswer });
      console.log(`✅ Updated FAQ ${editId}`);
      cancelEdit();
    } catch (err) {
      console.error("❌ Failed to update FAQ:", err.message);
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
            <div
              key={item.id}
              className="bg-blue-50 border border-blue-200 rounded p-4 flex justify-between items-center gap-4"
            >
              {editId === item.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    className="w-full border px-2 py-1 rounded"
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full border px-2 py-1 rounded"
                    value={editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <p>
                    <strong>Q:</strong> {item.q}
                  </p>
                  <p>
                    <strong>A:</strong> {item.a}
                  </p>
                </div>
              )}

              {editId !== item.id && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteFAQ(item.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
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
