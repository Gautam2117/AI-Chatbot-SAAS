import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full space-y-4">
        <h2 className="text-xl font-bold text-center text-blue-700">Login</h2>
        <input
          className="border px-4 py-2 w-full rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border px-4 py-2 w-full rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setPass(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={loginWithEmail}>
          Sign In
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded w-full" onClick={loginWithGoogle}>
          Sign In with Google
        </button>
        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
