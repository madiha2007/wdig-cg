"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../../../firebase"; // adjust path if needed

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase listener — fires on login, logout, and page refresh automatically
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Keep sessionStorage in sync so other parts of your app still work
      if (firebaseUser) {
        sessionStorage.setItem("user", JSON.stringify({
          email:  firebaseUser.email,
          name:   firebaseUser.displayName,
          photo:  firebaseUser.photoURL,
        }));
        sessionStorage.setItem("wdig_uid", firebaseUser.uid);
      } else {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("wdig_uid");
      }

      window.dispatchEvent(new Event("sessionUpdated"));
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    // onAuthStateChanged above will handle clearing state + sessionStorage
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}