import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getApiError } from "../api/http.js";
import { AuthShell } from "../components/AuthShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function Login() {
  const navigate = useNavigate();
  const { login, user, booting } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!booting && user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      await login(values);
      navigate("/");
    } catch (apiError) {
      setError(getApiError(apiError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your private lead pipeline.">
      <form className="auth-form" onSubmit={handleSubmit}>
        {error ? <div className="alert">{error}</div> : null}
        <label>
          Email
          <input type="email" required value={values.email} onChange={(event) => setValues((v) => ({ ...v, email: event.target.value }))} />
        </label>
        <label>
          Password
          <div className="input-with-button">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={values.password}
              onChange={(event) => setValues((v) => ({ ...v, password: event.target.value }))}
            />
            <button type="button" className="icon-button" title="Toggle password visibility" onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
        <button className="button primary" disabled={busy}>
          <LogIn size={18} />
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}
