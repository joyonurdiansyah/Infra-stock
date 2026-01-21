import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PRGP from "./pages/PRGP";
import MasterPR from "./pages/MasterPR";
import PRGPChecklist from "./pages/PRGPChecklist";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* PRGP */}
        <Route
          path="/prgp"
          element={
            <ProtectedRoute>
              <PRGP />
            </ProtectedRoute>
          }
        />

        {/* MASTER PR */}
        <Route
          path="/master-pr"
          element={
            <ProtectedRoute>
              <MasterPR />
            </ProtectedRoute>
          }
        />

        {/* PR GP CHECKLIST */}
        <Route
          path="/prgp-checklist"
          element={
            <ProtectedRoute>
              <PRGPChecklist />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
