import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AdminDashboard() {
  const { user, role } = useContext(AuthContext);
  const [usageData, setUsageData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortBy, setSortBy] = useState("tokensUsed");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || role !== "admin") navigate("/");
  }, [user, role, navigate]);

  useEffect(() => {
    const fetchUsage = async () => {
      const usageSnap = await getDocs(collection(db, "usage"));
      const data = await Promise.all(
        usageSnap.docs.map(async (docSnap) => {
          const userSnap = await getDoc(doc(db, "users", docSnap.id));
          const userData = userSnap.exists() ? userSnap.data() : {};

          return {
            userId: docSnap.id,
            email: userData.email || "N/A",
            tier: userData.tier || "free",
            ...docSnap.data(),
          };
        })
      );
      setUsageData(data);
      setFilteredData(data);
    };

    fetchUsage();
  }, []);

  useEffect(() => {
    let result = usageData;

    if (searchTerm)
      result = result.filter((u) =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (startDate && endDate)
      result = result.filter((u) => {
        const reset = u.lastReset?.toDate?.();
        return reset && reset >= startDate && reset <= endDate;
      });

    result = result.sort((a, b) => b[sortBy] - a[sortBy]);
    setFilteredData(result);
  }, [searchTerm, startDate, endDate, sortBy, usageData]);

  const exportCSV = () => {
    const rows = ["Email,Tier,Tokens Used,Last Reset"];
    filteredData.forEach((u) => {
      const row = `${u.email},${u.tier},${u.tokensUsed},${
        u.lastReset?.toDate?.().toDateString?.() || "N/A"
      }`;
      rows.push(row);
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `usage-${Date.now()}.csv`;
    link.click();
  };

  const handleTierChange = async (userId, newTier) => {
    await updateDoc(doc(db, "users", userId), { tier: newTier });
    setUsageData((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, tier: newTier } : u))
    );
  };

  const handleReset = async (userId) => {
    await updateDoc(doc(db, "usage", userId), {
      tokensUsed: 0,
      lastReset: Timestamp.now(),
    });
    setUsageData((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, tokensUsed: 0 } : u))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700">📊 Admin Dashboard</h1>

      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className="px-4 py-2 border rounded"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="End Date"
          className="px-4 py-2 border rounded"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="tokensUsed">Sort by Tokens</option>
          <option value="tier">Sort by Tier</option>
        </select>
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ⬇️ Export CSV
        </button>
      </div>

      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Tier</th>
              <th className="px-4 py-2">Tokens Used</th>
              <th className="px-4 py-2">Last Reset</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((u) => (
                <tr
                  key={u.userId}
                  className={
                    u.tokensUsed > 3000
                      ? "bg-red-50 border-t border-red-300"
                      : "border-t"
                  }
                >
                  <td className="px-4 py-2 font-mono text-xs">{u.email}</td>
                  <td className="px-4 py-2">
                    <select
                      value={u.tier}
                      onChange={(e) => handleTierChange(u.userId, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="unlimited">Unlimited</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">{u.tokensUsed}</td>
                  <td className="px-4 py-2">
                    {u.lastReset?.toDate?.().toDateString?.() || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleReset(u.userId)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      🔁 Reset
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
