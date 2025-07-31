// src/pages/Signup.jsx
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, Timestamp, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const signup = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const user = cred.user;

      // company pending
      const companyRef = await addDoc(collection(db, "companies"), {
        name: email.split("@")[0] + "'s Company",
        tier: "free",
        tokensUsedToday: 0,
        tokensUsedMonth: 0,
        lastReset: Timestamp.now(),
        createdBy: user.uid,
        status: "pending",
      });

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user",
        companyId: companyRef.id,
        tier: "free",
        active: false,
        createdAt: Timestamp.now(),
      });

      try { await sendEmailVerification(user); } catch {}
      navigate("/verify");
    } catch (e) {
      alert(e?.message || "Signup failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full space-y-6 transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 drop-shadow-lg">Create Your Account</h2>
        <p className="text-center text-gray-500 mb-4">Sign up to get started</p>

        <input
          className="border-2 border-gray-200 px-4 py-3 w-full rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition duration-300"
          placeholder="📧 Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border-2 border-gray-200 px-4 py-3 w-full rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition duration-300"
          type="password"
          placeholder="🔒 Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <button
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-4 py-3 rounded-lg w-full shadow-md hover:from-purple-700 hover:to-pink-700 transition duration-300 disabled:opacity-60"
          disabled={busy}
          onClick={signup}
        >
          {busy ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
