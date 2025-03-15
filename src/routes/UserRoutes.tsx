import { Route, Routes } from "react-router-dom";
import UserAssessments from "../pages/user/Assessments";
import UserDashboard from "../pages/user/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import UserAssessment from "../pages/user/Assessment";
import UserLayout from "../layouts/UserLayout";
import Help from "../pages/user/Help";

export default function UserRoutes() {
  return (
    <ProtectedRoute>
    <Routes>
    <Route element={<UserLayout />}>
      <Route path="/" element={<UserDashboard />} />
      <Route path="assessments" element={<UserAssessments />} />
      <Route path="help" element={<Help />} />
      </Route>
      <Route path="assessments/:id" element={<UserAssessment />} />
      </Routes>
    </ProtectedRoute>
  );
}
