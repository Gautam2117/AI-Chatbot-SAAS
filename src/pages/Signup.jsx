import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      navigate("/");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full space-y-4">
        <h2 className="text-xl font-bold text-center text-blue-700">Create Account</h2>
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
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={signup}>
          Sign Up
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
