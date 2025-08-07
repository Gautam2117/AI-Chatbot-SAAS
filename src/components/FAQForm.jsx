import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthProvider";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import DOMPurify from "dompurify";

/* ───────────────────────── tiny atoms ───────────────────────── */
const Glass = ({ className = "", children }) => (
  <div
    className={`rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.25)] ${className}`}
  >
    {children}
  </div>
);

const IconBtn = ({ onClick, children, title, disabled, className = "" }) => (
  <button
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 hover:bg-white/10 active:scale-[0.98] transition disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const ChipToggle = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
      active
        ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
        : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
    }`}
  >
    {children}
  </button>
);

/* ───────────────────────── component ───────────────────────── */
const FAQForm = ({ faqs, setFaqs }) => {
  const { user } = useContext(AuthContext);

  /* --------------- CRUD state --------------- */
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editId, setEditId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  /* --------------- UI state --------------- */
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date"); // "date" | "question"
  const [currentPage, setCurrentPage] = useState(1);
  const [importProgress, setImportProgress] = useState(0);

  const faqsPerPage = 6;

  /* ─────────── live Firestore listener ─────────── */
  useEffect(() => {
    if (!user?.uid) return;

    let unsub;
    (async () => {
      const profile = await getDoc(doc(db, "users", user.uid));
      const companyId = profile.data()?.companyId;
      if (!companyId) return;

      const faqsCol = collection(db, "faqs", companyId, "list");
      unsub = onSnapshot(query(faqsCol), (snap) =>
        setFaqs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      );
    })();

    return () => unsub?.();
  }, [user?.uid, setFaqs]);

  /* ─────────── filtered + sorted list ─────────── */
  const filteredSorted = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const filtered = (faqs || []).filter(
      (f) =>
        f.q?.toLowerCase().includes(term) || f.a?.toLowerCase().includes(term)
    );
    if (sortBy === "question") {
      return filtered.sort((a, b) => (a.q || "").localeCompare(b.q || ""));
    }
    return filtered.sort(
      (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    );
  }, [faqs, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredSorted.length / faqsPerPage) || 1;
  const currentFaqs = filteredSorted.slice(
    (currentPage - 1) * faqsPerPage,
    currentPage * faqsPerPage
  );

  /* ─────────── add FAQ ─────────── */
  const addFAQ = async () => {
    if (!user?.uid) return alert("🔒 Please log in.");
    const q = question.trim();
    const a = answer.trim();
    if (!q || !a) return;

    const dup = faqs.some(
      (f) =>
        f.q?.toLowerCase().trim() === q.toLowerCase() &&
        f.a?.toLowerCase().trim() === a.toLowerCase()
    );
    if (dup) return alert("❌ Duplicate FAQ already exists.");

    try {
      setIsSaving(true);
      await addDoc(
        collection(db, "faqs", user.companyId, "list"),
        {
          q: DOMPurify.sanitize(q),
          a: DOMPurify.sanitize(a),
          createdAt: serverTimestamp(),
        }
      );
      setQuestion("");
      setAnswer("");
      setCurrentPage(1);
    } finally {
      setIsSaving(false);
    }
  };

  /* ─────────── edit FAQ ─────────── */
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
    if (!user?.uid || !editId) return;
    const q = editQuestion.trim();
    const a = editAnswer.trim();
    if (!q || !a) return;

    const dup = faqs.some(
      (f) =>
        f.id !== editId &&
        f.q?.toLowerCase().trim() === q.toLowerCase() &&
        f.a?.toLowerCase().trim() === a.toLowerCase()
    );
    if (dup) return alert("❌ Another FAQ with the same Q & A already exists.");

    try {
      setIsSaving(true);
      await updateDoc(
        doc(db, "faqs", user.companyId, "list", editId),
        {
          q: DOMPurify.sanitize(q),
          a: DOMPurify.sanitize(a),
          updatedAt: serverTimestamp(),
        }
      );
      cancelEdit();
    } finally {
      setIsSaving(false);
    }
  };

  /* ─────────── delete FAQ ─────────── */
  const handleDelete = async () => {
    if (!user?.uid || !confirmDeleteId) return;
    try {
      setIsDeleting(true);
      await deleteDoc(
        doc(db, "faqs", user.companyId, "list", confirmDeleteId)
      );
      setConfirmDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  /* ─────────── helpers ─────────── */
  const safeForCsv = (str = "") => str.replace(/^(=|\+|-|@)/, "’$1"); // formula-injection guard
  const toggleExpand = (id) =>
    setExpandedFAQ((prev) => (prev === id ? null : id));

  /* ─────────── export CSV ─────────── */
  const exportToCSV = () => {
    const rows = [["Question", "Answer", "Created At"]];
    (faqs || []).forEach((f) =>
      rows.push([
        `"${safeForCsv(f.q).replace(/"/g, '""')}"`,
        `"${safeForCsv(f.a).replace(/"/g, '""')}"`,
        f.createdAt?.toDate?.()?.toLocaleString?.() || "N/A",
      ])
    );
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "faqs.csv";
    link.click();
  };

  /* ─────────── export PDF ─────────── */
  const exportToPDF = () => {
    const docx = new jsPDF();
    docx.text("📋 FAQs Report", 14, 20);
    autoTable(docx, {
      head: [["Question", "Answer", "Created / Updated"]],
      body: (faqs || []).map((f) => [
        f.q || "",
        f.a || "",
        (f.updatedAt || f.createdAt)?.toDate?.()?.toLocaleString?.() || "N/A",
      ]),
      styles: { cellWidth: "wrap" },
      columnStyles: { 0: { cellWidth: 70 }, 1: { cellWidth: 100 }, 2: { cellWidth: 35 } },
      startY: 28,
    });
    docx.save("faqs.pdf");
  };

  /* ─────────── CSV import ─────────── */
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    setImportProgress(0);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async ({ data }) => {
        const rows = Array.isArray(data) ? data : [];
        const total = rows.length || 1;
        let ok = 0;
        let skipped = 0;

        rows.sort((a, b) =>
          (a.Question || "").localeCompare(b.Question || "")
        );

        const BATCH_SIZE = 400;
        let batch = writeBatch(db);
        let batchCount = 0;

        for (const row of rows) {
          const q = (row["Question"] || "").trim();
          const a = (row["Answer"] || "").trim();
          if (!q || !a) continue;

          const dup = faqs.some(
            (f) =>
              f.q?.toLowerCase().trim() === q.toLowerCase() &&
              f.a?.toLowerCase().trim() === a.toLowerCase()
          );
          if (dup) {
            skipped++;
            setImportProgress(Math.round(((ok + skipped) / total) * 100));
            continue;
          }

          batch.set(
            doc(collection(db, "faqs", user.companyId, "list")),
            {
              q: DOMPurify.sanitize(q),
              a: DOMPurify.sanitize(a),
              createdAt: serverTimestamp(),
            }
          );
          ok++;
          batchCount++;

          if (batchCount === BATCH_SIZE) {
            await batch.commit();
            batch = writeBatch(db);
            batchCount = 0;
          }
          setImportProgress(Math.round(((ok + skipped) / total) * 100));
        }

        if (batchCount) await batch.commit();
        setImportProgress(100);
        alert(`✅ Imported ${ok} FAQ(s). Skipped ${skipped} duplicate(s).`);
      },
    });
  };

  /* ─────────────────────────────── UI ─────────────────────────────── */
  return (
    <Glass className="p-6 md:p-8 text-white/90">
      {/* header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          📋 Manage FAQs
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <IconBtn onClick={exportToCSV} title="Export CSV">
            ⬇️ CSV
          </IconBtn>
          <IconBtn onClick={exportToPDF} title="Export PDF">
            📄 PDF
          </IconBtn>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 hover:bg-white/10">
            📤 Import CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {/* search & sort */}
      <div className="mt-4 grid items-center gap-3 md:grid-cols-[1fr_auto_auto]">
        <input
          type="text"
          placeholder="🔍 Search FAQs…"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40"
        />

        <div className="flex items-center justify-end gap-2">
          <ChipToggle
            active={sortBy === "date"}
            onClick={() => setSortBy("date")}
          >
            📅 Date
          </ChipToggle>
          <ChipToggle
            active={sortBy === "question"}
            onClick={() => setSortBy("question")}
          >
            🔤 A–Z
          </ChipToggle>
        </div>

        {importProgress > 0 && importProgress < 100 && (
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 transition-all"
              style={{ width: `${importProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* list */}
      <div className="mt-5 grid gap-3">
        {currentFaqs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/60">
            No FAQs yet. Add your first one below!
          </div>
        ) : (
          currentFaqs.map((faq) => {
            const open = expandedFAQ === faq.id;
            const isEditing = editId === faq.id;

            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left hover:bg-white/5"
                >
                  <div className="font-medium text-white/90">
                    <span className="opacity-70">Q:</span> {faq.q}
                  </div>
                  <span className="text-white/60">{open ? "▲" : "▼"}</span>
                </button>

                {open && (
                  <div className="border-t border-white/10 px-5 pb-5 pt-2">
                    {isEditing ? (
                      <div className="grid gap-3">
                        <input
                          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40"
                          value={editQuestion}
                          onChange={(e) => setEditQuestion(e.target.value)}
                          placeholder="Edit question"
                        />
                        <textarea
                          rows={3}
                          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40"
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                          placeholder="Edit answer"
                        />
                        <div className="flex items-center gap-2">
                          <IconBtn onClick={saveEdit} disabled={isSaving}>
                            💾 Save
                          </IconBtn>
                          <IconBtn onClick={cancelEdit}>❌ Cancel</IconBtn>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-white/80">
                          <span className="opacity-70">A:</span> {faq.a}
                        </div>
                        <div className="mt-2 text-xs text-white/50">
                          {faq.updatedAt ? "Updated" : "Created"}:&nbsp;
                          {(faq.updatedAt || faq.createdAt)
                            ?.toDate?.()
                            ?.toLocaleString?.() || "N/A"}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <IconBtn onClick={() => startEdit(faq)}>
                            ✏️ Edit
                          </IconBtn>
                          <IconBtn
                            onClick={() => setConfirmDeleteId(faq.id)}
                            className="border-rose-400/30 text-rose-200"
                          >
                            🗑️ Delete
                          </IconBtn>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <IconBtn
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ◀ Prev
          </IconBtn>
          <span className="text-sm text-white/70">
            Page {currentPage} of {totalPages}
          </span>
          <IconBtn
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next ▶
          </IconBtn>
        </div>
      )}

      {/* add new */}
      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40"
        />
        <input
          type="text"
          placeholder="Enter answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40"
        />
        <button
          onClick={addFAQ}
          disabled={isSaving}
          className={`rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-3 text-sm font-medium shadow hover:from-fuchsia-400 hover:to-indigo-400 active:scale-[0.98] transition ${
            isSaving ? "opacity-60" : ""
          }`}
        >
          ➕ Add FAQ
        </button>
      </div>

      {/* delete confirm */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-white shadow-2xl">
            <h3 className="text-lg font-semibold text-rose-200">
              ⚠️ Confirm Deletion
            </h3>
            <p className="mt-1 text-sm text-white/70">
              Are you sure you want to delete this FAQ?
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <IconBtn onClick={() => setConfirmDeleteId(null)}>Cancel</IconBtn>
              <IconBtn
                onClick={handleDelete}
                disabled={isDeleting}
                className="border-rose-400/30 text-rose-200"
              >
                {isDeleting ? "Deleting…" : "Yes, Delete"}
              </IconBtn>
            </div>
          </div>
        </div>
      )}
    </Glass>
  );
};

export default FAQForm;
