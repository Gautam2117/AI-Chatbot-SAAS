// src/context/AuthProvider.js
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import Lottie from "react-lottie-player";
import loaderAnimation from "../assets/loader.json";  // Path to your Lottie JSON

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setRole(userSnap.data().role || "user");
        } else {
          await setDoc(userRef, {
            email: firebaseUser.email,
            role: "user",
            tier: "free",
          });
          setRole("user");
          console.log(`✅ User doc created for ${firebaseUser.uid}`);
        }

        const usageRef = doc(db, "usage", firebaseUser.uid);
        const usageSnap = await getDoc(usageRef);
        if (!usageSnap.exists()) {
          await setDoc(usageRef, {
            tokensUsed: 0,
            lastReset: Timestamp.now(),
          });
          console.log(`✅ Usage doc created for ${firebaseUser.uid}`);
        }
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {!loading ? (
        children
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
          <Lottie
            loop
            animationData={loaderAnimation}
            play
            style={{ width: 200, height: 200 }}
          />
        </div>
      )}
    </AuthContext.Provider>
  );
};
