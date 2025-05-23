import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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

      const dataWithUserInfo = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const userId = docSnap.id;
          const usage = docSnap.data();

          let email = "N/A";
          let tier = "N/A";

          try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              email = userData.email || "N/A";
              tier = userData.tier || "free";
            }
          } catch (err) {
            console.warn(`❌ Failed to fetch user info for ${userId}`, err.message);
          }

          return {
            userId,
            tokensUsed: usage.tokensUsed || 0,
            lastReset: usage.lastReset,
            email,
            tier,
          };
        })
      );

      setUsageData(dataWithUserInfo);
      setFilteredData(dataWithUserInfo);
    };

    fetchUsage();
  }, []);

  useEffect(() => {
    const filtered = usageData.filter((u) =>
      u.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        placeholder="Search by User ID or Email..."
        className="mb-4 w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Plan</th>
              <th className="px-4 py-2">Tokens Used</th>
              <th className="px-4 py-2">Last Reset</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((u) => (
                <tr key={u.userId} className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">{u.userId}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 capitalize">{u.tier}</td>
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
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
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
