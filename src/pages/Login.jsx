// src/pages/Login.jsx
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.emailVerified && user.active === true) {
      navigate("/");
    } else {
      navigate("/verify");
    }
  }, [user, navigate]);

  const loginWithEmail = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  const loginWithGoogle = async () => {
    if (googleLoginLoading) return;
    try {
      setGoogleLoginLoading(true);
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      if (e.code !== "auth/cancelled-popup-request") alert(e.message);
    } finally {
      setGoogleLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full space-y-6 transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 drop-shadow-lg">Welcome Back!</h2>
        <p className="text-center text-gray-500 mb-4">Please sign in to continue</p>

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
          onClick={loginWithEmail}
          disabled={busy}
        >
          {busy ? "Signing in..." : "Sign In"}
        </button>

        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-24 bg-gray-300"></span>
          <span className="text-gray-500">or</span>
          <span className="h-px w-24 bg-gray-300"></span>
        </div>

        <button
          className="flex items-center justify-center gap-3 bg-white border border-gray-300 px-4 py-3 rounded-lg w-full hover:shadow-lg transition duration-300"
          onClick={loginWithGoogle}
        >
          <FcGoogle className="text-2xl" />
          <span className="font-medium text-gray-700">Sign In with Google</span>
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-purple-600 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
