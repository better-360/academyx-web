import { Route, Routes } from "react-router-dom";
import UserDashboard from "../pages/user/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import UserAssessment from "../pages/user/Assessment";
import UserLayout from "../layouts/UserLayout";

export default function UserRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<UserDashboard />} />
        </Route>
        <Route path="assessments/:id" element={<UserAssessment />} />
      </Routes>
    </ProtectedRoute>
  );
}