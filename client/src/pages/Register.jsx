import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getApiError } from "../api/http.js";
import { AuthShell } from "../components/AuthShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function Register() {
  const navigate = useNavigate();
  const { register, user, booting } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!booting && user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (values.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setBusy(true);
    try {
      await register(values);
      navigate("/");
    } catch (apiError) {
      setError(getApiError(apiError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Create account" subtitle="Each user gets a fully isolated lead workspace.">
      <form className="auth-form" onSubmit={handleSubmit}>
        {error ? <div className="alert">{error}</div> : null}
        <label>
          Name
          <input required minLength="2" value={values.name} onChange={(event) => setValues((v) => ({ ...v, name: event.target.value }))} />
        </label>
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
              minLength="8"
              value={values.password}
              onChange={(event) => setValues((v) => ({ ...v, password: event.target.value }))}
            />
            <button type="button" className="icon-button" title="Toggle password visibility" onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
        <button className="button primary" disabled={busy}>
          <UserPlus size={18} />
          {busy ? "Creating..." : "Create account"}
        </button>
        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
