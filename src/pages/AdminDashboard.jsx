// src/pages/AdminDashboard.jsx
import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import { db } from "../firebase";
import {
  collection, getDocs, doc, updateDoc, Timestamp, query, orderBy,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  FaDownload, FaSearch, FaArrowLeft, FaArrowRight, FaExclamationTriangle,
} from "react-icons/fa";
import { MdOutlineFilterAlt } from "react-icons/md";

/* ---------------- Toast ---------------- */
function useToast() {
  const [notice, setNotice] = useState(null);
  const show = (type, message, ms = 2600) => {
    setNotice({ type, message });
    if (ms) setTimeout(() => setNotice(null), ms);
  };
  const Toast = () =>
    !notice ? null : (
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 text-sm rounded-xl shadow-xl
        ${notice.type === "error" ? "bg-rose-600/90 text-white"
          : notice.type === "warn" ? "bg-amber-600/90 text-white"
          : "bg-emerald-600/90 text-white"}`}
      >
        {notice.message}
      </div>
    );
  return { Toast, show };
}

const Badge = ({ tone = "gray", children }) => {
  const map = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-full ${map[tone] || map.gray}`}>
      {children}
    </span>
  );
};

const Chip = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full border transition
      ${active ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
               : "bg-white text-indigo-900 border-indigo-200 hover:bg-indigo-50"}`}
  >
    {children}
  </button>
);

const AssistantHint = ({ children }) => (
  <div className="relative rounded-2xl p-4 bg-white border border-indigo-100 shadow-sm">
    <div className="absolute -top-2 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 grid place-items-center text-white text-sm shadow">
      🤖
    </div>
    <div className="pl-10 text-sm text-indigo-900/80">{children}</div>
  </div>
);

export default function AdminDashboard() {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const { Toast, show } = useToast();

  // data
  const [rows, setRows] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [onlyPaid, setOnlyPaid] = useState(false);
  const [tierFilter, setTierFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sort, setSort] = useState({ field: "tokensUsed", dir: "desc" });

  const rowsPerPage = 10;
  const [page, setPage] = useState(1);

  // --- Fix #1: prevent double fetch in React 18 dev ---
  const didFetch = useRef(false);

  useEffect(() => {
    if (!user || role !== "admin") navigate("/");
  }, [user, role, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const load = async () => {
      setLoading(true);
      try {
        const [usersSnap, companiesSnap] = await Promise.all([
          getDocs(query(collection(db, "users"))),
          getDocs(query(collection(db, "companies"), orderBy("name"))),
        ]);

        const companyMap = {};
        const companyList = [];
        companiesSnap.forEach((d) => {
          const data = d.data();
          companyMap[d.id] = { id: d.id, ...data };
          companyList.push({ id: d.id, name: data?.name || "—" });
        });

        const result = [];
        usersSnap.forEach((d) => {
          const u = d.data();
          const company = u.companyId ? companyMap[u.companyId] : null;
          result.push({
            userId: d.id,
            email: u.email || "—",
            companyId: u.companyId || null,
            companyName: company?.name || "No Company",
            tier: company?.tier || "free",
            tokensUsed: company?.tokensUsedToday || 0,
            companyUsage: company?.tokensUsedToday || 0,
            lastReset: company?.lastReset || null,
            status: company?.status || "pending",
          });
        });

        setRows(result);
        setCompanies(companyList);
      } catch {
        show("error", "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [show]);

  // KPIs
  const kpis = useMemo(() => {
    const totalUsers = rows.length;
    const paidUsers = rows.filter((r) => r.tier !== "free").length;
    const tokensToday = rows.reduce((s, r) => s + (r.tokensUsed || 0), 0);
    const companiesCount = new Set(rows.map((r) => r.companyId).filter(Boolean)).size;
    return { totalUsers, paidUsers, tokensToday, companiesCount };
  }, [rows]);

  // filtering + sorting
  const filtered = useMemo(() => {
    let out = [...rows];

    if (debouncedSearch) {
      out = out.filter(
        (r) =>
          r.email.toLowerCase().includes(debouncedSearch) ||
          r.userId.toLowerCase().includes(debouncedSearch)
      );
    }
    if (onlyPaid) out = out.filter((r) => r.tier && r.tier !== "free");
    if (tierFilter !== "all") out = out.filter((r) => r.tier === tierFilter);
    if (companyFilter !== "all") out = out.filter((r) => r.companyId === companyFilter);
    if (startDate && endDate) {
      out = out.filter((r) => {
        const d = r.lastReset?.toDate?.() || null;
        return d && d >= startDate && d <= endDate;
      });
    }

    out.sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      switch (sort.field) {
        case "email":
          return a.email.localeCompare(b.email) * dir;
        case "tier":
          return (a.tier || "").localeCompare(b.tier || "") * dir;
        case "companyName":
          return (a.companyName || "").localeCompare(b.companyName || "") * dir;
        case "tokensUsed":
        default:
          return (a.tokensUsed - b.tokensUsed) * dir;
      }
    });
    return out;
  }, [
    rows, debouncedSearch, onlyPaid, tierFilter, companyFilter, startDate, endDate, sort.field, sort.dir,
  ]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const pageSafe = Math.min(page, totalPages);
  const paginated = filtered.slice((pageSafe - 1) * rowsPerPage, pageSafe * rowsPerPage);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, onlyPaid, tierFilter, companyFilter, startDate, endDate]);

  // actions
  const updateCompanyTier = async (companyId, newTier) => {
    if (!companyId) return show("error", "Missing company for this user.");
    const ref = doc(db, "companies", companyId);
    const prev = rows;
    const next = rows.map((r) => (r.companyId === companyId ? { ...r, tier: newTier } : r));
    setRows(next);
    try {
      await updateDoc(ref, { tier: newTier });
      show("success", "Plan updated.");
    } catch {
      setRows(prev);
      show("error", "Failed to update plan.");
    }
  };

  const [confirm, setConfirm] = useState(null);
  const resetTokens = async (companyId, scope = "daily") => {
    if (!companyId) return;
    const ref = doc(db, "companies", companyId);

    const prev = rows;
    const next = rows.map((r) =>
      r.companyId === companyId
        ? {
            ...r,
            tokensUsed: scope === "daily" ? 0 : r.tokensUsed,
            companyUsage: scope === "daily" ? 0 : r.companyUsage,
            lastReset: scope === "daily" ? Timestamp.now() : r.lastReset,
          }
        : r
    );
    setRows(next);

    try {
      if (scope === "daily") {
        await updateDoc(ref, { tokensUsedToday: 0, lastReset: Timestamp.now() });
      } else {
        await updateDoc(ref, { tokensUsedThisMonth: 0, monthlyUsageReset: Timestamp.now() });
      }
      show("success", `Tokens reset (${scope}).`);
    } catch {
      setRows(prev);
      show("error", "Failed to reset tokens.");
    } finally {
      setConfirm(null);
    }
  };

  // export helpers (unchanged)
  const exportCSV = () => {
    const rowsOut = [
      ["User ID", "Email", "Company", "Tier", "Tokens Today", "Last Reset"],
      ...filtered.map((r) => [
        r.userId,
        `"${r.email.replace(/"/g, '""')}"`,
        `"${(r.companyName || "None").replace(/"/g, '""')}"`,
        r.tier,
        r.tokensUsed,
        r.lastReset?.toDate?.().toISOString?.().slice(0, 19).replace("T", " ") || "N/A",
      ]),
    ];
    const csv = rowsOut.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "botify_usage.csv";
    a.click();
  };

  const exportPDF = () => {
    const docPDF = new jsPDF({ unit: "pt" });
    docPDF.setFontSize(16);
    docPDF.text("AI Chatbot Usage Report", 40, 40);
    docPDF.setFontSize(10);
    docPDF.text(`Exported: ${new Date().toLocaleString()}`, 40, 58);

    autoTable(docPDF, {
      head: [["User ID", "Email", "Company", "Tier", "Tokens Today", "Last Reset"]],
      body: filtered.map((r) => [
        r.userId,
        r.email,
        r.companyName || "None",
        r.tier,
        String(r.tokensUsed),
        r.lastReset?.toDate?.().toLocaleString?.() || "N/A",
      ]),
      startY: 80,
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [124, 58, 237] },
    });
    docPDF.save("botify_usage.pdf");
  };

  const SortBtn = ({ field, children }) => (
    <button
      className="inline-flex items-center gap-1 hover:underline"
      onClick={() =>
        setSort((s) =>
          s.field === field ? { field, dir: s.dir === "asc" ? "desc" : "asc" } : { field, dir: "desc" }
        )
      }
      title="Sort"
    >
      {children}
      <span className="text-[10px] opacity-60">
        {sort.field === field ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}
      </span>
    </button>
  );

  return (
    <div className="relative min-h-screen p-6 md:p-10 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(99,102,241,.18),transparent),radial-gradient(1000px_500px_at_80%_0,rgba(236,72,153,.18),transparent)]">
      <Toast />

      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 grid place-items-center text-white shadow-lg">
            🤖
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 drop-shadow-sm">
              Admin Analytics
            </h1>
            <p className="text-indigo-800/70 -mt-0.5">Monitor usage, manage plans, keep things humming.</p>
          </div>
        </div>

        <div className="mt-6">
          <AssistantHint>
            Tip: Filter by <strong>plan</strong> and <strong>company</strong>, then export the exact view to CSV/PDF.
            You can also set a plan at the <em>company</em> level—updates apply to all users of that org.
          </AssistantHint>
        </div>

        {/* KPI cards (reduced animation to avoid repaint flicker) */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: kpis.totalUsers },
            { label: "Paid Users", value: kpis.paidUsers },
            { label: "Tokens Today", value: kpis.tokensToday },
            { label: "Companies", value: kpis.companiesCount },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl p-[1.2px] bg-gradient-to-br from-fuchsia-400/60 to-indigo-400/60">
              <div className="rounded-2xl bg-white border border-indigo-100 p-4">
                <div className="text-xs uppercase tracking-wide text-indigo-700/80">{k.label}</div>
                <div className="text-2xl font-extrabold text-indigo-900 mt-1">{k.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Controls — solid bg, own layer */}
        <div
          className="mt-6 sticky top-2 z-40"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        >
          <div className="rounded-2xl bg-white border border-indigo-100 shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3 items-center">
              <div className="xl:col-span-2 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search email or UID"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-indigo-200 focus:ring-2 focus:ring-indigo-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Chip active={tierFilter === "all"} onClick={() => setTierFilter("all")}>All</Chip>
                <Chip active={tierFilter === "free"} onClick={() => setTierFilter("free")}>Free</Chip>
                <Chip active={tierFilter === "pro"} onClick={() => setTierFilter("pro")}>Pro</Chip>
                <Chip active={tierFilter === "pro-max"} onClick={() => setTierFilter("pro-max")}>Pro Max</Chip>
              </div>

              <select
                className="rounded-full bg-white border border-indigo-200 py-2 px-3 focus:ring-2 focus:ring-indigo-400"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              >
                <option value="all">All companies</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <DatePicker
                selected={startDate}
                onChange={(d) => setStartDate(d)}
                placeholderText="Start date"
                className="rounded-full bg-white border border-indigo-200 py-2 px-3 focus:ring-2 focus:ring-indigo-400"
              />
              <DatePicker
                selected={endDate}
                onChange={(d) => setEndDate(d)}
                placeholderText="End date"
                className="rounded-full bg-white border border-indigo-200 py-2 px-3 focus:ring-2 focus:ring-indigo-400"
              />

              <label className="inline-flex items-center gap-2">
                <MdOutlineFilterAlt className="text-indigo-600 text-xl" />
                <input
                  type="checkbox"
                  className="accent-indigo-600"
                  checked={onlyPaid}
                  onChange={(e) => setOnlyPaid(e.target.checked)}
                />
                <span className="text-sm font-medium text-indigo-900">Only paid</span>
              </label>
            </div>

            <div className="mt-3 flex flex-wrap gap-3 justify-end">
              <button onClick={() => navigate("/admin/leads")} className="rounded-full bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700">
                📥 View Leads
              </button>
              <button onClick={() => navigate("/admin/settings")} className="rounded-full bg-purple-600 text-white px-4 py-2 hover:bg-purple-700">
                ⚙️ Bot Settings
              </button>
              <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700">
                <FaDownload /> CSV
              </button>
              <button onClick={exportPDF} className="inline-flex items-center gap-2 rounded-full bg-sky-600 text-white px-4 py-2 hover:bg-sky-700">
                <FaDownload /> PDF
              </button>
            </div>
          </div>
        </div>

        {/* Chart (solid bg, higher z) */}
        <div className="mt-6 rounded-2xl border border-indigo-100 bg-white p-4 z-10 relative">
          <h2 className="text-lg font-bold text-indigo-900 mb-2">📊 Token Usage (Today)</h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filtered.slice(0, 30)} margin={{ top: 8, right: 16, left: -16, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="email" interval={0} angle={-25} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tokensUsed" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table (solid bg, higher z) */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-indigo-100 bg-white z-10 relative">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-indigo-50">
                <tr className="text-indigo-900">
                  <th className="px-4 py-3 text-left"><SortBtn field="userId">User ID</SortBtn></th>
                  <th className="px-4 py-3 text-left"><SortBtn field="email">Email</SortBtn></th>
                  <th className="px-4 py-3 text-left"><SortBtn field="companyName">Company</SortBtn></th>
                  <th className="px-4 py-3 text-left"><SortBtn field="tier">Plan</SortBtn></th>
                  <th className="px-4 py-3 text-left"><SortBtn field="tokensUsed">Tokens Today</SortBtn></th>
                  <th className="px-4 py-3 text-left">Last Reset</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-t">
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-10 text-center">
                      <div className="inline-flex items-center gap-2 text-indigo-700">
                        <span>😶‍🌫️</span>
                        <span>No records match your filters.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((r) => (
                    <tr key={r.userId} className={`border-t ${r.tokensUsed > 1000 ? "bg-yellow-50/60" : ""}`}>
                      <td className="px-4 py-2 font-mono text-[11px] text-gray-600">{r.userId}</td>
                      <td className="px-4 py-2">{r.email}</td>
                      <td className="px-4 py-2">{r.companyName}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Badge tone={r.tier === "pro-max" ? "purple" : r.tier === "pro" ? "green" : "gray"}>
                            {r.tier === "pro-max" ? "Pro Max" : r.tier.charAt(0).toUpperCase() + r.tier.slice(1)}
                          </Badge>
                          {r.companyId && (
                            <select
                              value={r.tier}
                              onChange={(e) => updateCompanyTier(r.companyId, e.target.value)}
                              className="border rounded-full px-2 py-1 focus:ring-1 focus:ring-indigo-400 text-xs"
                            >
                              <option value="free">Free</option>
                              <option value="pro">Pro</option>
                              <option value="pro-max">Pro Max</option>
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2">{r.tokensUsed}</td>
                      <td className="px-4 py-2">{r.lastReset?.toDate?.().toLocaleString?.() || "N/A"}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setConfirm({ companyId: r.companyId, scope: "daily" })}
                            className="text-xs bg-rose-500 text-white px-2 py-1 rounded-full hover:bg-rose-600"
                            disabled={!r.companyId}
                            title="Reset today's tokens"
                          >
                            Reset Daily
                          </button>
                          <button
                            onClick={() => setConfirm({ companyId: r.companyId, scope: "monthly" })}
                            className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full hover:bg-amber-600"
                            disabled={!r.companyId}
                            title="Reset monthly tokens"
                          >
                            Reset Monthly
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 flex justify-between items-center">
            <button
              disabled={pageSafe === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
            >
              <FaArrowLeft /> Prev
            </button>
            <span className="text-sm text-gray-600">Page {pageSafe} of {totalPages}</span>
            <button
              disabled={pageSafe === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
            >
              Next <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-600 font-bold">
              <FaExclamationTriangle /> Confirm Reset
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Are you sure you want to reset{" "}
              <strong>{confirm.scope === "daily" ? "today’s tokens" : "this month’s tokens"}</strong>{" "}
              for this company? This action cannot be undone.
            </p>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setConfirm(null)} className="rounded-full bg-gray-200 px-4 py-2 hover:bg-gray-300">
                Cancel
              </button>
              <button
                onClick={() => resetTokens(confirm.companyId, confirm.scope)}
                className={`rounded-full px-4 py-2 text-white ${
                  confirm.scope === "daily" ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                Reset {confirm.scope === "daily" ? "Daily" : "Monthly"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
