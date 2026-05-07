import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { AddLead } from "./pages/AddLead.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Leads } from "./pages/Leads.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leads"
        element={
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leads/new"
        element={
          <ProtectedRoute>
            <AddLead />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leads/:id/edit"
        element={
          <ProtectedRoute>
            <AddLead />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
