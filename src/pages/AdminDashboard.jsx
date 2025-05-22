import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, role } = useContext(AuthContext);
  const [usageData, setUsageData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || role !== "admin") {
      navigate("/");
    }
  }, [user, role, navigate]);

  useEffect(() => {
    const fetchUsage = async () => {
      const snapshot = await getDocs(collection(db, "usage"));
      const data = snapshot.docs.map(doc => ({
        userId: doc.id,
        ...doc.data(),
      }));
      setUsageData(data);
      setFilteredData(data); // default view
    };

    fetchUsage();
  }, []);

  // 🔍 Filter when search term changes
  useEffect(() => {
    const filtered = usageData.filter((u) =>
      u.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, usageData]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">
        📊 User Usage Overview
      </h1>

      <input
        type="text"
        placeholder="Search by User ID..."
        className="mb-4 w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Tokens Used</th>
              <th className="px-4 py-2">Last Reset</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((u) => (
                <tr key={u.userId} className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">{u.userId}</td>
                  <td className="px-4 py-2">{u.tokensUsed}</td>
                  <td className="px-4 py-2">
                    {typeof u.lastReset === "string"
                      ? u.lastReset
                      : u.lastReset?.toDate?.().toDateString?.() || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
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
