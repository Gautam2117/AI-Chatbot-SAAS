import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import Lottie from "react-lottie-player";
import loaderAnimation from "../assets/loader.json";
import { addDoc, collection } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        let userData;
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          userData = userSnap.data();
        } else {
          // ✅ Create company for first-time user
          const companyRef = await addDoc(collection(db, "companies"), {
            name: firebaseUser.displayName || firebaseUser.email.split("@")[0] + "'s Company",
            tier: "free",
            tokensUsedToday: 0,
            lastReset: Timestamp.now(),
            createdBy: firebaseUser.uid,
          });

          const companyId = companyRef.id;

          userData = {
            email: firebaseUser.email,
            role: "user",
            tier: "free",
            companyId,
          };

          await setDoc(userRef, userData);
          console.log(`✅ User + company created for ${firebaseUser.uid}`);
        }

        // Set role separately for legacy support
        setRole(userData.role || "user");

        // Set merged user info for global use
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          ...userData,
        });

        // Ensure usage document exists
        const usageRef = doc(db, "usage", firebaseUser.uid);
        const usageSnap = await getDoc(usageRef);
        if (!usageSnap.exists()) {
          await setDoc(usageRef, {
            tokensUsed: 0,
            lastReset: Timestamp.now(),
          });
          console.log(`✅ Usage doc created for ${firebaseUser.uid}`);
        }
      } else {
        // Logged out
        setUser(null);
        setRole("user");
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
        <div className="min-h-screen flex flex-col items-center justify-center">
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
