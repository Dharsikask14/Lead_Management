import { ContactRound, Home, ListChecks, LogOut, Mail, Moon, Sun, User, UserPlus, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function Layout({ children }) {
  const { user, logout, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [showUser, setShowUser] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="sidebar-brand">
          <div className="brand-mark" aria-hidden="true">
            <ContactRound size={22} />
          </div>
          <div>
            <strong className="app-name">Lead Manager</strong>
            <span>Secure lead management workspace</span>
          </div>
        </div>
        <nav className="top-nav">
          <NavLink to="/">
            <Home size={16} />
            Home
          </NavLink>
          <NavLink to="/leads/new">
            <UserPlus size={16} />
            Add Lead
          </NavLink>
          <NavLink to="/leads">
            <ListChecks size={16} />
            View Leads
          </NavLink>
        </nav>
        <div className="topbar-actions">
          <div className="user-menu">
            <button className="user-chip" type="button" onClick={() => setShowUser((value) => !value)}>
              {user?.name}
            </button>
            {showUser ? (
              <div className="user-popover">
                <p>User details</p>
                <div className="user-detail-line">
                  <User size={16} />
                  <strong>{user?.name}</strong>
                </div>
                <div className="user-detail-line">
                  <Mail size={16} />
                  <span>{user?.email}</span>
                </div>
              </div>
            ) : null}
          </div>
          <button className="icon-button" title="Toggle dark mode" onClick={() => setDarkMode((value) => !value)}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="button secondary" onClick={logout}>
            <LogOut size={18} />
            Log out
          </button>
          <button className="button secondary danger-action" onClick={signOut}>
            <UserX size={18} />
            Sign out
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
