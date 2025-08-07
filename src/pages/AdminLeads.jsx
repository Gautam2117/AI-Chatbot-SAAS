// src/pages/AdminLeads.jsx
import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import {
  FaDownload,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaRegCopy,
} from "react-icons/fa";

/* --- tiny toast (no extra deps) --- */
function useToast() {
  const [notice, setNotice] = useState(null);
  const show = (type, message, ms = 2400) => {
    setNotice({ type, message });
    if (ms) setTimeout(() => setNotice(null), ms);
  };
  const Toast = () =>
    !notice ? null : (
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 text-sm rounded-xl shadow-xl backdrop-blur-md
        ${
          notice.type === "error"
            ? "bg-rose-600/90 text-white"
            : notice.type === "warn"
            ? "bg-amber-600/90 text-white"
            : "bg-emerald-600/90 text-white"
        }`}
      >
        {notice.message}
      </div>
    );
  return { Toast, show };
}

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // search & paging
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const leadsPerPage = 10;

  // modal for viewing a single lead
  const [activeLead, setActiveLead] = useState(null);

  const { Toast, show } = useToast();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "leads"),
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // newest first if timestamp exists
        fetched.sort(
          (a, b) => (b?.timestamp?.seconds || 0) - (a?.timestamp?.seconds || 0)
        );
        setLeads(fetched);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  const filteredLeads = useMemo(() => {
    if (!debouncedSearch) return leads;
    return leads.filter(
      (lead) =>
        lead.name?.toLowerCase().includes(debouncedSearch) ||
        lead.email?.toLowerCase().includes(debouncedSearch) ||
        lead.message?.toLowerCase().includes(debouncedSearch)
    );
  }, [leads, debouncedSearch]);

  useEffect(() => setPage(1), [debouncedSearch, leads]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / leadsPerPage));
  const pageSafe = Math.min(page, totalPages);
  const paginated = filteredLeads.slice(
    (pageSafe - 1) * leadsPerPage,
    pageSafe * leadsPerPage
  );

  const fmt = (ts) => {
    if (!ts?.seconds) return "—";
    try {
      return new Date(ts.seconds * 1000).toLocaleString();
    } catch {
      return "—";
    }
  };

  const copy = async (text, label = "Copied") => {
    try {
      const MAX = 15_000_000; //  ~15 MB
      const out = (text || "").slice(0, MAX);
      await navigator.clipboard.writeText(out);
      if (text.length > MAX) show("warn", "Copied (truncated)");
      show("success", `${label}!`);
    } catch {
      show("warn", "Copy failed");
    }
  };

  const downloadCSV = () => {
    const esc = (s = "") => `"${String(s).replace(/"/g, '""')}"`;
    const headers = ["Name", "Email", "Message", "Timestamp"];
    const rows = filteredLeads.map((l) => [
      esc(l.name),
      esc(l.email),
      esc(l.message),
      esc(fmt(l.timestamp)),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `botify_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(99,102,241,.18),transparent),radial-gradient(1000px_500px_at_80%_0,rgba(236,72,153,.18),transparent)]">
      <Toast />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 grid place-items-center text-white shadow-lg">
            🤖
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-900">Leads Inbox</h1>
            <p className="text-indigo-800/70 -mt-0.5">Capture, review, and export your leads.</p>
          </div>
        </div>

        {/* Controls */}
        <div className="sticky top-2 z-40">
          <div className="bg-white/85 backdrop-blur-xl border border-white/60 shadow rounded-2xl p-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="relative flex-1 min-w-[260px]">
                <FaSearch className="absolute top-3 left-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or message…"
                  className="w-full pl-10 pr-4 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-indigo-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-full hover:bg-emerald-700 transition"
              >
                <FaDownload /> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="mt-6 bg-white shadow-xl rounded-2xl border border-white/60 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-indigo-50/90 text-indigo-700 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Message</th>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-3">
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center text-gray-500">
                      <div className="inline-flex items-center gap-2">
                        <span>😶‍🌫️</span>
                        <span>No leads found.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((lead) => (
                    <tr key={lead.id} className="border-t align-top">
                      <td className="px-4 py-3">
                        <div className="font-medium text-indigo-900">{lead.name || "—"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-indigo-700 hover:underline break-all"
                          >
                            {lead.email || "—"}
                          </a>
                          {lead.email && (
                            <button
                              className="p-1 rounded hover:bg-indigo-50"
                              onClick={() => copy(lead.email, "Email copied")}
                              title="Copy email"
                            >
                              <FaRegCopy className="text-indigo-600" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-700 line-clamp-3 max-w-[520px]">
                          {lead.message || "—"}
                        </div>
                        {lead.message && lead.message.length > 160 && (
                          <button
                            className="mt-1 text-indigo-600 text-xs underline"
                            onClick={() => setActiveLead(lead)}
                          >
                            View full
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{fmt(lead.timestamp)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}?subject=Re:%20Your%20inquiry&body=Hi%20${encodeURIComponent(
                                lead.name || ""
                              )},%0D%0A%0D%0AThanks%20for%20reaching%20out!`}
                              className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700"
                            >
                              Reply
                            </a>
                          )}
                          {lead.email && (
                            <button
                              onClick={() =>
                                copy(
                                  `${lead.name || ""} <${lead.email}>`,
                                  "Contact copied"
                                )
                              }
                              className="text-xs bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300"
                            >
                              Copy contact
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filteredLeads.length > 0 && (
            <div className="px-4 py-3 flex justify-between items-center">
              <button
                disabled={pageSafe === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
              >
                <FaArrowLeft /> Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {pageSafe} of {totalPages}
              </span>
              <button
                disabled={pageSafe === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
              >
                Next <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* View modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-indigo-900">Lead details</h3>
              <button
                onClick={() => setActiveLead(null)}
                className="rounded-full bg-gray-100 px-3 py-1 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div>
                <div className="text-gray-500">Name</div>
                <div className="font-medium">{activeLead.name || "—"}</div>
              </div>
              <div>
                <div className="text-gray-500">Email</div>
                <div className="font-medium break-all">{activeLead.email || "—"}</div>
              </div>
              <div>
                <div className="text-gray-500">Received</div>
                <div className="font-medium">{fmt(activeLead.timestamp)}</div>
              </div>
              <div>
                <div className="text-gray-500">Message</div>
                <div className="font-medium whitespace-pre-wrap break-words">
                  {activeLead.message || "—"}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {activeLead.email && (
                <a
                  href={`mailto:${activeLead.email}`}
                  className="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                  Reply
                </a>
              )}
              <button
                onClick={() => {
                  copy(
                    `${activeLead.name || ""} <${activeLead.email || ""}>\n\n${activeLead.message || ""}`,
                    "Lead copied"
                  );
                }}
                className="rounded-full bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeads;
