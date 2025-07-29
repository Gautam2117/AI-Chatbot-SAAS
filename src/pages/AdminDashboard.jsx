import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaDownload,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { MdOutlineFilterAlt } from "react-icons/md";

export default function AdminDashboard() {
  const { user, role } = useContext(AuthContext);
  const [usageData, setUsageData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyPaid, setOnlyPaid] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortField, setSortField] = useState("tokensUsed");
  const navigate = useNavigate();
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    if (!user || role !== "admin") navigate("/");
  }, [user, role, navigate]);

  useEffect(() => {
    const fetchAllData = async () => {
      const [usageSnap, userSnap, companySnap] = await Promise.all([
        getDocs(collection(db, "usage")),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "companies")),
      ]);

      const userMap = {};
      userSnap.forEach((doc) => {
        userMap[doc.id] = doc.data();
      });

      const companyMap = {};
      companySnap.forEach((doc) => {
        companyMap[doc.id] = doc.data();
      });

      const data = userSnap.docs.map((doc) => {
      const user = doc.data();
      const companyId = user.companyId || null;
      const company = companyId ? companyMap[companyId] : null;

      return {
        userId: doc.id,
        email: user.email || "N/A",
        tier: company?.tier || "free",
        tokensUsed: company?.tokensUsedToday || 0,
        lastReset: company?.lastReset || null,
        companyId,
        companyName: company?.name || "No Company",
        companyUsage: company?.tokensUsedToday || 0,
      };
    });

      setUsageData(data);
      setFilteredData(data);
      setCompanies(Object.values(companyMap));
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    let filtered = [...usageData];

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (onlyPaid) {
      filtered = filtered.filter((u) => u.tier && u.tier !== "free");
    }

    if (startDate && endDate) {
      filtered = filtered.filter((u) => {
        const date = u.lastReset?.toDate?.();
        return date >= startDate && date <= endDate;
      });
    }

    filtered.sort((a, b) => {
      if (sortField === "tokensUsed") return b.tokensUsed - a.tokensUsed;
      if (sortField === "tier") return (b.tier || "").localeCompare(a.tier || "");
      return 0;
    });

    setFilteredData(filtered);
  }, [searchTerm, onlyPaid, usageData, startDate, endDate, sortField]);

  const updateTier = async (userId, newTier) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { tier: newTier });
    setUsageData((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, tier: newTier } : u))
    );
  };

  const resetTokens = async (companyId) => {
    const companyRef = doc(db, "companies", companyId);
    await updateDoc(companyRef, {
      tokensUsedToday: 0,
      lastReset: Timestamp.now(),
    });

    setUsageData((prev) =>
      prev.map((u) =>
        u.companyId === companyId ? { ...u, tokensUsed: 0, lastReset: Timestamp.now() } : u
      )
    );
  };

  const exportCSV = () => {
    const rows = [
      ["User ID", "Email", "Tier", "Tokens Used", "Last Reset", "Company", "Company Usage"],
      ...filteredData.map((u) => [
        u.userId,
        `"${u.email.replace(/"/g, '""')}"`,
        `"${u.tier.replace(/"/g, '""')}"`,
        u.tokensUsed,
        u.lastReset?.toDate?.().toDateString?.() || "N/A",
        u.companyName || "None",
        u.companyUsage || 0,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "user_usage.csv";
    a.click();
  };

  const exportPDF = () => {
    const docPDF = new jsPDF();
    docPDF.setFontSize(18);
    docPDF.text("📊 AI Chatbot Usage Report", 14, 20);
    docPDF.setFontSize(12);
    docPDF.text(`Exported on ${new Date().toDateString()}`, 14, 28);

    const tableColumn = ["User ID", "Email", "Tier", "Tokens", "Last Reset", "Company", "Company Tokens"];
    const tableRows = filteredData.map((u) => [
      u.userId,
      u.email,
      u.tier,
      u.tokensUsed,
      u.lastReset?.toDate?.().toDateString?.() || "N/A",
      u.companyName || "None",
      u.companyUsage || 0,
    ]);

    autoTable(docPDF, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
    });

    docPDF.save("user_usage_report.pdf");
  };

  const paginated = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6 md:p-10">
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 drop-shadow-lg mb-8">
        🚀 Botify Admin Analytics Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email or UID"
            className="pl-10 pr-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Start Date"
          className="px-4 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-indigo-400"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="End Date"
          className="px-4 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-indigo-400"
        />
        <label className="flex items-center gap-2">
          <MdOutlineFilterAlt className="text-indigo-500 text-xl" />
          <input
            type="checkbox"
            checked={onlyPaid}
            onChange={(e) => setOnlyPaid(e.target.checked)}
          />
          <span className="text-sm font-medium text-gray-700">Only Paid Users</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-3 justify-end mb-6">
        <button
          onClick={() => navigate("/admin/leads")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition"
        >
          📥 View Leads
        </button>
        <button
          onClick={() => navigate("/admin/settings")}
          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 transition"
        >
          ⚙️ Bot Settings
        </button>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition"
        >
          <FaDownload /> CSV
        </button>
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
        >
          <FaDownload /> PDF
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-xl mb-10">
        <h2 className="text-lg font-bold mb-4 text-indigo-700">📊 Token Usage Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="email" interval={0} angle={-25} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tokensUsed" fill="#7C3AED" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-indigo-50">
            <tr>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Tokens Used</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Company Tokens</th>
              <th className="px-4 py-3">Last Reset</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((u) => (
              <tr key={u.userId} className={`border-t ${u.tokensUsed > 1000 ? "bg-yellow-50" : ""}`}>
                <td className="px-4 py-2 font-mono text-xs text-gray-600">{u.userId}</td>
                <td className="px-4 py-2">{u.email}</td>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  u.tier === "pro-max" ? "bg-purple-100 text-purple-700" :
                  u.tier === "pro" ? "bg-green-100 text-green-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {u.tier === "pro-max" ? "Pro Max" : u.tier.charAt(0).toUpperCase() + u.tier.slice(1)}
                </span>

                <td className="px-4 py-2">
                  <select
                    value={u.tier}
                    onChange={(e) => updateTier(u.userId, e.target.value)}
                    className="border rounded-full px-2 py-1 focus:ring-1 focus:ring-indigo-400"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="pro-max">Pro Max</option>
                  </select>
                </td>
                <td className="px-4 py-2">{u.tokensUsed}</td>
                <td className="px-4 py-2">{u.companyName}</td>
                <td className="px-4 py-2">{u.companyUsage}</td>
                <td className="px-4 py-2">{u.lastReset?.toDate?.().toDateString?.() || "N/A"}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => resetTokens(u.companyId)}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition"
                  >
                    Reset
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 px-4 py-3 flex justify-between items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
          >
            <FaArrowLeft /> Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
          >
            Next <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
