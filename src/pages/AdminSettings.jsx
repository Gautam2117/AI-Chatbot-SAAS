import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaSave } from "react-icons/fa";

const AdminSettings = () => {
  const [botName, setBotName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [color, setColor] = useState("#7C3AED");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const ref = doc(db, "settings", "global");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setBotName(data.botName || "");
        setGreeting(data.greeting || "");
        setColor(data.color || "#7C3AED");
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    const ref = doc(db, "settings", "global");
    await setDoc(ref, {
      botName,
      greeting,
      color,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="p-10 text-center">Loading settings...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">⚙️ Bot Settings</h1>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">🤖 Bot Name</label>
          <input
            type="text"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            placeholder="e.g. Botify"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">💬 Default Greeting</label>
          <input
            type="text"
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            placeholder="e.g. Hi! How can I help you today?"
          />
        </div>

        <div className="mb-8">
          <label className="block mb-1 text-sm font-medium text-gray-700">🎨 Theme Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-10 p-0 border-2 border-gray-300 rounded"
          />
          <span className="ml-4 text-gray-600">{color}</span>
        </div>

        <button
          onClick={saveSettings}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
        >
          <FaSave /> Save Settings
        </button>

        {saved && <p className="mt-4 text-green-600 font-semibold">✅ Settings Saved!</p>}
      </div>
    </div>
  );
};

export default AdminSettings;
