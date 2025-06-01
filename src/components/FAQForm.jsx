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
  orderBy,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";

const FAQForm = ({ faqs, setFaqs }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editId, setEditId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date"); // "date" or "question"
  const faqsPerPage = 5;
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.uid) return;

    const faqsCollection = collection(db, "faqs", user.uid, "list");
    const q = query(faqsCollection); // removed orderBy to support missing createdAt
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedFaqs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFaqs(fetchedFaqs);
    });
    return () => unsubscribe();
  }, [user, setFaqs]);

  const addFAQ = async () => {
    if (!user?.uid) return alert("🔒 Please log in.");
    if (question.trim() && answer.trim()) {
      try {
        setIsSaving(true);
        await addDoc(collection(db, "faqs", user.uid, "list"), {
          q: question,
          a: answer,
          createdAt: serverTimestamp(), // Ensure date is saved
        });
        setQuestion("");
        setAnswer("");
      } catch (err) {
        console.error("❌ Failed to add FAQ:", err.message);
      } finally {
        setIsSaving(false);
      }
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
    if (!user?.uid || !editId || !editQuestion.trim() || !editAnswer.trim()) return;
    try {
      setIsSaving(true);
      await updateDoc(doc(db, "faqs", user.uid, "list", editId), {
        q: editQuestion,
        a: editAnswer,
        updatedAt: serverTimestamp(),
      });
      cancelEdit();
    } catch (err) {
      console.error("❌ Failed to update FAQ:", err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (faqId) => setConfirmDeleteId(faqId);
  const handleDelete = async () => {
    if (!user?.uid || !confirmDeleteId) return;
    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "faqs", user.uid, "list", confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("❌ Failed to delete FAQ:", err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleExpand = (faqId) => {
    setExpandedFAQ((prev) => (prev === faqId ? null : faqId));
  };

  // 🔥 Filter, sort, paginate
  const filteredFaqs = faqs
    .filter((faq) =>
      faq.q?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      } else if (sortBy === "question") {
        return a.q?.localeCompare(b.q);
      }
      return 0;
    });

  const indexOfLast = currentPage * faqsPerPage;
  const indexOfFirst = indexOfLast - faqsPerPage;
  const currentFaqs = filteredFaqs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFaqs.length / faqsPerPage);

  const exportToCSV = () => {
    const rows = [["Question", "Answer", "Created At"]];
    faqs.forEach((faq) => {
      rows.push([
        faq.q,
        faq.a,
        faq.createdAt?.toDate?.().toLocaleString() || "N/A",
      ]);
    });
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "faqs.csv";
    a.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("📋 FAQs Report", 14, 20);
    doc.autoTable({
      head: [["Question", "Answer", "Created At"]],
      body: faqs.map((faq) => [
        faq.q,
        faq.a,
        faq.createdAt?.toDate?.().toLocaleString() || "N/A",
      ]),
    });
    doc.save("faqs.pdf");
  };

  const [importProgress, setImportProgress] = useState(0);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user?.uid) return;

    setImportProgress(0); // Reset progress
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        const totalRows = rows.length;
        let processed = 0;

        const promises = rows.map(async (row) => {
          const question = row["Question"]?.trim();
          const answer = row["Answer"]?.trim();
          if (question && answer) {
            await addDoc(collection(db, "faqs", user.uid, "list"), {
              q: question,
              a: answer,
              createdAt: serverTimestamp(),
            });
          }
          processed++;
          setImportProgress(Math.round((processed / totalRows) * 100));
        });

        try {
          await Promise.all(promises);
          alert("✅ FAQs imported successfully!");
          setImportProgress(100); // Complete
        } catch (err) {
          console.error("❌ Error importing FAQs:", err.message);
          alert("❌ Failed to import some FAQs.");
        }
      },
    });
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl shadow-2xl p-6 md:p-10 space-y-6 hover:scale-[1.02] transition">
      <h2 className="text-3xl font-extrabold text-indigo-700 text-center">📋 Manage FAQs</h2>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="🔍 Search FAQs..."
          className="w-full md:w-1/2 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="date">Sort by Date</option>
          <option value="question">Sort by Question</option>
        </select>
        <div className="flex gap-2">
          <button onClick={exportToCSV} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">⬇️ CSV</button>
          <button onClick={exportToPDF} className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">📄 PDF</button>
        </div>
      </div>

      <div className="grid gap-4">
        {currentFaqs.length === 0 ? (
          <p className="text-gray-500 text-center italic">No FAQs found. Try searching or add new ones!</p>
        ) : (
          currentFaqs.map((faq) => (
            <div key={faq.id} className="bg-white border border-indigo-200 rounded-lg p-4 shadow hover:shadow-lg">
              <div onClick={() => toggleExpand(faq.id)} className="cursor-pointer flex justify-between items-center">
                <p className="font-semibold text-indigo-800">Q: {faq.q}</p>
                <span>{expandedFAQ === faq.id ? "🔼" : "🔽"}</span>
              </div>
              {expandedFAQ === faq.id && (
                <>
                  {editId === faq.id ? (
                    <div className="space-y-2 mt-2">
                      <input
                        type="text"
                        className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
                      />
                      <input
                        type="text"
                        className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
                        value={editAnswer}
                        onChange={(e) => setEditAnswer(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button onClick={saveEdit} disabled={isSaving} className={`bg-green-600 text-white px-4 py-2 rounded-lg ${isSaving ? "opacity-50" : ""}`}>💾 Save</button>
                        <button onClick={cancelEdit} className="bg-gray-400 text-white px-4 py-2 rounded-lg">❌ Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-indigo-700 mt-2">A: {faq.a}</p>
                  )}
                  {editId !== faq.id && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => startEdit(faq)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg">✏️ Edit</button>
                      <button onClick={() => confirmDelete(faq.id)} className="bg-red-600 text-white px-3 py-1 rounded-lg">🗑️ Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-indigo-300 rounded disabled:opacity-50">◀ Prev</button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 bg-indigo-300 rounded disabled:opacity-50">Next ▶</button>
        </div>
      )}

      {/* Bulk Import CSV UI */}
      <div className="mt-6">
        <label className="block font-medium text-sm text-indigo-700 mb-1">
          📤 Import FAQs (CSV only)
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-indigo-600 file:text-white file:rounded-lg hover:file:bg-indigo-700"
        />
        <p className="text-xs mt-1 text-gray-500">
          File must have columns: <strong>Question</strong>, <strong>Answer</strong>
        </p>
        {importProgress > 0 && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-indigo-600 h-4 rounded-full"
              style={{ width: `${importProgress}%` }}
            />
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <input type="text" placeholder="Enter question" value={question} onChange={(e) => setQuestion(e.target.value)} className="border px-4 py-3 rounded-lg" />
        <input type="text" placeholder="Enter answer" value={answer} onChange={(e) => setAnswer(e.target.value)} className="border px-4 py-3 rounded-lg" />
        <button onClick={addFAQ} disabled={isSaving} className={`bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-lg ${isSaving ? "opacity-50" : ""}`}>➕ Add FAQ</button>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-bold text-red-600">⚠️ Confirm Deletion</h3>
            <p>Are you sure you want to delete this FAQ?</p>
            <div className="flex justify-center gap-4">
              <button onClick={handleDelete} disabled={isDeleting} className={`bg-red-600 text-white px-4 py-2 rounded ${isDeleting ? "opacity-50" : ""}`}>Yes, Delete</button>
              <button onClick={() => setConfirmDeleteId(null)} className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQForm;
