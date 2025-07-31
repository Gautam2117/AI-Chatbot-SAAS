// src/context/AuthProvider.jsx
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, sendEmailVerification, getIdToken, getIdTokenResult } from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp, collection, addDoc } from "firebase/firestore";
import Lottie from "react-lottie-player";
import loaderAnimation from "../assets/loader.json";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setRole("user");
          return;
        }

        // Ensure we have latest token (custom claims after OTP)
        try { await getIdToken(firebaseUser, true); } catch {}

        const userRef = doc(db, "users", firebaseUser.uid);
        let userData;
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          userData = userSnap.data();
        } else {
          // First-time login: create company + mark inactive
          const companyRef = await addDoc(collection(db, "companies"), {
            name: (firebaseUser.displayName || firebaseUser.email.split("@")[0]) + "'s Company",
            tier: "free",
            tokensUsedToday: 0,
            tokensUsedMonth: 0,
            lastReset: Timestamp.now(),
            createdBy: firebaseUser.uid,
            status: "pending",
          });

          userData = {
            email: firebaseUser.email,
            role: "user",
            tier: "free",
            companyId: companyRef.id,
            active: false,
            createdAt: Timestamp.now(),
          };
          await setDoc(userRef, userData);

          // send verification email if needed
          if (!firebaseUser.emailVerified) {
            try { await sendEmailVerification(firebaseUser); } catch {}
          }
        }

        // claims (active enforced in rules; also stored in user doc for UI)
        let claims = {};
        try {
          const res = await getIdTokenResult(firebaseUser);
          claims = res.claims || {};
        } catch {}

        setRole(userData.role || "user");
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: !!firebaseUser.emailVerified,
          claims,
          ...userData,
        });

        // IMPORTANT: Do NOT create usage docs here; wait until user is active.
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {!loading ? (
        children
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Lottie loop animationData={loaderAnimation} play style={{ width: 200, height: 200 }} />
        </div>
      )}
    </AuthContext.Provider>
  );
};
