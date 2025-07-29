import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  Timestamp,
  collection,
  addDoc,
} from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      // ✅ Step 1: Create a new company for this user
      const companyRef = await addDoc(collection(db, "companies"), {
        name: email.split("@")[0] + "'s Company",
        tier: "free",
        tokensUsedToday: 0,
        tokensUsedMonth: 0, // ✅ Monthly token tracking added
        lastReset: Timestamp.now(),
        createdBy: user.uid,
      });

      const companyId = companyRef.id;

      // ✅ Step 2: Create the user document and link the company
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        role: "user",
        companyId: companyId,
      });

      console.log(`✅ User created: ${user.uid}, linked to company ${companyId}`);
      navigate("/");
    } catch (e) {
      alert(e.message);
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
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border-2 border-gray-200 px-4 py-3 w-full rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition duration-300"
          type="password"
          placeholder="🔒 Password"
          onChange={(e) => setPass(e.target.value)}
        />

        <button
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-4 py-3 rounded-lg w-full shadow-md hover:from-purple-700 hover:to-pink-700 transition duration-300"
          onClick={signup}
        >
          Sign Up
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
