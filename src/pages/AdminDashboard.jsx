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
import "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  useEffect(() => {
    if (!user || role !== "admin") navigate("/");
  }, [user, role, navigate]);

  useEffect(() => {
    const fetchUsage = async () => {
      const usageSnap = await getDocs(collection(db, "usage"));
      const userSnap = await getDocs(collection(db, "users"));

      const userMap = {};
      userSnap.forEach((doc) => {
        userMap[doc.id] = doc.data();
      });

      const data = usageSnap.docs.map((doc) => {
        const usage = doc.data();
        const userMeta = userMap[doc.id] || {};
        return {
          userId: doc.id,
          tokensUsed: usage.tokensUsed || 0,
          lastReset: usage.lastReset,
          email: userMeta.email || "N/A",
          tier: userMeta.tier || "free",
        };
      });

      setUsageData(data);
      setFilteredData(data);
    };

    fetchUsage();
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
      filtered = filtered.filter((u) => u.tier !== "free");
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

  const resetTokens = async (userId) => {
    const usageRef = doc(db, "usage", userId);
    await updateDoc(usageRef, {
      tokensUsed: 0,
      lastReset: Timestamp.now(),
    });
    setUsageData((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, tokensUsed: 0 } : u))
    );
  };

  const exportCSV = () => {
    const rows = [
      ["User ID", "Email", "Tier", "Tokens Used", "Last Reset"],
      ...filteredData.map((u) => [
        u.userId,
        u.email,
        u.tier,
        u.tokensUsed,
        u.lastReset?.toDate?.().toDateString?.() || "N/A",
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
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("📊 AI Chatbot Usage Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Exported on ${new Date().toDateString()}`, 14, 28);

    const tableColumn = ["User ID", "Email", "Tier", "Tokens Used", "Last Reset"];
    const tableRows = filteredData.map((u) => [
      u.userId,
      u.email,
      u.tier,
      u.tokensUsed,
      u.lastReset?.toDate?.().toDateString?.() || "N/A",
    ]);

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 35 });
    doc.save("user_usage_report.pdf");
  };

  const paginated = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">📊 User Usage Overview</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by email or UID"
          className="px-4 py-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyPaid}
            onChange={(e) => setOnlyPaid(e.target.checked)}
          />
          Only Paid Users
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Start Date"
          className="px-2 py-1 border rounded"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="End Date"
          className="px-2 py-1 border rounded"
        />
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ⬇️ Export CSV
        </button>
        <button
          onClick={exportPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          📄 Export PDF
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Usage Graph</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="email" interval={0} angle={-20} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tokensUsed" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Plan</th>
              <th className="px-4 py-2">Tokens Used</th>
              <th className="px-4 py-2">Last Reset</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((u) => (
              <tr key={u.userId} className={u.tokensUsed > 1000 ? "bg-yellow-50" : ""}>
                <td className="px-4 py-2 font-mono text-xs">{u.userId}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">
                  <select
                    value={u.tier}
                    onChange={(e) => updateTier(u.userId, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </td>
                <td className="px-4 py-2">{u.tokensUsed}</td>
                <td className="px-4 py-2">{u.lastReset?.toDate?.().toDateString?.() || "N/A"}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => resetTokens(u.userId)}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Reset
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            ◀ Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}
