import { Routes, Route } from "react-router-dom";
import ManagerDashboard from "../pages/manager/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function ManagerRoutes() {
  return (
    <ProtectedRoute requiredRole="COMPANY_ADMIN">
      <Routes>
         <Route path="/" element={<ManagerDashboard />} />
      </Routes>
      </ProtectedRoute>
  );
}