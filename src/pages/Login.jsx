import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Google Icon

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const loginWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      navigate("/");
    } catch (e) {
      alert(e.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate("/");
    } catch (e) {
      alert(e.message);
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
          onClick={loginWithEmail}
        >
          Sign In
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
