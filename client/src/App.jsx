import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { AddLead } from "./pages/AddLead.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Leads } from "./pages/Leads.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";

export function App() {
 
  const base = "/Lead_Management";

  return (
    <Routes>
      <Route path={`${base}/login`} element={<Login />} />
      <Route path={`${base}/register`} element={<Register />} />
      
      <Route
        path={`${base}/`}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${base}/leads`}
        element={
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${base}/leads/new`}
        element={
          <ProtectedRoute>
            <AddLead />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${base}/leads/:id/edit`}
        element={
          <ProtectedRoute>
            <AddLead />
          </ProtectedRoute>
        }
      />
      
      {/* Redirect any unknown path back to the dashboard root */}
      <Route path="*" element={<Navigate to={`${base}/`} replace />} />
    </Routes>
  );
}