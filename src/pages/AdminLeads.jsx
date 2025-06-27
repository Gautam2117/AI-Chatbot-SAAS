import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { FaDownload, FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const leadsPerPage = 10;

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "leads"), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeads(fetched);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let results = [...leads];
    if (search) {
      results = results.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(search.toLowerCase()) ||
          lead.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredLeads(results);
    setPage(1);
  }, [search, leads]);

  const paginated = filteredLeads.slice((page - 1) * leadsPerPage, page * leadsPerPage);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const downloadCSV = () => {
    const headers = ["Name", "Email", "Message", "Timestamp"];
    const rows = filteredLeads.map((lead) => [
      `"${lead.name}"`,
      `"${lead.email}"`,
      `"${lead.message}"`,
      new Date(lead.timestamp?.seconds * 1000).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `botify_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">📥 Leads Inbox</h1>

        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <FaSearch className="absolute top-3 left-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-indigo-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition"
          >
            <FaDownload /> Export CSV
          </button>
        </div>

        {filteredLeads.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No leads found.</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border shadow">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-indigo-100 text-indigo-700 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((lead) => (
                    <tr key={lead.id} className="border-t">
                      <td className="px-4 py-2">{lead.name}</td>
                      <td className="px-4 py-2">{lead.email}</td>
                      <td className="px-4 py-2">{lead.message}</td>
                      <td className="px-4 py-2">
                        {new Date(lead.timestamp?.seconds * 1000).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between items-center text-sm">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
              >
                <FaArrowLeft /> Prev
              </button>
              <span className="text-gray-600">
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLeads;
