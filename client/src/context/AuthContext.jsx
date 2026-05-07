import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { deleteAccount, fetchCurrentUser, loginUser, logoutUser, registerUser } from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let active = true;

    fetchCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setBooting(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      booting,
      async login(credentials) {
        const currentUser = await loginUser(credentials);
        setUser(currentUser);
        return currentUser;
      },
      async register(payload) {
        const currentUser = await registerUser(payload);
        setUser(currentUser);
        return currentUser;
      },
      async logout() {
        await logoutUser();
        setUser(null);
      },
      async signOut() {
        const confirmed = window.confirm("Signing out will permanently delete your account and all of your leads. Continue?");

        if (!confirmed) {
          return;
        }

        await deleteAccount();
        setUser(null);
      }
    }),
    [booting, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
